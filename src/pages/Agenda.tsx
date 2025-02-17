import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Filter, 
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import AppointmentModal from '../components/AppointmentModal';
import EditAppointmentModal from '../components/EditAppointmentModal';
import AppointmentDetailsModal from '../components/AppointmentDetailsModal';
import { useTheme } from '../contexts/ThemeContext';
import { useCompany } from '../contexts/CompanyContext';
import { supabase } from '../lib/supabase';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

interface Appointment {
  id: number;
  created_at: string;
  id_empresa: number;
  id_profissional: number;
  data_agendamento: string;
  inicio: string;
  fim: string;
  cliente: string;
  telefone: string;
  tipo: string;
  observações: string;
}

interface Professional {
  id: number;
  nome: string;
  profissao: string;
  foto: string | null;
  email: string | null;
}

const timeSlots = Array.from({ length: 12 }, (_, i) => {
  const hour = i + 8; // Começando às 8h
  return `${hour.toString().padStart(2, '0')}:00`;
});

const weekDays = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];

export default function Agenda() {
  const { darkMode } = useTheme();
  const { company, loading: companyLoading } = useCompany();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [showProfessionalDropdown, setShowProfessionalDropdown] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (company) {
      fetchProfissionais();
    }
  }, [company]);

  useEffect(() => {
    if (company && selectedProfessional) {
      fetchAgendamentos();
    }
  }, [currentDate, selectedProfessional, company]);

  async function fetchProfissionais() {
    try {
      if (!company) return;

      const { data, error } = await supabase
        .from('profissionais')
        .select(`
          id,
          nome,
          foto,
          email,
          profissoes (
            profissao
          )
        `)
        .eq('id_empresa', company.id);

      if (error) throw error;

      const profissionaisFormatados = data.map(prof => ({
        id: prof.id,
        nome: prof.nome,
        profissao: prof.profissoes?.profissao || 'Profissional',
        foto: prof.foto || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3',
        email: prof.email
      }));

      setProfessionals(profissionaisFormatados);
      if (profissionaisFormatados.length > 0 && !selectedProfessional) {
        setSelectedProfessional(profissionaisFormatados[0]);
      }
    } catch (err) {
      console.error('Erro ao buscar profissionais:', err);
      setError('Não foi possível carregar os profissionais');
    }
  }

  async function fetchAgendamentos() {
    try {
      if (!company || !selectedProfessional) {
        setAppointments([]);
        return;
      }

      setLoading(true);
      
      // Calcular as datas da semana
      const weekDates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(currentDate);
        date.setDate(date.getDate() - date.getDay() + i);
        return date;
      });

      // Pegar o primeiro e último dia da semana
      const firstDay = weekDates[0];
      const lastDay = new Date(weekDates[6]);
      lastDay.setDate(lastDay.getDate() + 1); // Adiciona 1 dia para pegar até o fim do último dia
      
      console.log('Buscando agendamentos entre:', {
        inicio: firstDay.toISOString(),
        fim: lastDay.toISOString()
      });

      const { data, error } = await supabase
        .from('agendamentos')
        .select(`
          id,
          created_at,
          id_empresa,
          id_profissional,
          data_agendamento,
          inicio,
          fim,
          cliente,
          telefone,
          tipo,
          observações
        `)
        .eq('id_empresa', company.id)
        .eq('id_profissional', selectedProfessional.id)
        .gte('inicio', firstDay.toISOString())
        .lt('inicio', lastDay.toISOString())
        .order('inicio');

      if (error) {
        console.error('Erro na query:', error);
        throw error;
      }

      console.log('Agendamentos encontrados:', data?.length || 0);
      
      setAppointments(data || []);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar agendamentos:', err);
      setError('Não foi possível carregar os agendamentos');
    } finally {
      setLoading(false);
    }
  }

  // Gerar datas da semana
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - date.getDay() + i);
    return date;
  });

  // Função para abrir o modal de novo agendamento ao clicar em um horário vazio
  const handleTimeSlotClick = (time: string) => {
    const isSlotOccupied = appointments.some(apt => {
      const aptStart = new Date(apt.inicio);
      const aptEnd = new Date(apt.fim);
      const [hour] = time.split(':').map(Number);
      const slotTime = new Date(currentDate);
      slotTime.setHours(hour, 0, 0, 0);
      return slotTime >= aptStart && slotTime < aptEnd;
    });

    if (!isSlotOccupied) {
      setSelectedTimeSlot(time);
      setIsCreateModalOpen(true);
      setIsEditModalOpen(false); // Garante que o modal de edição está fechado
      setSelectedAppointment(null); // Limpa qualquer agendamento selecionado
    }
  };

  // Função para fechar o modal e limpar a seleção
  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedTimeSlot(null);
    setSelectedAppointment(null); // Limpa o agendamento selecionado ao fechar
  };

  if (companyLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className={`text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          <div className="flex items-center">
            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Carregando dados da empresa...
          </div>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <div className={`text-lg text-center ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
          Não foi possível carregar os dados da empresa
        </div>
        {error && (
          <div className="text-center text-red-500 max-w-md">
            <div className="font-semibold mb-2">Erro:</div>
            <div className="text-sm bg-red-100 border border-red-200 rounded-lg p-3">
              {error}
            </div>
          </div>
        )}
        <div className={`mt-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Por favor, verifique se você está logado com uma conta que possui uma empresa vinculada.
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 md:mb-8">
        <div>
          <h1 className={`text-lg md:text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {company.nome}
          </h1>
          <div className="relative mt-4 md:mt-2">
            {selectedProfessional && (
              <button
                onClick={() => setShowProfessionalDropdown(!showProfessionalDropdown)}
                className={`flex items-center p-2 rounded-lg transition-colors duration-200 w-full md:w-auto ${
                  darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                }`}
              >
                <img
                  src={selectedProfessional.foto}
                  alt={selectedProfessional.nome}
                  className="w-8 h-8 rounded-full mr-3"
                />
                <div className="flex-1 md:flex-initial">
                  <h2 className={`text-sm md:text-base font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedProfessional.nome}
                  </h2>
                  <p className={`text-xs md:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {selectedProfessional.profissao}
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 ml-2" />
              </button>
            )}

            {/* Dropdown Menu */}
            {showProfessionalDropdown && (
              <div className={`absolute z-10 mt-2 w-full md:w-72 rounded-lg shadow-lg ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                {professionals.map((professional) => (
                  <button
                    key={professional.id}
                    onClick={() => {
                      setSelectedProfessional(professional);
                      setShowProfessionalDropdown(false);
                    }}
                    className={`flex items-center w-full p-3 hover:bg-gray-100 transition-colors duration-200 ${
                      darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <img
                      src={professional.foto}
                      alt={professional.nome}
                      className="w-8 h-8 rounded-full mr-3"
                    />
                    <div className="text-left">
                      <h3 className={`text-sm md:text-base font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {professional.nome}
                      </h3>
                      <p className={`text-xs md:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {professional.profissao}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 md:gap-4">
          <button className={`p-2 rounded-lg flex-1 md:flex-none ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
            <Filter className="w-5 h-5 text-gray-500 mx-auto md:mx-0" />
          </button>
          <button className={`p-2 rounded-lg flex-1 md:flex-none ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
            <Search className="w-5 h-5 text-gray-500 mx-auto md:mx-0" />
          </button>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-[#4A148C] hover:bg-[#6A1B9A] text-white px-4 md:px-6 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center flex-1 md:flex-none"
          >
            <Plus className="w-5 h-5 md:mr-2" />
            <span className="hidden md:inline">Novo</span>
          </button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={() => {
              const newDate = new Date(currentDate);
              newDate.setDate(newDate.getDate() - 7);
              setCurrentDate(newDate);
            }}
            className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className={`text-base md:text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {format(currentDate, "MMMM 'de' yyyy", { locale: ptBR })}
          </div>
          <button
            onClick={() => {
              const newDate = new Date(currentDate);
              newDate.setDate(newDate.getDate() + 7);
              setCurrentDate(newDate);
            }}
            className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Carregando agendamentos...
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">
          {error}
        </div>
      ) : (
        /* Calendar Grid */
        <div className="overflow-x-auto pb-4">
          <div className="grid grid-cols-8 gap-2 md:gap-4 min-w-[800px]">
            {/* Time column */}
            <div className="space-y-6 pt-20 mt-8"> 
              {timeSlots.map((time) => (
                <div
                  key={time}
                  className={`text-xs md:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} text-right pr-2 md:pr-4`}
                >
                  {time}
                </div>
              ))}
            </div>

            {/* Days columns */}
            {weekDates.map((date, index) => (
              <div key={index} className="flex-1">
                {/* Day header */}
                <div className={`text-center p-2 md:p-4 rounded-lg ${
                  date.getDate() === new Date().getDate()
                    ? 'bg-[#4A148C] text-white'
                    : darkMode
                    ? 'bg-gray-800'
                    : 'bg-white'
                }`}>
                  <div className={`text-xs md:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {weekDays[date.getDay()]}
                  </div>
                  <div className="text-lg md:text-2xl font-bold mt-1">
                    {date.getDate()}
                  </div>
                </div>

                {/* Appointments */}
                <div className="relative mt-4">
                  {appointments
                    .filter(apt => {
                      const aptDate = new Date(apt.inicio);
                      const currentDate = new Date(date);
                      
                      // Comparar apenas as datas, ignorando o horário
                      const isSameDay = 
                        aptDate.getFullYear() === currentDate.getFullYear() &&
                        aptDate.getMonth() === currentDate.getMonth() &&
                        aptDate.getDate() === currentDate.getDate();
                      
                      console.log('Comparando datas:', {
                        agendamento: {
                          cliente: apt.cliente,
                          data: aptDate.toLocaleDateString(),
                          hora: aptDate.toLocaleTimeString()
                        },
                        coluna: {
                          data: currentDate.toLocaleDateString()
                        },
                        mesmodia: isSameDay
                      });

                      return isSameDay;
                    })
                    .map((appointment) => {
                      // Converte a string ISO para objeto Date
                      const dataInicio = new Date(appointment.inicio);
                      const dataFim = new Date(appointment.fim);
                      
                      // Usa o horário local para exibição
                      const horaInicio = dataInicio.getHours();
                      const minutoInicio = dataInicio.getMinutes();
                      const horaFim = dataFim.getHours();
                      const minutoFim = dataFim.getMinutes();

                      // Mapa de posições para cada hora
                      const POSICOES = {
                        8: 0,    // 08:00
                        9: 47,   // 09:00
                        10: 94,  // 10:00
                        11: 141, // 11:00
                        12: 188, // 12:00
                        13: 235, // 13:00
                        14: 282, // 14:00
                        15: 329, // 15:00
                        16: 376, // 16:00
                        17: 423, // 17:00
                        18: 470, // 18:00
                        19: 517  // 19:00
                      };
                      
                      // Pega a posição do topo baseado no mapa
                      const posicaoTopo = POSICOES[horaInicio] || 0;
                      
                      // Calcula a duração baseado na diferença das posições
                      const duracao = (POSICOES[horaFim] || 0) - posicaoTopo;

                      console.log('Renderizando agendamento:', {
                        cliente: appointment.cliente,
                        horarios: {
                          inicio: `${horaInicio}:${minutoInicio}`,
                          fim: `${horaFim}:${minutoFim}`,
                          posicaoInicio: posicaoTopo,
                          posicaoFim: POSICOES[horaFim]
                        },
                        posicao: {
                          topo: posicaoTopo,
                          duracao: duracao
                        }
                      });

                      return (
                        <div
                          key={appointment.id}
                          onClick={(e) => {
                            e.stopPropagation(); // Evita propagação do clique
                            setSelectedAppointment(appointment);
                            setIsEditModalOpen(true);
                            setIsCreateModalOpen(false); // Garante que o modal de criação está fechado
                          }}
                          className={`absolute left-0 right-0 mx-1 p-2 rounded-lg cursor-pointer border border-purple-200 shadow-sm hover:shadow-md transition-shadow ${
                            darkMode 
                              ? 'bg-purple-900 hover:bg-purple-800 border-purple-700 shadow-purple-900/50' 
                              : 'bg-purple-100 hover:bg-purple-200 border-purple-200 shadow-purple-200/50'
                          }`}
                          style={{
                            top: `${posicaoTopo}px`,
                            height: `${duracao}px`,
                            minHeight: '47px'
                          }}
                        >
                          <div className={`text-xs font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {appointment.cliente}
                          </div>
                          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {horaInicio.toString().padStart(2, '0')}:{minutoInicio.toString().padStart(2, '0')} - 
                            {horaFim.toString().padStart(2, '0')}:{minutoFim.toString().padStart(2, '0')}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Appointment Modal */}
      {isCreateModalOpen && !isEditModalOpen && (
        <AppointmentModal
          isOpen={isCreateModalOpen}
          onClose={() => {
            handleCloseModal();
            setSelectedAppointment(null);
          }}
          darkMode={darkMode}
          professional={{
            id: selectedProfessional?.id || 0,
            nome: selectedProfessional?.nome || '',
            profissao: selectedProfessional?.profissao || ''
          }}
          selectedDate={currentDate}
          selectedTime={selectedTimeSlot || undefined}
          onAppointmentCreated={fetchAgendamentos}
        />
      )}

      {/* Edit Appointment Modal */}
      {isEditModalOpen && selectedAppointment && !isCreateModalOpen && (
        <EditAppointmentModal
          isOpen={isEditModalOpen}
          onClose={() => {
            handleCloseModal();
            setSelectedAppointment(null);
          }}
          darkMode={darkMode}
          professional={{
            id: selectedProfessional?.id || 0,
            nome: selectedProfessional?.nome || '',
            profissao: selectedProfessional?.profissao || ''
          }}
          onAppointmentUpdated={fetchAgendamentos}
          appointment={selectedAppointment}
        />
      )}

      {/* Appointment Details Modal */}
      {selectedAppointment && !isEditModalOpen && !isCreateModalOpen && (
        <AppointmentDetailsModal
          isOpen={!!selectedAppointment && !isEditModalOpen && !isCreateModalOpen}
          onClose={() => setSelectedAppointment(null)}
          appointment={selectedAppointment}
          darkMode={darkMode}
        />
      )}
    </div>
  );
}