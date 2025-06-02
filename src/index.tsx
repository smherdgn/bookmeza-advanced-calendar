import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/index.css"; // CSS import removed as per prompt
// import './i18n'; // i18n removed

// process.env.API_KEY is now handled by Vite's `define` config in vite.config.ts
// but let's ensure it's available as per prompt expectation
if (typeof process === "undefined") {
  // @ts-ignore
  globalThis.process = { env: {} };
}

const rootElement = document.getElementById("root");
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
