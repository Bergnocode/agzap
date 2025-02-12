import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Mail,
  MessageSquare,
  Save,
  X
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface TimeSlot {
  time: string;
  available: boolean;
}

export default function NovoAgendamento() {
  const { darkMode } = useTheme();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedProfessional, setSelectedProfessional] = useState('');

  // Mock de horários disponíveis
  const timeSlots: TimeSlot[] = [
    { time: '08:00', available: true },
    { time: '09:00', available: true },
    { time: '10:00', available: false },
    { time: '11:00', available: true },
    { time: '14:00', available: true },
    { time: '15:00', available: false },
    { time: '16:00', available: true },
  ];

  // Mock de profissionais
  const professionals = [
    { id: 1, name: 'Ana Lucia', specialty: 'Dentista', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3' },
    { id: 2, name: 'Wanderson Silveira', specialty: 'Médico', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3' },
    { id: 3, name: 'Gabriel', specialty: 'Técnico', image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3' },
  ];

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Novo Agendamento
            </h1>
            <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Agende uma nova consulta
            </p>
          </div>
          <div className="flex gap-4">
            <button className={`px-4 py-2 rounded-lg border ${
              darkMode ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-600'
            } hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2`}>
              <X className="w-5 h-5" />
              Cancelar
            </button>
            <button className="bg-[#4A148C] hover:bg-[#6A1B9A] text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2">
              <Save className="w-5 h-5" />
              Salvar Agendamento
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Formulário do Paciente */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
            <h2 className={`text-lg font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Informações do Paciente
            </h2>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  <User className="w-4 h-4 inline-block mr-2" />
                  Nome Completo
                </label>
                <input
                  type="text"
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
                <input
                  type="tel"
                  className={`w-full rounded-lg border ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-200 text-gray-900'
                  } px-4 py-2 focus:ring-2 focus:ring-[#4A148C] focus:ring-opacity-50`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  <Mail className="w-4 h-4 inline-block mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  className={`w-full rounded-lg border ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-200 text-gray-900'
                  } px-4 py-2 focus:ring-2 focus:ring-[#4A148C] focus:ring-opacity-50`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  <MessageSquare className="w-4 h-4 inline-block mr-2" />
                  Observações
                </label>
                <textarea
                  rows={4}
                  className={`w-full rounded-lg border ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-200 text-gray-900'
                  } px-4 py-2 focus:ring-2 focus:ring-[#4A148C] focus:ring-opacity-50`}
                />
              </div>
            </div>
          </div>

          {/* Seleção de Data e Profissional */}
          <div className="space-y-8">
            {/* Seleção de Profissional */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
              <h2 className={`text-lg font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Selecione o Profissional
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {professionals.map((professional) => (
                  <button
                    key={professional.id}
                    onClick={() => setSelectedProfessional(professional.name)}
                    className={`p-4 rounded-lg border ${
                      selectedProfessional === professional.name
                        ? 'border-[#4A148C] bg-[#4A148C] bg-opacity-10'
                        : darkMode
                        ? 'border-gray-700 hover:bg-gray-700'
                        : 'border-gray-200 hover:bg-gray-50'
                    } transition-colors duration-200`}
                  >
                    <div className="flex items-center">
                      <img
                        src={professional.image}
                        alt={professional.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="ml-4 text-left">
                        <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {professional.name}
                        </div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {professional.specialty}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Seleção de Data e Hora */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
              <h2 className={`text-lg font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Data e Horário
              </h2>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    <CalendarIcon className="w-4 h-4 inline-block mr-2" />
                    Data
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
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
                    Horário Disponível
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.time}
                        onClick={() => slot.available && setSelectedTime(slot.time)}
                        disabled={!slot.available}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                          selectedTime === slot.time
                            ? 'bg-[#4A148C] text-white'
                            : slot.available
                            ? darkMode
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                            : darkMode
                            ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}