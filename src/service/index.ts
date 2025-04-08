export interface Vaga {
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

export interface ApplicationType {
    candidato: string;
    vaga: string;
    empresa: string;
    data_aplicacao: string;
    status: string;
}

export interface Company {
    id: number;
    name: string;
}

export interface FormData {
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

export interface Candidate {
    id: number;
    name: string;
    email: string;
    position: string;
    applicationDate?: string;
    status?: "Aprovado" | "Em Análise" | "Entrevista" | "Rejeitado" | "Contratado";
    avatarUrl?: string;
    experience?: string;
    education?: string;
    skills?: string[];
    vacancy?: string;
    // Campos de informações pessoais
    telefone?: string;
    data_nasc?: string;
    genero?: string;
    cor?: string;
    orient_sexual?: string;
  }

export interface User {
    id: number;
    name: string;
    email: string;
    permission: string;
    lastActive?: string;
    status?: "Ativo" | "Inativo" | "Pendente";
    avatarUrl?: string;
    createdAt?: string;
    role?: string;
  }
