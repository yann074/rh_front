import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { fetchUserData, fetchEnums, setAuthToken } from "../services/api";
import { UserData, CandidatoData, EnumsData } from "@/types";
import axios from "axios";

export const useFetchCandidateData = (token: string | null) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData>({ email: "", name: "" });
  const [candidatoData, setCandidatoData] = useState<Partial<CandidatoData>>({});
  const [enums, setEnums] = useState<EnumsData>({ sexUser: [], gender: [], orientation: [], color: [] });

  useEffect(() => {
    if (!token) {
      Swal.fire({
        title: "Erro!",
        text: "Você precisa estar logado para acessar esta página.",
        icon: "error",
        confirmButtonText: "OK",
        background: "#ffffff",
        confirmButtonColor: "#6d28d9",
      }).then(() => {
        window.location.href = "/login";
      });
      return;
    }

    setAuthToken(token);

    const fetchData = async () => {
      try {
        setLoading(true);
        const [userProfileResponse, enumsResponse] = await Promise.all([
          fetchUserData(),
          fetchEnums(),
        ]);

        const { user, candidate, address } = userProfileResponse.data.data;
        setUserData({ name: user.name, email: user.email });
        setCandidatoData({
          secondary_email: candidate?.secondary_email || "",
          cpf: candidate?.cpf || "",
          phone: candidate?.phone || "",
          birth_date: candidate?.birth_date?.split("T")[0] || "",
          linkedin: candidate?.linkedin || "",
          pcd: candidate?.pcd || false,
          photoPreview: candidate?.photo || "",
          resumeName: candidate?.resume?.split("/").pop() || "",
          sex: candidate?.sex || "",
          sexual_orientation: candidate?.sexual_orientation || "",
          race: candidate?.race || "",
          gender: candidate?.gender || "",
          expected_salary: address?.expected_salary || "",
          has_driver_license: Boolean(address?.has_driver_license),
          driver_license_category: address?.driver_license_category || "",
          instagram_link: address?.instagram_link || "",
          facebook_link: address?.facebook_link || "",
          zip_code: address?.zip_code || "",
          state: address?.state || "",
          city: address?.city || "",
          neighborhood: address?.neighborhood || "",
          street: address?.street || "",
          number: address?.number || "",
          complement: address?.complement || "",
        });

        const { sexo, gender, orient, color } = enumsResponse.data.data;
        setEnums({ sexUser: sexo, gender, orientation: orient, color });

      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response) {
            if (err.response.status === 401 || err.response.status === 403) {
                 Swal.fire({
                    title: "Sessão expirada",
                    text: "Sua sessão expirou. Por favor, faça o login novamente.",
                    icon: "warning",
                 }).then(() => {
                    localStorage.clear();
                    sessionStorage.clear();
                    window.location.href = "/login";
                 });
            } else {
                setError(`Ocorreu um erro ao buscar seus dados. (Erro: ${err.response.status})`);
            }
        } else {
            setError("Não foi possível conectar ao servidor. Verifique sua internet.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  return { loading, error, userData, candidatoData, enums, setCandidatoData };
};