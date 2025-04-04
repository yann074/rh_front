import { 
  Paintbrush, 
  Briefcase, 
  MapPin, 
  Calendar, 
  Loader2,
  Clock,
  GraduationCap,
  DollarSign,
  X,
  Building,
  FileText,
  Gift,
  BadgeCheck
} from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent, 
  CardDescription,  
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface Vaga {
  id: number;
  title: string;
  description: string;
  salary: string;
  requirements: string;
  location: string;
  benefits?: string;
  status: string;
  job_type: string;
  education: string;
  companies_id: string;
  created_at?: string;
  updated_at?: string;
}

export function JobDetailsDialog({
  open,
  onOpenChange,
  selectedVaga,
  loadingDetails,
  detailsError,
  handleEdit
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedVaga: Vaga | null;
  loadingDetails: boolean;
  detailsError: string | null;
  handleEdit: (id: number) => void;
}) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Não disponível";
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

  const getbenefits = (vaga: Vaga) => {
    return vaga.benefits || vaga.benefits || "Não especificado";
  };

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'ativa':
      case 'aberta':
        return 'bg-emerald-100 text-emerald-800';
      case 'pendente':
        return 'bg-amber-100 text-amber-800';
      case 'encerrada':
      case 'fechada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoTrabalhoIcon = (tipo: string) => {
    switch(tipo.toLowerCase()) {
      case 'remoto':
        return <Building className="h-4 w-4" />;
      case 'presencial':
        return <Building className="h-4 w-4" />;
      case 'híbrido':
        return <Building className="h-4 w-4" />;
      default:
        return <Briefcase className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0 rounded-lg bg-white border shadow-lg" onInteractOutside={(e) => e.preventDefault()}>
        {loadingDetails ? (
          <div className="flex flex-col justify-center items-center py-16 px-6">
            <Loader2 className="h-10 w-10 text-purple-600 animate-spin mb-4" />
            <p className="text-gray-600 text-lg">Carregando detalhes da vaga...</p>
          </div>
        ) : detailsError ? (
          <div className="p-6">
            <DialogHeader className="pb-4 border-b">
              <DialogTitle className="text-xl text-red-600 flex items-center">
                <X className="mr-2 h-5 w-5" /> Erro ao carregar a vaga
              </DialogTitle>
            </DialogHeader>
            <div className="bg-red-50 p-4 rounded-lg my-4">
              <p className="text-red-500 mb-4">{detailsError}</p>
              <h3 className="font-medium text-gray-800 mb-2">Possíveis soluções:</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>Verifique se o ID da vaga existe no banco de dados</li>
                <li>Confirme se o modelo Vaga está retornando resultados corretamente</li>
                <li>Verifique os logs do servidor para identificar erros específicos</li>
              </ul>
            </div>
            <DialogFooter>
              <Button 
                onClick={() => onOpenChange(false)}
                variant="default"
                className="bg-purple-600 hover:bg-purple-700"
              >
                Fechar
              </Button>
            </DialogFooter>
          </div>
        ) : selectedVaga ? (
          <>
            <DialogHeader className="px-6 pt-6 pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <DialogTitle className="text-2xl font-bold text-gray-900">
                    {selectedVaga.title}
                  </DialogTitle>
                  <div className="flex mt-2 gap-2 items-center">
                    <Badge className={`${getStatusColor(selectedVaga.status)} px-3 py-1`}>
                      {selectedVaga.status}
                    </Badge>
                    <Badge className="bg-gray-100 text-gray-800 px-3 py-1 flex items-center">
                      {getTipoTrabalhoIcon(selectedVaga.job_type)}
                      <span className="ml-1">{selectedVaga.job_type}</span>
                    </Badge>
                    <p className="text-sm text-gray-500 flex items-center">
                      <Calendar className="h-4 w-4 inline mr-1" /> 
                      Publicada em {formatDate(selectedVaga.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            </DialogHeader>
            
            <Tabs defaultValue="detalhes" className="px-6">
              <TabsList className="mb-4 w-full justify-start">
                <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
                <TabsTrigger value="requirements">requirements</TabsTrigger>
                <TabsTrigger value="benefits">Benefícios</TabsTrigger>
              </TabsList>
              
              <TabsContent value="detalhes" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="col-span-2">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <FileText className="mr-2 h-5 w-5 text-purple-600" />
                        Descrição da Vaga
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 whitespace-pre-line">{selectedVaga.description}</p>
                    </CardContent>
                  </Card>
                  
                  <div className="space-y-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <DollarSign className="mr-2 h-5 w-5 text-green-600" />
                          Salário
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 font-medium">{selectedVaga.salary || "A combinar"}</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <MapPin className="mr-2 h-5 w-5 text-red-500" />
                          Localização
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700">{selectedVaga.location || "Não especificado"}</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <GraduationCap className="mr-2 h-5 w-5 text-blue-600" />
                          Formação Necessária
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700">{selectedVaga.education || "Não especificado"}</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <Clock className="mr-2 h-5 w-5 text-purple-600" />
                          Atualização
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700">Última atualização em {formatDate(selectedVaga.updated_at)}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="requirements" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BadgeCheck className="mr-2 h-5 w-5 text-amber-600" />
                      requirements para a Vaga
                    </CardTitle>
                    <CardDescription>
                      Habilidades e qualificações necessárias para esta posição
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="whitespace-pre-line text-gray-700">
                      {selectedVaga.requirements}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="benefits" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Gift className="mr-2 h-5 w-5 text-green-600" />
                      Benefícios Oferecidos
                    </CardTitle>
                    <CardDescription>
                      Vantagens e benefícios disponíveis para esta posição
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="whitespace-pre-line text-gray-700">
                      {getbenefits(selectedVaga)}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <DialogFooter className="p-6 border-t mt-6 bg-gray-50">
              <div className="w-full flex justify-end">
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => onOpenChange(false)}
                  >
                    Fechar
                  </Button>
                  <Button
                    onClick={() => handleEdit(selectedVaga.id)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Paintbrush className="mr-2 h-4 w-4" />
                    Editar Vaga
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </>
        ) : (
          <div className="text-center py-12 px-6">
            <div className="flex flex-col items-center justify-center">
              <X className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Vaga não encontrada</h3>
              <p className="text-gray-500 mb-6">Não foi possível encontrar os detalhes desta vaga no sistema.</p>
              <Button 
                onClick={() => onOpenChange(false)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Fechar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}