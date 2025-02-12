import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

interface LiveChatButtonProps {
  darkMode: boolean;
}

export default function LiveChatButton({ darkMode }: LiveChatButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className={`absolute bottom-16 right-0 w-80 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } rounded-lg shadow-lg p-4 mb-4 transform transition-all duration-300 ease-in-out animate-fade-in`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Chat ao Vivo
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className={`p-1 rounded-lg ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className={`${
            darkMode ? 'bg-gray-700' : 'bg-gray-50'
          } rounded-lg p-4 mb-4 h-64 overflow-y-auto`}>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Como posso ajudar você hoje?
            </p>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Digite sua mensagem..."
              className={`flex-1 rounded-lg border ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
              } px-3 py-2 focus:ring-2 focus:ring-primary focus:ring-opacity-50`}
            />
            <button className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg transition-colors duration-200">
              Enviar
            </button>
          </div>
        </div>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${
          isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary-hover'
        } text-white p-4 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110`}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>
    </div>
  );
}