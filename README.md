# Context Saver

A premium SaaS application to save and resume your work context instantly.

## Environment Setup

To run this application, you need to set up your Firebase configuration using environment variables.

1. Create a `.env` file in the root directory (copy from `.env.example`).
2. Populate the following variables with your Firebase Web App configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Important:** Never commit your `.env` file to version control. It is already included in `.gitignore`.

## Features

- **Session Management**: Save what you're doing, why you paused, and the exact next step.
- **Firebase Auth**: Secure account creation and login.
- **Cloud Sync**: Real-time synchronization across devices using Firestore.
- **Premium Design**: Polished, modern SaaS aesthetic with dark mode support.
- **Stripe Integration**: Easy upgrade path to Pro features.

## Development

```bash
npm install
npm run dev
```
