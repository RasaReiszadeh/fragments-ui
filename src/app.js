import { signIn, getUser } from './auth';

const API_URL = process.env.API_URL;

// Create a fragment (text or image)
async function createFragment(user) {
  const type = document.querySelector('#fragmentType').value.trim();
  const result = document.querySelector('#result');

  let body;

  if (type.startsWith('image/')) {
    const fileInput = document.querySelector('#fragmentFile');
    if (!fileInput.files[0]) {
      result.innerHTML = `<p style="color:red;">Please select an image file.</p>`;
      return;
    }
    body = await fileInput.files[0].arrayBuffer();
  } else {
    const content = document.querySelector('#fragmentContent').value;
    body = content;
  }

  try {
    const res = await fetch(`${API_URL}/v1/fragments`, {
      method: 'POST',
      headers: user.authorizationHeaders(type),
      body,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error?.message || 'Failed to create fragment');

    result.innerHTML = `
      <p><strong>Fragment created successfully.</strong></p>
      <p><strong>ID:</strong> ${data.fragment.id}</p>
      <p><strong>Type:</strong> ${data.fragment.type}</p>
      <p><strong>Location:</strong> ${res.headers.get('location')}</p>
    `;
    document.querySelector('#fragmentContent').value = '';
    document.querySelector('#fragmentFile').value = '';
    await loadFragments(user);
  } catch (err) {
    result.innerHTML = `<p style="color:red;"><strong>Error:</strong> ${err.message}</p>`;
  }
}

// Update an existing fragment
async function updateFragment(user, id, type) {
  const newContent = prompt(`Enter new content for fragment ${id}:`);
  if (newContent === null) return;

  try {
    const res = await fetch(`${API_URL}/v1/fragments/${id}`, {
      method: 'PUT',
      headers: user.authorizationHeaders(type),
      body: newContent,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error?.message || 'Failed to update fragment');

    alert('Fragment updated successfully!');
    await loadFragments(user);
  } catch (err) {
    alert(`Error: ${err.message}`);
  }
}

// Delete a fragment
async function deleteFragment(user, id) {
  if (!confirm(`Delete fragment ${id}?`)) return;

  try {
    const res = await fetch(`${API_URL}/v1/fragments/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${user.idToken}` },
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data?.error?.message || 'Failed to delete fragment');
    }
    alert('Fragment deleted!');
    await loadFragments(user);
  } catch (err) {
    alert(`Error: ${err.message}`);
  }
}

// View/convert a fragment
async function viewFragment(user, id, type) {
  let ext = '';

  if (type === 'text/markdown') {
    const convert = confirm('Convert Markdown to HTML? Click Cancel to view raw.');
    if (convert) ext = '.html';
  } else if (type === 'image/png') {
    const convert = confirm('Convert PNG to JPEG? Click Cancel to view raw PNG.');
    if (convert) ext = '.jpg';
  } else if (type === 'image/jpeg') {
    const convert = confirm('Convert JPEG to PNG? Click Cancel to view raw JPEG.');
    if (convert) ext = '.png';
  }

  const url = `${API_URL}/v1/fragments/${id}${ext}`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${user.idToken}` },
    });

    if (!res.ok) throw new Error('Failed to fetch fragment');

    const contentType = res.headers.get('content-type') || '';
    const result = document.querySelector('#result');

    if (contentType.startsWith('image/')) {
      const blob = await res.blob();
      const imgUrl = URL.createObjectURL(blob);
      result.innerHTML = `<p><strong>Fragment Image${ext ? ' (converted)' : ''}:</strong></p><img src="${imgUrl}" style="max-width:400px;" />`;
    } else {
      const text = await res.text();
      result.innerHTML = `<p><strong>Fragment Content${ext ? ' (converted)' : ''}:</strong></p><pre style="white-space:pre-wrap;background:#1a1a2e;padding:10px;border-radius:6px;">${text}</pre>`;
    }
  } catch (err) {
    alert(`Error: ${err.message}`);
  }
}

// Load and display all fragments
async function loadFragments(user) {
  const list = document.querySelector('#fragmentsList');
  try {
    const res = await fetch(`${API_URL}/v1/fragments?expand=1`, {
      headers: { Authorization: `Bearer ${user.idToken}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error?.message || 'Failed to load fragments');

    if (!data.fragments.length) {
      list.innerHTML = '<li>No fragments yet.</li>';
      return;
    }

    list.innerHTML = data.fragments
      .map(
        (fragment) => `
        <li style="margin-bottom:16px;padding:12px;border:1px solid #333;border-radius:8px;">
          <strong>ID:</strong> ${fragment.id}<br />
          <strong>Type:</strong> ${fragment.type}<br />
          <strong>Size:</strong> ${fragment.size} bytes<br />
          <strong>Created:</strong> ${new Date(fragment.created).toLocaleString()}<br />
          <div style="margin-top:8px;display:flex;gap:8px;">
            <button onclick="window.__viewFragment('${fragment.id}','${fragment.type}')" style="padding:4px 10px;cursor:pointer;">View/Convert</button>
            <button onclick="window.__updateFragment('${fragment.id}','${fragment.type}')" style="padding:4px 10px;cursor:pointer;" ${fragment.type.startsWith('image/') ? 'disabled' : ''}>Update</button>
            <button onclick="window.__deleteFragment('${fragment.id}')" style="padding:4px 10px;cursor:pointer;color:red;">Delete</button>
          </div>
        </li>
      `
      )
      .join('');
  } catch (err) {
    list.innerHTML = `<li style="color:red;">${err.message}</li>`;
  }
}

// Toggle content/file input based on type
function handleTypeChange() {
  const type = document.querySelector('#fragmentType').value;
  const contentArea = document.querySelector('#contentArea');
  const fileArea = document.querySelector('#fileArea');

  if (type.startsWith('image/')) {
    contentArea.style.display = 'none';
    fileArea.style.display = 'block';
  } else {
    contentArea.style.display = 'block';
    fileArea.style.display = 'none';
  }
}

async function init() {
  const userSection = document.querySelector('#user');
  const loginBtn = document.querySelector('#login');
  const createBtn = document.querySelector('#createFragment');
  const typeSelect = document.querySelector('#fragmentType');

  loginBtn.onclick = () => signIn();
  typeSelect.onchange = handleTypeChange;

  const user = await getUser();
  if (!user) return;

  userSection.hidden = false;
  userSection.querySelector('.username').innerText = user.username;
  loginBtn.disabled = true;

  // Expose functions for inline onclick handlers
  window.__viewFragment = (id, type) => viewFragment(user, id, type);
  window.__updateFragment = (id, type) => updateFragment(user, id, type);
  window.__deleteFragment = (id) => deleteFragment(user, id);

  createBtn.onclick = async () => await createFragment(user);

  await loadFragments(user);
}

addEventListener('DOMContentLoaded', init);