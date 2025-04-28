"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useParams, useNavigate } from "react-router-dom"

export default function Apply() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isCandidate, setIsCandidate] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!id) {
      setError("ID da vaga não encontrado!")
      setIsLoading(false)
      return
    }

    checkIfUserIsCandidate()
  }, [id])

  const checkIfUserIsCandidate = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("Usuário não autenticado!")
        setIsLoading(false)
        return
      }

      console.log("Verificando status de candidato...")

      try {
        // Tenta fazer a requisição
        const response = await axios.get("http://127.0.0.1:8000/api/check_candidate", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        console.log("Resposta de sucesso:", response.data)

        // Verifica se a resposta tem o formato esperado para sucesso
        if (
          response.data &&
          response.data.status_code === 200 &&
          response.data.message === "success" &&
          response.data.data &&
          response.data.data.is_candidate === true
        ) {
          console.log("Usuário é candidato - prosseguindo com a candidatura")
          setIsCandidate(true)
          applyForJob()
        } else {
          // Resposta inesperada
          console.error("Resposta inesperada da API:", response.data)
          setError("Resposta inesperada do servidor.")
          setIsLoading(false)
        }
      } catch (apiError: any) {
        console.log("Erro da API:", apiError.response?.data)

        // Verifica se é o erro específico de "Usuário não é candidato"
        if (
          apiError.response &&
          apiError.response.status === 500 &&
          apiError.response.data &&
          apiError.response.data.status_code === 500 &&
          apiError.response.data.message === "Usuário não é candidato."
        ) {
          console.log("Usuário não é candidato - mostrando opções")
          setIsCandidate(false)
          setIsLoading(false)
        } else {
          // Outros erros
          throw apiError // Repassa o erro para ser tratado no catch externo
        }
      }
    } catch (error: any) {
      console.error("Erro ao verificar status de candidato:", error)
      const errorMessage = error.response?.data?.message || "Erro ao verificar seu perfil de candidato."
      setError(errorMessage)
      setIsLoading(false)
    }
  }

  const applyForJob = async () => {
    try {
      const token = localStorage.getItem("token")

      const response = await axios.post(
        `http://127.0.0.1:8000/api/apply_opportunities/${id}`,
        { id_vaga: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      console.log("Resposta da candidatura:", response.data)
      setSuccess(true)
      setIsLoading(false)
      fetchUserData()
    } catch (error: any) {
      console.error("Erro ao enviar candidatura:", error)
      const errorMessage = error.response?.data?.message || "Erro ao enviar sua candidatura. Tente novamente."
      setError(errorMessage)
      setIsLoading(false)
    }
  }

  const fetchUserData = async () => {
    try {
      const userProfileResponse = await axios.get("http://127.0.0.1:8000/api/userprofile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      console.log("Usuário autenticado:", userProfileResponse.data)
      console.log("Token usado:", localStorage.getItem("token"))
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error)
    }
  }

  const handleGoToHome = () => {
    navigate("/")
  }

  const handleGoToProfile = () => {
    navigate("/userhomepage")
  }

  const handleTryAgain = () => {
    setError(null)
    setIsLoading(true)
    checkIfUserIsCandidate()
  }

  // Adiciona logs para depuração
  console.log("Estado atual:", { isCandidate, isLoading, error, success })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando seu perfil...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md" role="alert">
          <strong className="font-bold">Erro! </strong>
          <span className="block sm:inline">{error}</span>
          <div className="mt-4 flex justify-end space-x-3">
            <button
              onClick={handleGoToHome}
              className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto sm:text-sm"
            >
              Voltar para Página Inicial
            </button>
            <button
              onClick={handleTryAgain}
              className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (isCandidate === false) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
              <svg
                className="h-10 w-10 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                ></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Perfil Incompleto</h3>
            <p className="text-sm text-gray-600 mb-6">
              Você precisa completar seu perfil de candidato antes de se candidatar a uma vaga. Por favor, preencha
              todas as informações necessárias para continuar.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleGoToHome}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Voltar para Página Inicial
              </button>
              <button
                onClick={handleGoToProfile}
                className="w-full sm:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Ir para Perfil
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative max-w-md">
          <strong className="font-bold">Sucesso! </strong>
          <span className="block sm:inline">Candidatura enviada com sucesso!</span>
          <button
            onClick={handleGoToHome}
            className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Voltar para Página Inicial
          </button>
        </div>
      </div>
    )
  }

  return null
}