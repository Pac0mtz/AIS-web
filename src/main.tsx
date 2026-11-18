import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { ThemeProvider } from 'next-themes'
import './index.css'
import App from './App.tsx'
import { installPhoneClickTracking } from './lib/analytics'

installPhoneClickTracking()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider attribute="data-theme" storageKey="ais-theme" defaultTheme="system">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => undefined))
}
