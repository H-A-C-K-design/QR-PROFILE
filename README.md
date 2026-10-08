# QR-PROFILE (QR SCAN PRO)

> A modern, secure, and production-ready web application where users create and manage verifiable digital identity profiles accessible via dynamically generated QR codes.

---

## 🌟 Key Features

- **Google Authentication**: Built on real Firebase Auth with Google Sign-In.
- **Dynamic Unique QR Codes**: Real-time QR generation (`qrcode`) linked directly to the user's live public profile URL.
- **Branded QR Badges**: Download high-resolution PNG identity cards with embedded QR, custom branding, and typography rendered on an HTML5 canvas.
- **Cloud-Synced Profiles**: Profile photos uploaded directly to Firebase Storage with size and MIME validation. Profile fields stored in Cloud Firestore.
- **Zero Mock Data Architecture**: Strictly operates with live database records. Graceful empty states, skeleton loaders, and sanitized public field visibility.
- **Public Visibility Controls**: Toggle public profile access ON/OFF anytime from the dashboard or settings.
- **Mobile Digital Card View**: Mobile-optimized digital identity card with direct mail, phone, and website links when scanned with any smartphone camera.
- **Web Share API Support**: Share your profile link instantly through native mobile and desktop share sheets.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide Icons](https://lucide.dev/)
- **Backend & Auth**: [Firebase](https://firebase.google.com/) (Authentication, Cloud Firestore, Cloud Storage)
- **QR Code Engine**: `qrcode`

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/H-A-C-K-design/QR-PROFILE.git
cd QR-PROFILE
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Firebase
Create a `.env.local` file from the provided `.env.example`:
```bash
cp .env.example .env.local
```

Fill in your Firebase credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🔒 Security Rules

- **Cloud Firestore**: Refer to [`firestore.rules`](./firestore.rules) for document-level user authorization.
- **Cloud Storage**: Refer to [`storage.rules`](./storage.rules) for image upload restrictions and ownership checks.
