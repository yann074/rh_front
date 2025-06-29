"use client"

import type React from "react"

import { useState, useEffect } from "react"
import api, { getData, postData } from "@/service/Api"
import { Loader2, Trash, AlertTriangle, MoreHorizontal, Search, Filter } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Training {
  id: number
  name: string
  type: string
  workload_hours?: number
  institution?: string
  start_date?: string
  end_date?: string
  requires_certificate: boolean
}

interface ValidationErrors {
  [key: string]: string[]
}

const initialNewTrainingState: Omit<Training, "id"> = {
  name: "",
  type: "",
  workload_hours: undefined,
  institution: "",
  start_date: "",
  end_date: "",
  requires_certificate: false,
}

const trainingTypes = [
  { value: "Tecnico", label: "Técnico" },
  { value: "Comportamental", label: "Comportamental" },
  { value: "Gerencial", label: "Gerencial" },
  { value: "Lideranca", label: "Liderança" },
]

export default function TrainingsTable() {
  const [trainings, setTrainings] = useState<Training[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [newTraining, setNewTraining] = useState<Omit<Training, "id">>(initialNewTrainingState)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [trainingToDelete, setTrainingToDelete] = useState<Training | null>(null)

  // Estado para erros de validação
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})

  const formatDate = (date?: string) => {
    if (!date) return "N/A"
    return new Date(date + "T00:00:00").toLocaleDateString("pt-BR")
  }

  useEffect(() => {
    fetchTrainings()
  }, [])

  const fetchTrainings = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await getData("/trainings")
      setTrainings(response.data || [])
    } catch (err) {
      console.error("Erro ao buscar treinamentos:", err)
      setError("Não foi possível carregar os treinamentos.")
    } finally {
      setLoading(false)
    }
  }

  const handleAddTraining = async () => {
    if (!newTraining.type || !newTraining.name) {
      setError("Os campos com * são obrigatórios.")
      return
    }

    // Limpar erros anteriores
    setValidationErrors({})
    setError(null)
    setIsSubmitting(true)

    try {
      await postData("/trainings", { ...newTraining })

      // Limpar formulário e fechar modal
      setModalOpen(false)
      setNewTraining(initialNewTrainingState)
      setValidationErrors({})
      fetchTrainings()
    } catch (err: any) {
      console.error("Erro ao adicionar treinamento:", err)

      // Verificar se é um erro de validação (422)
      if (err.response && err.response.status === 422) {
        const errors = err.response.data.errors || {}
        setValidationErrors(errors)
      } else {
        // Para outros tipos de erro, mostrar mensagem genérica
        const errorMessages = err.response?.data?.errors
          ? Object.values(err.response.data.errors).flat().join(" ")
          : "Ocorreu um erro inesperado."
        setError(`Erro: ${errorMessages}`)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const openDeleteDialog = (training: Training) => {
    setTrainingToDelete(training)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!trainingToDelete) return

    setIsDeleting(true)
    setError(null)
    try {
      await api.delete(`/trainings/${trainingToDelete.id}`)
      setTrainings((prev) => prev.filter((t) => t.id !== trainingToDelete.id))
      setIsDeleteDialogOpen(false)
    } catch (err) {
      console.error("Erro ao excluir treinamento:", err)
      setError("Não foi possível excluir o treinamento.")
    } finally {
      setIsDeleting(false)
      setTrainingToDelete(null)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const val = name === "workload_hours" ? (value === "" ? undefined : Number(value)) : value
    setNewTraining((prev) => ({ ...prev, [name]: val }))
  }

  const handleSelectChange = (value: string) => {
    setNewTraining((prev) => ({ ...prev, type: value }))
  }

  const handleCheckboxChange = (checked: boolean | "indeterminate") => {
    setNewTraining((prev) => ({ ...prev, requires_certificate: Boolean(checked) }))
  }

  // Função para limpar erros quando o modal for fechado
  const handleCloseModal = (open: boolean) => {
    setModalOpen(open)
    if (!open) {
      setValidationErrors({})
      setError(null)
      setNewTraining(initialNewTrainingState)
    }
  }

  // Função para obter o nome do campo em português
  const getFieldLabel = (fieldName: string): string => {
    const fieldLabels: { [key: string]: string } = {
      name: "Nome",
      type: "Tipo",
      workload_hours: "Carga Horária",
      institution: "Instituição",
      start_date: "Data de Início",
      end_date: "Data de Fim",
      requires_certificate: "Requer Certificado",
    }
    return fieldLabels[fieldName] || fieldName
  }

  const filteredTrainings = trainings.filter(
    (training) =>
      (training.name?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
      (training.type?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
      (training.institution?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl">Treinamentos</CardTitle>
            <CardDescription>Gerencie a lista de treinamentos disponíveis.</CardDescription>
          </div>
          <Dialog open={modalOpen} onOpenChange={handleCloseModal}>
            <DialogTrigger asChild>
              <Button className="bg-white hover:bg-purple-200">Novo Treinamento</Button>
            </DialogTrigger>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle>Adicionar Novo Treinamento</DialogTitle>
              </DialogHeader>

              {/* Exibir erros de validação */}
              {Object.keys(validationErrors).length > 0 && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <div className="font-medium mb-2">Erro de validação:</div>
                    <ul className="list-disc list-inside space-y-1">
                      {Object.entries(validationErrors).map(([field, errors]) => (
                        <li key={field}>
                          <strong>{getFieldLabel(field)}:</strong> {errors.join(", ")}
                        </li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <div className="py-4 space-y-3">
                <div>
                  <Input
                    name="name"
                    placeholder="Nome do Treinamento *"
                    value={newTraining.name}
                    onChange={handleChange}
                    className={validationErrors.name ? "border-red-500 focus:border-red-500" : ""}
                  />
                  {validationErrors.name && <p className="text-sm text-red-600 mt-1">{validationErrors.name[0]}</p>}
                </div>

                <div>
                  <Select value={newTraining.type} onValueChange={handleSelectChange}>
                    <SelectTrigger className={validationErrors.type ? "border-red-500 focus:border-red-500" : ""}>
                      <SelectValue placeholder="Selecione o Tipo *" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {trainingTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {validationErrors.type && <p className="text-sm text-red-600 mt-1">{validationErrors.type[0]}</p>}
                </div>

                <div>
                  <Input
                    name="institution"
                    placeholder="Instituição"
                    value={newTraining.institution ?? ""}
                    onChange={handleChange}
                    className={validationErrors.institution ? "border-red-500 focus:border-red-500" : ""}
                  />
                  {validationErrors.institution && (
                    <p className="text-sm text-red-600 mt-1">{validationErrors.institution[0]}</p>
                  )}
                </div>

                <div>
                  <Input
                    name="workload_hours"
                    placeholder="Carga Horária (horas)"
                    type="number"
                    value={newTraining.workload_hours ?? ""}
                    onChange={handleChange}
                    className={validationErrors.workload_hours ? "border-red-500 focus:border-red-500" : ""}
                  />
                  {validationErrors.workload_hours && (
                    <p className="text-sm text-red-600 mt-1">{validationErrors.workload_hours[0]}</p>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-600">Data de Início</label>
                  <Input
                    name="start_date"
                    type="date"
                    value={newTraining.start_date ?? ""}
                    onChange={handleChange}
                    className={validationErrors.start_date ? "border-red-500 focus:border-red-500" : ""}
                  />
                  {validationErrors.start_date && (
                    <p className="text-sm text-red-600 mt-1">{validationErrors.start_date[0]}</p>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-600">Data de Fim</label>
                  <Input
                    name="end_date"
                    type="date"
                    value={newTraining.end_date ?? ""}
                    onChange={handleChange}
                    className={validationErrors.end_date ? "border-red-500 focus:border-red-500" : ""}
                  />
                  {validationErrors.end_date && (
                    <p className="text-sm text-red-600 mt-1">{validationErrors.end_date[0]}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Checkbox
                    id="requires_certificate"
                    checked={newTraining.requires_certificate}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <label htmlFor="requires_certificate" className="text-sm font-medium">
                    Requer certificado?
                  </label>
                  {validationErrors.requires_certificate && (
                    <p className="text-sm text-red-600 ml-2">{validationErrors.requires_certificate[0]}</p>
                  )}
                </div>
              </div>

              {/* Erro genérico (não de validação) */}
              {error && (
                <div className="text-sm text-red-600 p-2 bg-red-50 rounded-md border border-red-200">{error}</div>
              )}

              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => handleCloseModal(false)} disabled={isSubmitting}>
                  Cancelar
                </Button>
                <Button type="submit" onClick={handleAddTraining} disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Salvar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome, tipo ou instituição..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="animate-spin text-purple-600" size={32} />
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Carga Horária</TableHead>
                    <TableHead>Instituição</TableHead>
                    <TableHead>Início</TableHead>
                    <TableHead>Fim</TableHead>
                    <TableHead>Certificado</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTrainings.length > 0 ? (
                    filteredTrainings.map((training) => (
                      <TableRow key={training.id}>
                        <TableCell className="font-medium">{training.name}</TableCell>
                        <TableCell>{training.type}</TableCell>
                        <TableCell>{training.workload_hours ? `${training.workload_hours}h` : "N/A"}</TableCell>
                        <TableCell>{training.institution ?? "N/A"}</TableCell>
                        <TableCell>{formatDate(training.start_date)}</TableCell>
                        <TableCell>{formatDate(training.end_date)}</TableCell>
                        <TableCell>{training.requires_certificate ? "Sim" : "Não"}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Abrir menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white">
                              <DropdownMenuLabel>Ações</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-700 focus:bg-red-50"
                                onClick={() => openDeleteDialog(training)}
                              >
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
                      <TableCell colSpan={8} className="h-24 text-center">
                        Nenhum treinamento encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              Confirmar exclusão
            </DialogTitle>
            <DialogDescription className="pt-2">
              Você está prestes a excluir o treinamento:{" "}
              <strong className="text-gray-800">{trainingToDelete?.name}</strong>.
              <br />
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={isDeleting}>
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sim, Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
