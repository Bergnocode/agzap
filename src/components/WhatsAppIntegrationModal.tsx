import React, { useState } from 'react';
import { QrCode, X, Smartphone, Settings, Check } from 'lucide-react';

interface WhatsAppIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
}

export default function WhatsAppIntegrationModal({ isOpen, onClose, darkMode }: WhatsAppIntegrationModalProps) {
  const [isConnected, setIsConnected] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className={`relative w-full max-w-4xl rounded-xl shadow-lg ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } p-6`}>
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                WhatsApp
              </h2>
              <span className={`ml-3 px-3 py-1 rounded-full text-xs font-medium ${
                isConnected 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {isConnected ? 'Conectado' : 'Desconectado'}
              </span>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Instructions */}
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Conecte com seu celular
              </h3>
              <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Escaneie o código para usar o WhatsApp para prospecções
              </p>

              <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <ol className="space-y-4">
                  <li className="flex items-start">
                    <span className={`mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>1.</span>
                    <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Abra o WhatsApp no seu celular.
                    </p>
                  </li>
                  <li className="flex items-start">
                    <span className={`mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>2.</span>
                    <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Toque em <span className="font-medium">Mais opções</span> ou em{' '}
                      <span className="font-medium">Configurações</span> e selecione{' '}
                      <span className="font-medium">Aparelhos Conectados</span>.
                    </p>
                  </li>
                  <li className="flex items-start">
                    <span className={`mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>3.</span>
                    <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Toque em <span className="font-medium">Conectar um aparelho</span>.
                    </p>
                  </li>
                  <li className="flex items-start">
                    <span className={`mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>4.</span>
                    <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Aponte seu celular para esta tela para capturar o código.
                    </p>
                  </li>
                </ol>
              </div>
            </div>

            {/* Right Column - QR Code */}
            <div className="flex flex-col items-center justify-center">
              <div className={`p-8 rounded-lg ${darkMode ? 'bg-white' : 'bg-gray-50'}`}>
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=example" 
                  alt="WhatsApp QR Code"
                  className="w-64 h-64"
                />
              </div>
              <button
                onClick={() => setIsConnected(!isConnected)}
                className="mt-6 w-full flex items-center justify-center px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors duration-200"
              >
                {isConnected ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Já conectou? Verificar conexão!
                  </>
                ) : (
                  <>
                    <Smartphone className="w-5 h-5 mr-2" />
                    Verificar conexão
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