import React, { useState } from 'react';
import { Search, Plus, User, Phone, Mail, Edit, Trash2 } from 'lucide-react';
import NewClientModal from '../components/NewClientModal';
import { useTheme } from '../contexts/ThemeContext';

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  lastContact: string;
}

const clients: Client[] = [
  {
    id: 1,
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '(11) 99999-9999',
    status: 'active',
    lastContact: '2024-03-10'
  },
  {
    id: 2,
    name: 'Maria Santos',
    email: 'maria.santos@email.com',
    phone: '(11) 98888-8888',
    status: 'active',
    lastContact: '2024-03-09'
  }
];

export default function Clientes() {
  const { darkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedClient(null);
  };

  const handleDelete = (id: number) => {
    // Implementar lógica de deleção
    console.log('Deletar cliente:', id);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Clientes
          </h1>
          <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Gerencie sua base de clientes
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#00D856] text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Cliente
        </button>
      </div>

      {/* Barra de Pesquisa */}
      <div className={`${
        darkMode ? 'bg-gray-800' : 'bg-white'
      } p-4 rounded-xl shadow-lg mb-8`}>
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <input
            type="text"
            placeholder="Pesquisar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-12 pr-4 py-3 rounded-lg ${
              darkMode
                ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600'
                : 'bg-gray-50 text-gray-900 placeholder-gray-500 border-gray-200'
            } border focus:outline-none focus:ring-2 focus:ring-[#00D856] focus:ring-opacity-50`}
          />
        </div>
      </div>

      {/* Lista de Clientes */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`${
                darkMode ? 'bg-gray-700' : 'bg-gray-50'
              } border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Cliente</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Contato</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Último Contato</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {clients.map((client) => (
                <tr
                  key={client.id}
                  className={`${
                    darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                  } transition-colors duration-200`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <User className={`w-10 h-10 ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      } mr-3`} />
                      <div>
                        <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {client.name}
                        </div>
                        <div className="text-sm text-gray-500">{client.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Phone className="w-4 h-4 mr-2" />
                      {client.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      client.status === 'active'
                        ? 'bg-[#00D856] bg-opacity-10 text-[#00D856]'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {client.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(client.lastContact).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => handleEdit(client)}
                        className="p-2 text-[#00D856] hover:bg-[#00D856] hover:bg-opacity-10 rounded-lg transition-colors duration-200"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(client.id)}
                        className="p-2 text-red-500 hover:bg-red-500 hover:bg-opacity-10 rounded-lg transition-colors duration-200"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Client Modal */}
      <NewClientModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        darkMode={darkMode}
        client={selectedClient}
      />
    </div>
  );
}