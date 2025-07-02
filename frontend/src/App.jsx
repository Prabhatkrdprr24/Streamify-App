import React from 'react'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignUp from './pages/SignUpPage'
import NotificationsPage from './pages/NotificationsPage'
import ChatPage from './pages/ChatPage'
import CallPage from './pages/CallPage'
import OnboardingPage from './pages/OnboardingPage'
import { Routes, Route } from 'react-router-dom'  
import { Toaster } from 'react-hot-toast'

const App = () => {
  return (
    <div className='h-screen data-theme="dark" '>
    
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/call" element={<CallPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
      </Routes>

      <Toaster />

    </div>
  )
}

export default App