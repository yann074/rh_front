import { useState, useEffect } from "react";
import axios from "axios";
import { 
  Trash, 
  Paintbrush,  
  MoreHorizontal, 
  Award, 
  User, 
  Calendar, 
  Search, 
  Filter,
  Briefcase,
  GraduationCap,
  CheckCircle,
  Clock,
  XCircle,
  Phone,
  Mail
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Candidate {
  id: number;
  name: string;
  email: string;
  position: string;
  applicationDate?: string;
  status?: "Aprovado" | "Em Análise" | "Entrevista" | "Rejeitado" | "Contratado";
  avatarUrl?: string;
  experience?: string;
  education?: string;
  skills?: string[];
  vacancy?: string;
  // Campos de informações pessoais
  telefone?: string;
  data_nasc?: string;
  genero?: string;
  cor?: string;
  orient_sexual?: string;
}

export default function CandidateTable() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPosition, setFilterPosition] = useState<string>("all");
  const [userPersonalData, setUserPersonalData] = useState<Record<string, any>>({});

  useEffect(() => {
    setLoading(true);
    
    // Primeiro, vamos tentar carregar os dados pessoais dos usuários
    axios.post("http://127.0.0.1:8000/api/user_personal")
      .then((personalResponse) => {
        // Criar um mapa de ID do usuário para dados pessoais
        const personalMap: Record<string, any> = {};
        personalResponse.data.forEach((item: any) => {
          personalMap[item.user_id] = item;
        });
        setUserPersonalData(personalMap);
        
        // Agora vamos carregar os dados principais
        return axios.get("http://127.0.0.1:8000/api/all");
      })
      .then((response) => {
        // Combinar os dados dos usuários com os dados pessoais
        const enrichedCandidates = response.data.data.map((user: any) => {
          const personal = userPersonalData[user.id] || {};
          
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            position: mapToPosition(user.permission),
            applicationDate: getRandomDate(),
            status: getRandomStatus(),
            avatarUrl: "",
            experience: getRandomExperience(),
            education: getRandomEducation(),
            skills: getRandomSkills(),
            vacancy: getRandomVacancy(mapToPosition(user.permission)),
            // Dados pessoais, se disponíveis
            telefone: personal.telefone || "",
            data_nasc: personal.data_nasc || "",
            genero: personal.genero || "",
            cor: personal.cor || "",
            orient_sexual: personal.orient_sexual || ""
          };
        });
        
        setCandidates(enrichedCandidates);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar dados:", error);
        
        // Caso a chamada para user_personal falhe, ainda assim carregamos os dados básicos
        axios.get("http://127.0.0.1:8000/api/all")
          .then((response) => {
            const enrichedCandidates = response.data.data.map((user: any) => ({
              id: user.id,
              name: user.name,
              email: user.email,
              position: mapToPosition(user.permission),
              applicationDate: getRandomDate(),
              status: getRandomStatus(),
              avatarUrl: "",
              experience: getRandomExperience(),
              education: getRandomEducation(),
              skills: getRandomSkills(),
              vacancy: getRandomVacancy(mapToPosition(user.permission)),
              // Adicionar informações pessoais simuladas baseadas nos dados disponíveis
              telefone: simulatePhoneNumber(user.id),
              data_nasc: simulateBirthDate(user.id),
              genero: simulateGender(user.name),
              cor: simulateRace(user.id),
              orient_sexual: simulateOrientation(user.id)
            }));
            
            setCandidates(enrichedCandidates);
            setLoading(false);
          })
          .catch((secondError) => {
            console.error("Erro ao buscar dados alternativos:", secondError);
            setLoading(false);
          });
      });
  }, []);

  // Funções para simular dados pessoais caso a API não forneça
  const simulatePhoneNumber = (id: number) => {
    return `(${10 + (id % 90)}) 9${id % 10}${id % 10}${id % 10}${id % 10}-${id % 10}${id % 10}${id % 10}${id % 10}`;
  };
  
  const simulateBirthDate = (id: number) => {
    const year = 1980 + (id % 25);
    const month = 1 + (id % 12);
    const day = 1 + (id % 28);
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  };
  
  const simulateGender = (name: string) => {
    const genders = ["masculino", "feminino", "não-binário"];
    const seed = name.length;
    return genders[seed % genders.length];
  };
  
  const simulateRace = (id: number) => {
    const races = ["branco", "preto", "pardo", "amarelo", "indígena"];
    return races[id % races.length];
  };
  
  const simulateOrientation = (id: number) => {
    const orientations = ["heterossexual", "homossexual", "bissexual"];
    return orientations[id % orientations.length];
  };

  // Formatação de datas
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch (e) {
      return dateString;
    }
  };

  // Dados de demonstração
  const getRandomDate = () => {
    const days = Math.floor(Math.random() * 60);
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toLocaleDateString('pt-BR');
  };

  const getRandomStatus = (): "Aprovado" | "Em Análise" | "Entrevista" | "Rejeitado" | "Contratado" => {
    const statuses: ["Aprovado", "Em Análise", "Entrevista", "Rejeitado", "Contratado"] = 
      ["Aprovado", "Em Análise", "Entrevista", "Rejeitado", "Contratado"];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  const mapToPosition = (permission: string): string => {
    const positions: Record<string, string> = {
      "Admin": "Desenvolvedor Sênior",
      "User": "Desenvolvedor Júnior",
      "Editor": "Designer UX/UI",
      "Guest": "Analista de Dados"
    };
    return positions[permission] || "Desenvolvedor Full Stack";
  };

  const getRandomExperience = (): string => {
    const experiences = ["1-2 anos", "3-5 anos", "5+ anos", "Menos de 1 ano", "7+ anos"];
    return experiences[Math.floor(Math.random() * experiences.length)];
  };

  const getRandomEducation = (): string => {
    const education = ["Graduação", "Pós-graduação", "Mestrado", "Bootcamp", "Técnico"];
    return education[Math.floor(Math.random() * education.length)];
  };

  const getRandomSkills = (): string[] => {
    const allSkills = ["React", "Node.js", "Python", "Java", "SQL", "UX/UI", "TypeScript", "PHP", "AWS", "Docker"];
    const numSkills = Math.floor(Math.random() * 4) + 1;
    const shuffled = [...allSkills].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numSkills);
  };

  const getRandomVacancy = (position: string): string => {
    if (position.includes("Desenvolvedor")) {
      return `Vaga ${Math.floor(Math.random() * 5) + 1} - ${position}`;
    } else if (position.includes("Designer")) {
      return `Vaga ${Math.floor(Math.random() * 3) + 1} - ${position}`;
    } else {
      return `Vaga ${Math.floor(Math.random() * 2) + 1} - ${position}`;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aprovado":
        return "bg-green-100 text-green-800";
      case "Em Análise":
        return "bg-blue-100 text-blue-800";
      case "Entrevista":
        return "bg-purple-100 text-purple-800";
      case "Rejeitado":
        return "bg-red-100 text-red-800";
      case "Contratado":
        return "bg-emerald-100 text-emerald-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Aprovado":
        return <CheckCircle className="h-4 w-4 text-green-600 mr-1" />;
      case "Em Análise":
        return <Clock className="h-4 w-4 text-blue-600 mr-1" />;
      case "Entrevista":
        return <User className="h-4 w-4 text-purple-600 mr-1" />;
      case "Rejeitado":
        return <XCircle className="h-4 w-4 text-red-600 mr-1" />;
      case "Contratado":
        return <Award className="h-4 w-4 text-emerald-600 mr-1" />;
      default:
        return null;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Funções para lidar com ações
  const handleView = (id: number) => {
    console.log("Ver candidato", id);
    // Implementar lógica para visualizar candidato
  };

  const handleScheduleInterview = (id: number) => {
    console.log("Agendar entrevista com candidato", id);
    // Implementar lógica para agendar entrevista
  };

  const handleReject = (id: number) => {
    console.log("Rejeitar candidato", id);
    // Implementar lógica para rejeitar candidato
  };

  // Filtrar candidatos com base no termo de pesquisa e no filtro de cargo
  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPosition = filterPosition === "all" || candidate.position === filterPosition;
    return matchesSearch && matchesPosition;
  });

  const getGenderIcon = (gender: string | undefined) => {
    if (!gender) return null;
    
    if (gender.toLowerCase().includes("masculino")) {
      return <span className="text-blue-500">♂</span>;
    } else if (gender.toLowerCase().includes("feminino")) {
      return <span className="text-pink-500">♀</span>;
    } else {
      return <span className="text-purple-500">⚧</span>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl">Candidatos às Vagas</CardTitle>
            <CardDescription>
              Gerencie todos os candidatos às vagas disponíveis.
            </CardDescription>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700">
            Adicionar Candidato
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar candidatos..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={filterPosition}
                onValueChange={setFilterPosition}
              >
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Filtrar por cargo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os cargos</SelectItem>
                  <SelectItem value="Desenvolvedor Sênior">Desenvolvedor Sênior</SelectItem>
                  <SelectItem value="Desenvolvedor Júnior">Desenvolvedor Júnior</SelectItem>
                  <SelectItem value="Designer UX/UI">Designer UX/UI</SelectItem>
                  <SelectItem value="Analista de Dados">Analista de Dados</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Carregando candidatos...</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead className="w-[300px]">Candidato</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Vaga</TableHead>
                    <TableHead>Experiência</TableHead>
                    <TableHead>Data de Aplicação</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCandidates.length > 0 ? (
                    filteredCandidates.map((candidate) => (
                      <TableRow key={candidate.id}>
                        <TableCell className="font-medium">{candidate.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={candidate.avatarUrl} alt={candidate.name} />
                              <AvatarFallback className="bg-purple-100 text-purple-800">
                                {getInitials(candidate.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center">
                                <p className="font-medium">{candidate.name}</p>
                                {getGenderIcon(candidate.genero)}
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <Mail className="h-3 w-3 mr-1" />
                                {candidate.email}
                              </div>
                              {candidate.telefone && (
                                <div className="flex items-center text-xs text-gray-400">
                                  <Phone className="h-3 w-3 mr-1" />
                                  {candidate.telefone}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(candidate.status || "")}>
                            <div className="flex items-center">
                              {getStatusIcon(candidate.status || "")}
                              {candidate.status}
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {candidate.position.includes("Sênior") && <Award className="h-4 w-4 text-yellow-600" />}
                            {candidate.position.includes("Júnior") && <GraduationCap className="h-4 w-4 text-blue-600" />}
                            {candidate.position.includes("Designer") && <Paintbrush className="h-4 w-4 text-purple-600" />}
                            {candidate.position.includes("Analista") && <Briefcase className="h-4 w-4 text-green-600" />}
                            {candidate.position}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium">{candidate.vacancy}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{candidate.experience}</span>
                        </TableCell>
                        <TableCell>{candidate.applicationDate}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Abrir menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Ações</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleView(candidate.id)}>
                                <User className="mr-2 h-4 w-4 text-blue-600" />
                                Ver Perfil
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleScheduleInterview(candidate.id)}>
                                <Calendar className="mr-2 h-4 w-4 text-purple-600" />
                                Agendar Entrevista
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuLabel>Informações Pessoais</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Calendar className="mr-2 h-4 w-4 text-gray-600" />
                                Nascimento: {formatDate(candidate.data_nasc || "")}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4 text-gray-600" />
                                Gênero: {candidate.genero || "Não informado"}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4 text-gray-600" />
                                Cor/Raça: {candidate.cor || "Não informado"}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4 text-gray-600" />
                                Orientação: {candidate.orient_sexual || "Não informado"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600" onClick={() => handleReject(candidate.id)}>
                                <Trash className="mr-2 h-4 w-4" />
                                Rejeitar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        Nenhum candidato encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-500">
              Mostrando {filteredCandidates.length} de {candidates.length} candidatos
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
    </div>
  );
}