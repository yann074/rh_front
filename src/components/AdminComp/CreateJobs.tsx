import React, { useState, FormEvent, ChangeEvent } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Importando SweetAlert2 em vez de sonner
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
const MAX_REQUISITOS_LENGTH = 255; // Ajuste este valor conforme seu banco de dados
const MAX_DESCRICAO_LENGTH = 500; // Ajuste este valor conforme seu banco de dados
const MAX_BENEFICIOS_LENGTH = 500; // Ajuste este valor conforme seu banco de dados

interface FormData {
  titulo: string;
  descricao: string;
  salario: string;
  requisitos: string;
  localizacao: string;
  beneficios: string;
  status: 'ativo' | 'rascunho' | 'pausada';
  tipo_trabalho: 'presencial' | 'hibrido' | 'remoto';
  formacao: string;
}

type TabType = 'sobre' | 'requisitos' | 'beneficios' | 'configuracoes';

const JobCreationForm: React.FC = () => {
  const navigate = useNavigate(); 
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("sobre");
  const [formData, setFormData] = useState<FormData>({
    titulo: '',
    descricao: '',
    salario: '',
    requisitos: '',
    localizacao: '',
    beneficios: '',
    status: 'ativo',
    tipo_trabalho: 'presencial',
    formacao: ''
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    // Limitar tamanho dos campos de texto
    if (name === 'requisitos' && value.length > MAX_REQUISITOS_LENGTH) {
      processedValue = value.substring(0, MAX_REQUISITOS_LENGTH);
    } else if (name === 'descricao' && value.length > MAX_DESCRICAO_LENGTH) {
      processedValue = value.substring(0, MAX_DESCRICAO_LENGTH);
    } else if (name === 'beneficios' && value.length > MAX_BENEFICIOS_LENGTH) {
      processedValue = value.substring(0, MAX_BENEFICIOS_LENGTH);
    }
    
    setFormData(prev => ({ ...prev, [name]: processedValue }));
  };

  const handleSelectChange = (name: keyof FormData) => (value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/new_job', formData, {
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
        titulo: '',
        descricao: '',
        salario: '',
        requisitos: '',
        localizacao: '',
        beneficios: '',
        status: 'ativo',
        tipo_trabalho: 'presencial',
        formacao: ''
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
    const tabs: TabType[] = ["sobre", "requisitos", "beneficios", "configuracoes"];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  const prevTab = () => {
    const tabs: TabType[] = ["sobre", "requisitos", "beneficios", "configuracoes"];
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
              <TabsTrigger value="requisitos">2. Requisitos</TabsTrigger>
              <TabsTrigger value="beneficios">3. Benefícios</TabsTrigger>
              <TabsTrigger value="configuracoes">4. Configurações</TabsTrigger>
            </TabsList>

            <TabsContent value="sobre" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="input-titulo">Título da vaga *</Label>
                <Input
                  id="input-titulo"
                  name="titulo"
                  placeholder="Ex: Analista de Recursos Humanos"
                  value={formData.titulo}
                  onChange={handleChange}
                  required
                  maxLength={100}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="input-descricao">
                  Descrição da vaga * 
                  <span className="text-sm text-muted-foreground ml-2">
                    ({formData.descricao.length}/{MAX_DESCRICAO_LENGTH})
                  </span>
                </Label>
                <Textarea
                  id="input-descricao"
                  name="descricao"
                  placeholder="Descreva detalhadamente as responsabilidades e atividades do cargo..."
                  value={formData.descricao}
                  onChange={handleChange}
                  rows={6}
                  required
                  maxLength={MAX_DESCRICAO_LENGTH}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="input-localizacao">Localização *</Label>
                <Input
                  id="input-localizacao"
                  name="localizacao"
                  placeholder="Ex: São Paulo, SP"
                  value={formData.localizacao}
                  onChange={handleChange}
                  required
                  maxLength={100}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="input-salario">Salário</Label>
                  <Input
                    id="input-salario"
                    name="salario"
                    placeholder="Ex: R$ 4.000,00"
                    value={formData.salario}
                    onChange={handleChange}
                    maxLength={20}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="select-tipo-trabalho">Tipo de trabalho</Label>
                  <Select 
                    value={formData.tipo_trabalho} 
                    onValueChange={handleSelectChange('tipo_trabalho')}
                  >
                    <SelectTrigger id="select-tipo-trabalho">
                      <SelectValue placeholder="Selecione o tipo de trabalho" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="presencial">Presencial</SelectItem>
                      <SelectItem value="hibrido">Híbrido</SelectItem>
                      <SelectItem value="remoto">Remoto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="requisitos" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="input-requisitos">
                  Requisitos da vaga * 
                  <span className="text-sm text-muted-foreground ml-2">
                    ({formData.requisitos.length}/{MAX_REQUISITOS_LENGTH})
                  </span>
                </Label>
                <Alert className="mb-2">
                  <InfoIcon className="h-4 w-4" />
                  <AlertDescription>
                    Por favor, seja conciso. Este campo tem um limite de {MAX_REQUISITOS_LENGTH} caracteres.
                  </AlertDescription>
                </Alert>
                <Textarea
                  id="input-requisitos"
                  name="requisitos"
                  placeholder="Liste os requisitos e habilidades necessárias para o cargo..."
                  value={formData.requisitos}
                  onChange={handleChange}
                  rows={6}
                  required
                  maxLength={MAX_REQUISITOS_LENGTH}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="select-formacao">Formação acadêmica</Label>
                <Select 
                  value={formData.formacao} 
                  onValueChange={handleSelectChange('formacao')}
                >
                  <SelectTrigger id="select-formacao">
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

            <TabsContent value="beneficios" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="input-beneficios">
                  Benefícios oferecidos *
                  <span className="text-sm text-muted-foreground ml-2">
                    ({formData.beneficios.length}/{MAX_BENEFICIOS_LENGTH})
                  </span>
                </Label>
                <Textarea
                  id="input-beneficios"
                  name="beneficios"
                  placeholder="Liste os benefícios oferecidos para esta vaga..."
                  value={formData.beneficios}
                  onChange={handleChange}
                  rows={6}
                  required
                  maxLength={MAX_BENEFICIOS_LENGTH}
                />
              </div>
            </TabsContent>

            <TabsContent value="configuracoes" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="select-status">Status da vaga</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={handleSelectChange('status')}
                >
                  <SelectTrigger id="select-status">
                    <SelectValue placeholder="Selecione o status da vaga" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativa</SelectItem>
                    <SelectItem value="rascunho">Rascunho</SelectItem>
                    <SelectItem value="pausada">Pausada</SelectItem>
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