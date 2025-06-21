import { useState, useEffect } from "react"
import api from "@/service/Api" // Certifique-se que o caminho para sua API está correto
import {
  Award, User, Search, Filter, CheckCircle, Clock, XCircle, Mail,
  Download, Camera, Phone, Calendar, MapPin, Loader2, ThumbsUp, ThumbsDown,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
  DialogFooter, DialogClose,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"


interface Application {
  id: number;
  name: string;
  email: string;
  vacancy: string;
  applicationDate: string;
  status: string;
  userId: number;
}
interface CandidateProfile {
  name: string;
  email: string;
  photo_url?: string;
  resume_url?: string;
  phone?: string;
  birth_date?: string;
  linkedin?: string;
  sex?: string;
  race?: string;
  location?: string;
}

export default function Applications() {
  const [applications, setApplications] = useState<Application[]>([])
  const [selectedCandidate, setSelectedCandidate] = useState<Application | null>(null)
  const [candidateProfile, setCandidateProfile] = useState<CandidateProfile | null>(null)
  
  const [loading, setLoading] = useState(true)
  const [modalLoading, setModalLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false) // Novo estado para o loading das ações

  const [searchTerm, setSearchTerm] = useState("")
  const [filterPosition, setFilterPosition] = useState<string>("all")

  useEffect(() => {
    fetchApplications();
  }, [])

  const fetchApplications = () => {
    setLoading(true)
    api.get('/apply_opportunities') 
      .then((response) => {
        const transformedData = response.data.data.map((app: any) => ({
          id: app.id, name: app.candidato, email: app.email, vacancy: app.vaga,
          applicationDate: app.data_aplicacao, status: app.status, userId: app.user_id,
        }))
        setApplications(transformedData)
      })
      .catch((error) => console.error("Erro ao buscar candidaturas:", error))
      .finally(() => setLoading(false))
  }

  const handleViewProfile = (candidate: Application) => {
    setSelectedCandidate(candidate)
    setModalLoading(true)
    setCandidateProfile(null)

    api.get(`/candidate-profile/${candidate.userId}`) 
      .then(response => {
        setCandidateProfile(response.data.data)
      })
      .catch(error => {
        console.error("Erro ao buscar detalhes do candidato:", error)
      })
      .finally(() => {
        setModalLoading(false)
      })
  }

  const handleApplicationAction = (applicationId: number, action: 'approve' | 'reject') => {
    setActionLoading(true);
    const newStatus = action === 'approve' ? 'Aprovado' : 'Rejeitado';

    api.post(`/applications/${applicationId}/${action}`)
      .then(() => {
        // Atualiza o estado da lista principal de forma reativa
        setApplications(currentApplications =>
          currentApplications.map(app =>
            app.id === applicationId ? { ...app, status: newStatus } : app
          )
        );

        // Atualiza o estado do candidato selecionado (se ele estiver no modal)
        if (selectedCandidate && selectedCandidate.id === applicationId) {
          setSelectedCandidate(prev => prev ? { ...prev, status: newStatus } : null);
        }
      })
      .catch(error => {
        console.error(`Erro ao ${action} a candidatura:`, error);
        
      })
      .finally(() => {
        setActionLoading(false);
      });
  };
  
  const handleCloseModal = () => {
    setSelectedCandidate(null)
    setCandidateProfile(null)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Não informado"
    const date = new Date(dateString)
    date.setDate(date.getDate() + 1)
    return date.toLocaleDateString("pt-BR")
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "aprovado": return "bg-green-100 text-green-800"
      case "em análise": return "bg-blue-100 text-blue-800"
      case "entrevista": return "bg-purple-100 text-purple-800"
      case "rejeitado": return "bg-red-100 text-red-800"
      case "contratado": return "bg-emerald-100 text-emerald-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "aprovado": return <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
      case "em análise": return <Clock className="h-4 w-4 text-blue-600 mr-1" />
      case "entrevista": return <User className="h-4 w-4 text-purple-600 mr-1" />
      case "rejeitado": return <XCircle className="h-4 w-4 text-red-600 mr-1" />
      case "contratado": return <Award className="h-4 w-4 text-emerald-600 mr-1" />
      default: return null
    }
  }
  const getInitials = (name: string) => name ? name.split(" ").map((part) => part[0]).join("").toUpperCase().substring(0, 2) : ""

  const filteredApplications = applications.filter(app => 
    (app.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     app.vacancy.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterPosition === "all" || app.vacancy === filterPosition)
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Candidaturas Recebidas</CardTitle>
          <CardDescription>Gerencie todas as candidaturas às vagas disponíveis.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome ou vaga..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterPosition} onValueChange={setFilterPosition}>
                <SelectTrigger className="w-full md:w-[220px]">
                  <SelectValue placeholder="Filtrar por vaga" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as vagas</SelectItem>
                  {Array.from(new Set(applications.map((app) => app.vacancy))).map((vacancy) => (
                    <SelectItem key={vacancy} value={vacancy}>
                      {vacancy}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Candidato</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Vaga</TableHead>
                  <TableHead>Data de Aplicação</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-10">Carregando candidaturas...</TableCell></TableRow>
                ) : filteredApplications.length > 0 ? (
                  filteredApplications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-purple-100 text-purple-800">{getInitials(app.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{app.name}</p>
                            <p className="text-xs text-muted-foreground">{app.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                         <Badge variant="outline" className={getStatusColor(app.status)}>
                            <div className="flex items-center">{getStatusIcon(app.status)}{app.status}</div>
                         </Badge>
                      </TableCell>
                      <TableCell>{app.vacancy}</TableCell>
                      <TableCell>{formatDate(app.applicationDate)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => handleViewProfile(app)}>
                          Ver Perfil
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={5} className="text-center py-10">Nenhuma candidatura encontrada.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedCandidate} onOpenChange={(isOpen) => !isOpen && handleCloseModal()}>
        <DialogContent className="sm:max-w-[650px] bg-white">
          {selectedCandidate && (
             <>
               <DialogHeader>
                  <DialogTitle className="text-2xl">{selectedCandidate.name}</DialogTitle>
                  <DialogDescription>
                    Perfil do candidato para a vaga de <span className="font-semibold text-purple-700">{selectedCandidate.vacancy}</span>
                  </DialogDescription>
               </DialogHeader>

               {modalLoading ? (
                 <div className="flex items-center justify-center h-60">
                   <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                   <p className="ml-4">Carregando perfil...</p>
                 </div>
               ) : candidateProfile ? (
                 <div className="grid gap-4 py-4">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={candidateProfile.photo_url} />
                            <AvatarFallback className="bg-purple-100 text-purple-800 text-3xl">{getInitials(candidateProfile.name)}</AvatarFallback>
                        </Avatar>
                        <div className="space-x-2">
                           {candidateProfile.resume_url && <a href={candidateProfile.resume_url} download target="_blank" rel="noreferrer"><Button variant="outline"><Download className="mr-2 h-4 w-4"/> Currículo</Button></a>}
                           {candidateProfile.photo_url && <a href={candidateProfile.photo_url} target="_blank" rel="noreferrer"><Button variant="outline"><Camera className="mr-2 h-4 w-4"/> Foto</Button></a>}
                        </div>
                    </div>
                    <Card>
                      <CardContent className="pt-6 text-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <p className="flex items-center"><Mail className="w-4 h-4 mr-2 text-muted-foreground" /> {candidateProfile.email}</p>
                          <p className="flex items-center"><Phone className="w-4 h-4 mr-2 text-muted-foreground" /> {candidateProfile.phone || "Não informado"}</p>
                          <p className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-muted-foreground" /> {formatDate(candidateProfile.birth_date)}</p>
                          <p className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-muted-foreground" /> {candidateProfile.location || "Não informado"}</p>
                          <p className="flex items-center"><User className="w-4 h-4 mr-2 text-muted-foreground" /> {candidateProfile.sex || "Não informado"}</p>
                          {candidateProfile.linkedin && <a href={candidateProfile.linkedin} target="_blank" rel="noreferrer" className="flex items-center text-blue-600 hover:underline col-span-full"><Award className="w-4 h-4 mr-2 text-muted-foreground" /> {candidateProfile.linkedin}</a>}
                        </div>
                      </CardContent>
                    </Card>
                 </div>
               ) : (
                <div className="text-center h-60 flex items-center justify-center">
                    <p className="text-red-500">Não foi possível carregar os detalhes do perfil.</p>
                </div>
               )}             
               <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
                    <div className="flex items-center">
                        <span className="text-sm text-muted-foreground mr-2">Status:</span>
                        <Badge variant="outline" className={getStatusColor(selectedCandidate.status)}>
                            <div className="flex items-center">
                               {getStatusIcon(selectedCandidate.status)}
                               {selectedCandidate.status}
                            </div>
                        </Badge>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          variant="destructive"
                          onClick={() => handleApplicationAction(selectedCandidate.id, 'reject')}
                          disabled={actionLoading || modalLoading}
                        >
                          {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ThumbsDown className="mr-2 h-4 w-4" />}
                          Rejeitar
                        </Button>
                        <Button
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleApplicationAction(selectedCandidate.id, 'approve')}
                          disabled={actionLoading || modalLoading}
                        >
                           {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ThumbsUp className="mr-2 h-4 w-4" />}
                          Aprovar
                        </Button>
                        <DialogClose asChild>
                          <Button variant="outline" onClick={handleCloseModal}>Fechar</Button>
                        </DialogClose>
                    </div>
               </DialogFooter>               
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}