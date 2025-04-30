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
  const [alreadyApplied, setAlreadyApplied] = useState(false)

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

      const response = await axios.get("http://127.0.0.1:8000/api/check_candidate", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (
        response.data &&
        response.data.status_code === 200 &&
        response.data.message === "success" &&
        response.data.data &&
        response.data.data.is_candidate === true
      ) {
        setIsCandidate(true)
        applyForJob()
      } else {
        setError("Resposta inesperada do servidor.")
        setIsLoading(false)
      }
    } catch (apiError: any) {
      if (
        apiError.response &&
        apiError.response.status === 500 &&
        apiError.response.data &&
        apiError.response.data.message === "Usuário não é candidato."
      ) {
        setIsCandidate(false)
        setIsLoading(false)
      } else {
        throw apiError
      }
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
        }
      )

      setSuccess(true)
      setIsLoading(false)
      fetchUserData()
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        setAlreadyApplied(true)
        setIsLoading(false)
        return
      }

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

  const handleGoToReturnOpportunity = () => {
    navigate(`/statusresponse/${id}`);
  }
  

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
              className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              Voltar para Página Inicial
            </button>
            <button
              onClick={handleTryAgain}
              className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700"
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
              <svg className="h-10 w-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01M5.06 19h13.88c1.54 0 2.5-1.67 1.73-3L13.73 4a2 2 0 00-3.46 0L3.34 16c-.77 1.33.19 3 1.72 3z"
                ></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Perfil Incompleto</h3>
            <p className="text-sm text-gray-600 mb-6">
              Você precisa completar seu perfil de candidato antes de se candidatar a uma vaga.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={handleGoToHome} className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Voltar para Página Inicial
              </button>
              <button onClick={handleGoToProfile} className="w-full sm:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                Editar Perfil
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (alreadyApplied) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
            <svg className="h-10 w-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-3-3v6m-7.071 7.071a8 8 0 1111.314-11.314 8 8 0 01-11.314 11.314z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Candidatura Já Realizada</h3>
          <p className="text-sm text-gray-600 mb-6">
            Você já se candidatou a esta vaga. Deseja visualizar sua candidatura ou voltar à página de vagas?
          </p>
          <div className="flex justify-center gap-3">
            <button onClick={handleGoToHome} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              Página de Vagas
            </button>
            <button onClick={handleGoToReturnOpportunity} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
              Ver Candidatura
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Candidatura Enviada com Sucesso!</h3>
          <p className="text-sm text-gray-600 mb-6">
            Parabéns! Sua candidatura foi enviada com sucesso.
          </p>
          <div className="flex justify-center gap-3">
            <button onClick={handleGoToHome} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              Página de Vagas
            </button>
            <button onClick={handleGoToProfile} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
              Ver Perfil
            </button>
          </div>
        </div>
      </div>
    )
  }

}
