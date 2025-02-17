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

interface EditAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  professional: {
    id: number;
    nome: string;
    profissao: string;
  };
  onAppointmentUpdated: () => void;
  appointment: {
    id: number;
    cliente: string;
    telefone: string;
    inicio: string;
    fim: string;
    observações: string;
  };
}

export default function EditAppointmentModal({ 
  isOpen, 
  onClose, 
  darkMode, 
  professional,
  onAppointmentUpdated,
  appointment 
}: EditAppointmentModalProps) {
  const { company } = useCompany();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    paciente: appointment.cliente,
    telefone: appointment.telefone,
    data: new Date(appointment.inicio).toISOString().split('T')[0],
    horarioInicio: new Date(appointment.inicio).toLocaleTimeString().slice(0, 5),
    horarioFim: new Date(appointment.fim).toLocaleTimeString().slice(0, 5),
    observacoes: appointment.observações
  });

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

      console.log('Atualizando agendamento:', {
        data: formData.data,
        dataInicio: dataInicio.toISOString(),
        dataFim: dataFim.toISOString()
      });

      const agendamentoData = {
        id_empresa: company.id,
        id_profissional: professional.id,
        inicio: dataInicio.toISOString(),
        fim: dataFim.toISOString(),
        data_agendamento: dataInicio.toISOString(),
        cliente: formData.paciente,
        telefone: formData.telefone,
        "observações": formData.observacoes,
        tipo: 'consulta'
      };

      const { data, error } = await supabase
        .from('agendamentos')
        .update(agendamentoData)
        .eq('id', appointment.id)
        .select()
        .single();

      if (error) throw error;

      toast.success('Agendamento atualizado com sucesso!');
      onAppointmentUpdated();
      onClose();
    } catch (err: any) {
      console.error('Erro ao atualizar agendamento:', err);
      setError(err.message || 'Erro ao atualizar agendamento');
      toast.error('Erro ao atualizar agendamento');
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
                Editar Agendamento
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
            {/* Nome do Paciente */}
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <User className="w-4 h-4 inline mr-2" />
                Nome do Paciente
              </label>
              <input
                type="text"
                value={formData.paciente}
                onChange={(e) => setFormData(prev => ({ ...prev, paciente: e.target.value }))}
                className={`w-full p-2 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
                } focus:outline-none focus:ring-1 focus:ring-purple-500`}
              />
            </div>

            {/* Telefone */}
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <Phone className="w-4 h-4 inline mr-2" />
                Telefone
              </label>
              <InputMask
                mask="(99) 99999-9999"
                value={formData.telefone}
                onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                className={`w-full p-2 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
                } focus:outline-none focus:ring-1 focus:ring-purple-500`}
              />
            </div>

            {/* Grid para Data e Horários */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Data */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <CalendarIcon className="w-4 h-4 inline mr-2" />
                  Data
                </label>
                <input
                  type="date"
                  value={formData.data}
                  onChange={(e) => setFormData(prev => ({ ...prev, data: e.target.value }))}
                  className={`w-full p-2 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
                  } focus:outline-none focus:ring-1 focus:ring-purple-500`}
                />
              </div>

              {/* Horário Início */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <Clock className="w-4 h-4 inline mr-2" />
                  Início
                </label>
                <input
                  type="time"
                  value={formData.horarioInicio}
                  onChange={(e) => setFormData(prev => ({ ...prev, horarioInicio: e.target.value }))}
                  className={`w-full p-2 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
                  } focus:outline-none focus:ring-1 focus:ring-purple-500`}
                />
              </div>

              {/* Horário Fim */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <Clock className="w-4 h-4 inline mr-2" />
                  Término
                </label>
                <input
                  type="time"
                  value={formData.horarioFim}
                  onChange={(e) => setFormData(prev => ({ ...prev, horarioFim: e.target.value }))}
                  className={`w-full p-2 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
                  } focus:outline-none focus:ring-1 focus:ring-purple-500`}
                />
              </div>
            </div>

            {/* Observações */}
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <MessageSquare className="w-4 h-4 inline mr-2" />
                Observações
              </label>
              <textarea
                value={formData.observacoes}
                onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                className={`w-full p-2 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
                } focus:outline-none focus:ring-1 focus:ring-purple-500`}
                rows={3}
              />
            </div>

            {/* Botões */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={onClose}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  darkMode
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                }`}
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2 text-sm font-medium"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
