import React from "react";
import {
  Mail,
  CheckCircle,
  Phone,
  Calendar,
  DollarSign,
  Car,
  Instagram,
  Facebook,
  Heart,
  MapPin,
  AlertCircle,
  Check,
  ChevronDown,
} from "lucide-react";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

import type { CandidatoData, EnumsData, UserData } from "@/types";
import { LICENSE_CATEGORIES, BRAZILIAN_STATES } from "./constants";


// Função helper movida para o escopo do módulo
const isFieldFilled = (value: any): boolean => {
    if (value === null || value === undefined) return false;
    if (typeof value === "string") return value.trim() !== "";
    if (typeof value === "boolean") return true; // Switch sempre tem valor
    return true;
};

// --- Componente ValidatedInput ---
const ValidatedInput = ({ 
    name, 
    value,
    formErrors, 
    ...props 
}: React.InputHTMLAttributes<HTMLInputElement> & { formErrors: Record<string, string> }) => {
    const isFilled = isFieldFilled(value);
    const hasError = name ? formErrors[name] : false;
    
    return (
      <div className="relative">
        <Input
          name={name}
          value={value || ""}
          className={`
            bg-white
            ${hasError ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : ''}
            ${isFilled && !hasError ? 'border-green-400 bg-green-50 focus:border-green-500 focus:ring-green-200' : ''}
            transition-all duration-200
          `}
          {...props}
        />
        {isFilled && !hasError && (
          <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
        )}
        {hasError && (
          <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
        )}
      </div>
    );
};

