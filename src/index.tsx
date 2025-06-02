import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// import './i18n'; // i18n removed
import './index.css'; // Import Tailwind CSS and global styles

// process.env.API_KEY is now handled by Vite's `define` config in vite.config.ts
// but let's ensure it's available as per prompt expectation
if (typeof process === 'undefined') {
  // @ts-ignore
  globalThis.process = { env: {} };
}
if (!process.env.API_KEY) {
   // This will be defined by Vite. If running outside Vite and it's not set, mock it.
  process.env.API_KEY = "MOCK_GEMINI_API_KEY_RUNTIME_FALLBACK";
}


const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    {/* Suspense for i18n removed */}
    <App />
  </React.StrictMode>
);