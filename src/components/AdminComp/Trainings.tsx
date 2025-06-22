import { useState, useEffect } from "react";
// Importe o serviço de API e ícones
import api, { getData, postData } from "@/service/Api"; 
import { Loader2, Trash2, AlertCircle, AlertTriangle } from "lucide-react";

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
  type: "", // O tipo começa vazio, para ser selecionado
  workload_hours: undefined,
  institution: "",
  start_date: "",
  end_date: "",
  requires_certificate: false,
};

// Opções para o campo de seleção, baseadas no Enum do Laravel
const trainingTypes = [
  { value: 'Tecnico', label: 'Técnico' },
  { value: 'Comportamental', label: 'Comportamental' },
  { value: 'Gerencial', label: 'Gerencial' },
  { value: 'Lideranca', label: 'Liderança' },
];

export default function TrainingsTable() {
  // Estados do componente
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para o modal de criação
  const [modalOpen, setModalOpen] = useState(false);
  const [newTraining, setNewTraining] = useState<Omit<Training, "id">>(initialNewTrainingState);

  // Estados para o dialog de exclusão
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [trainingToDelete, setTrainingToDelete] = useState<Training | null>(null);

  const formatDate = (date?: string) => {
    if (!date) return "N/A";
    // Adiciona um 'T00:00:00' para garantir que a data seja interpretada no fuso horário local
    return new Date(date + 'T00:00:00').toLocaleDateString("pt-BR");
  };
  
  // Efeito para buscar dados iniciais
  useEffect(() => {
    fetchTrainings();
  }, []);

  // Funções de manipulação de dados
  const fetchTrainings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getData("/trainings");
      setTrainings(response.data || []);
    } catch (err) {
      console.error("Erro ao buscar treinamentos:", err);
      setError("Não foi possível carregar os treinamentos. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTraining = async () => {
    // Validação simples no frontend
    if (!newTraining.type) {
        setError("Por favor, selecione um tipo de treinamento.");
        return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const trainingData = { ...newTraining };
      await postData("/trainings", trainingData);
      setModalOpen(false);
      setNewTraining(initialNewTrainingState);
      fetchTrainings();
    } catch (err: any) {
      console.error("Erro ao adicionar treinamento:", err);
      if (err.response && err.response.data && err.response.data.errors) {
        const errorMessages = Object.values(err.response.data.errors).flat().join(' ');
        setError(`Erro de validação: ${errorMessages}`);
      } else {
        setError("Ocorreu um erro ao salvar. Verifique os dados e tente novamente.");
      }
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

  // Handlers para os campos do formulário
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
    <>
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="w-full flex flex-col gap-2">
            <div>
              <CardTitle>Treinamentos</CardTitle>
              <CardDescription>Gerencie a lista de treinamentos disponíveis.</CardDescription>
            </div>
            <Input
              type="text"
              placeholder="Buscar por nome, tipo ou instituição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:max-w-sm"
            />
          </div>

          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
              <Button>Novo Treinamento</Button>
            </DialogTrigger>
            <DialogContent className="bg-white sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Adicionar Novo Treinamento</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <Input name="name" placeholder="Nome do Treinamento *" value={newTraining.name} onChange={handleChange} />
                
                {/* Campo de Seleção para o Tipo */}
                <Select value={newTraining.type} onValueChange={handleSelectChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o Tipo *" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-100">
                    {trainingTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Input name="institution" placeholder="Instituição *" value={newTraining.institution ?? ""} onChange={handleChange} />
                <Input name="workload_hours" placeholder="Carga Horária (horas) *" type="number" value={newTraining.workload_hours ?? ""} onChange={handleChange} />
                
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-600">Data de Início *</label>
                  <Input name="start_date" type="date" value={newTraining.start_date ?? ""} onChange={handleChange} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-600">Data de Fim *</label>
                  <Input name="end_date" type="date" value={newTraining.end_date ?? ""} onChange={handleChange} />
                </div>
                <div className="flex items-center gap-2 col-span-full mt-2">
                  <Checkbox id="requires_certificate" checked={newTraining.requires_certificate} onCheckedChange={handleCheckboxChange} />
                  <label htmlFor="requires_certificate" className="text-sm font-medium">Requer certificado?</label>
                </div>
              </div>
              {error && (
                <div className="text-sm text-red-600 p-2 bg-red-50 rounded-md">{error}</div>
              )}
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
          {loading ? (
            <div className="flex justify-center items-center py-10"><Loader2 className="animate-spin text-blue-600" size={32} /></div>
          ) : !loading && trainings.length === 0 ? (
            <div className="text-center py-10 text-gray-500"><p>Nenhum treinamento encontrado.</p></div>
          ) : (
            <div className="overflow-x-auto">
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
                  {filteredTrainings.map((training) => (
                    <TableRow key={training.id}>
                      <TableCell className="font-medium">{training.name}</TableCell>
                      <TableCell>{training.type}</TableCell>
                      <TableCell>{training.workload_hours ? `${training.workload_hours}h` : "N/A"}</TableCell>
                      <TableCell>{training.institution ?? "N/A"}</TableCell>
                      <TableCell>{formatDate(training.start_date)}</TableCell>
                      <TableCell>{formatDate(training.end_date)}</TableCell>
                      <TableCell>{training.requires_certificate ? "Sim" : "Não"}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="destructive" size="icon" onClick={() => openDeleteDialog(training)}>
                          <Trash2 size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-white border border-gray-200 shadow-lg sm:max-w-md">
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
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sim, Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}