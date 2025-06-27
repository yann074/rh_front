// src/types.ts

export interface UserData {
  id?: number;
  email: string;
  name: string;
  role?: string;
  created_at?: string;
}

export interface CandidatoData {
  user_id?: number;
  secondary_email: string;
  cpf: string;
  phone: string;
  birth_date: string;
  linkedin: string;
  pcd: boolean;
  photo: File | null;
  photoPreview: string;
  resume?: File | null;
  resumeName?: string;
  sex: string;
  sexual_orientation: string;
  race: string;
  gender: string;
  expected_salary?: string;
  has_driver_license?: boolean;
  driver_license_category?: string;
  instagram_link?: string;
  facebook_link?: string;
  zip_code?: string;
  state?: string;
  city?: string;
  neighborhood?: string;
  street?: string;
  number?: string;
  complement?: string;
}

export interface EnumsData {
  sexUser: string[];
  gender: string[];
  orientation: string[];
  color: string[];
}