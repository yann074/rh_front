import { useEffect, useState } from "react";
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

        axios.post(`http://127.0.0.1:8000/api/job/${id}`, { id_vaga: id }, {
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
        
    }, [id]);

    return (
        <div className="flex justify-center items-center h-screen">
            <h1 className="text-2xl font-semibold">Candidatura enviada com sucesso!</h1>
        </div>
    );
}
