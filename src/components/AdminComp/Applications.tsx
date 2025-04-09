"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import {
  Trash,
  MoreHorizontal,
  Award,
  User,
  Calendar,
  Search,
  Filter,
  Briefcase,
  CheckCircle,
  Clock,
  XCircle,
  Mail,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Original ApplicationType from the Applications component
export interface ApplicationType {
  candidato: string
  vaga: string
  empresa: string
  data_aplicacao: string
  status: string
}

// Extended interface to match the CandidateTable structure
interface EnhancedApplication {
  id: number
  name: string
  email: string
  position: string
  applicationDate: string
  status: string
  avatarUrl?: string
  experience?: string
  education?: string
  skills?: string[]
  vacancy: string
  telefone?: string
  data_nasc?: string
  genero?: string
  cor?: string
  orient_sexual?: string
  empresa: string
}

export default function Applications() {
  const [applications, setApplications] = useState<EnhancedApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPosition, setFilterPosition] = useState<string>("all")

  useEffect(() => {
    setLoading(true)

    axios
      .get("http://127.0.0.1:8000/api/apply_opportunities")
      .then((response) => {
        // Transform the application data to match the CandidateTable structure
        const transformedData = response.data.data.map((app: ApplicationType, index: number) => ({
          id: index + 1,
          name: app.candidato,
          email: `${app.candidato.toLowerCase().replace(/\s+/g, ".")}@example.com`, // Generate a placeholder email
          position: "Candidato",
          applicationDate: app.data_aplicacao,
          status: app.status,
          vacancy: app.vaga,
          empresa: app.empresa,
          experience: "Não informado",
        }))

        setApplications(transformedData)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Erro ao buscar candidaturas:", error)
        setLoading(false)
      })
  }, [])

  // Formatação de datas
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("pt-BR")
    } catch (e) {
      return dateString
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "aprovado":
        return "bg-green-100 text-green-800"
      case "em análise":
        return "bg-blue-100 text-blue-800"
      case "entrevista":
        return "bg-purple-100 text-purple-800"
      case "rejeitado":
        return "bg-red-100 text-red-800"
      case "contratado":
        return "bg-emerald-100 text-emerald-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "aprovado":
        return <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
      case "em análise":
        return <Clock className="h-4 w-4 text-blue-600 mr-1" />
      case "entrevista":
        return <User className="h-4 w-4 text-purple-600 mr-1" />
      case "rejeitado":
        return <XCircle className="h-4 w-4 text-red-600 mr-1" />
      case "contratado":
        return <Award className="h-4 w-4 text-emerald-600 mr-1" />
      default:
        return null
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Funções para lidar com ações
  const handleView = (id: number) => {
    console.log("Ver candidatura", id)
    // Implementar lógica para visualizar candidatura
  }

  const handleScheduleInterview = (id: number) => {
    console.log("Agendar entrevista", id)
    // Implementar lógica para agendar entrevista
  }

  const handleReject = (id: number) => {
    console.log("Rejeitar candidatura", id)
    // Implementar lógica para rejeitar candidatura
  }

  // Filtrar candidaturas com base no termo de pesquisa e no filtro de vaga
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.vacancy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.empresa.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesPosition = filterPosition === "all" || app.vacancy === filterPosition

    return matchesSearch && matchesPosition
  })

  // Get unique vacancies for filter dropdown
  const uniqueVacancies = Array.from(new Set(applications.map((app) => app.vacancy)))

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl">Candidaturas Recebidas</CardTitle>
            <CardDescription>Gerencie todas as candidaturas às vagas disponíveis.</CardDescription>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700">Nova Candidatura</Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar candidaturas..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterPosition} onValueChange={setFilterPosition}>
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Filtrar por vaga" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as vagas</SelectItem>
                  {uniqueVacancies.map((vacancy, index) => (
                    <SelectItem key={index} value={vacancy}>
                      {vacancy}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Carregando candidaturas...</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead className="w-[300px]">Candidato</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Vaga</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Data de Aplicação</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.length > 0 ? (
                    filteredApplications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">{app.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={app.avatarUrl} alt={app.name} />
                              <AvatarFallback className="bg-purple-100 text-purple-800">
                                {getInitials(app.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center">
                                <p className="font-medium">{app.name}</p>
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <Mail className="h-3 w-3 mr-1" />
                                {app.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(app.status)}>
                            <div className="flex items-center">
                              {getStatusIcon(app.status)}
                              {app.status}
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-purple-600" />
                            {app.vacancy}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium">{app.empresa}</span>
                        </TableCell>
                        <TableCell>{formatDate(app.applicationDate)}</TableCell>
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
                              <DropdownMenuItem onClick={() => handleView(app.id)}>
                                <User className="mr-2 h-4 w-4 text-blue-600" />
                                Ver Detalhes
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleScheduleInterview(app.id)}>
                                <Calendar className="mr-2 h-4 w-4 text-purple-600" />
                                Agendar Entrevista
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600" onClick={() => handleReject(app.id)}>
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
                      <TableCell colSpan={7} className="h-24 text-center">
                        Nenhuma candidatura encontrada.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-500">
              Mostrando {filteredApplications.length} de {applications.length} candidaturas
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
  )
}
