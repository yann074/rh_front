import { useEffect, useState } from "react";
import axios from "axios";

const CheckServer = () => {
  const [serverStatus, setServerStatus] = useState<string>("Verificando servidor...");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/all")
      .then(() => {
        setServerStatus("✅ Servidor online!");
      })
      .catch(() => {
        setServerStatus("❌ Servidor offline. Verifique a conexão.");
      });
  }, []);

  useEffect(() => {
    console.log(serverStatus);
  }, [serverStatus]);

  return null;
};

export default CheckServer;
