import { Navigate } from "react-router-dom"
import { type ReactNode, useEffect, useState } from "react"
import axios from "axios"

interface AdminRouteProps {
  children: ReactNode
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showAccessDenied, setShowAccessDenied] = useState(false)

  useEffect(() => {
    const checkAdminStatus = async () => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token")

      if (!token) {
        setIsLoading(false)
        return
      }

      try {
        const response = await axios.get("https://rhback-production.up.railway.app/api/userprofile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        // Check if user has admin permission
        if (response.data && response.data.permission === "admin") {
          setIsAdmin(true)
        } else {
          // User is logged in but not an admin
          setShowAccessDenied(true)
          
          // Redirect to home page after showing message for a few seconds
          setTimeout(() => {
            setShowAccessDenied(false)
          }, 3000)
        }
      } catch (error) {
        console.error("Error verifying admin status:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAdminStatus()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-700"></div>
      </div>
    )
  }

  if (showAccessDenied) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Acesso Negado</h2>
          <p className="text-gray-600 mb-6">Você não tem permissão para acessar esta área. Apenas administradores podem visualizar o painel.</p>
          <p className="text-sm text-gray-500">Redirecionando para a página inicial...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default AdminRoute
