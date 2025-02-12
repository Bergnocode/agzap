import React, { useState } from 'react';
import { 
  Calendar,
  Clock,
  User,
  Phone,
  MessageSquare,
  MapPin,
  X,
  Edit,
  Trash2,
  Save
} from 'lucide-react';

interface AppointmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  appointment: {
    id: string;
    patientName: string;
    time: string;
    duration: string;
    professional: string;
    status: 'scheduled' | 'completed' | 'cancelled';
    phone?: string;
    email?: string;
    notes?: string;
    address?: string;
  };
}

export default function AppointmentDetailsModal({ 
  isOpen, 
  onClose, 
  darkMode,
  appointment 
}: AppointmentDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    patientName: appointment.patientName,
    phone: appointment.phone || '',
    email: appointment.email || '',
    notes: appointment.notes || '',
    address: appointment.address || '',
    time: appointment.time,
    duration: appointment.duration
  });

  if (!isOpen) return null;

  const handleSave = () => {
    // Aqui você implementaria a lógica para salvar as alterações
    console.log('Dados editados:', editedData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedData({
      patientName: appointment.patientName,
      phone: appointment.phone || '',
      email: appointment.email || '',
      notes: appointment.notes || '',
      address: appointment.address || '',
      time: appointment.time,
      duration: appointment.duration
    });
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className={`relative w-full max-w-2xl rounded-xl shadow-lg ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } p-6`}>
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <div className="flex items-center">
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Detalhes do Agendamento
                </h2>
                <span className={`ml-3 px-3 py-1 rounded-full text-xs font-medium ${
                  appointment.status === 'scheduled'
                    ? 'bg-primary bg-opacity-10 text-primary'
                    : appointment.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {appointment.status === 'scheduled' ? 'Agendado' : 
                   appointment.status === 'completed' ? 'Concluído' : 'Cancelado'}
                </span>
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {appointment.professional}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className={`p-2 rounded-lg ${
                      darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    } text-primary`}
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    className={`p-2 rounded-lg ${
                      darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    } text-red-500`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className={`p-2 rounded-lg ${
                      darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    } text-primary`}
                  >
                    <Save className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleCancel}
                    className={`p-2 rounded-lg ${
                      darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    } text-red-500`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </>
              )}
              <button
                onClick={onClose}
                className={`p-2 rounded-lg ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Patient Info */}
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex items-center mb-4">
                <User className="w-5 h-5 mr-2 text-primary" />
                <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Informações do Paciente
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Nome
                  </p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.patientName}
                      onChange={(e) => setEditedData({...editedData, patientName: e.target.value})}
                      className={`w-full rounded-lg border ${
                        darkMode
                          ? 'bg-gray-600 border-gray-500 text-white'
                          : 'bg-white border-gray-200 text-gray-900'
                      } px-3 py-1 mt-1`}
                    />
                  ) : (
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {appointment.patientName}
                    </p>
                  )}
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Telefone
                  </p>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedData.phone}
                      onChange={(e) => setEditedData({...editedData, phone: e.target.value})}
                      className={`w-full rounded-lg border ${
                        darkMode
                          ? 'bg-gray-600 border-gray-500 text-white'
                          : 'bg-white border-gray-200 text-gray-900'
                      } px-3 py-1 mt-1`}
                    />
                  ) : (
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {appointment.phone || '-'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Appointment Info */}
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex items-center mb-4">
                <Calendar className="w-5 h-5 mr-2 text-primary" />
                <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Detalhes do Agendamento
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Horário
                  </p>
                  {isEditing ? (
                    <div className="flex gap-2 items-center mt-1">
                      <input
                        type="time"
                        value={editedData.time}
                        onChange={(e) => setEditedData({...editedData, time: e.target.value})}
                        className={`rounded-lg border ${
                          darkMode
                            ? 'bg-gray-600 border-gray-500 text-white'
                            : 'bg-white border-gray-200 text-gray-900'
                        } px-3 py-1`}
                      />
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>-</span>
                      <input
                        type="time"
                        value={editedData.duration}
                        onChange={(e) => setEditedData({...editedData, duration: e.target.value})}
                        className={`rounded-lg border ${
                          darkMode
                            ? 'bg-gray-600 border-gray-500 text-white'
                            : 'bg-white border-gray-200 text-gray-900'
                        } px-3 py-1`}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-primary" />
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {appointment.time} - {appointment.duration}
                      </p>
                    </div>
                  )}
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Local
                  </p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.address}
                      onChange={(e) => setEditedData({...editedData, address: e.target.value})}
                      className={`w-full rounded-lg border ${
                        darkMode
                          ? 'bg-gray-600 border-gray-500 text-white'
                          : 'bg-white border-gray-200 text-gray-900'
                      } px-3 py-1 mt-1`}
                    />
                  ) : (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-primary" />
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {appointment.address || 'Consultório Principal'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex items-center mb-4">
                <MessageSquare className="w-5 h-5 mr-2 text-primary" />
                <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Observações
                </h3>
              </div>
              {isEditing ? (
                <textarea
                  value={editedData.notes}
                  onChange={(e) => setEditedData({...editedData, notes: e.target.value})}
                  rows={3}
                  className={`w-full rounded-lg border ${
                    darkMode
                      ? 'bg-gray-600 border-gray-500 text-white'
                      : 'bg-white border-gray-200 text-gray-900'
                  } px-3 py-2`}
                />
              ) : (
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {appointment.notes || 'Sem observações'}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={onClose}
                className={`px-4 py-2 rounded-lg border ${
                  darkMode ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-600'
                } hover:bg-gray-100 dark:hover:bg-gray-700`}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}