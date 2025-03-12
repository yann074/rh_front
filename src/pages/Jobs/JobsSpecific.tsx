import Footer from "@/components/layouts/Footer";
import Header from "@/components/layouts/Header";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface Vaga {
    id: number;
    titulo: string;
    descricao: string;
    salario: string;
    requisitos: string;
    localizacao: string;
    beneficios: string; 
    status: string;
    tipo_trabalho: string;
    formacao: string;
    created_at?: string;
    updated_at?: string;
}

export default function JobsSpecific() {
    const { id } = useParams();
    const [data, setData] = useState<Vaga | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const endpoint = `http://127.0.0.1:8000/api/all_specific/${id}`;
                console.log(`Buscando vaga: ${endpoint}`);
                
                const response = await axios.get(endpoint);
                
                if (response.data && response.data.data) {
                    setData(response.data.data);
                } else {
                    setError("A resposta da API não contém os dados esperados.");
                    console.error("Resposta inesperada:", response.data);
                }
            } catch (error: any) {
                console.error("Erro ao buscar dados da vaga:", error);
                
                if (error.response) {
                    if (error.response.status === 404) {
                        setError(`Vaga não encontrada. O ID ${id} pode não existir no banco de dados.`);
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
    
    const formatDate = (dateString: string | number | Date) => {
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

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <main className="flex-grow">
                <div className="container mx-auto px-4 py-8">
                    {loading ? (
                        <div className="flex justify-center items-center py-16">
                            <p className="text-gray-600">Carregando detalhes da vaga...</p>
                        </div>
                    ) : error ? (
                        <div className="max-w-2xl mx-auto">
                            <div className="bg-red-50 border border-red-200 rounded-xl p-6 my-8">
                                <h2 className="text-xl font-semibold text-red-700 mb-4">Erro ao carregar a vaga</h2>
                                <p className="text-gray-700 mb-4">{error}</p>
                                
                                <div className="bg-white p-4 rounded-lg mb-4">
                                    <h3 className="font-medium text-gray-800 mb-2">Possíveis soluções:</h3>
                                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                                        <li>Verifique se o ID da vaga existe no banco de dados</li>
                                        <li>Confirme se o modelo Vaga está retornando resultados corretamente</li>
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
                                        to="/jobs" 
                                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                                    >
                                        Ver todas as vagas
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
                                    <Link to="/jobs" className="flex items-center">
                                        <ChevronLeft className="h-4 w-4 mr-1" />
                                        Voltar para lista de vagas
                                    </Link>
                                </Button>
                            </div>
                            
                            <div className="bg-white rounded-3xl shadow-md overflow-hidden">
                                <div className="bg-[#723E98] p-6">
                                    <h1 className="text-3xl font-semibold text-center text-white uppercase">
                                        {data.titulo}
                                    </h1>
                                </div>
                                
                                <div className="p-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div className="bg-purple-50 p-4 rounded-xl">
                                            <p className="text-gray-800 mb-2"><strong>Salário:</strong> R${data.salario}</p>
                                            <p className="text-gray-800 mb-2"><strong>Localização:</strong> {data.localizacao}</p>
                                            <p className="text-gray-800 mb-2"><strong>Tipo de Trabalho:</strong> {data.tipo_trabalho}</p>
                                            <p className="text-gray-800"><strong>Status:</strong> {data.status}</p>
                                        </div>
                                        
                                        <div className="bg-purple-50 p-4 rounded-xl">
                                            <p className="text-gray-800 mb-2"><strong>Formação Necessária:</strong> {data.formacao}</p>
                                            <p className="text-gray-800 mb-2"><strong>Data de Publicação:</strong> {data.created_at ? formatDate(data.created_at) : '-'}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="mb-6">
                                        <h2 className="text-xl font-semibold mb-2 text-[#723E98]">Descrição</h2>
                                        <div className="bg-gray-50 p-4 rounded-xl">
                                            <p className="text-gray-800">{data.descricao}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="mb-6">
                                        <h2 className="text-xl font-semibold mb-2 text-[#723E98]">Requisitos</h2>
                                        <div className="bg-gray-50 p-4 rounded-xl">
                                            <p className="text-gray-800">{data.requisitos}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="mb-8">
                                        <h2 className="text-xl font-semibold mb-2 text-[#723E98]">Benefícios</h2>
                                        <div className="bg-gray-50 p-4 rounded-xl">
                                            <p className="text-gray-800">{data.beneficios}</p>
                                        </div>
                                    </div>
                                    
                                    <Link to={`/apply/${data.id}`} className="block w-full bg-[#723E98] text-white text-center py-3 px-4 rounded-xl hover:bg-purple-800 transition font-semibold">
                                        Candidatar-se a essa vaga
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-gray-600">Vaga não encontrada.</p>
                            <Link to="/" className="text-purple-600 hover:underline mt-4 inline-block">
                                Voltar para lista de vagas
                            </Link>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}