import { useState, useEffect } from "react"
import axios from "axios"
import { Trash, MoreHorizontal, Building, Calendar, Search, Filter, AlertTriangle, FileText, MapPin, Phone, } from "lucide-react"
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
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Swal from 'sweetalert2';

interface CompanyType {
  id: number
  name: string
  address?: string
  phone?: string
  cnpj?: string
  createdAt?: string
}

export default function CompanyTable() {
  const [companies, setCompanies] = useState<CompanyType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [companyToDelete, setCompanyToDelete] = useState<CompanyType | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [newCompanyName, setNewCompanyName] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [newCompanyAddress, setNewCompanyAddress] = useState('');
  const [newCompanyPhone, setNewCompanyPhone] = useState('');
  const [newCompanyCNPJ, setNewCompanyCNPJ] = useState('');

  const fetchCompanies = () => {
    setLoading(true)
    axios
      .get("http://127.0.0.1:8000/api/companies")
      .then((response) => {

        // Baseado no console que você mostrou, o caminho correto parece ser response.data.data
        let companiesData = []

        if (response.data && response.data.data && Array.isArray(response.data.data)) {
          companiesData = response.data.data
        }

        const enrichedCompanies = companiesData.map((company: { id: any; name: any; created_at: string | number | Date; cnpj: string; phone: string; address: string }) => ({
          id: company.id,
          name: company.name,
          phone: company.phone,
          address: company.address,
          cnpj: company.cnpj,
          // Formatar a data para exibição (created_at vem como "2025-04-29T00:40:13.000000Z")
          createdAt: company.created_at ? new Date(company.created_at).toLocaleDateString('pt-BR') : '-'
        }))
        setCompanies(enrichedCompanies)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Erro ao buscar empresas:", error)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchCompanies()
  }, [])

  const getRandomPastDate = () => {
    const months = Math.floor(Math.random() * 12)
    const date = new Date()
    date.setMonth(date.getMonth() - months)
    return date.toLocaleDateString("pt-BR")
  }

  const confirmDelete = (company: CompanyType) => {
    setCompanyToDelete(company)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!companyToDelete) return;

    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");

      await axios.delete(`http://127.0.0.1:8000/api/companies/${companyToDelete.id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      setCompanies(companies.filter((company) => company.id !== companyToDelete.id));

      // Exibe o SweetAlert2 de sucesso
      Swal.fire({
        title: 'Empresa excluída com sucesso!',
        text: 'A empresa foi removida da lista.',
        icon: 'success',
        confirmButtonText: 'OK',
        timer: 3000,
        timerProgressBar: true,
      });

    } catch (error: any) {
      console.error("Erro ao excluir empresa:", error);

      // Exibe o SweetAlert2 de erro
      Swal.fire({
        title: 'Erro ao excluir empresa',
        text: 'Ocorreu um erro ao tentar excluir a empresa. Tente novamente.',
        icon: 'error',
        confirmButtonText: 'OK',
      });

    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setCompanyToDelete(null);
    }
  };

  const handleAddCompany = async () => {
    if (!newCompanyName.trim()) return;

    setIsAdding(true);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");

      const response = await axios.post(
        "http://127.0.0.1:8000/api/companies",
        {
          name: newCompanyName,
          address: newCompanyAddress,
          phone: newCompanyPhone,
          cnpj: newCompanyCNPJ,
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      )


      // Adiciona a nova empresa ao estado com uma data aleatória se necessário
      const newCompany = {
        ...response.data.data,
        createdAt: response.data.data.createdAt || getRandomPastDate(),
      };

      setCompanies([...companies, newCompany]);
      setNewCompanyName("");

      // Exibe o SweetAlert2 de sucesso
      Swal.fire({
        title: 'Empresa adicionada com sucesso!',
        text: 'A nova empresa foi cadastrada corretamente.',
        icon: 'success',
        confirmButtonText: 'OK',
        timer: 3000,
        timerProgressBar: true,
      });

    } catch (error: any) {
      console.error("Erro ao adicionar empresa:", error);

      // Exibe o SweetAlert2 de erro
      Swal.fire({
        title: 'Erro ao adicionar empresa',
        text: 'Ocorreu um erro ao tentar cadastrar a empresa. Tente novamente.',
        icon: 'error',
        confirmButtonText: 'OK',
      });

    } finally {
      setIsAdding(false);
      setAddDialogOpen(false);
    }
  };

  const filteredCompanies = companies.filter((company) => {
    return company.name?.toLowerCase().includes(searchTerm.toLowerCase())
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl">Empresas Cadastradas</CardTitle>
            <CardDescription>Gerencie todas as empresas cadastradas na plataforma.</CardDescription>
          </div>
          <Button
            className="bg-purple-600 hover:bg-purple-700"
            onClick={() => setAddDialogOpen(true)}
          >
            Adicionar Empresa
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar empresas..."
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
            <div className="text-center py-10">
              <p className="text-gray-500">Carregando empresas...</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead className="w-[300px]">Nome da Empresa</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead>CNPJ</TableHead>
                    <TableHead>Endereço</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompanies.length > 0 ? (
                    filteredCompanies.map((company) => (
                      <TableRow key={company.id}>
                        <TableCell className="font-medium">{company.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                              <Building className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="font-medium">{company.name}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span>{company.createdAt}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <span>{company.cnpj}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span>{company.address}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span>{company.phone}</span>
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
                              <DropdownMenuItem className="text-red-600" onClick={() => confirmDelete(company)}>
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
                      <TableCell colSpan={4} className="h-24 text-center">
                        Nenhuma empresa encontrada.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-500">
              Mostrando {filteredCompanies.length} de {companies.length} empresas
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

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-white border border-gray-200 shadow-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              Confirmar exclusão
            </DialogTitle>
            <DialogDescription>
              Você está prestes a excluir a empresa <strong>{companyToDelete?.name}</strong>. Esta ação não pode ser
              desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Add Company Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="bg-white border border-gray-200 shadow-lg">
          <DialogHeader>
            <DialogTitle>Adicionar Nova Empresa</DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo para adicionar uma nova empresa ao sistema.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-3">
            <Input
              placeholder="Nome da empresa"
              value={newCompanyName}
              onChange={(e) => setNewCompanyName(e.target.value)}
            />
            <Input
              placeholder="Endereço"
              value={newCompanyAddress}
              onChange={(e) => setNewCompanyAddress(e.target.value)}
            />
            <Input
              placeholder="Telefone"
              value={newCompanyPhone}
              onChange={(e) => setNewCompanyPhone(e.target.value)}
            />
            <Input
              placeholder="CNPJ"
              value={newCompanyCNPJ}
              onChange={(e) => setNewCompanyCNPJ(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)} disabled={isAdding}>
              Cancelar
            </Button>
            <Button
              onClick={handleAddCompany}
              disabled={isAdding || !newCompanyName.trim()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isAdding ? "Adicionando..." : "Adicionar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}