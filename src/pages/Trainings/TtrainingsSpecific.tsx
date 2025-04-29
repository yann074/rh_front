import Footer from "@/components/layouts/Footer";
import Header from "@/components/layouts/Header";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, BookOpen, Clock, Calendar, Award, UserCheck } from "lucide-react";

interface Training {
    id: number;
    name: string;
    type: string;
    workload_hours?: number;
    institution?: string;
    start_date?: string;
    end_date?: string;
    requires_certificate: boolean;
    description?: string;
    created_at?: string;
    updated_at?: string;
}

export default function TrainingsSpecific() {
    const { id } = useParams();
    const [data, setData] = useState<Training | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const endpoint = `http://127.0.0.1:8000/api/trainings/${id}`;
                console.log(`Buscando treinamento: ${endpoint}`);
                
                const response = await axios.get(endpoint);
                
                if (response.data && response.data.data) {
                    setData(response.data.data);
                } else {
                    setError("A resposta da API não contém os dados esperados.");
                    console.error("Resposta inesperada:", response.data);
                }
            } catch (error: any) {
                console.error("Erro ao buscar dados do treinamento:", error);
                
                if (error.response) {
                    if (error.response.status === 404) {
                        setError(`Treinamento não encontrado. O ID ${id} pode não existir no banco de dados.`);
                    } else {
                        setError(`Erro do servidor: ${error.response.status} - ${error.response.statusText}`);
                    }
                } else if (error.request) {
                    setError("Não foi possível conectar ao servidor. Verifique se o backend está em execução.");
                } else {
                    setError(`Erro ao configurar a requisição: ${error.message}`);
                }
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    const handleGoBack = () => {
        navigate(-1); 
    };
    
    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch (e) {
            return String(dateString);
        }
    };

    const handleDownloadCertificate = async () => {
        if (!id) return;
    
        try {
            const token = localStorage.getItem('token'); // Ou outro local onde você armazena o token
    
            const response = await axios.get(`http://127.0.0.1:8000/api/trainings/${id}/certificate`, {
                responseType: 'blob', // Importante para PDF
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            // Criar URL e fazer download automático
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `certificado_treinamento_${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error: any) {
            console.error("Erro ao baixar o certificado:", error);
            alert("Não foi possível baixar o certificado. Verifique se você está inscrito ou se o certificado está disponível.");
        }
    };

    
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <main className="flex-grow">
                <div className="container mx-auto px-4 py-8">
                    {loading ? (
                        <div className="flex justify-center items-center py-16">
                            <p className="text-gray-600">Carregando detalhes do treinamento...</p>
                        </div>
                    ) : error ? (
                        <div className="max-w-2xl mx-auto">
                            <div className="bg-red-50 border border-red-200 rounded-xl p-6 my-8">
                                <h2 className="text-xl font-semibold text-red-700 mb-4">Erro ao carregar o treinamento</h2>
                                <p className="text-gray-700 mb-4">{error}</p>
                                
                                <div className="bg-white p-4 rounded-lg mb-4">
                                    <h3 className="font-medium text-gray-800 mb-2">Possíveis soluções:</h3>
                                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                                        <li>Verifique se o ID do treinamento existe no banco de dados</li>
                                        <li>Confirme se o modelo Training está retornando resultados corretamente</li>
                                        <li>Verifique os logs do servidor para identificar erros específicos</li>
                                    </ul>
                                </div>
                                
                                <div className="flex gap-4 mt-6">
                                    <button 
                                        onClick={handleGoBack}
                                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                                    >
                                        Voltar
                                    </button>
                                    <Link 
                                        to="/trainings" 
                                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                                    >
                                        Ver todos os treinamentos
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : data ? (
                        <div className="max-w-4xl mx-auto">
                            <div className="mb-4">
                                <Button 
                                    variant="ghost" 
                                    className="text-purple-700 hover:text-purple-900 hover:bg-purple-100" 
                                    asChild
                                >
                                    <Link to="/trainings" className="flex items-center">
                                        <ChevronLeft className="h-4 w-4 mr-1" />
                                        Voltar para lista de treinamentos
                                    </Link>
                                </Button>
                            </div>
                            
                            <div className="bg-white rounded-3xl shadow-md overflow-hidden">
                                <div className="bg-[#723E98] p-6">
                                    <h1 className="text-3xl font-semibold text-center text-white uppercase">
                                        {data.name}
                                    </h1>
                                </div>
                                
                                <div className="p-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div className="bg-purple-50 p-4 rounded-xl">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Award className="h-5 w-5 text-purple-700" />
                                                <p className="text-gray-800"><strong>Tipo:</strong> {data.type || 'Não especificado'}</p>
                                            </div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <BookOpen className="h-5 w-5 text-purple-700" />
                                                <p className="text-gray-800"><strong>Instituição:</strong> {data.institution || 'Não especificada'}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <UserCheck className="h-5 w-5 text-purple-700" />
                                                <p className="text-gray-800"><strong>Certificado:</strong> {data.requires_certificate ? 'Sim' : 'Não'}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-purple-50 p-4 rounded-xl">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Calendar className="h-5 w-5 text-purple-700" />
                                                <p className="text-gray-800"><strong>Início:</strong> {formatDate(data.start_date)}</p>
                                            </div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <Calendar className="h-5 w-5 text-purple-700" />
                                                <p className="text-gray-800"><strong>Término:</strong> {formatDate(data.end_date)}</p>
                                            </div>
                                            {data.workload_hours && (
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-5 w-5 text-purple-700" />
                                                    <p className="text-gray-800"><strong>Carga Horária:</strong> {data.workload_hours} horas</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {data.description && (
                                        <div className="mb-6">
                                            <h2 className="text-xl font-semibold mb-2 text-[#723E98]">Descrição</h2>
                                            <div className="bg-gray-50 p-4 rounded-xl">
                                                <p className="text-gray-800">{data.description}</p>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className="flex justify-between items-center mt-8">
                                        <div className="text-sm text-gray-500">
                                            <p>Atualizado em: {data.updated_at ? formatDate(data.updated_at) : '-'}</p>
                                        </div>
                                        
                                        <Link 
                                            to={`/trainings/apply/${data.id}`} 
                                            className="bg-[#723E98] text-white text-center py-3 px-6 rounded-xl hover:bg-purple-800 transition font-semibold flex items-center gap-2"
                                        >
                                            Inscrever-se neste treinamento
                                        </Link>

                                        <button 
                                            onClick={handleDownloadCertificate}
                                            className="bg-[#723E98] text-white text-center py-3 px-6 rounded-xl hover:bg-purple-800 transition font-semibold flex items-center gap-2"
                                        >
                                            Baixar certificado em PDF
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-gray-600">Treinamento não encontrado.</p>
                            <Link to="/trainings" className="text-purple-600 hover:underline mt-4 inline-block">
                                Voltar para lista de treinamentos
                            </Link>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}