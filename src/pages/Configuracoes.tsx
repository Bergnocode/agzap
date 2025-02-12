import React, { useState } from 'react';
import {
  Settings,
  Building,
  Users,
  Link,
  Palette,
  Shield,
  Mail,
  Save,
  Edit,
  Lock,
  MessageSquare
} from 'lucide-react';
import WhatsAppIntegrationModal from '../components/WhatsAppIntegrationModal';
import { useTheme } from '../contexts/ThemeContext';

export default function Configuracoes() {
  const { darkMode } = useTheme();
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Configurações
          </h1>
          <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Gerencie as configurações do sistema
          </p>
        </div>
        <button className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center">
          <Save className="w-5 h-5 mr-2" />
          Salvar Alterações
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Perfil da Empresa */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
          <div className="flex items-center mb-6">
            <Building className="w-5 h-5 text-primary mr-2" />
            <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Perfil da Empresa
            </h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Nome da Empresa
              </label>
              <input
                type="text"
                defaultValue="AGZap Solutions"
                className={`w-full rounded-lg border ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } px-4 py-2 focus:ring-2 focus:ring-primary focus:ring-opacity-50`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                CNPJ
              </label>
              <input
                type="text"
                defaultValue="12.345.678/0001-90"
                className={`w-full rounded-lg border ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } px-4 py-2 focus:ring-2 focus:ring-primary focus:ring-opacity-50`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Endereço
              </label>
              <input
                type="text"
                defaultValue="Av. Paulista, 1000 - São Paulo, SP"
                className={`w-full rounded-lg border ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } px-4 py-2 focus:ring-2 focus:ring-primary focus:ring-opacity-50`}
              />
            </div>
          </div>
        </div>

        {/* Permissões de Usuários */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
          <div className="flex items-center mb-6">
            <Users className="w-5 h-5 text-primary mr-2" />
            <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Permissões de Usuários
            </h2>
          </div>
          <div className="space-y-4">
            {[
              { role: 'Administrador', description: 'Acesso total ao sistema' },
              { role: 'Gerente', description: 'Gerenciamento de equipe e relatórios' },
              { role: 'Atendente', description: 'Atendimento ao cliente' },
            ].map((permission, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  darkMode ? 'border-gray-700' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {permission.role}
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {permission.description}
                    </p>
                  </div>
                  <button className="p-2 text-primary hover:bg-primary hover:bg-opacity-10 rounded-lg transition-colors duration-200">
                    <Edit className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Integrações */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
          <div className="flex items-center mb-6">
            <Link className="w-5 h-5 text-primary mr-2" />
            <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Integrações
            </h2>
          </div>
          <div className="space-y-4">
            {[
              { name: 'WhatsApp Business API', status: 'Conectado', icon: MessageSquare },
              { name: 'Sistema de Pagamentos', status: 'Conectado', icon: Link },
              { name: 'CRM', status: 'Desconectado', icon: Users },
            ].map((integration, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  darkMode ? 'border-gray-700' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <integration.icon className={`w-5 h-5 mr-3 ${
                      integration.status === 'Conectado' ? 'text-primary' : 'text-gray-400'
                    }`} />
                    <div>
                      <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {integration.name}
                      </h3>
                      <span className={`text-sm ${
                        integration.status === 'Conectado'
                          ? 'text-primary'
                          : 'text-red-500'
                      }`}>
                        {integration.status}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => integration.name === 'WhatsApp Business API' && setIsWhatsAppModalOpen(true)}
                    className="p-2 text-primary hover:bg-primary hover:bg-opacity-10 rounded-lg transition-colors duration-200"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Segurança */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
          <div className="flex items-center mb-6">
            <Shield className="w-5 h-5 text-primary mr-2" />
            <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Segurança
            </h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Autenticação em Duas Etapas
              </label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <span className={`ml-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Ativar
                </span>
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Política de Senhas
              </label>
              <select
                className={`w-full rounded-lg border ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } px-4 py-2 focus:ring-2 focus:ring-primary focus:ring-opacity-50`}
              >
                <option>Forte (mínimo 12 caracteres)</option>
                <option>Média (mínimo 8 caracteres)</option>
                <option>Básica (mínimo 6 caracteres)</option>
              </select>
            </div>
            <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              <Lock className="w-4 h-4 mr-2" />
              Atualizar Configurações de Segurança
            </button>
          </div>
        </div>
      </div>

      {/* WhatsApp Integration Modal */}
      <WhatsAppIntegrationModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
        darkMode={darkMode}
      />
    </div>
  );
}