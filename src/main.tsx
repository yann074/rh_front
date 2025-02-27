import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Register from './pages/auth/Register.js'
import UserHomePage from './pages/DashboardUser/UserHomePage.js'
import { GoogleOAuthProvider } from "@react-oauth/google";

const CLIENT_ID ='239792615305-dh5fndio5bf43rhha3kji5qe3jpuj7uq.apps.googleusercontent.com'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <UserHomePage />
    </GoogleOAuthProvider>
  </StrictMode>,
)