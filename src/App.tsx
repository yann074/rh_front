import { useState } from 'react';
import axios from 'axios';

const App = () => {  // <- Remova "export" daqui
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    axios.post('https://rhback-production.up.railway.app/api/login', form)
      .then(response => {
        console.log(response.data);
        if (response.data.message === "User is admin") {
          window.alert("Usuário criado, faça o Login");
        }
        if (response.data.message === "User not is admin") {
          window.alert("Usuário criado, faça o Login");
        }
      })
      .catch(error => {
        console.error('Houve um erro!', error);
      });
  };

  return (
    <div>
      <h2>Cadastro de Usuário</h2>
      <form onSubmit={handleSubmit}>

        <input
          type="email"
          name="email"
          placeholder="Digite seu email"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Digite sua senha"
          onChange={handleChange}
          required
        />

        <button type="submit">Registrar</button>

      </form>
    </div>
  );
};

export default App; // <- Agora o App é exportado como default