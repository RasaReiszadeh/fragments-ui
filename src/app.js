import { signIn, getUser } from './auth';

async function createFragment(user) {
  const type = document.querySelector('#fragmentType').value.trim();
  const content = document.querySelector('#fragmentContent').value;
  const result = document.querySelector('#result');

  try {
    const res = await fetch(`${process.env.API_URL}/v1/fragments`, {
      method: 'POST',
      headers: user.authorizationHeaders(type),
      body: content,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error?.message || 'Failed to create fragment');
    }

    result.innerHTML = `
      <p><strong>Fragment created successfully.</strong></p>
      <p><strong>ID:</strong> ${data.fragment.id}</p>
      <p><strong>Type:</strong> ${data.fragment.type}</p>
      <p><strong>Location:</strong> ${res.headers.get('location')}</p>
    `;

    document.querySelector('#fragmentContent').value = '';
    await loadFragments(user);
  } catch (err) {
    result.innerHTML = `<p style="color:red;"><strong>Error:</strong> ${err.message}</p>`;
  }
}

async function loadFragments(user) {
  const list = document.querySelector('#fragmentsList');

  try {
    const res = await fetch(`${process.env.API_URL}/v1/fragments?expand=1`, {
      headers: {
        Authorization: `Bearer ${user.idToken}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error?.message || 'Failed to load fragments');
    }

    if (!data.fragments.length) {
      list.innerHTML = '<li>No fragments yet.</li>';
      return;
    }

    list.innerHTML = data.fragments
      .map(
        (fragment) => `
          <li>
            <strong>ID:</strong> ${fragment.id}<br />
            <strong>Type:</strong> ${fragment.type}<br />
            <strong>Size:</strong> ${fragment.size}<br />
            <strong>Created:</strong> ${fragment.created}
          </li>
        `
      )
      .join('');
  } catch (err) {
    list.innerHTML = `<li style="color:red;">${err.message}</li>`;
  }
}

async function init() {
  const userSection = document.querySelector('#user');
  const loginBtn = document.querySelector('#login');
  const createBtn = document.querySelector('#createFragment');

  loginBtn.onclick = () => signIn();

  const user = await getUser();
  if (!user) {
    return;
  }

  userSection.hidden = false;
  userSection.querySelector('.username').innerText = user.username;
  loginBtn.disabled = true;

  createBtn.onclick = async () => {
    await createFragment(user);
  };

  await loadFragments(user);
}

addEventListener('DOMContentLoaded', init);