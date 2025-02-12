import React from 'react';
import { Bell, AlertTriangle, MessageSquare, Calendar, Info, Settings, Clock } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface Notification {
  id: number;
  type: 'alert' | 'message' | 'reminder' | 'update';
  title: string;
  description: string;
  time: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
}

const notifications: Notification[] = [
  {
    id: 1,
    type: 'alert',
    title: 'Sistema em Manutenção',
    description: 'Manutenção programada para hoje às 23h',
    time: '2024-03-15T10:00:00',
    read: false,
    priority: 'high'
  },
  {
    id: 2,
    type: 'message',
    title: 'Nova mensagem do sistema',
    description: 'Atualização de segurança disponível',
    time: '2024-03-15T09:30:00',
    read: true,
    priority: 'medium'
  },
  {
    id: 3,
    type: 'reminder',
    title: 'Lembrete de Consulta',
    description: 'Consulta com Dr. João em 1 hora',
    time: '2024-03-15T09:00:00',
    read: false,
    priority: 'high'
  },
  {
    id: 4,
    type: 'update',
    title: 'Nova Atualização',
    description: 'Versão 2.0 disponível com novos recursos',
    time: '2024-03-14T16:00:00',
    read: true,
    priority: 'low'
  }
];

export default function Notificacoes() {
  const { darkMode } = useTheme();

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Notificações
          </h1>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Gerencie suas notificações e alertas
          </p>
        </div>
        <button className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          Configurar Notificações
        </button>
      </div>

      {/* Filtros Rápidos */}
      <div className={`flex space-x-4 mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        <button className="flex items-center px-4 py-2 rounded-lg bg-primary bg-opacity-10 text-primary">
          <AlertTriangle className="w-4 h-4 mr-2" />
          Prioritários
        </button>
        <button className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
          <MessageSquare className="w-4 h-4 mr-2" />
          Mensagens
        </button>
        <button className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
          <Calendar className="w-4 h-4 mr-2" />
          Lembretes
        </button>
        <button className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
          <Info className="w-4 h-4 mr-2" />
          Atualizações
        </button>
      </div>

      {/* Lista de Notificações */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg`}>
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-6 border-b ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            } ${!notification.read ? (darkMode ? 'bg-gray-700' : 'bg-gray-50') : ''} 
            hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200`}
          >
            <div className="flex items-start">
              {/* Ícone */}
              <div className={`p-2 rounded-lg mr-4 ${
                notification.type === 'alert'
                  ? 'bg-red-100 text-red-600'
                  : notification.type === 'message'
                  ? 'bg-blue-100 text-blue-600'
                  : notification.type === 'reminder'
                  ? 'bg-yellow-100 text-yellow-600'
                  : 'bg-green-100 text-green-600'
              }`}>
                {notification.type === 'alert' && <AlertTriangle className="w-6 h-6" />}
                {notification.type === 'message' && <MessageSquare className="w-6 h-6" />}
                {notification.type === 'reminder' && <Calendar className="w-6 h-6" />}
                {notification.type === 'update' && <Info className="w-6 h-6" />}
              </div>

              {/* Conteúdo */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {notification.title}
                  </h3>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <Clock className="w-4 h-4 inline-block mr-1" />
                    {new Date(notification.time).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {notification.description}
                </p>
                {notification.priority === 'high' && (
                  <span className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Prioritário
                  </span>
                )}
              </div>

              {/* Status */}
              {!notification.read && (
                <div className="w-2 h-2 bg-primary rounded-full"></div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}