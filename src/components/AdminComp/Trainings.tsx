import { useState, useEffect } from "react";
// Importe o serviço de API e ícones
import api, { getData, postData } from "@/service/Api"; 
import { Loader2, Trash, AlertTriangle, MoreHorizontal, Search, Filter } from "lucide-react"; // Ícones atualizados

// Importe os componentes da UI
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Importado
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";


// Interface e estado inicial
interface Training {
  id: number;
  name: string;
  type: string;
  workload_hours?: number;
  institution?: string;
  start_date?: string;
  end_date?: string;
  requires_certificate: boolean;
}

const initialNewTrainingState: Omit<Training, "id"> = {
  name: "",
  type: "",
  workload_hours: undefined,
  institution: "",
  start_date: "",
  end_date: "",
  requires_certificate: false,
};

const trainingTypes = [
  { value: 'Tecnico', label: 'Técnico' },
  { value: 'Comportamental', label: 'Comportamental' },
  { value: 'Gerencial', label: 'Gerencial' },
  { value: 'Lideranca', label: 'Liderança' },
];

export default function TrainingsTable() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [newTraining, setNewTraining] = useState<Omit<Training, "id">>(initialNewTrainingState);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [trainingToDelete, setTrainingToDelete] = useState<Training | null>(null);

  const formatDate = (date?: string) => {
    if (!date) return "N/A";
    return new Date(date + 'T00:00:00').toLocaleDateString("pt-BR");
  };
  
  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getData("/trainings");
      setTrainings(response.data || []);
    } catch (err) {
      console.error("Erro ao buscar treinamentos:", err);
      setError("Não foi possível carregar os treinamentos.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTraining = async () => {
    if (!newTraining.type || !newTraining.name) {
      setError("Os campos com * são obrigatórios.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await postData("/trainings", { ...newTraining });
      setModalOpen(false);
      setNewTraining(initialNewTrainingState);
      fetchTrainings();
    } catch (err: any) {
      const errorMessages = err.response?.data?.errors ? Object.values(err.response.data.errors).flat().join(' ') : "Ocorreu um erro.";
      setError(`Erro: ${errorMessages}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteDialog = (training: Training) => {
    setTrainingToDelete(training);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!trainingToDelete) return;

    setIsDeleting(true);
    setError(null);
    try {
      await api.delete(`/trainings/${trainingToDelete.id}`);
      setTrainings((prev) => prev.filter((t) => t.id !== trainingToDelete.id));
      setIsDeleteDialogOpen(false);
    } catch (err) {
      console.error("Erro ao excluir treinamento:", err);
      setError("Não foi possível excluir o treinamento.");
    } finally {
      setIsDeleting(false);
      setTrainingToDelete(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const val = name === 'workload_hours' ? (value === '' ? undefined : Number(value)) : value;
    setNewTraining((prev) => ({ ...prev, [name]: val }));
  };
  
  const handleSelectChange = (value: string) => {
    setNewTraining((prev) => ({ ...prev, type: value }));
  };

  const handleCheckboxChange = (checked: boolean | 'indeterminate') => {
    setNewTraining((prev) => ({ ...prev, requires_certificate: Boolean(checked) }));
  };

  const filteredTrainings = trainings.filter((training) =>
    (training.name?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
    (training.type?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
    (training.institution?.toLowerCase() ?? "").includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl">Treinamentos</CardTitle>
            <CardDescription>Gerencie a lista de treinamentos disponíveis.</CardDescription>
          </div>
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
             <DialogTrigger asChild>
                <Button className="bg-white hover:bg-purple-200">Novo Treinamento</Button>
             </DialogTrigger>
             <DialogContent className="bg-white">
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Treinamento</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-3">
                  <Input name="name" placeholder="Nome do Treinamento *" value={newTraining.name} onChange={handleChange} />
                  
                  <Select value={newTraining.type} onValueChange={handleSelectChange}>
                    <SelectTrigger><SelectValue placeholder="Selecione o Tipo *" /></SelectTrigger>
                    <SelectContent className="bg-white">
                      {trainingTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Input name="institution" placeholder="Instituição" value={newTraining.institution ?? ""} onChange={handleChange} />
                  <Input name="workload_hours" placeholder="Carga Horária (horas)" type="number" value={newTraining.workload_hours ?? ""} onChange={handleChange} />
                  
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-600">Data de Início</label>
                    <Input name="start_date" type="date" value={newTraining.start_date ?? ""} onChange={handleChange} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-600">Data de Fim</label>
                    <Input name="end_date" type="date" value={newTraining.end_date ?? ""} onChange={handleChange} />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Checkbox id="requires_certificate" checked={newTraining.requires_certificate} onCheckedChange={handleCheckboxChange} />
                    <label htmlFor="requires_certificate" className="text-sm font-medium">Requer certificado?</label>
                  </div>
                </div>
                {error && <div className="text-sm text-red-600 p-2 bg-red-50 rounded-md">{error}</div>}
                <DialogFooter className="mt-4">
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
                <div className="flex justify-center items-center py-10"><Loader2 className="animate-spin text-purple-600" size={32} /></div>
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
                                            <DropdownMenuItem className="text-red-600 focus:text-red-700 focus:bg-red-50" onClick={() => openDeleteDialog(training)}>
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
                            <TableCell colSpan={8} className="h-24 text-center">Nenhum treinamento encontrado.</TableCell>
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
              Você está prestes a excluir o treinamento: <strong className="text-gray-800">{trainingToDelete?.name}</strong>.
              <br/>
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
  );
}