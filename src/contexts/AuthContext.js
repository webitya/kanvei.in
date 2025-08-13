"use client"
import { createContext, useContext, useReducer, useEffect } from "react"

const AuthContext = createContext()

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      }
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      }
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      }
    case "LOAD_USER":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      }
    default:
      return state
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true,
  })

  // Load user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("kanvei-token")
    const user = localStorage.getItem("kanvei-user")

    if (token && user) {
      dispatch({
        type: "LOAD_USER",
        payload: {
          token,
          user: JSON.parse(user),
        },
      })
    } else {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }, [])

  // Save to localStorage whenever auth state changes
  useEffect(() => {
    if (state.isAuthenticated && state.token && state.user) {
      localStorage.setItem("kanvei-token", state.token)
      localStorage.setItem("kanvei-user", JSON.stringify(state.user))
    } else {
      localStorage.removeItem("kanvei-token")
      localStorage.removeItem("kanvei-user")
    }
  }, [state.isAuthenticated, state.token, state.user])

  const login = async (email, password) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        dispatch({
          type: "LOGIN",
          payload: {
            user: data.user,
            token: data.token,
          },
        })
        return { success: true }
      } else {
        dispatch({ type: "SET_LOADING", payload: false })
        return { success: false, error: data.error }
      }
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false })
      return { success: false, error: "Network error" }
    }
  }

  const loginWithOTP = async (email, otp) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })

      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp, type: "login" }),
      })

      const data = await response.json()

      if (data.success) {
        dispatch({
          type: "LOGIN",
          payload: {
            user: data.user,
            token: data.token,
          },
        })
        return { success: true }
      } else {
        dispatch({ type: "SET_LOADING", payload: false })
        return { success: false, error: data.error }
      }
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false })
      return { success: false, error: "Network error" }
    }
  }

  const loginWithGoogle = async (googleToken) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })

      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ googleToken }),
      })

      const data = await response.json()

      if (data.success) {
        dispatch({
          type: "LOGIN",
          payload: {
            user: data.user,
            token: data.token,
          },
        })
        return { success: true }
      } else {
        dispatch({ type: "SET_LOADING", payload: false })
        return { success: false, error: data.error }
      }
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false })
      return { success: false, error: "Network error" }
    }
  }

  const loginWithFacebook = async (facebookToken) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })

      const response = await fetch("/api/auth/facebook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ facebookToken }),
      })

      const data = await response.json()

      if (data.success) {
        dispatch({
          type: "LOGIN",
          payload: {
            user: data.user,
            token: data.token,
          },
        })
        return { success: true }
      } else {
        dispatch({ type: "SET_LOADING", payload: false })
        return { success: false, error: data.error }
      }
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false })
      return { success: false, error: "Network error" }
    }
  }

  const sendOTP = async (email, type) => {
    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, type }),
      })

      const data = await response.json()
      return data
    } catch (error) {
      return { success: false, error: "Network error" }
    }
  }

  const register = async (name, email, password) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (data.success) {
        dispatch({
          type: "LOGIN",
          payload: {
            user: data.user,
            token: data.token,
          },
        })
        return { success: true }
      } else {
        dispatch({ type: "SET_LOADING", payload: false })
        return { success: false, error: data.error }
      }
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false })
      return { success: false, error: "Network error" }
    }
  }

  const registerWithOTP = async (name, email, password, otp) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })

      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
          type: "register",
          userData: { name, password },
        }),
      })

      const data = await response.json()

      if (data.success) {
        dispatch({
          type: "LOGIN",
          payload: {
            user: data.user,
            token: data.token,
          },
        })
        return { success: true }
      } else {
        dispatch({ type: "SET_LOADING", payload: false })
        return { success: false, error: data.error }
      }
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false })
      return { success: false, error: "Network error" }
    }
  }

  const logout = () => {
    dispatch({ type: "LOGOUT" })
  }

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        login,
        loginWithOTP,
        loginWithGoogle,
        loginWithFacebook,
        sendOTP,
        register,
        registerWithOTP,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
