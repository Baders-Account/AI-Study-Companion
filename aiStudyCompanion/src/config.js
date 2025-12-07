// API Configuration
// Automatically detects dev vs production - no manual toggle needed!
// - Local dev (npm run dev): uses localhost:3000
// - Production build: uses deployed Vercel backend

const isDev = import.meta.env.DEV; // Vite automatically sets this

export const API_BASE_URL = isDev
    ? "http://localhost:3000/api"
    : "https://ai-study-companion-2cda.vercel.app/api";
