# 💻 Fragments UI Client

> A responsive Single Page Application (SPA) client for creating, browsing, converting, and inspecting multi-format cloud fragments.

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://react.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/)
[![AWS](https://img.shields.io/badge/AWS-Cognito_Auth-232F3E?style=flat-square&logo=amazonwebservices&logoColor=white)](https://aws.amazon.com/cognito/)
[![Cypress](https://img.shields.io/badge/Cypress-E2E_Testing-17202C?style=flat-square&logo=cypress&logoColor=white)](https://www.cypress.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

[Overview](#overview) • [Core Features](#core-features) • [User Flow](#user-flow) • [Tech Stack](#tech-stack) • [Quick Start](#quick-start)

---

## 📌 Overview

**Fragments UI** provides an interactive web interface for interacting with the **Fragments Cloud Microservice**.

It handles client-side authentication flows using **Amazon Cognito**, supports live drafting and uploading of arbitrary text, JSON, and media fragments, displays rich metadata analytics, and provides instant visual rendering for converted file extensions.

---

## ✨ Core Features

- **Cognito Authentication Flow:** Client-side OAuth2 integration with Amazon Cognito User Pools, managing access token lifecycle and authorized API sessions.
- **Dynamic Fragment Creation:** Editor support for creating text, markdown, HTML, JSON data, and multi-format image file uploads.
- **On-the-Fly Conversion Previews:** View fragments rendered in their native format or request dynamic extensions (`.html`, `.txt`, `.jpg`, `.webp`) directly in the UI.
- **Metadata Inspector:** Real-time inspection of fragment metadata including payload size, creation/updated timestamps, and registered MIME types.
- **End-to-End Automated Testing:** Instrumented with Cypress to validate authentication flows, form validation, error handling, and API integration.

---

## 🔄 User Flow

```text
 ┌─────────────────────────────────┐
 │       Cognito Login Screen      │ ── User authenticates via Cognito
 └────────────────┬────────────────┘
                  │
                  ▼
 ┌─────────────────────────────────┐
 │        Fragment Dashboard       │ ── Lists existing fragment IDs & metadata
 └───────┬─────────────────┬───────┘
         │                 │
         ▼                 ▼
 ┌───────────────┐ ┌───────────────┐
 │  New Payload  │ │  View / Edit  │ ── Inspects raw format, updates payload,
 │Editor / Upload│ │   Inspector   │    or triggers format conversions (.ext)
 └───────────────┘ └───────────────┘
```

---

## 🛠️ Tech Stack

- **Framework:** React / Next.js
- **State & Data Fetching:** SWR / Fetch API
- **Identity:** Amazon Cognito Auth SDK
- **Testing:** Cypress (end-to-end integration testing)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- An active instance of the Fragments API
- Amazon Cognito User Pool client configured for SPA web clients

### 1. Installation

```bash
git clone https://github.com/RasaReiszadeh/fragments-ui.git
cd fragments-ui
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_COGNITO_POOL_ID=your-pool-id
NEXT_PUBLIC_COGNITO_CLIENT_ID=your-client-id
```

### 3. Running the Client

```bash
# Start local development server
npm run dev

# Run Cypress end-to-end test suite
npm run cypress:open
```

Visit `http://localhost:3000` to access the application.

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.
