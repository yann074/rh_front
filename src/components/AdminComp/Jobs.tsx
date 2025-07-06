import { useState, useEffect } from "react";
import axios from "axios";
import {
    Trash,
    Paintbrush,
    MoreHorizontal,
    Briefcase,
    MapPin,
    Calendar,
    Search,
    Filter,
    Loader2,
    Clock,
    GraduationCap,
    DollarSign,
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { JobDetailsDialog } from "./JobsDetailsDialog";
import { Link, Outlet } from "react-router-dom";

interface Vaga {
    id: number;
    title: string;
    description: string;
    salary: string;
    requirements: string;
    location: string;
    benefits?: string;
    status: string;
    job_type: string;
    education: string;
    companies_id: string;
    created_at?: string;
    updated_at?: string;
}

export default function JobsTable() {
    const [vagas, setVagas] = useState<Vaga[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [filterTipo, setFilterTipo] = useState<string>("all");

    // Estado para o dialog de detalhes
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [selectedVaga, setSelectedVaga] = useState<Vaga | null>(null);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [detailsError, setDetailsError] = useState<string | null>(null);



    useEffect(() => {
        setLoading(true);
        axios.get("https://rhback-production.up.railway.app/api/opportunities")
            .then((response) => {
                let vagasData: Vaga[] = [];

                if (Array.isArray(response.data)) {
                    vagasData = response.data;
                } else if (response.data.data && Array.isArray(response.data.data)) {
                    vagasData = response.data.data;
                } else if (response.data.vagas && Array.isArray(response.data.vagas)) {
                    vagasData = response.data.vagas;
                } else {
                    console.error('Formato de resposta da API inesperado:', response.data);
                }

                setVagas(vagasData);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Erro ao buscar vagas:", error);
                setLoading(false);
            });
    }, []);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "aberta":
                return "bg-green-100 text-green-800";
            case "fechada":
                return "bg-red-100 text-red-800";
            case "em análise":
                return "bg-yellow-100 text-yellow-800";
            case "pendente":
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-purple-100 text-purple-800";
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch (e) {
            return "Data inválida";
        }
    };

    // Funções para lidar com ações
    const handleEdit = (id: number) => {
        console.log("Editar vaga", id);
        // Falta Implementar lógica para editar vaga
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Tem certeza que deseja deletar esta vaga?")) return;
    
        try {
            await axios.delete(`https://rhback-production.up.railway.app/api/opportunities/${id}`);
            setVagas(prev => prev.filter(v => v.id !== id));
        } catch (error) {
            console.error("Erro ao deletar vaga:", error);
            alert("Erro ao deletar. Tente novamente.");
        }
    };
    

    const handleViewDetails = async (id: number) => {
        console.log("Ver detalhes da vaga", id);
        setDetailsDialogOpen(true);
        setLoadingDetails(true);
        setDetailsError(null);

        try {
            const endpoint = `https://rhback-production.up.railway.app/api/opportunities/${id}`;
            console.log(`Buscando vaga: ${endpoint}`);

            const response = await axios.get(endpoint);

            if (response.data && response.data.data) {
                setSelectedVaga(response.data.data);
            } else {
                // Verifica se a vaga já está nos dados carregados previamente
                const vagaFromList = vagas.find(vaga => vaga.id === id);
                if (vagaFromList) {
                    setSelectedVaga(vagaFromList);
                } else {
                    setDetailsError("A resposta da API não contém os dados esperados.");
                    console.error("Resposta inesperada:", response.data);
                }
            }
        } catch (error: any) {
            console.error("Erro ao buscar dados da vaga:", error);

            if (error.response) {
                if (error.response.status === 404) {
                    setDetailsError(`Vaga não encontrada. O ID ${id} pode não existir no banco de dados.`);
                } else {
                    setDetailsError(`Erro do servidor: ${error.response.status} - ${error.response.statusText}`);
                }
            } else if (error.request) {
                setDetailsError("Não foi possível conectar ao servidor. Verifique se o backend está em execução.");
            } else {
                setDetailsError(`Erro ao configurar a requisição: ${error.message}`);
            }
        } finally {
            setLoadingDetails(false);
        }
    };

    // Filtrar vagas
    const filteredVagas = vagas.filter(vaga => {
        const matchesSearch = vaga.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vaga.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === "all" || vaga.status.toLowerCase() === filterStatus.toLowerCase();
        const matchesTipo = filterTipo === "all" || vaga.job_type.toLowerCase() === filterTipo.toLowerCase();
        return matchesSearch && matchesStatus && matchesTipo;
    });

    const truncateText = (text: string, maxLength: number) => {
        if (!text) return "";
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <CardTitle className="text-2xl">Vagas de Emprego</CardTitle>
                        <CardDescription>
                            Gerencie todas as vagas cadastradas na plataforma.
                        </CardDescription>
                    </div>
                    <Link to="/dashboard/createjobs">
                        <Button className="bg-white hover:bg-purple-200">
                            Adicionar Nova Vaga
                        </Button>
                    </Link>
                    <Outlet />
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Buscar vagas..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Select
                                value={filterStatus}
                                onValueChange={setFilterStatus}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filtrar por status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos os status</SelectItem>
                                    <SelectItem value="ativo">Ativo</SelectItem>
                                    <SelectItem value="fechada">Fechada</SelectItem>
                                    <SelectItem value="em análise">Em Análise</SelectItem>
                                    <SelectItem value="pendente">Pendente</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select
                                value={filterTipo}
                                onValueChange={setFilterTipo}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filtrar por tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos os tipos</SelectItem>
                                    <SelectItem value="remoto">Remoto</SelectItem>
                                    <SelectItem value="presencial">Presencial</SelectItem>
                                    <SelectItem value="híbrido">Híbrido</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="outline" size="icon">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-10">
                            <Loader2 className="h-8 w-8 text-purple-600 animate-spin mx-auto mb-4" />
                            <p className="text-gray-500">Carregando vagas...</p>
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px]">#</TableHead>
                                        <TableHead className="w-[250px]">Vaga</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Localização</TableHead>
                                        <TableHead>Tipo</TableHead>
                                        <TableHead>Formação</TableHead>
                                        <TableHead>Salário</TableHead>
                                        <TableHead>Criada em</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredVagas.length > 0 ? (
                                        filteredVagas.map((vaga) => (
                                            <TableRow key={vaga.id}>
                                                <TableCell className="font-medium">{vaga.id}</TableCell>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium">{vaga.title}</p>
                                                        <p className="text-sm text-gray-500">{truncateText(vaga.description, 50)}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={getStatusColor(vaga.status)}>
                                                        {vaga.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="h-4 w-4 text-gray-400" />
                                                        <span>{vaga.location || "Não especificado"}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Briefcase className="h-4 w-4 text-blue-600" />
                                                        <span>{vaga.job_type || "Não especificado"}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <GraduationCap className="h-4 w-4 text-amber-600" />
                                                        <span>{vaga.education || "Não especificado"}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <DollarSign className="h-4 w-4 text-green-600" />
                                                        <span>{vaga.salary || "A combinar"}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-gray-400" />
                                                        <span>{formatDate(vaga.created_at)}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <span className="sr-only">Abrir menu</span>
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-lg">
                                                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem onClick={() => handleViewDetails(vaga.id)}>
                                                                <Clock className="mr-2 h-4 w-4 text-purple-600" />
                                                                Ver Detalhes
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleEdit(vaga.id)}>
                                                                <Paintbrush className="mr-2 h-4 w-4 text-blue-600" />
                                                                Editar
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(vaga.id)}>
                                                                <Trash className="mr-2 h-4 w-4" />
                                                                Excluir
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={9} className="h-24 text-center">
                                                Nenhuma vaga encontrada.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}

                    <div className="flex items-center justify-between mt-4">
                        <p className="text-sm text-gray-500">
                            Mostrando {filteredVagas.length} de {vagas.length} vagas
                        </p>
                        <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" disabled>
                                Anterior
                            </Button>
                            <Button variant="outline" size="sm" className="bg-purple-50">
                                1
                            </Button>
                            <Button variant="outline" size="sm">
                                2
                            </Button>
                            <Button variant="outline" size="sm">
                                Próximo
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Dialog para exibir detalhes da vaga */}
            <JobDetailsDialog
                open={detailsDialogOpen}
                onOpenChange={setDetailsDialogOpen}
                selectedVaga={selectedVaga}
                loadingDetails={loadingDetails}
                detailsError={detailsError}
                handleEdit={handleEdit}
            />
        </div>
    );
}