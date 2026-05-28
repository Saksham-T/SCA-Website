import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/sca.css'
import './assets/sca-extras.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
