import React, { useState } from 'react';
import InputMask from 'react-input-mask';
import { 
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  MessageSquare,
  Save,
  X
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCompany } from '../contexts/CompanyContext';
import { toast } from 'react-toastify';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  selectedDate?: Date;
  selectedTime?: string;
  professional: {
    id: number;
    nome: string;
    profissao: string;
  };
  onAppointmentCreated: () => void;
}

export default function AppointmentModal({ 
  isOpen, 
  onClose, 
  darkMode, 
  professional,
  selectedDate: initialDate,
  selectedTime: initialTime,
  onAppointmentCreated 
}: AppointmentModalProps) {
  const { company } = useCompany();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    paciente: '',
    telefone: '',
    data: initialDate ? initialDate.toISOString().split('T')[0] : '',
    horarioInicio: initialTime || '',
    horarioFim: initialTime ? addHours(initialTime, 1) : '',
    observacoes: ''
  });

  const addHours = (time: string, hours: number): string => {
    const [h, m] = time.split(':').map(Number);
    const newHour = (h + hours) % 24;
    return `${String(newHour).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Se mudar o horário de início, atualiza o horário de fim automaticamente
    if (name === 'horarioInicio' && value) {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        horarioFim: addHours(value, 1)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      if (!company) {
        setError('Empresa não encontrada');
        return;
      }

      setLoading(true);
      setError(null);

      // Validações
      if (!formData.paciente || !formData.telefone || !formData.data || !formData.horarioInicio || !formData.horarioFim) {
        setError('Por favor, preencha todos os campos obrigatórios');
        return;
      }

      // Extrair e validar horários
      const [hora, minuto] = formData.horarioInicio.split(':').map(Number);
      const [horaFim, minutoFim] = formData.horarioFim.split(':').map(Number);

      // Validar se horário final é maior que inicial
      const inicioEmMinutos = hora * 60 + minuto;
      const fimEmMinutos = horaFim * 60 + minutoFim;

      if (fimEmMinutos <= inicioEmMinutos) {
        toast.error('O horário final deve ser maior que o horário inicial');
        return;
      }

      // Criar o agendamento
      const [ano, mes, dia] = formData.data.split('-').map(Number);
      
      // Cria as datas usando o horário local
      const dataInicio = new Date(ano, mes - 1, dia, hora, minuto);
      const dataFim = new Date(ano, mes - 1, dia, horaFim, minutoFim);

      console.log('Criando agendamento:', {
        data: formData.data,
        dataInicio: dataInicio.toISOString(),
        dataFim: dataFim.toISOString()
      });

      const { data, error: supabaseError } = await supabase
        .from('agendamentos')
        .insert([
          {
            id_empresa: company.id,
            id_profissional: professional.id,
            inicio: dataInicio.toISOString(),
            fim: dataFim.toISOString(),
            data_agendamento: dataInicio.toISOString(),
            cliente: formData.paciente,
            telefone: formData.telefone,
            "observações": formData.observacoes,
            tipo: 'consulta'
          }
        ])
        .select()
        .single();

      if (supabaseError) throw supabaseError;

      onAppointmentCreated();
      onClose();
      toast.success('Agendamento criado com sucesso!');
    } catch (err: any) {
      console.error('Erro ao criar agendamento:', err);
      setError(err.message || 'Erro ao criar agendamento');
      toast.error('Erro ao criar agendamento');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className={`relative w-full max-w-2xl rounded-xl shadow-lg ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } p-4 md:p-6`}>
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Novo Agendamento
              </h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {professional.nome} - {professional.profissao}
              </p>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-100 border border-red-200 text-red-700">
              {error}
            </div>
          )}

          {/* Form */}
          <div className="space-y-6">
            {/* Grid responsivo para campos do formulário */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  <User className="w-4 h-4 inline-block mr-2" />
                  Nome do Paciente
                </label>
                <input
                  type="text"
                  name="paciente"
                  value={formData.paciente}
                  onChange={handleInputChange}
                  className={`w-full rounded-lg border ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-200 text-gray-900'
                  } px-4 py-2 focus:ring-2 focus:ring-[#4A148C] focus:ring-opacity-50`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  <Phone className="w-4 h-4 inline-block mr-2" />
                  Telefone
                </label>
                <InputMask
                  mask="(99) 99999-9999"
                  type="tel"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleInputChange}
                  className={`w-full rounded-lg border ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-200 text-gray-900'
                  } px-4 py-2 focus:ring-2 focus:ring-[#4A148C] focus:ring-opacity-50`}
                  placeholder="(11) 91234-5678"
                />
              </div>
            </div>

            {/* Seleção de horário responsiva */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  <CalendarIcon className="w-4 h-4 inline-block mr-2" />
                  Data
                </label>
                <input
                  type="date"
                  name="data"
                  value={formData.data}
                  onChange={handleInputChange}
                  className={`w-full rounded-lg border ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-200 text-gray-900'
                  } px-4 py-2 focus:ring-2 focus:ring-[#4A148C] focus:ring-opacity-50`}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    <Clock className="w-4 h-4 inline-block mr-2" />
                    Início
                  </label>
                  <input
                    type="time"
                    name="horarioInicio"
                    value={formData.horarioInicio}
                    onChange={handleInputChange}
                    className={`w-full rounded-lg border ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-200 text-gray-900'
                    } px-4 py-2 focus:ring-2 focus:ring-[#4A148C] focus:ring-opacity-50`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    <Clock className="w-4 h-4 inline-block mr-2" />
                    Término
                  </label>
                  <input
                    type="time"
                    name="horarioFim"
                    value={formData.horarioFim}
                    onChange={handleInputChange}
                    className={`w-full rounded-lg border ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-200 text-gray-900'
                    } px-4 py-2 focus:ring-2 focus:ring-[#4A148C] focus:ring-opacity-50`}
                  />
                </div>
              </div>
            </div>

            {/* Observações */}
            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                <MessageSquare className="w-4 h-4 inline-block mr-2" />
                Observações
              </label>
              <textarea
                name="observacoes"
                value={formData.observacoes}
                onChange={handleInputChange}
                rows={4}
                className={`w-full rounded-lg border ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-200 text-gray-900'
                } px-4 py-2 focus:ring-2 focus:ring-[#4A148C] focus:ring-opacity-50`}
              />
            </div>

            {/* Botões de ação */}
            <div className="flex flex-col-reverse md:flex-row justify-end gap-4 mt-6">
              <button
                onClick={onClose}
                disabled={loading}
                className={`w-full md:w-auto px-4 py-2 rounded-lg border ${
                  darkMode ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-600'
                } hover:bg-gray-100 dark:hover:bg-gray-700`}
              >
                Cancelar
              </button>
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full md:w-auto bg-[#4A148C] hover:bg-[#6A1B9A] text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Agendando...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Agendar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}