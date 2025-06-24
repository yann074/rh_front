import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
    withCredentials: true,
});

// Este é o interceptor. Ele "intercepta" cada requisição antes de ela ser enviada.
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
       
        // 1. Pega o token do localStorage OU do sessionStorage.
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        // =====================================================================

        // 2. Se o token existir, anexa ele ao cabeçalho 'Authorization'.
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // 3. Retorna a configuração modificada para que a requisição prossiga.
        return config;
    },
    (error) => {
        // Em caso de erro na configuração da requisição, rejeita a promise.
        return Promise.reject(error);
    }
);

export const postData = async (url: string, data: any) => {
    try {
        const response = await api.post(url, data);
        return response.data;
    } catch (error) {
        console.error("Erro ao enviar dados:", error);
        throw error;
    }
};

export const getData = async(url: string, config?: AxiosRequestConfig) => {
    try{
        const response = await api.get(url, config);
        return response.data;
    }catch(error){
        console.error("Erro ao buscar dados:", error);
        throw error;
    }
}

// É uma boa prática exportar a instância 'api' diretamente 
export default api;