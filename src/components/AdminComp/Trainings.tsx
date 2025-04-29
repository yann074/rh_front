import { useState, useEffect } from "react";
import axios from "axios";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Trash2 } from "lucide-react";
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

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

export default function TrainingsTable() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [newTraining, setNewTraining] = useState<Omit<Training, "id">>({
    name: "",
    type: "",
    workload_hours: undefined,
    institution: "",
    start_date: "",
    end_date: "",
    requires_certificate: false,
  });

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = () => {
    setLoading(true);
    axios
      .get("http://127.0.0.1:8000/api/trainings")
      .then((res) => setTrainings(res.data.data || []))
      .catch((err) => console.error("Erro ao buscar treinamentos:", err))
      .finally(() => setLoading(false));
  };

  const formatDate = (date?: string) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("pt-BR");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setNewTraining((prev) => ({ ...prev, [name]: val }));
  };

  const handleAddTraining = () => {
    axios
      .post("http://127.0.0.1:8000/api/trainings", newTraining)
      .then(() => {
        fetchTrainings();
        setModalOpen(false);
        setNewTraining({
          name: "",
          type: "",
          workload_hours: undefined,
          institution: "",
          start_date: "",
          end_date: "",
          requires_certificate: false,
        });
      })
      .catch((err) => console.error("Erro ao adicionar treinamento:", err));
  };

  const handleDelete = (id: number) => {
    axios
      .delete(`http://127.0.0.1:8000/api/trainings/${id}`)
      .then(() => setTrainings((prev) => prev.filter((t) => t.id !== id)))
      .catch((err) => console.error("Erro ao excluir treinamento:", err));
  };

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="w-full flex flex-col gap-2">
          <div>
            <CardTitle>Treinamentos</CardTitle>
            <CardDescription>Lista de treinamentos disponíveis.</CardDescription>
          </div>
          <Input
            type="text"
            placeholder="Buscar por nome, tipo ou instituição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full "
          />
        </div>
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button>Novo Treinamento</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Treinamento</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Input
                name="name"
                placeholder="Nome"
                value={newTraining.name}
                onChange={handleChange}
              />
              <Input
                name="type"
                placeholder="Tipo"
                value={newTraining.type}
                onChange={handleChange}
              />
              <Input
                name="workload_hours"
                placeholder="Carga horária"
                type="number"
                value={newTraining.workload_hours ?? ""}
                onChange={handleChange}
              />
              <Input
                name="institution"
                placeholder="Instituição"
                value={newTraining.institution}
                onChange={handleChange}
              />
              <Input
                name="start_date"
                type="date"
                value={newTraining.start_date}
                onChange={handleChange}
              />
              <Input
                name="end_date"
                type="date"
                value={newTraining.end_date}
                onChange={handleChange}
              />
              <div className="flex items-center gap-2 col-span-full mt-2">
                <Checkbox
                  id="requires_certificate"
                  checked={newTraining.requires_certificate}
                  onCheckedChange={(checked) =>
                    setNewTraining((prev) => ({
                      ...prev,
                      requires_certificate: Boolean(checked),
                    }))
                  }
                />
                <label htmlFor="requires_certificate">Requer certificado</label>
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button onClick={handleAddTraining}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="animate-spin" size={24} />
          </div>
        ) : (
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
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trainings
                .filter((training) =>
                  (training.name?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
                  (training.type?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
                  (training.institution?.toLowerCase() ?? "").includes(searchTerm.toLowerCase())
                )
                .map((training) => (
                  <TableRow key={training.id}>
                    <TableCell>{training.name}</TableCell>
                    <TableCell>{training.type}</TableCell>
                    <TableCell>{training.workload_hours ?? "N/A"}</TableCell>
                    <TableCell>{training.institution ?? "N/A"}</TableCell>
                    <TableCell>{formatDate(training.start_date)}</TableCell>
                    <TableCell>{formatDate(training.end_date)}</TableCell>
                    <TableCell>{training.requires_certificate ? "Sim" : "Não"}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(training.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
