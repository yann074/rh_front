import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, CheckCircle, InfoIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Constantes para limites de caracteres
const MAX_REQUIREMENTS_LENGTH = 255; // Ajuste este valor conforme seu banco de dados
const MAX_DESCRIPTION_LENGTH = 500; // Ajuste este valor conforme seu banco de dados
const MAX_BENEFITS_LENGTH = 500; // Ajuste este valor conforme seu banco de dados

interface Company {
  id: number;
  name: string;
}

interface FormData {
  title: string;
  description: string;
  salary: string;
  requirements: string;
  location: string;
  benefits: string;
  status: 'ativo' | 'rascunho' | 'pausada';
  job_type: 'Presencial' | 'Remoto' | 'Hibrido';
  education: string,
  companies_id: string
}

type TabType = 'sobre' | 'requirements' | 'benefits' | 'configuracoes';

const JobCreationForm: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("sobre");
  const [jobTypes, setJobTypes] = useState<string[]>([]);
  const [statusTypes, setStatusTypes] = useState<string[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    salary: '',
    requirements: '',
    location: '',
    benefits: '',
    status: 'ativo',
    job_type: 'Presencial',
    education: '',
    companies_id: ''
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let processedValue = value;

    // Limitar tamanho dos campos de texto
    if (name === 'requirements' && value.length > MAX_REQUIREMENTS_LENGTH) {
      processedValue = value.substring(0, MAX_REQUIREMENTS_LENGTH);
    } else if (name === 'description' && value.length > MAX_DESCRIPTION_LENGTH) {
      processedValue = value.substring(0, MAX_DESCRIPTION_LENGTH);
    } else if (name === 'benefits' && value.length > MAX_BENEFITS_LENGTH) {
      processedValue = value.substring(0, MAX_BENEFITS_LENGTH);
    }

    setFormData(prev => ({ ...prev, [name]: processedValue }));
  };

  const handleSelectChange = (name: keyof FormData) => (value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  //buscar enums
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobTypeRes, statusRes, companyRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/enums/job-type'),
          axios.get('http://127.0.0.1:8000/api/enums/status'),
          axios.get('http://127.0.0.1:8000/api/companies'),
        ]);

        setStatusTypes(statusRes.data.data);
        setJobTypes(jobTypeRes.data.data);
        setCompanies(companyRes.data.data);
      } catch (error) {
        console.error('Erro ao carregar enums e empresas:', error);
      }
    };

    fetchData();
  }, []);


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    console.log("Enviando formData:", formData);
    try {
      await axios.post('http://127.0.0.1:8000/api/opportunities', formData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      // Exibe o SweetAlert2 de sucesso
      Swal.fire({
        title: 'Vaga criada com sucesso!',
        text: 'A vaga foi publicada e já está disponível.',
        icon: 'success',
        confirmButtonText: 'OK',
        timer: 3000,
        timerProgressBar: true
      }).then(() => {
        // Navega para a página anterior após fechar o alert
        navigate(-1);
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        salary: '',
        requirements: '',
        location: '',
        benefits: '',
        status: 'ativo',
        job_type: 'Presencial',
        education: '',
        companies_id: ''
      });
      setActiveTab("sobre");

    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Ocorreu um erro desconhecido';
      setError(errorMessage);

      // Exibe o SweetAlert2 de erro
      Swal.fire({
        title: 'Erro ao criar vaga',
        text: 'Ocorreu um erro ao tentar criar a vaga. Tente novamente.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextTab = () => {
    const tabs: TabType[] = ["sobre", "requirements", "benefits", "configuracoes"];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  const prevTab = () => {
    const tabs: TabType[] = ["sobre", "requirements", "benefits", "configuracoes"];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Criar nova vaga</CardTitle>
        <CardDescription>
          Adicione as informações da nova vaga que será publicada no portal de carreiras.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as TabType)} className="w-full">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="sobre">1. Sobre a vaga</TabsTrigger>
              <TabsTrigger value="requirements">2. requirements</TabsTrigger>
              <TabsTrigger value="benefits">3. Benefícios</TabsTrigger>
              <TabsTrigger value="configuracoes">4. Configurações</TabsTrigger>
            </TabsList>

            <TabsContent value="sobre" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="input-title">Título da vaga *</Label>
                <Input
                  id="input-title"
                  name="title"
                  placeholder="Ex: Analista de Recursos Humanos"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  maxLength={100}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companies_id">Empresa *</Label>
                <select
                  id="companies_id"
                  value={formData.companies_id}
                  onChange={(e) => setFormData({ ...formData, companies_id: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecione a empresa</option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="input-description">
                  Descrição da vaga *
                  <span className="text-sm text-muted-foreground ml-2">
                    ({formData.description.length}/{MAX_DESCRIPTION_LENGTH})
                  </span>
                </Label>
                <Textarea
                  id="input-description"
                  name="description"
                  placeholder="Descreva detalhadamente as responsabilidades e atividades do cargo..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  required
                  maxLength={MAX_DESCRIPTION_LENGTH}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="input-location">Localização *</Label>
                <Input
                  id="input-location"
                  name="location"
                  placeholder="Ex: São Paulo, SP"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  maxLength={100}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="input-salary">Salário</Label>
                  <Input
                    id="input-salary"
                    name="salary"
                    placeholder="Ex: R$ 4.000,00"
                    value={formData.salary}
                    onChange={handleChange}
                    maxLength={20}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="select-tipo-trabalho">Tipo de trabalho</Label>
                  <Select
                    value={formData.job_type}
                    onValueChange={handleSelectChange('job_type')}
                  >
                    <SelectTrigger id="select-tipo-trabalho">
                      <SelectValue placeholder="Selecione o tipo de trabalho" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

              </div>
            </TabsContent>

            <TabsContent value="requirements" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="input-requirements">
                  requirements da vaga *
                  <span className="text-sm text-muted-foreground ml-2">
                    ({formData.requirements.length}/{MAX_REQUIREMENTS_LENGTH})
                  </span>
                </Label>
                <Alert className="mb-2">
                  <InfoIcon className="h-4 w-4" />
                  <AlertDescription>
                    Por favor, seja conciso. Este campo tem um limite de {MAX_REQUIREMENTS_LENGTH} caracteres.
                  </AlertDescription>
                </Alert>
                <Textarea
                  id="input-requirements"
                  name="requirements"
                  placeholder="Liste os requirements e habilidades necessárias para o cargo..."
                  value={formData.requirements}
                  onChange={handleChange}
                  rows={6}
                  required
                  maxLength={MAX_REQUIREMENTS_LENGTH}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="select-education">Formação acadêmica</Label>
                <Select
                  value={formData.education}
                  onValueChange={handleSelectChange('education')}
                >
                  <SelectTrigger id="select-education">
                    <SelectValue placeholder="Selecione o nível de formação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ensino_medio">Ensino Médio</SelectItem>
                    <SelectItem value="tecnico">Técnico</SelectItem>
                    <SelectItem value="superior">Superior</SelectItem>
                    <SelectItem value="pos_graduacao">Pós-graduação</SelectItem>
                    <SelectItem value="mestrado">Mestrado</SelectItem>
                    <SelectItem value="doutorado">Doutorado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="benefits" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="input-benefits">
                  Benefícios oferecidos *
                  <span className="text-sm text-muted-foreground ml-2">
                    ({formData.benefits.length}/{MAX_BENEFITS_LENGTH})
                  </span>
                </Label>
                <Textarea
                  id="input-benefits"
                  name="benefits"
                  placeholder="Liste os benefícios oferecidos para esta vaga..."
                  value={formData.benefits}
                  onChange={handleChange}
                  rows={6}
                  required
                  maxLength={MAX_BENEFITS_LENGTH}
                />
              </div>
            </TabsContent>

            <TabsContent value="configuracoes" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="select-status">Status da vaga</Label>
                <Select
                  value={formData.status}
                  onValueChange={handleSelectChange("status")}
                >
                  <SelectTrigger id="select-status">
                    <SelectValue placeholder="Selecione o status da vaga" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusTypes.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>


              <Alert className="mt-6">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Revisão</AlertTitle>
                <AlertDescription>
                  Revise todas as informações antes de finalizar. Após a criação, a vaga poderá ser editada no painel administrativo.
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={prevTab} disabled={activeTab === "sobre"}>
          Voltar
        </Button>

        {activeTab === "configuracoes" ? (
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Criando..." : "Criar vaga"}
          </Button>
        ) : (
          <Button onClick={nextTab}>
            Próximo
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default JobCreationForm;