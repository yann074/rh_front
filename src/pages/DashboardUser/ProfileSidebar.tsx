import React from "react";
import { Link } from "react-router-dom";
import {
  User,
  Save,
  Award,
  Camera,
  Mail,
  Linkedin,
  FileText,
  CheckCircle,
  Lightbulb,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { UserData, CandidatoData } from "@/types";

// Definindo as props que o componente receberá
interface ProfileSidebarProps {
  userData: UserData;
  formData: Partial<CandidatoData>;
  progress: {
    personalProgress: number;
    diversityProgress: number;
    locationProgress: number;
  };
  // Esta prop deve receber a função handleFileChange do hook
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>, field: "photo" | "resume") => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSwitchChange: (checked: boolean, field: keyof CandidatoData) => void;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  userData,
  formData,
  progress,
  onFileChange,
  onInputChange,
  onSwitchChange,
}) => {
  return (
    <div className="lg:col-span-4 space-y-6">
      {/* Profile Card */}
      <Card className="overflow-hidden border-none shadow-md rounded-xl">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-32 relative">
          {formData.pcd && (
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
                {formData.photoPreview ? (
                  <AvatarImage src={formData.photoPreview} alt="foto de perfil" />
                ) : (
                  <AvatarFallback className="bg-indigo-100 text-indigo-800">
                    <User className="h-12 w-12" />
                  </AvatarFallback>
                )}
              </Avatar>
              <Button
                size="sm"
                type="button" // Garante que o botão não submeta o formulário
                className="absolute bottom-0 right-0 rounded-full bg-indigo-600 hover:bg-indigo-700 h-10 w-10 p-0 shadow-md"
                onClick={() => document.getElementById("photo-upload")?.click()}
              >
                <Camera className="h-5 w-5" />
                <input
                  id="photo-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                
                  //  Garante que estamos usando a função onFileChange correta
                  
                  onChange={(e) => onFileChange(e, "photo")}
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
              <Label htmlFor="linkedin-sidebar" className="text-slate-600 flex items-center text-sm">
                <Linkedin className="h-4 w-4 mr-2 text-indigo-500" />
                LinkedIn
              </Label>
              <Input
                id="linkedin-sidebar"
                name="linkedin"
                placeholder="www.linkedin.com/in/seuperfil"
                value={formData.linkedin || ''}
                onChange={onInputChange}
                className="border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resume-upload" className="text-slate-600 flex items-center text-sm">
                <FileText className="h-4 w-4 mr-2 text-indigo-500" />
                Currículo (PDF)
              </Label>
              <div className="mt-1">
                <Button 
                    type="button" // Garante que o botão não submeta o formulário
                    variant="outline"
                    className="w-full justify-start border-slate-200"
                    onClick={() => document.getElementById("resume-upload")?.click()}
                >
                    <Save className="h-4 w-4 mr-2"/>
                    {formData.resumeName ? "Trocar Arquivo" : "Enviar Arquivo"}
                </Button>
                <input
                  id="resume-upload"
                  type="file"
                  accept="application/pdf"
                  // O input do currículo já estava usando a função correta
                  onChange={(e) => onFileChange(e, "resume")}
                  className="hidden"
                />
                {formData.resumeName && (
                  <div className="mt-2 flex items-center text-sm text-slate-600">
                    <FileText className="h-4 w-4 mr-2 text-indigo-500 flex-shrink-0" />
                    <span className="truncate" title={formData.resumeName}>{formData.resumeName}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between bg-indigo-50 p-4 rounded-lg">
              <Label htmlFor="pcd-switch" className="flex items-center text-slate-700 font-medium">
                <Award className="h-5 w-5 mr-2 text-indigo-600" />
                Pessoa com deficiência
              </Label>
              <Switch
                id="pcd-switch"
                checked={formData.pcd}
                onCheckedChange={(checked) => onSwitchChange(checked, "pcd")}
                className="data-[state=checked]:bg-indigo-600"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Profile Progress Card */}
      <Card className="border-none shadow-md rounded-xl">
        <CardHeader className="pb-2 border-b border-slate-100">
          <CardTitle className="text-lg text-slate-800">Progresso do Perfil</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div>
            <div className="flex justify-between mb-1"><span className="text-sm text-slate-600 font-medium">Dados Pessoais</span><span className="text-sm text-indigo-600 font-medium">{progress.personalProgress}%</span></div>
            <Progress value={progress.personalProgress} className="h-2 [&>div]:bg-indigo-500" />
          </div>
          <div>
            <div className="flex justify-between mb-1"><span className="text-sm text-slate-600 font-medium">Diversidade</span><span className="text-sm text-indigo-600 font-medium">{progress.diversityProgress}%</span></div>
            <Progress value={progress.diversityProgress} className="h-2 [&>div]:bg-indigo-500" />
          </div>
          <div>
            <div className="flex justify-between mb-1"><span className="text-sm text-slate-600 font-medium">Localização</span><span className="text-sm text-indigo-600 font-medium">{progress.locationProgress}%</span></div>
            <Progress value={progress.locationProgress} className="h-2 [&>div]:bg-indigo-500" />
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 mt-4">
            <div className="flex"><div className="flex-shrink-0"><CheckCircle className="h-5 w-5 text-amber-500" /></div><div className="ml-3"><p className="text-sm text-amber-800">Perfis completos têm 3x mais chances de serem descobertos por recrutadores.</p></div></div>
          </div>
        </CardContent>
      </Card>
      
      {/* Behavioral Profile Link Card */}
      <Link to="/behaviorprofile" className="block hover:shadow-lg transition-shadow duration-300 rounded-xl">
        <Card className="border-none shadow-md rounded-xl overflow-hidden group">
          <div className="p-6 bg-gradient-to-br from-purple-600 to-indigo-700 text-white text-center"><div className="flex justify-center mb-4"><div className="bg-white/20 p-3 rounded-full"><Lightbulb className="h-8 w-8 text-white" /></div></div><CardTitle className="text-xl font-bold">Descubra seu Perfil Comportamental</CardTitle><p className="mt-2 text-indigo-100 text-sm">Responda algumas perguntas e receba uma análise completa das suas competências.</p></div>
          <div className="bg-white p-4 text-center"><span className="font-semibold text-indigo-600 group-hover:underline">Começar Análise Agora &rarr;</span></div>
        </Card>
      </Link>
    </div>
  );
};