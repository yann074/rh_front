import axios from "axios"
import { useEffect, useState } from "react"

export default function InitialJobs() {

    const [data, setData] = useState([]);

    useEffect(() => {
         axios.get("http://127.0.0.1:8000/api/all_job")
        .then((response) =>{
            console.log(response.data.data);
            setData(response.data.data)
        })
        .catch(console.error)
    }, []);
    

    return(
        <>

            <h1>VAGAS</h1>

            <ul>{data.map(date => {
                return(
                    <li key={date.id}>
                        <p>{date.titulo}</p>
                        <p>{date.localizacao}</p>
                        <p>{date.created_at}</p>
                        <button>Ver vaga</button>
                    </li>
                )
            })}</ul>
        </>
    )
}