// --- Componente ValidatedDropdown ---
const ValidatedDropdown = ({
    value,
    onValueChange,
    options,
    placeholder,
    fieldName,
    formErrors,
  }: {
    value?: string;
    onValueChange: (value: string) => void;
    options: { value: string; label: string }[];
    placeholder: string;
    fieldName: string;
    formErrors: Record<string, string>;
  }) => {
    const isFilled = isFieldFilled(value);
    const hasError = formErrors[fieldName];
    const selectedLabel = options.find((opt) => opt.value === value)?.label || placeholder;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={`
              w-full justify-between font-normal bg-white
              ${hasError ? "border-red-400 text-red-900 focus:border-red-500 focus:ring-red-200" : ""}
              ${isFilled && !hasError ? "border-green-400 bg-green-50 text-green-900 focus:border-green-500 focus:ring-green-200" : ""}
              transition-all duration-200
            `}
          >
            <span className="truncate">{selectedLabel}</span>
            <div className="flex items-center">
                {isFilled && !hasError && <Check className="h-4 w-4 text-green-500" />}
                {hasError && <AlertCircle className="h-4 w-4 text-red-500" />}
                <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] bg-white">
          {options.map((option) => (
            <DropdownMenuItem key={option.value} onSelect={() => onValueChange(option.value)}>
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
};


interface ProfileTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  userData: UserData;
  formData: Partial<CandidatoData>;
  formErrors: Record<string, string>;
  enums: EnumsData;
  handlers: {
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSelectChange: (value: string, field: keyof CandidatoData) => void;
    handleSwitchChange: (checked: boolean, field: keyof CandidatoData) => void;
    handleCepBlur: (cep: string) => void;
  };
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({
  activeTab,
  setActiveTab,
  userData,
  formData,
  formErrors,
  enums,
  handlers,
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <CardHeader className="border-b border-slate-100 bg-white rounded-t-xl sticky top-0 z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <CardTitle className="text-xl text-slate-800">Editar Informações</CardTitle>
            <div className="mt-4 md:mt-0">
              <TabsList className="grid w-full grid-cols-3 bg-slate-100 p-1">
                <TabsTrigger value="pessoal" className="flex items-center gap-2 data-[state=active]:bg-purple-200"><CheckCircle className="h-4 w-4" /> Dados Pessoais</TabsTrigger>
                <TabsTrigger value="diversidade" className="flex items-center gap-2 data-[state=active]:bg-purple-200"><Heart className="h-4 w-4" /> Diversidade</TabsTrigger>
                <TabsTrigger value="localizacao" className="flex items-center gap-2 data-[state=active]:bg-purple-200"><MapPin className="h-4 w-4" /> Localização</TabsTrigger>
              </TabsList>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
            {/* Aba de Dados Pessoais */}
            <TabsContent value="pessoal" className="mt-0 space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200"><div className="flex items-center gap-2 mb-2"><CheckCircle className="h-5 w-5 text-blue-600" /><h3 className="font-medium text-blue-800">Dados Pessoais</h3></div><p className="text-sm text-blue-700">Preencha todos os campos obrigatórios. Os campos preenchidos aparecerão com uma marca verde.</p></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="secondary_email" className="flex items-center gap-2"><Mail className="h-4 w-4" />Email Secundário<span className="text-red-500">*</span></Label>
                        <ValidatedInput id="secondary_email" name="secondary_email" type="email" value={formData.secondary_email} onChange={handlers.handleInputChange} formErrors={formErrors} />
                        {formErrors.secondary_email && <p className="text-red-500 text-sm">{formErrors.secondary_email}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="cpf" className="flex items-center gap-2"><CheckCircle className="h-4 w-4" />CPF<span className="text-red-500">*</span></Label>
                        <ValidatedInput id="cpf" name="cpf" value={formData.cpf} onChange={handlers.handleInputChange} formErrors={formErrors}/>
                        {formErrors.cpf && <p className="text-red-500 text-sm">{formErrors.cpf}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center gap-2"><Phone className="h-4 w-4" />Telefone<span className="text-red-500">*</span></Label>
                        <ValidatedInput id="phone" name="phone" value={formData.phone} onChange={handlers.handleInputChange} formErrors={formErrors}/>
                        {formErrors.phone && <p className="text-red-500 text-sm">{formErrors.phone}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="birth_date" className="flex items-center gap-2"><Calendar className="h-4 w-4" />Data de Nascimento<span className="text-red-500">*</span></Label>
                        <ValidatedInput id="birth_date" name="birth_date" type="date" value={formData.birth_date} onChange={handlers.handleInputChange} formErrors={formErrors}/>
                        {formErrors.birth_date && <p className="text-red-500 text-sm">{formErrors.birth_date}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="expected_salary" className="flex items-center gap-2"><DollarSign className="h-4 w-4" />Pretensão Salarial<span className="text-red-500">*</span></Label>
                        <ValidatedInput id="expected_salary" name="expected_salary" value={formData.expected_salary} onChange={handlers.handleInputChange} formErrors={formErrors}/>
                        {formErrors.expected_salary && <p className="text-red-500 text-sm">{formErrors.expected_salary}</p>}
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between"><Label htmlFor="has_driver_license" className="flex items-center gap-2"><Car className="h-4 w-4" />Possui CNH</Label><Switch id="has_driver_license" checked={formData.has_driver_license || false} onCheckedChange={(c) => handlers.handleSwitchChange(c, 'has_driver_license')} /></div>
                        {formData.has_driver_license && (
                            <ValidatedDropdown value={formData.driver_license_category} onValueChange={(v) => handlers.handleSelectChange(v, 'driver_license_category')} options={LICENSE_CATEGORIES.map(c => ({ value: c, label: c }))} placeholder="Selecione a categoria *" fieldName="driver_license_category" formErrors={formErrors}/>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="instagram_link" className="flex items-center gap-2"><Instagram className="h-4 w-4" />Instagram</Label>
                        <ValidatedInput id="instagram_link" name="instagram_link" value={formData.instagram_link} onChange={handlers.handleInputChange} formErrors={formErrors}/>
                        {formErrors.instagram_link && <p className="text-red-500 text-sm">{formErrors.instagram_link}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="facebook_link" className="flex items-center gap-2"><Facebook className="h-4 w-4" />Facebook</Label>
                        <ValidatedInput id="facebook_link" name="facebook_link" value={formData.facebook_link} onChange={handlers.handleInputChange} formErrors={formErrors}/>
                        {formErrors.facebook_link && <p className="text-red-500 text-sm">{formErrors.facebook_link}</p>}
                    </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-6"><p className="text-sm text-blue-700">Seu e-mail principal é <strong>{userData.email}</strong>. O e-mail secundário é um contato alternativo.</p></div>
            </TabsContent>

            {/* Aba de Diversidade */}
            <TabsContent value="diversidade" className="mt-0 space-y-6">
                <div className="bg-indigo-50 p-5 rounded-lg border border-indigo-200"><div className="flex items-center gap-2 mb-2"><Heart className="h-5 w-5 text-indigo-600" /><h3 className="font-medium text-indigo-800">Informações de Diversidade</h3></div><p className="text-sm text-indigo-700">Estas informações são confidenciais e usadas para promover a diversidade e inclusão.</p></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">Sexo Biológico <span className="text-red-500">*</span></Label>
                        <ValidatedDropdown value={formData.sex} onValueChange={(v) => handlers.handleSelectChange(v, 'sex')} options={enums.sexUser.map((s) => ({ value: s.toLowerCase().replace(/\s+/g, "_"), label: s }))} placeholder="Selecione *" fieldName="sex" formErrors={formErrors}/>
                    </div>
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">Identidade de Gênero <span className="text-red-500">*</span></Label>
                        <ValidatedDropdown value={formData.gender} onValueChange={(v) => handlers.handleSelectChange(v, 'gender')} options={enums.gender.map((g) => ({ value: g, label: g }))} placeholder="Selecione *" fieldName="gender" formErrors={formErrors}/>
                    </div>
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">Orientação Sexual <span className="text-red-500">*</span></Label>
                        <ValidatedDropdown value={formData.sexual_orientation} onValueChange={(v) => handlers.handleSelectChange(v, 'sexual_orientation')} options={enums.orientation.map((o) => ({ value: o, label: o }))} placeholder="Selecione *" fieldName="sexual_orientation" formErrors={formErrors}/>
                    </div>
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">Raça/Cor/Etnia <span className="text-red-500">*</span></Label>
                        <ValidatedDropdown value={formData.race} onValueChange={(v) => handlers.handleSelectChange(v, 'race')} options={enums.color.map((c) => ({ value: c, label: c }))} placeholder="Selecione *" fieldName="race" formErrors={formErrors}/>
                    </div>
                </div>
            </TabsContent>

            {/* Aba de Localização */}
            <TabsContent value="localizacao" className="mt-0 space-y-6">
                <div className="bg-indigo-50 p-5 rounded-lg border border-indigo-200"><div className="flex items-center gap-2 mb-2"><MapPin className="h-5 w-5 text-indigo-600" /><h3 className="font-medium text-indigo-800">Informações de Localização</h3></div><p className="text-sm text-indigo-700">Preencha seu endereço completo para encontrarmos oportunidades próximas a você.</p></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="zip_code" className="flex items-center gap-2">CEP <span className="text-red-500">*</span></Label>
                        <ValidatedInput id="zip_code" name="zip_code" value={formData.zip_code} onChange={handlers.handleInputChange} onBlur={(e) => handlers.handleCepBlur(e.target.value)} formErrors={formErrors}/>
                    </div>
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">Estado <span className="text-red-500">*</span></Label>
                        <ValidatedDropdown value={formData.state} onValueChange={(v) => handlers.handleSelectChange(v, 'state')} options={BRAZILIAN_STATES.map((s) => ({ value: s, label: s }))} placeholder="Selecione *" fieldName="state" formErrors={formErrors}/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="city" className="flex items-center gap-2">Cidade<span className="text-red-500">*</span></Label>
                        <ValidatedInput id="city" name="city" value={formData.city} onChange={handlers.handleInputChange} formErrors={formErrors}/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="neighborhood" className="flex items-center gap-2">Bairro<span className="text-red-500">*</span></Label>
                        <ValidatedInput id="neighborhood" name="neighborhood" value={formData.neighborhood} onChange={handlers.handleInputChange} formErrors={formErrors}/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="street" className="flex items-center gap-2">Rua<span className="text-red-500">*</span></Label>
                        <ValidatedInput id="street" name="street" value={formData.street} onChange={handlers.handleInputChange} formErrors={formErrors}/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="number" className="flex items-center gap-2">Número<span className="text-red-500">*</span></Label>
                        <ValidatedInput id="number" name="number" value={formData.number} onChange={handlers.handleInputChange} formErrors={formErrors}/>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="complement">Complemento</Label>
                        <Textarea id="complement" name="complement" value={formData.complement || ""} onChange={handlers.handleInputChange} className="resize-none bg-white" rows={3}/>
                    </div>
                </div>
            </TabsContent>
        </CardContent>
    </Tabs>
  );
};