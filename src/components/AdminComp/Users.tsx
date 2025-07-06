import { useState, useEffect } from "react"
import axios from "axios"
import { Trash, Paintbrush, MoreHorizontal, Shield, User, Calendar, Search, Filter, AlertTriangle } from "lucide-react"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface UserType {
  id: number
  name: string
  email: string
  permission: string
  lastActive?: string
  status?: "Ativo" | "Inativo" | "Pendente"
  avatarUrl?: string
  createdAt?: string
  role?: string
}

export default function UserTable() {
  const [users, setUsers] = useState<UserType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPermission, setFilterPermission] = useState<string>("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<UserType | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchUsers = () => {
    setLoading(true)
    axios
      .get("https://rhback-production.up.railway.app/api/users")
      .then((response) => {
        const enrichedUsers = response.data.data.Usuarios.map((user: UserType) => ({
          ...user,
          lastActive: getRandomDate(),
          status: getRandomStatus(),
          avatarUrl: "",
          createdAt: getRandomPastDate(),
          role: mapPermissionToRole(user.permission),
        }))
        setUsers(enrichedUsers)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Erro ao buscar usuários:", error)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const getRandomDate = () => {
    const days = Math.floor(Math.random() * 30)
    const date = new Date()
    date.setDate(date.getDate() - days)
    return date.toLocaleDateString("pt-BR")
  }

  const getRandomPastDate = () => {
    const months = Math.floor(Math.random() * 12)
    const date = new Date()
    date.setMonth(date.getMonth() - months)
    return date.toLocaleDateString("pt-BR")
  }

  const getRandomStatus = (): "Ativo" | "Inativo" | "Pendente" => {
    const statuses: ["Ativo", "Inativo", "Pendente"] = ["Ativo", "Inativo", "Pendente"]
    return statuses[Math.floor(Math.random() * statuses.length)]
  }

  const mapPermissionToRole = (permission: string): string => {
    const roles: Record<string, string> = {
      Admin: "admin",
      User: "usuario"
    }
    return roles[permission] || permission
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo":
        return "bg-green-100 text-green-800"
      case "Inativo":
        return "bg-gray-100 text-gray-800"
      case "Pendente":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-blue-100 text-blue-800"
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

  const handleEdit = (id: number) => {
    console.log("Editar usuário", id)
  }

  const confirmDelete = (user: UserType) => {
    setUserToDelete(user)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!userToDelete) return

    setIsDeleting(true)
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token")

      await axios.delete(`https://rhback-production.up.railway.app/api/users/${userToDelete.id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      })

      setUsers(users.filter((user) => user.id !== userToDelete.id))
    } catch (error) {
      console.error("Erro ao excluir usuário:", error)
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setUserToDelete(null)
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPermission = filterPermission === "all" || user.permission === filterPermission
    return matchesSearch && matchesPermission
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl">Usuários do Sistema</CardTitle>
            <CardDescription>Gerencie todos os usuários cadastrados na plataforma.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar usuários..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterPermission} onValueChange={setFilterPermission}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por permissão" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as permissões</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="usuario">Usuário</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Carregando usuários...</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead className="w-[300px]">Usuário</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Permissão</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead>Último acesso</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={user.avatarUrl} alt={user.name} />
                              <AvatarFallback className="bg-purple-100 text-purple-800">
                                {getInitials(user.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(user.status || "")}>{user.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {user.permission === "Admin" && <Shield className="h-4 w-4 text-purple-600" />}
                            {user.permission === "User" && <User className="h-4 w-4 text-blue-600" />}
                            {user.role || user.permission}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span>{user.createdAt}</span>
                          </div>
                        </TableCell>
                        <TableCell>{user.lastActive}</TableCell>
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
                              <DropdownMenuItem onClick={() => handleEdit(user.id)}>
                                <Paintbrush className="mr-2 h-4 w-4 text-blue-600" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600" onClick={() => confirmDelete(user)}>
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
                      <TableCell colSpan={7} className="h-24 text-center">
                        Nenhum usuário encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-500">
              Mostrando {filteredUsers.length} de {users.length} usuários
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

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-white border border-gray-200 shadow-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              Confirmar exclusão
            </DialogTitle>
            <DialogDescription>
              Você está prestes a excluir o usuário <strong>{userToDelete?.name}</strong>. Esta ação não pode ser
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
    </div>
  )
}