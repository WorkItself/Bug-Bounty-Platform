import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.tsx'
import { UserProvider } from './context/UserContext.tsx'
import { SupportProvider } from './context/SupportContext.tsx'
import { AxiosProvider } from './context/AxiosContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AxiosProvider>
      <UserProvider>
        <SupportProvider>
          <App />
        </SupportProvider>
      </UserProvider>
    </AxiosProvider>
  </StrictMode>,
)
