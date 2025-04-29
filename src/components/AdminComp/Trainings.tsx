import { useState, useEffect } from "react";
import axios from "axios";
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
import { Loader2 } from "lucide-react";

interface Training {
    id: number;
    name: string;
    type: string;
    workload_hours?: number;
    institution?: string;
    start_date?: string;
    end_date?: string;
    requires_certificate: boolean;
    created_at?: string;
    updated_at?: string;
}

export default function TrainingsTable() {
    const [trainings, setTrainings] = useState<Training[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        axios.get("http://127.0.0.1:8000/api/trainings")
            .then((response) => {
                const trainingsData: Training[] = response.data.data || [];
                setTrainings(trainingsData);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Erro ao buscar treinamentos:", error);
                setLoading(false);
            });
    }, []);

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

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Treinamentos</CardTitle>
                    <CardDescription>
                        Lista de todos os treinamentos cadastrados.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center items-center">
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
                                    <TableHead>Requer Certificado</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {trainings.map((training) => (
                                    <TableRow key={training.id}>
                                        <TableCell>{training.name}</TableCell>
                                        <TableCell>{training.type}</TableCell>
                                        <TableCell>{training.workload_hours ?? 'N/A'}</TableCell>
                                        <TableCell>{training.institution ?? 'N/A'}</TableCell>
                                        <TableCell>{formatDate(training.start_date)}</TableCell>
                                        <TableCell>{formatDate(training.end_date)}</TableCell>
                                        <TableCell>{training.requires_certificate ? 'Sim' : 'Não'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
