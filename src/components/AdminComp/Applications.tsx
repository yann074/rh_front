import React, { useState, useEffect } from 'react';
import axios from 'axios';

// types/ApplicationType.ts
export interface ApplicationType {
  candidato: string;
  vaga: string;
  empresa: string;
  data_aplicacao: string;
  status: string;
}

const Applications: React.FC = () => {
  const [applications, setApplications] = useState<ApplicationType[]>([]);

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/api/apply_opportunities')
      .then((response) => {
        setApplications(response.data.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar candidaturas:", error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Candidaturas Recebidas</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-purple-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Candidato</th>
              <th className="py-3 px-4 text-left">Vaga</th>
              <th className="py-3 px-4 text-left">Empresa</th>
              <th className="py-3 px-4 text-left">Data da Aplicação</th>
              <th className="py-3 px-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{app.candidato}</td>
                <td className="py-2 px-4">{app.vaga}</td>
                <td className="py-2 px-4">{app.empresa}</td>
                <td className="py-2 px-4">{app.data_aplicacao}</td>
                <td className="py-2 px-4">
                  <span className="px-2 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                    {app.status}
                  </span>
                </td>
              </tr>
            ))}
            {applications.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  Nenhuma candidatura encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Applications;
