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
import { useQuery } from '@tanstack/react-query'
import {axiosInstance} from './lib/axios.js'
import { Navigate } from 'react-router-dom'
import PageLoader from './components/PageLoader.jsx'
import { getAuthUser } from './lib/api.js'
import useAuthUser from './hooks/useAuthUser.js'
import Layout from './components/Layout.jsx' // Assuming you have a Layout component
import { useThemeStore } from './store/useThemeStore.js' // Assuming you have a Zustand store for theme


const App = () => {

  const { isLoading, authUser } = useAuthUser();
  const { theme, setTheme } = useThemeStore();

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;
 
  if( isLoading ) <PageLoader />

  return (
    <div className='h-screen' data-theme={theme}>
    
      <Routes>

        <Route path="/" element={
          isAuthenticated && isOnboarded 
          ? (
            <Layout showSidebar={true}>
              <HomePage />
            </Layout>
          ) 
          : (
          <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
          )} 

        />

        <Route path="/login" element={
          !isAuthenticated ? <LoginPage /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />
          } />

        <Route path="/signup" element={
          !isAuthenticated ? <SignUp /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />
          } />

        <Route path="/notifications" element={isAuthenticated ? <NotificationsPage /> : <Navigate to='/login' />} />
        <Route path="/chat" element={isAuthenticated ? <ChatPage /> : <Navigate to='/login' />} />
        <Route path="/call" element={isAuthenticated ? <CallPage /> : <Navigate to='/login' />} />
        <Route path="/onboarding" 
        element={
          isAuthenticated ? (
            isOnboarded ? <Navigate to='/' /> : <OnboardingPage />
          ) : (
            <Navigate to='/login' />
          ) } />
      </Routes>

      <Toaster />

    </div>
  )
}

export default App