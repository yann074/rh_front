import axios, { AxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

export const postData = async (url: string, data: any) => {
  try {
    const response = await api.post(url, data);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    throw error;
  }
};

export const getData = async(url: string,data: AxiosRequestConfig<any> | undefined) => {
  try{
    const response = await api.get(url,data);
    return response.data;
  }catch(error){
    console.error("Error ao buscar dados");
    throw error;
  }
}