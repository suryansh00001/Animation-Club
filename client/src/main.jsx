import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AppContextProvider } from './context/appContext.jsx'
import { AdminContextProvider } from './context/adminContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AppContextProvider>
      <AdminContextProvider>
        <App />
      </AdminContextProvider>
    </AppContextProvider>
  </BrowserRouter>,
)
