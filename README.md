# Apptency Notes App🚀

Apptency is a lightweight, secure, and 100% offline-first Markdown note-taking application. Built with Next.js, React, and Tailwind CSS v4, it is compiled natively into an Android application (`.apk`) using Ionic Capacitor v6. 

All notes are structured in GitHub Flavored Markdown (GFM) and persisted entirely on the client side inside the browser's `localStorage` or device storage, providing absolute data privacy and instantaneous response times.

---

## 🌟 Key Features

### 🔒 100% Offline-First & Private
* **Zero Database Overhead:** No backend server or PostgreSQL database required. 
* **Browser Sandbox:** All folders, notes, and preferences are saved securely on the client-side using `localStorage`.
* **Zero-Tracker Policy:** Your data never leaves your device.

### 📝 Rich GitHub Flavored Markdown (GFM) Editor
* **Live Side-by-Side Preview:** Write in the monospace code-editor and view live compiled previews.
* **Interactive Checklists:** Toggle markdown checkboxes (`- [ ]` / `- [x]`) directly within the preview screen.
* **Advanced formatting:** Supports standard headings, code-blocks with syntax highlighting, inline HTML `<kbd>` keys, custom `<span style="color:red">` markers, and collapsible `<details>` blocks.
* **Metrics:** Live tracking of characters, words, and line counts.

### 🎨 Custom Confirmation & Alert Modals
* **Cohesive Theme Integration:** All generic browser alerts (`alert()`) and pop-ups (`confirm()`) are completely replaced by beautiful, modern modal overlays designed to match the application's active themes.
* **Smart Alert Boxes:** Automatically collapses into single-action alert boxes or expands into destructive double-action warnings based on state properties.

### 📱 Responsive Fullscreen UI
* **Viewport Adaptation:** Seamlessly expands to a true full-screen layout (`100dvh`) on mobile devices, removing desktop browser notches and fake indicator elements.
* **Centered Mockup Frame:** Renders inside an elegant mobile mockup shell on larger desktop resolutions (`md:` screens).
* **Smooth Rendering:** Buggy background overlays are replaced with a lightweight linear SVG pattern, eliminating GPU/hardware compositing glitches on Android Chrome.

### 🔄 Native Mobile Navigation & App Exit Protection
* **SPA Back-Button Navigation:** Deeply integrated with the HTML5 Session History API (`pushState`/`popstate`). Pressing the browser's back button or performing native swipe-back gestures navigates between app screens instead of closing the website.
* **Android Hardware Key Interceptor:** Maps Android’s native back key directly to the history stack. It gracefully exits the app only when backed out of the main Home dashboard.

### 📦 Automated Native Android Compilation
* **CI/CD Workflow (`build-android.yml`):** Automatically packages the web code into an installable `.apk` package via GitHub Actions.
* **Source Code Protection:** Obfuscates static Next.js production bundles during the compilation stage using `javascript-obfuscator` to protect strings, logic, and arrays from reverse engineering.

---

## 🛠️ Technology Stack

* **Web Framework:** Next.js (App Router, static mode), React 19.
* **Styles & Animations:** Tailwind CSS v4 (Class-based dark variants).
* **Native Wrapper:** Ionic Capacitor v6 (with `@capacitor/app` event system).
* **Libraries:** JSZip (for offline markdown backups), Lucide Icons, Canvas Confetti.
* **Security Tool:** `javascript-obfuscator`.
* **Build Tools:** Node 22, JDK 21, Gradle, Ubuntu Hosted Runners.

---

## 📂 Project Architecture

```text
Apptency/
├── .github/
│   └── workflows/
│       └── build-android.yml    # GitHub Action compile pipeline
├── src/
│   ├── app/
│   │   ├── globals.css          # Tailwind CSS configuration
│   │   ├── layout.tsx           # Global HTML wrap
│   │   └── page.tsx             # Core single-page screen controller
│   ├── components/
│   │   ├── ConfirmationModal.tsx # Unified custom alerts and warnings
│   │   ├── FolderModal.tsx       # Creative bottom sheet for folder actions
│   │   ├── NoteEditor.tsx        # High-performance Markdown editor
│   │   ├── NoteView.tsx          # Real-time GFM compiler and metadata view
│   │   ├── SettingsScreen.tsx    # Unified local configuration screen
│   │   ├── Sidebar.tsx           # Drawer navigation and quick directories
│   │   └── SplashScreen.tsx      # Welcome ambient progress screen
│   └── utils/
│       ├── markdown.tsx         # Monospace regex parsing engine
│       └── zipHelper.ts         # JSON-to-Markdown ZIP compiler
├── capacitor.config.json        # Capacitor native config details
├── next.config.ts               # Static-export configuration
├── package.json                 # Dependency configurations
└── tsconfig.json                # TypeScript declarations
```

---

## 🚀 How to Run Locally

### 1. Install Dependencies
Make sure you have Node.js installed. In the root directory, install dependencies bypassing potential peer version blocks:
```bash
npm install --legacy-peer-deps
```

### 2. Start Development Server
Launch the development environment:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) inside your browser.

### 3. Build & Export Statically
Generate the production static assets inside the `/out` directory:
```bash
npm run build
```

---

## 🤖 GitHub Actions Automated Android Build

Whenever you push new changes to the `main` branch, a GitHub Action is triggered to compile your protected APK:

1. Navigte to the **Actions** tab in your GitHub repository.
2. Select the latest active run of **Build Protected Android APK**.
3. Once the build completes, scroll down to the **Artifacts** section at the bottom of the page.
4. Download the **`Apptency-protected-android-apk`** `.zip` package.
5. Extract the zip file to find the installable **`app-debug.apk`**.

> **Note:** GitHub limits private repositories to a strict 500 MB Actions storage quota. If your build fails at the `Upload APK Artifact` step with a storage quota error, navigate to older runs and delete previous build artifacts to free up space, or make your repository Public.

---

## 📱 Device Compatibility

* **Web Browsers:** Responsive on Chrome, Safari, Firefox, Edge, and Opera.
* **Android APK:** Fully compatible with **Android 9.0 (API Level 28 - Pie)** up to **Android 15 and Android 16+**.

---

## 📄 License & Terms
Apptency operates strictly under secure, offline-first client storage sandboxes. Export your note data frequently as a `.ZIP` backup from the Settings screen to keep your backups safe across browser clears or device resets.

---
