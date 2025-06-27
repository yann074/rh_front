import axios from "axios";

export const fetchAddressByCep = async (cep: string) => {
  if (!cep || cep.length !== 9) return null;
  try {
    const response = await axios.get(`https://viacep.com.br/ws/${cep.replace("-", "")}/json/`);
    if (!response.data.erro) {
      return {
        street: response.data.logradouro,
        neighborhood: response.data.bairro,
        city: response.data.localidade,
        state: response.data.uf,
      };
    }
    return null;
  } catch (error) {
    console.error("Erro ao buscar CEP:", error);
    return null;
  }
};