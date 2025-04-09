import { Navigate } from "react-router-dom"
import { type ReactNode, useEffect, useState } from "react"

interface UserRouteProps {
  children: ReactNode
}

const UserRoute = ({ children }: UserRouteProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token")

      if (token) {
        setIsAuthenticated(true)
      }

      setIsLoading(false)
    }

    checkAuthStatus()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-700"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default UserRoute
