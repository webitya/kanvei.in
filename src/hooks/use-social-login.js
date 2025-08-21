"use client"

import { signIn } from "next-auth/react"

export const useSocialLogin = () => {
  const loginWithGoogle = async () => {
    // Set flag before initiating social login
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('social-login-pending', 'true')
    }
    
    try {
      await signIn('google', { callbackUrl: window.location.origin })
    } catch (error) {
      // Clear flag on error
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('social-login-pending')
      }
      console.error('Google login error:', error)
    }
  }

  const loginWithFacebook = async () => {
    // Set flag before initiating social login
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('social-login-pending', 'true')
    }
    
    try {
      await signIn('facebook', { callbackUrl: window.location.origin })
    } catch (error) {
      // Clear flag on error
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('social-login-pending')
      }
      console.error('Facebook login error:', error)
    }
  }

  const loginWithGitHub = async () => {
    // Set flag before initiating social login
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('social-login-pending', 'true')
    }
    
    try {
      await signIn('github', { callbackUrl: window.location.origin })
    } catch (error) {
      // Clear flag on error
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('social-login-pending')
      }
      console.error('GitHub login error:', error)
    }
  }

  return {
    loginWithGoogle,
    loginWithFacebook,
    loginWithGitHub,
  }
}
