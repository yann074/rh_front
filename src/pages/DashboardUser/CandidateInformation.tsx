import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, User, Save, CheckCircle, Briefcase, Camera, Phone, Mail, Calendar, Linkedin, Award, Heart, Home } from 'lucide-react';

// Definition of types
interface UserData {
  id?: number;
  email: string;
  name: string;
  role?: string;
  created_at?: string;
}

interface CandidatoData {
  user_id?: number;
  email_sec: string;
  cpf: string;
  telefone: string;
  data_nasc: string;
  linkedin: string;
  pcd: boolean;
  foto: File | null;
  fotoPreview: string;
  sexo: string;
  orient_sexual: string;
  cor: string;
  genero: string;
}

const CandidateInformation: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("pessoal");
  const [userData, setUserData] = useState<UserData>({
    email: '',
    name: ''
  });
  const [candidatoData, setCandidatoData] = useState<CandidatoData>({
    email_sec: '',
    cpf: '',
    telefone: '',
    data_nasc: '',
    linkedin: '',
    pcd: false,
    foto: null,
    fotoPreview: '',
    sexo: '',
    orient_sexual: '',
    cor: '',
    genero: ''
  });

  // Calcular o progresso do perfil
  const calculateProfileProgress = () => {
    let personalProgress = 0;
    let diversityProgress = 0;

    // Verificar campos pessoais
    const personalFields = ['email_sec', 'cpf', 'telefone', 'data_nasc', 'linkedin', 'fotoPreview'];
    personalFields.forEach(field => {
      if (candidatoData[field as keyof CandidatoData]) personalProgress++;
    });
    personalProgress = Math.round((personalProgress / personalFields.length) * 100);

    // Verificar campos de diversidade
    const diversityFields = ['sexo', 'orient_sexual', 'cor', 'genero'];
    diversityFields.forEach(field => {
      if (candidatoData[field as keyof CandidatoData]) diversityProgress++;
    });
    diversityProgress = Math.round((diversityProgress / diversityFields.length) * 100);

    return { personalProgress, diversityProgress };
  };

  const { personalProgress, diversityProgress } = calculateProfileProgress();
  const totalProgress = Math.round((personalProgress + diversityProgress) / 2);

  // token from storage
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  useEffect(() => {
    // User autenticado
    if (!token) {
      Swal.fire({
        title: 'Erro!',
        text: 'Você precisa estar logado para acessar esta página.',
        icon: 'error',
        confirmButtonText: 'OK',
        background: '#ffffff',
        confirmButtonColor: '#6d28d9'
      }).then(() => {
        // Redirect to login page
        window.location.href = '/login';
      });
      return;
    }

    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setUserData({
        id: response.data.data[1]?.id,
        email: response.data.data[1]?.email || '',
        name: response.data.data[1]?.name || '',
        role: response.data.data[1]?.permission || '',
        created_at: response.data.data[1]?.created_at || '',
      });
      
      console.log(response.data)

      // Removed checkExistingCandidatoData call
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      Swal.fire({
        title: 'Aviso',
        text: 'Não foi possível obter suas informações. Por favor, tente novamente mais tarde.',
        icon: 'warning',
        confirmButtonText: 'OK',
        background: '#ffffff',
        confirmButtonColor: '#6d28d9'
      });
      setLoading(false);
    }
  };

  // Removed checkExistingCandidatoData function entirely

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setCandidatoData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean): void => {
    setCandidatoData(prev => ({ ...prev, pcd: checked }));
  };

  const handleSelectChange = (value: string, field: keyof CandidatoData): void => {
    setCandidatoData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      // Store the file object for form submission
      setCandidatoData(prev => ({ ...prev, foto: file }));

      // Create preview URL for display
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setCandidatoData(prev => ({ ...prev, fotoPreview: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      setSaving(true);

      // Create FormData for file upload
      const formData = new FormData();

      // Add all fields to FormData
      formData.append('email_sec', candidatoData.email_sec);
      formData.append('cpf', candidatoData.cpf);
      formData.append('telefone', candidatoData.telefone);
      formData.append('data_nasc', candidatoData.data_nasc);
      formData.append('linkedin', candidatoData.linkedin);
      formData.append('pcd', candidatoData.pcd ? '1' : '0');
      formData.append('sexo', candidatoData.sexo);
      formData.append('orient_sexual', candidatoData.orient_sexual);
      formData.append('cor', candidatoData.cor);
      formData.append('genero', candidatoData.genero);

      // Arquivo de foto
      if (candidatoData.foto) {
        formData.append('foto', candidatoData.foto);
      }

      // Mudar isso dps
      const method = 'post';
      const endpoint = 'http://127.0.0.1:8000/api/user_personal';

      await axios({
        method,
        url: endpoint,
        data: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      Swal.fire({
        title: 'Sucesso!',
        text: 'Seus dados foram salvos com sucesso.',
        icon: 'success',
        confirmButtonText: 'OK',
        background: '#ffffff',
        confirmButtonColor: '#6d28d9'
      });
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      Swal.fire({
        title: 'Erro!',
        text: 'Não foi possível salvar seus dados. Por favor, tente novamente.',
        icon: 'error',
        confirmButtonText: 'OK',
        background: '#ffffff',
        confirmButtonColor: '#6d28d9'
      });
    } finally {
      setSaving(false);
    }
  };

  // Rest of the component remains the same...

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <div className="p-8 rounded-xl shadow-lg bg-white border-l-4 border-indigo-600 w-full max-w-md">
          <Loader2 className="h-16 w-16 animate-spin text-indigo-600 mx-auto" />
          <p className="mt-6 text-xl text-center text-slate-700 font-medium">Carregando seu perfil...</p>
          <p className="mt-2 text-sm text-center text-slate-500">Estamos preparando tudo para você</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-indigo-600 text-white p-2 rounded-lg">
                <Briefcase className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold text-slate-800">Candidato Talento</span>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50"
              >
                <Home className="h-5 w-5 mr-2" />
                Dashboard
              </Button>

              <div className="flex items-center space-x-3">
                <span className="text-sm text-slate-600 hidden md:inline-block">Olá, {userData.name || "Usuário"}</span>
                <Avatar className="h-9 w-9 border border-slate-200">
                  {candidatoData.fotoPreview ? (
                    <AvatarImage src={candidatoData.fotoPreview} alt="Foto de perfil" />
                  ) : (
                    <AvatarFallback className="bg-indigo-100 text-indigo-600">
                      {userData.name ? userData.name.charAt(0).toUpperCase() : "U"}
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-indigo-700 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Meu Perfil</h1>
              <p className="mt-2 text-indigo-200 max-w-xl">
                Complete suas informações para aumentar suas chances nas oportunidades de emprego e se destacar para os recrutadores.
              </p>
            </div>

            <div className="mt-6 md:mt-0">
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <div className="relative h-16 w-16">
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `conic-gradient(#4f46e5 ${totalProgress}%, transparent ${totalProgress}%)`,
                      }}
                    ></div>
                    <div className="absolute inset-1 bg-indigo-700 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">{totalProgress}%</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-white">Completando seu perfil</h3>
                    <p className="text-indigo-200 text-sm">Perfis completos recebem 3x mais oportunidades</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Profile Card */}
            <Card className="overflow-hidden border-none shadow-md rounded-xl">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-32 relative">
                {candidatoData.pcd && (
                  <Badge className="absolute top-4 right-4 bg-white text-indigo-700 hover:bg-indigo-50">
                    <Award className="h-3 w-3 mr-1" />
                    PCD
                  </Badge>
                )}
              </div>

              <div className="px-6 pt-0 pb-6">
                <div className="relative -mt-16 mb-4 flex justify-center">
                  <div className="relative">
                    <Avatar className="h-32 w-32 ring-4 ring-white shadow-md">
                      {candidatoData.fotoPreview ? (
                        <AvatarImage src={candidatoData.fotoPreview} alt="Foto de perfil" />
                      ) : (
                        <AvatarFallback className="bg-indigo-100 text-indigo-800">
                          <User className="h-12 w-12" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <Button
                      size="sm"
                      className="absolute bottom-0 right-0 rounded-full bg-indigo-600 hover:bg-indigo-700 h-10 w-10 p-0 shadow-md"
                      onClick={() => document.getElementById('foto-upload')?.click()}
                    >
                      <Camera className="h-5 w-5" />
                      <input
                        id="foto-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </Button>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">{userData.name || "Usuário"}</h2>
                  <p className="text-slate-500 flex items-center justify-center mt-1">
                    <Mail className="h-4 w-4 mr-2" />
                    {userData.email}
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="linkedin" className="text-slate-600 flex items-center text-sm">
                      <Linkedin className="h-4 w-4 mr-2 text-indigo-500" />
                      LinkedIn
                    </Label>
                    <Input
                      id="linkedin"
                      name="linkedin"
                      placeholder="www.linkedin.com/in/seuperfil"
                      value={candidatoData.linkedin}
                      onChange={handleInputChange}
                      className="border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="flex items-center justify-between bg-indigo-50 p-4 rounded-lg">
                    <Label htmlFor="pcd" className="flex items-center text-slate-700 font-medium">
                      <Award className="h-5 w-5 mr-2 text-indigo-600" />
                      Pessoa com deficiência
                    </Label>
                    <Switch
                      id="pcd"
                      checked={candidatoData.pcd}
                      onCheckedChange={handleSwitchChange}
                      className="data-[state=checked]:bg-indigo-600"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Profile Progress */}
            <Card className="border-none shadow-md rounded-xl">
              <CardHeader className="pb-2 border-b border-slate-100">
                <CardTitle className="text-lg text-slate-800">Progresso do Perfil</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-slate-600 font-medium">Dados Pessoais</span>
                      <span className="text-sm text-indigo-600 font-medium">{personalProgress}%</span>
                    </div>
                    <Progress value={personalProgress} className="h-2 bg-slate-100" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-slate-600 font-medium">Diversidade</span>
                      <span className="text-sm text-indigo-600 font-medium">{diversityProgress}%</span>
                    </div>
                    <Progress value={diversityProgress} className="h-2 bg-slate-100" />
                  </div>

                  <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-amber-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-amber-800">
                          Perfis completos têm 3x mais chances de serem descobertos por recrutadores.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8">
            <Card className="border-none shadow-md rounded-xl">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <CardHeader className="border-b border-slate-100 bg-white rounded-t-xl">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <CardTitle className="text-xl text-slate-800">Editar Informações</CardTitle>

                    <div className="mt-4 md:mt-0">
                      <TabsList className="grid grid-cols-2 bg-slate-100 p-1">
                        <TabsTrigger
                          value="pessoal"
                          className="font-medium rounded-md data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
                        >
                          Dados Pessoais
                        </TabsTrigger>
                        <TabsTrigger
                          value="diversidade"
                          className="font-medium rounded-md data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
                        >
                          Diversidade
                        </TabsTrigger>
                      </TabsList>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-6">
                  <form onSubmit={handleSubmit}>
                    <TabsContent value="pessoal" className="mt-0 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="email_sec" className="flex items-center text-slate-700">
                            <Mail className="h-4 w-4 mr-2 text-indigo-500" />
                            Email Secundário
                          </Label>
                          <Input
                            id="email_sec"
                            name="email_sec"
                            type="email"
                            placeholder="email@exemplo.com"
                            value={candidatoData.email_sec}
                            onChange={handleInputChange}
                            className="border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cpf" className="flex items-center text-slate-700">
                            <CheckCircle className="h-4 w-4 mr-2 text-indigo-500" />
                            CPF
                          </Label>
                          <Input
                            id="cpf"
                            name="cpf"
                            placeholder="000.000.000-00"
                            value={candidatoData.cpf}
                            onChange={handleInputChange}
                            className="border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="telefone" className="flex items-center text-slate-700">
                            <Phone className="h-4 w-4 mr-2 text-indigo-500" />
                            Telefone
                          </Label>
                          <Input
                            id="telefone"
                            name="telefone"
                            placeholder="(00) 00000-0000"
                            value={candidatoData.telefone}
                            onChange={handleInputChange}
                            className="border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="data_nasc" className="flex items-center text-slate-700">
                            <Calendar className="h-4 w-4 mr-2 text-indigo-500" />
                            Data de Nascimento
                          </Label>
                          <Input
                            id="data_nasc"
                            name="data_nasc"
                            type="date"
                            value={candidatoData.data_nasc}
                            onChange={handleInputChange}
                            className="border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <Mail className="h-5 w-5 text-blue-500" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-blue-700">
                              Seu e-mail principal é <strong>{userData.email}</strong>. O e-mail secundário é opcional e pode ser usado como contato alternativo.
                            </p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="diversidade" className="mt-0 space-y-6">
                      <div className="bg-indigo-50 p-5 rounded-lg mb-6 border border-indigo-100">
                        <div className="flex items-start">
                          <Heart className="h-5 w-5 mr-3 text-indigo-600 mt-0.5" />
                          <div>
                            <h3 className="font-medium text-indigo-800 mb-1">Informações de Diversidade</h3>
                            <p className="text-sm text-indigo-700">
                              Estas informações são opcionais e confidenciais, utilizadas apenas para promover a diversidade e inclusão em nossos processos seletivos. Não impactam negativamente suas candidaturas.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="sexo" className="text-slate-700 font-medium">Sexo Biológico</Label>
                          <Select
                            value={candidatoData.sexo}
                            onValueChange={(value) => handleSelectChange(value, 'sexo')}
                          >
                            <SelectTrigger id="sexo" className="border-slate-200 focus:border-indigo-500 focus:ring-indigo-500">
                              <SelectValue placeholder="Selecione uma opção" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-slate-200">
                              <SelectItem value="masculino">Masculino</SelectItem>
                              <SelectItem value="feminino">Feminino</SelectItem>
                              <SelectItem value="prefiro_nao_informar">Prefiro não informar</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="genero" className="text-slate-700 font-medium">Identidade de Gênero</Label>
                          <Select
                            value={candidatoData.genero}
                            onValueChange={(value) => handleSelectChange(value, 'genero')}
                          >
                            <SelectTrigger id="genero" className="border-slate-200 focus:border-indigo-500 focus:ring-indigo-500">
                              <SelectValue placeholder="Selecione uma opção" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-slate-200">
                              <SelectItem value="homem_cis">Homem Cisgênero</SelectItem>
                              <SelectItem value="mulher_cis">Mulher Cisgênero</SelectItem>
                              <SelectItem value="homem_trans">Homem Transgênero</SelectItem>
                              <SelectItem value="mulher_trans">Mulher Transgênero</SelectItem>
                              <SelectItem value="nao_binario">Não-Binário</SelectItem>
                              <SelectItem value="outro">Outro</SelectItem>
                              <SelectItem value="prefiro_nao_informar">Prefiro não informar</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="orient_sexual" className="text-slate-700 font-medium">Orientação Sexual</Label>
                          <Select
                            value={candidatoData.orient_sexual}
                            onValueChange={(value) => handleSelectChange(value, 'orient_sexual')}
                          >
                            <SelectTrigger id="orient_sexual" className="border-slate-200 focus:border-indigo-500 focus:ring-indigo-500">
                              <SelectValue placeholder="Selecione uma opção" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-gray-200">
                              <SelectItem value="heterossexual">Heterossexual</SelectItem>
                              <SelectItem value="homossexual">Homossexual</SelectItem>
                              <SelectItem value="bissexual">Bissexual</SelectItem>
                              <SelectItem value="pansexual">Pansexual</SelectItem>
                              <SelectItem value="assexual">Assexual</SelectItem>
                              <SelectItem value="outro">Outro</SelectItem>
                              <SelectItem value="prefiro_nao_informar">Prefiro não informar</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cor" className="text-gray-700">Cor/Raça/Etnia</Label>
                          <Select
                            value={candidatoData.cor}
                            onValueChange={(value) => handleSelectChange(value, 'cor')}
                          >
                            <SelectTrigger id="cor" className="border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                              <SelectValue placeholder="Selecione uma opção" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-gray-200">
                              <SelectItem value="branco">Branco</SelectItem>
                              <SelectItem value="preto">Preto</SelectItem>
                              <SelectItem value="pardo">Pardo</SelectItem>
                              <SelectItem value="amarelo">Amarelo</SelectItem>
                              <SelectItem value="indigena">Indígena</SelectItem>
                              <SelectItem value="outro">Outro</SelectItem>
                              <SelectItem value="prefiro_nao_informar">Prefiro não informar</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </TabsContent>

                    <div className="mt-8 pt-6 border-t border-gray-100">
                      <Button
                        type="submit"
                        className="w-full md:w-auto bg-purple-700 hover:bg-purple-800"
                        disabled={saving}
                      >
                        {saving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Salvando...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Salvar Alterações
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateInformation;