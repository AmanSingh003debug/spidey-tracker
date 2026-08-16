import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

/*
  This app was originally built as a Claude artifact using window.storage
  (Claude's built-in persistence API). Outside claude.ai that API doesn't
  exist, so this shim reimplements the same get/set/delete/list interface
  on top of the browser's localStorage, keyed under "spidey:".
*/
const PREFIX = "spidey:";

window.storage = {
  async get(key) {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw === null) throw new Error("Key not found: " + key);
    return { key, value: raw, shared: false };
  },
  async set(key, value) {
    localStorage.setItem(PREFIX + key, value);
    return { key, value, shared: false };
  },
  async delete(key) {
    localStorage.removeItem(PREFIX + key);
    return { key, deleted: true, shared: false };
  },
  async list(prefix = "") {
    const keys = Object.keys(localStorage)
      .filter(k => k.startsWith(PREFIX))
      .map(k => k.slice(PREFIX.length))
      .filter(k => k.startsWith(prefix));
    return { keys, prefix, shared: false };
  }
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
