import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { updateCandidateData, updatePersonalData } from "../services/api";
import { fetchAddressByCep } from "../services/cepService";
import { isValidUrl } from "../utils/validators";
import { formatSocialMediaUrl } from "../utils/formatters";
import type { CandidatoData } from "@/types";

export const useCandidateForm = (initialData: Partial<CandidatoData>) => {
  const [formData, setFormData] = useState(initialData);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Sincroniza o estado do formulário quando os dados da API são carregados
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean, field: keyof CandidatoData) => {
    setFormData((prev) => ({ ...prev, [field]: checked }));
  };

  const handleSelectChange = (value: string, field: keyof CandidatoData) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  
  // A única responsabilidade desta função é ATUALIZAR O ESTADO LOCAL.
  // Nenhuma chamada de API deve existir aqui.
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: "photo" | "resume") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (field === "resume" && file.type !== "application/pdf") {
      Swal.fire("Formato inválido", "Por favor, selecione apenas arquivos PDF.", "error");
      return;
    }

    // Se o campo for 'photo', lê o arquivo para gerar um preview
    if (field === "photo") {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          photo: file, // Armazena o objeto File para o envio posterior
          photoPreview: reader.result as string, // Armazena a URL do preview para exibição
        }));
      };
      reader.readAsDataURL(file);
    } 
    // Se o campo for 'resume'
    else {
      setFormData((prev) => ({
        ...prev,
        resume: file, // Armazena o objeto File para o envio posterior
        resumeName: file.name, // Armazena o nome do arquivo para exibição
      }));
    }
  };
  
  // =====================================================================
  //  FIM DA CORREÇÃO
  // =====================================================================


  const handleCepBlur = async (cep: string) => {
    const address = await fetchAddressByCep(cep);
    if (address) {
      setFormData((prev) => ({ ...prev, ...address }));
    } else if (cep && cep.length >= 8) { // Apenas mostra erro se o CEP parece válido
      Swal.fire("CEP não encontrado", "Não foi possível encontrar o endereço para o CEP informado.", "warning");
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (formData.instagram_link && !isValidUrl(formatSocialMediaUrl(formData.instagram_link, "instagram.com"))) {
      errors.instagram_link = "Por favor, insira um link válido do Instagram";
    }
    if (formData.facebook_link && !isValidUrl(formatSocialMediaUrl(formData.facebook_link, "facebook.com"))) {
      errors.facebook_link = "Por favor, insira um link válido do Facebook";
    }
    if (formData.expected_salary && !/^R?\$?\s*\d+(?:[.,]\d{1,2})?$/.test(formData.expected_salary)) {
      errors.expected_salary = "Por favor, insira um valor numérico válido";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // A função de envio permanece a mesma, pois já está correta.
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      Swal.fire("Erro de validação", "Por favor, corrija os erros no formulário.", "error");
      return;
    }
    
    setSaving(true);
    try {
      await updateCandidateData(formData);
      await updatePersonalData(formData);

      Swal.fire("Sucesso!", "Seus dados foram salvos com sucesso.", "success");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Não foi possível salvar seus dados.";
      Swal.fire("Erro!", errorMessage, "error");
    } finally {
      setSaving(false);
    }
  };

  return {
    formData,
    setFormData,
    formErrors,
    saving,
    handleInputChange,
    handleSwitchChange,
    handleSelectChange,
    handleFileChange, // Retornando a versão corrigida
    handleCepBlur,
    handleSubmit,
  };
};