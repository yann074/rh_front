import React, { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import Swal from "sweetalert2";

// Hooks e componentes refatorados
import { useFetchCandidateData } from "./hooks/useFetchCandidateData";
import { useCandidateForm } from "./hooks/useCandidateForm";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileSidebar } from "./ProfileSidebar";
import { ProfileTabs } from "./ProfileTabs";
import { CandidatoData } from "@/types";

// Função para calcular o progresso
const calculateProfileProgress = (data: Partial<CandidatoData>) => {
  if (!data) return { personalProgress: 0, diversityProgress: 0, locationProgress: 0, totalProgress: 0 };
    
  const personalFields = ["secondary_email", "cpf", "phone", "birth_date", "linkedin", "photoPreview"];
  const diversityFields = ["sex", "sexual_orientation", "race", "gender"];
  const locationFields = ["zip_code", "state", "city", "neighborhood", "street", "number"];

  const calculateProgress = (fields: string[]) => {
    const completed = fields.filter(field => !!data[field as keyof CandidatoData]).length;
    return Math.round((completed / fields.length) * 100);
  };

  const personalProgress = calculateProgress(personalFields);
  const diversityProgress = calculateProgress(diversityFields);
  const locationProgress = calculateProgress(locationFields);
  const totalProgress = Math.round((personalProgress + diversityProgress + locationProgress) / 3);

  return { personalProgress, diversityProgress, locationProgress, totalProgress };
};


const CandidateInformation: React.FC = () => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  const [activeTab, setActiveTab] = useState<string>("pessoal");

  // Hook para buscar os dados iniciais
  const { loading, error, userData, candidatoData, enums } = useFetchCandidateData(token);
  
  // Hook para gerenciar o estado e a lógica do formulário
  const {
    formData,
    setFormData,
    formErrors,
    saving,
    handleInputChange,
    handleSwitchChange,
    handleSelectChange,
    handleFileChange,
    handleCepBlur,
    handleSubmit,
  } = useCandidateForm(candidatoData);

  // Sincroniza o estado do formulário quando os dados da API são carregados
  useEffect(() => {
    setFormData(candidatoData);
  }, [candidatoData, setFormData]);

  // Calcula o progresso de forma memorizada para evitar recálculos desnecessários
  const progress = useMemo(() => calculateProfileProgress(formData), [formData]);

  // Exibe um erro genérico se a busca de dados falhar
  useEffect(() => {
    if (error) {
        Swal.fire({
            title: "Erro de Conexão",
            text: error,
            icon: "error",
            confirmButtonColor: "#6d28d9",
        });
    }
  }, [error]);

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
      <ProfileHeader 
        userData={userData} 
        photoPreview={formData.photoPreview} 
        totalProgress={progress.totalProgress} 
      />

      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* O formulário agora envolve todo o conteúdo principal (Sidebar + Abas) */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* ************************************ */}
            {/* RENDERIZAÇÃO CORRETA DA SIDEBAR      */}
            {/* ************************************ */}
            <ProfileSidebar
              userData={userData}
              formData={formData}
              progress={progress}
              onFileChange={handleFileChange}
              onInputChange={handleInputChange}
              onSwitchChange={handleSwitchChange}
            />

            <div className="lg:col-span-8">
              <Card className="border-none shadow-md rounded-xl">
                
                {/* ************************************ */}
                {/* RENDERIZAÇÃO CORRETA DAS ABAS        */}
                {/* ************************************ */}
                <ProfileTabs
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  userData={userData}
                  formData={formData}
                  formErrors={formErrors}
                  enums={enums}
                  handlers={{
                    handleInputChange,
                    handleSelectChange,
                    handleSwitchChange,
                    handleCepBlur,
                  }}
                />

                {/* Botão de Salvar fica dentro do Card, mas ainda dentro do <form> */}
                <div className="mt-8 pt-6 border-t border-gray-100 p-6 flex justify-end">
                  <Button
                    type="submit"
                    className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white"
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
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CandidateInformation;