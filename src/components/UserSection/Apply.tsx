import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function Apply() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isCandidate, setIsCandidate] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [alreadyApplied, setAlreadyApplied] = useState(false);

    
    // A variável 'token' agora é definida uma vez no topo do componente,
    // lendo de ambos os storages (localStorage e sessionStorage).
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    

    useEffect(() => {
        if (!id) {
            setError("ID da vaga não encontrado!");
            setIsLoading(false);
            return;
        }

        // Verifica se o usuário está logado antes de prosseguir
        if (!token) {
            setError("Usuário não autenticado! Você precisa estar logado para se candidatar.");
            setIsLoading(false);
            // Opcional: redirecionar para o login
            // navigate("/login"); 
            return;
        }

        checkIfUserIsCandidate();
    }, [id, token]); // Adicionado 'token' como dependência

    const checkIfUserIsCandidate = async () => {
        setIsLoading(true);
        try {
            // A verificação do token já foi feita no useEffect.
            // A chamada da API agora usa a variável 'token' principal.
            const response = await axios.get("https://rhback-production.up.railway.app/api/check_candidate", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (
                response.data?.status_code === 200 &&
                response.data?.message === "success" &&
                response.data?.data?.is_candidate === true
            ) {
                setIsCandidate(true);
                applyForJob(); // Procede para a candidatura
            } else {
                // Se a resposta não for a esperada, mas não for um erro de "não candidato"
                setError("Resposta inesperada do servidor ao verificar seu perfil.");
                setIsLoading(false);
            }
        } catch (apiError) {
            // Tratamento de erro seguro para TypeScript
            if (axios.isAxiosError(apiError) && apiError.response) {
                if (apiError.response.status === 500 && apiError.response.data?.message === "Usuário não é candidato.") {
                    setIsCandidate(false);
                } else {
                    // Outros erros da API
                    setError(apiError.response.data?.message || "Ocorreu um erro ao verificar seu perfil.");
                }
            } else {
                // Erros de rede ou outros
                setError("Ocorreu um erro inesperado. Verifique sua conexão.");
            }
            setIsLoading(false);
        }
    };

    const applyForJob = async () => {
        try {
            // A chamada da API agora usa a variável 'token' principal.
            await axios.post(
                `https://rhback-production.up.railway.app/api/apply_opportunities/${id}`,
                { id_vaga: id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setSuccess(true);
            setIsLoading(false);
            fetchUserData(); // Busca dados após o sucesso
        } catch (error) {
            // Tratamento de erro seguro para TypeScript
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 409) {
                    setAlreadyApplied(true);
                    setIsLoading(false);
                    return;
                }
                const errorMessage = error.response?.data?.message || "Erro ao enviar sua candidatura. Tente novamente.";
                setError(errorMessage);
            } else {
                setError("Ocorreu um erro inesperado ao se candidatar.");
            }
            setIsLoading(false);
        }
    };

    const fetchUserData = async () => {
        try {
            // A chamada da API agora usa a variável 'token' principal.
            const userProfileResponse = await axios.get("https://rhback-production.up.railway.app/api/userprofile", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Dados do usuário autenticado:", userProfileResponse.data);
        } catch (error) {
            console.error("Erro ao buscar dados do usuário após candidatura:", error);
        }
    };

    // As funções de manipulação de eventos (handlers) e a lógica de renderização (JSX)
    // permanecem as mesmas. Copie e cole este arquivo inteiro.
    
    const handleGoToHome = () => {
        navigate("/");
    };

    const handleGoToProfile = () => {
        navigate("/userhomepage");
    };

    const handleTryAgain = () => {
        setError(null);
        checkIfUserIsCandidate();
    };

    const handleGoToReturnOpportunity = () => {
        navigate(`/statusresponse/${id}`);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Verificando seu perfil e realizando candidatura...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                        <svg className="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Ocorreu um Erro</h3>
                    <p className="text-sm text-gray-600 mb-6">{error}</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button onClick={handleGoToHome} className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                            Página Inicial
                        </button>
                        <button onClick={handleTryAgain} className="w-full sm:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700">
                            Tentar Novamente
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (isCandidate === false) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
                            <svg className="h-10 w-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M5.06 19h13.88c1.54 0 2.5-1.67 1.73-3L13.73 4a2 2 0 00-3.46 0L3.34 16c-.77 1.33.19 3 1.72 3z"></path>
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
                                Completar Perfil
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
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
        );
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
        );
    }
    
    // Retorno padrão caso nenhuma condição seja atendida (bom para evitar erros de "não retorna nada")
    return null; 
}