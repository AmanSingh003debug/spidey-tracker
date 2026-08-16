# The Wall-Crawler's Log

Spiderman-themed daily routine + workout tracker. Built with Vite + React.

Data is stored in the browser's `localStorage` (private to whichever device/browser you open the site on).

## Deploy — GitHub + Vercel (same flow as Bat Tracker)

1. **Create a new repo** on GitHub (e.g. `spidey-tracker`) under `AmanSingh003debug`.
2. **Upload every file in this folder**, keeping the folder structure exactly as-is:
   - `index.html`
   - `package.json`
   - `vite.config.js`
   - `src/main.jsx`
   - `src/App.jsx`
   - (this `README.md` is optional)
3. Go to **vercel.com → Add New Project → Import** the `spidey-tracker` repo.
4. Vercel auto-detects Vite. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`. Leave defaults, click **Deploy**.
5. You'll get a live URL like `spidey-tracker.vercel.app` — bookmark it on your phone, or add to home screen for an app-like feel.

## Notes

- Since it's `localStorage`, logs only exist on the device/browser you use. If you want it synced across your phone and laptop, that needs a real backend (e.g. Supabase) — say the word if you want that upgrade next.
- Local dev: `npm install` then `npm run dev`.
