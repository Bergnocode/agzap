import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Filter, Clock } from 'lucide-react';
import NewProfessionalModal from '../components/NewProfessionalModal';
import { useTheme } from '../contexts/ThemeContext';

interface Professional {
  id: number;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  availability: string;
  status?: 'active' | 'inactive';
}

const professionals: Professional[] = [
  {
    id: 1,
    name: "Wanderson",
    specialty: "Médico",
    email: "wandersoncnm@gmail.com",
    phone: "11914600243",
    availability: "Seg (Manhã e Tarde), Ter (Manhã)",
    status: 'active'
  },
  {
    id: 2,
    name: "Dudu Gameplay",
    specialty: "Seu Madruga",
    email: "dudu@gmail.com",
    phone: "11914600243",
    availability: "Seg (Manhã), Ter (Tarde)",
    status: 'active'
  },
  {
    id: 3,
    name: "Teste",
    specialty: "Dentista",
    email: "juca@gmail.com",
    phone: "11914600243",
    availability: "Seg (Manhã)",
    status: 'active'
  },
  {
    id: 4,
    name: "EduPlay",
    specialty: "Gamer",
    email: "teste@gmail.com",
    phone: "11991460024",
    availability: "Sáb (Manhã e Tarde)",
    status: 'active'
  }
];

export default function Profissionais() {
  const { darkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);

  const handleDelete = (id: number) => {
    // Implementar lógica de deleção
    console.log('Deletar profissional:', id);
  };

  const handleEdit = (professional: Professional) => {
    setSelectedProfessional(professional);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProfessional(null);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Profissionais
          </h1>
          <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Gerencie sua equipe de profissionais
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#00D856] hover:bg-[#00bf4b] text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Adicionar Profissional
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar profissional..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
              darkMode 
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
            } focus:outline-none focus:ring-2 focus:ring-[#00D856] focus:ring-opacity-50`}
          />
        </div>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-2 rounded-lg border ${
            darkMode 
              ? 'border-gray-700 text-gray-300 hover:bg-gray-800' 
              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
          } flex items-center gap-2`}
        >
          <Filter className="w-5 h-5" />
          Filtros
        </button>
      </div>

      {/* Table */}
      <div className={`rounded-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={darkMode ? 'bg-gray-800' : 'bg-gray-50'}>
                <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                  Nome
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                  Especialidade
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                  Email
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                  Telefone
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                  Disponibilidade
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {professionals.map((professional) => (
                <tr 
                  key={professional.id}
                  className={`${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'} transition-colors duration-200`}
                >
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {professional.name}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    {professional.specialty}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    {professional.email}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    {professional.phone}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {professional.availability}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEdit(professional)}
                        className="p-2 rounded-lg hover:bg-[#00D856] hover:bg-opacity-10 text-[#00D856] transition-colors duration-200"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(professional.id)}
                        className="p-2 rounded-lg hover:bg-red-100 text-red-500 transition-colors duration-200"
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

      {/* Professional Modal */}
      <NewProfessionalModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        darkMode={darkMode}
        professional={selectedProfessional}
      />
    </div>
  );
}