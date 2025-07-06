import axios from "axios";
import { formatSocialMediaUrl } from "../utils/formatters";
import { CandidatoData } from "@/types";

const apiClient = axios.create({
  baseURL: "https://rhback-production.up.railway.app/api",
});

export const setAuthToken = (token: string) => {
  apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const fetchUserData = () => apiClient.get("/user-data");
export const fetchEnums = () => apiClient.get("/enums/sex-user");

export const updateCandidateData = (data: Partial<CandidatoData>) => {
  const formData = new FormData();
  
  // Adiciona campos ao FormData
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (key === 'pcd' || key === 'has_driver_license') {
        formData.append(key, value ? "1" : "0");
      } else if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, String(value));
      }
    }
  });

  return apiClient.post("/user-data", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updatePersonalData = (data: Partial<CandidatoData>) => {
  const personalData = {
    zip_code: data.zip_code,
    state: data.state,
    city: data.city,
    neighborhood: data.neighborhood,
    street: data.street,
    number: data.number,
    complement: data.complement,
    expected_salary: data.expected_salary
      ? Number.parseFloat(data.expected_salary.replace(/[^\d,]/g, "").replace(",", "."))
      : null,
    has_driver_license: data.has_driver_license ? 1 : 0,
    driver_license_category: data.driver_license_category || "",
    instagram_link: formatSocialMediaUrl(data.instagram_link, "instagram.com"),
    facebook_link: formatSocialMediaUrl(data.facebook_link, "facebook.com"),
  };

  return apiClient.post("/personal-data", personalData, {
    headers: { "Content-Type": "application/json" },
  });
};