import { useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function Apply() {
    
    const { id } = useParams();
    useEffect(() => {
        if (!id) {
            console.error("ID não encontrado!");
            return;
        }

        const token = localStorage.getItem('token');

        axios.post(`http://127.0.0.1:8000/api/apply_opportunities/${id}`, { id_vaga: id }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then((response) => {
            console.log(response.data);
        })
        .catch((error) => {
            console.error(error.response.data);
        });
        
        fetchUserData();
    }, [id]);
    
    const fetchUserData = async () => {
        try {

            const userProfileResponse = await axios.get('http://127.0.0.1:8000/api/userprofile', {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            });
          
            console.log('Usuário autenticado:', userProfileResponse.data);
            console.log('Token usado:', localStorage.getItem('token'));
      
          } catch (error) {
            console.error('Erro ao buscar dados do usuário:', error);
          }
        };
    
    return (
        <div className="flex justify-center items-center h-screen">
            <h1 className="text-2xl font-semibold">Candidatura enviada com sucesso!</h1>
        </div>
    );
}
