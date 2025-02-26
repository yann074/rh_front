import { useState } from "react";
import axios from "axios";

interface FormDataType {
  email_sec: string;
  cpf: string;
  telefone: string;
  data_nasc: string;
  linkedin: string;
  pcd?: string;
  sexo?: string;
  orient_sexual?: string;
  cor?: string;
  genero?: string;
}

const DataPersonal = () => {
  const [form, setForm] = useState<FormDataType>({
    email_sec: "",
    cpf: "",
    telefone: "",
    data_nasc: "",
    linkedin: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      formData.append(key, (form as any)[key]);
    });

    if (selectedFile) {
      formData.append("foto", selectedFile);
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://127.0.0.1:8000/api/user_personal",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Dados enviados com sucesso!");
      console.log(response.data);
    } catch (error: any) {
      alert("Erro ao tentar enviar os dados.");
      console.error("Erro no envio:", error.response?.data || error.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Cadastro de Candidato</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Email Secundário</label>
          <input type="email" className="form-control" name="email_sec" onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">CPF</label>
          <input type="text" className="form-control" name="cpf" onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">Telefone</label>
          <input type="text" className="form-control" name="telefone" onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">Data de Nascimento</label>
          <input type="date" className="form-control" name="data_nasc" onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">LinkedIn</label>
          <input type="url" className="form-control" name="linkedin" onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">Possui Deficiência?</label>
          <select className="form-select" name="pcd" onChange={handleChange}>
            <option value="">Selecione</option>
            <option value="1">Sim</option>
            <option value="0">Não</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Foto</label>
          <input type="file" accept="image/*" onChange={handleFileChange} className="form-control" name="foto" />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="img-thumbnail mt-2"
              style={{ width: "150px", height: "150px" }}
            />
          )}
        </div>

        <button type="submit" className="btn btn-primary">Enviar</button>
      </form>
    </div>
  );
};

export default DataPersonal;
