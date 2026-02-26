import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { router } from '@/router/index'
import './index.css'

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element not found')

createRoot(rootElement).render(
  <StrictMode>
    {/*
      GoogleOAuthProvider wraps the entire app so any component can use
      useGoogleLogin() or GoogleLogin from @react-oauth/google.
      Only the Client ID is used here — the client_secret lives in the backend.
    */}
    <GoogleOAuthProvider clientId={googleClientId}>
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </StrictMode>
)
