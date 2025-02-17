import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Filter, Clock } from 'lucide-react';
import NewProfessionalModal from '../components/NewProfessionalModal';
import DisponibilidadeModal from '../components/DisponibilidadeModal';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useCompany } from '../contexts/CompanyContext';

interface Professional {
  id: number;
  created_at: string;
  nome: string;
  id_profissao: number;
  email: string | null;
  foto: string | null;
  nivel: boolean | null;
  id_empresa: number;
  profissao?: {
    id: number;
    profissao: string;
  };
  disponibilidade?: {
    id: number;
    dia_semana: string;
    hora_inicio: string;
    hora_fim: string;
    ativo: boolean;
  }[];
}

interface Profissao {
  id: number;
  profissao: string;
  id_empresa: number;
}

export default function Profissionais() {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const { company, loading: companyLoading } = useCompany();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDisponibilidadeModalOpen, setIsDisponibilidadeModalOpen] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [profissoes, setProfissoes] = useState<Profissao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (company?.id && !companyLoading) {
      console.log('Iniciando busca de profissionais para empresa:', company.id);
      fetchProfessionals();
      fetchProfissoes();
    }
  }, [company, companyLoading]);

  const fetchProfissoes = async () => {
    if (!company?.id) return;

    try {
      console.log('Buscando profissões para empresa:', company.id);

      // Buscar profissões da empresa
      const { data: profissoesData, error: profissoesError } = await supabase
        .from('profissoes')
        .select('id, profissao, id_empresa')
        .eq('id_empresa', company.id);

      if (profissoesError) {
        console.error('Erro ao buscar profissões:', profissoesError);
        return;
      }

      console.log('Profissões encontradas:', profissoesData);
      setProfissoes(profissoesData || []);
    } catch (error) {
      console.error('Erro ao buscar profissões:', error);
    }
  };

  const fetchProfessionals = async () => {
    if (!company?.id) return;

    setLoading(true);
    try {
      console.log('Buscando profissionais para empresa:', company.id);
      
      // Buscar profissionais com suas profissões
      const { data: profissionaisData, error: profissionaisError } = await supabase
        .from('profissionais')
        .select(`
          id,
          nome,
          email,
          foto,
          nivel,
          id_empresa,
          id_profissao
        `)
        .eq('id_empresa', company.id);

      console.log('Resultado da busca de profissionais:', { profissionaisData, profissionaisError });

      if (profissionaisError) {
        console.error('Erro ao buscar profissionais:', profissionaisError);
        return;
      }

      // Para cada profissional, buscar sua disponibilidade
      const profissionaisComDisponibilidade = await Promise.all((profissionaisData || []).map(async (prof) => {
        console.log('Buscando disponibilidade para profissional:', prof.id);
        
        const { data: disponibilidadeData, error: disponibilidadeError } = await supabase
          .from('disponibilidade_profissional')
          .select(`
            id,
            dia_semana,
            hora_inicio,
            hora_fim,
            ativo
          `)
          .eq('id_profissional', prof.id)
          .eq('ativo', true);

        if (disponibilidadeError) {
          console.error('Erro ao buscar disponibilidade:', disponibilidadeError);
          return prof;
        }

        // Buscar a profissão do profissional
        const profissao = profissoes.find(p => p.id === prof.id_profissao);

        return {
          ...prof,
          profissao: profissao || null,
          disponibilidade: disponibilidadeData || []
        };
      }));

      console.log('Profissionais com disponibilidade:', profissionaisComDisponibilidade);
      setProfessionals(profissionaisComDisponibilidade);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatarDisponibilidade = (disponibilidade: Professional['disponibilidade']) => {
    if (!disponibilidade || disponibilidade.length === 0) return 'Sem disponibilidade cadastrada';

    const diasTraduzidos: { [key: string]: string } = {
      'segunda': 'Seg',
      'terca': 'Ter',
      'quarta': 'Qua',
      'quinta': 'Qui',
      'sexta': 'Sex',
      'sabado': 'Sáb',
      'domingo': 'Dom'
    };

    // Função para determinar se é manhã ou tarde
    const getPeriodo = (hora: string) => {
      const hora_num = parseInt(hora.split(':')[0]);
      if (hora_num < 12) return 'manhã';
      return 'tarde';
    };

    // Agrupar por dia da semana
    const disponibilidadePorDia = disponibilidade.reduce((acc, disp) => {
      if (!acc[disp.dia_semana]) {
        acc[disp.dia_semana] = new Set();
      }
      acc[disp.dia_semana].add(getPeriodo(disp.hora_inicio));
      acc[disp.dia_semana].add(getPeriodo(disp.hora_fim));
      return acc;
    }, {} as { [key: string]: Set<string> });

    // Formatar a saída
    return Object.entries(disponibilidadePorDia)
      .map(([dia, periodos]) => {
        const periodosArray = Array.from(periodos);
        let periodo = '';
        if (periodosArray.length === 2) {
          periodo = 'Manhã e Tarde';
        } else {
          periodo = periodosArray[0].charAt(0).toUpperCase() + periodosArray[0].slice(1);
        }
        return `${diasTraduzidos[dia]} (${periodo})`;
      })
      .join(', ');
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este profissional?')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profissionais')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Recarregar a lista após deletar
      fetchProfessionals();
    } catch (error) {
      console.error('Erro ao deletar profissional:', error);
      alert('Erro ao deletar profissional. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (professional: Professional) => {
    setSelectedProfessional(professional);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProfessional(null);
    // Recarregar a lista de profissionais após fechar o modal
    fetchProfessionals();
  };

  const handleShowDisponibilidade = (professional: Professional) => {
    setSelectedProfessional(professional);
    setIsDisponibilidadeModalOpen(true);
  };

  const filteredProfessionals = professionals.filter(prof =>
    prof.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (prof.email && prof.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
                  Disponibilidade
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {filteredProfessionals.map((professional) => (
                <tr 
                  key={professional.id}
                  className={`${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'} transition-colors duration-200`}
                >
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {professional.nome}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    {professional.profissao?.profissao || 'Não especificada'}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    {professional.email || 'Não informado'}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    {professional.disponibilidade && professional.disponibilidade.length > 0 ? (
                      <button
                        onClick={() => handleShowDisponibilidade(professional)}
                        className="flex items-center text-[#00D856] hover:text-[#00bf4b] transition-colors duration-200"
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        Ver Disponibilidade
                      </button>
                    ) : (
                      <div className="flex items-center text-red-500">
                        <Clock className="w-4 h-4 mr-2" />
                        Indisponível
                      </div>
                    )}
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
        professional={selectedProfessional}
        profissoes={profissoes}
      />

      {/* Disponibilidade Modal */}
      <DisponibilidadeModal
        isOpen={isDisponibilidadeModalOpen}
        onClose={() => setIsDisponibilidadeModalOpen(false)}
        disponibilidade={selectedProfessional?.disponibilidade || []}
        nomeProfissional={selectedProfessional?.nome || ''}
      />
    </div>
  );
}