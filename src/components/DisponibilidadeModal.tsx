import React from 'react';
import { X } from 'lucide-react';

interface Disponibilidade {
  id: number;
  dia_semana: string;
  hora_inicio: string;
  hora_fim: string;
  ativo: boolean;
}

interface DisponibilidadeModalProps {
  isOpen: boolean;
  onClose: () => void;
  disponibilidade: Disponibilidade[];
  nomeProfissional: string;
}

const DisponibilidadeModal: React.FC<DisponibilidadeModalProps> = ({
  isOpen,
  onClose,
  disponibilidade,
  nomeProfissional
}) => {
  if (!isOpen) return null;

  const diasTraduzidos: { [key: string]: string } = {
    'segunda': 'Segunda-feira',
    'terca': 'Terça-feira',
    'quarta': 'Quarta-feira',
    'quinta': 'Quinta-feira',
    'sexta': 'Sexta-feira',
    'sabado': 'Sábado',
    'domingo': 'Domingo'
  };

  // Ordenar os dias da semana
  const ordemDias = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'];
  const disponibilidadeOrdenada = [...disponibilidade].sort((a, b) => 
    ordemDias.indexOf(a.dia_semana) - ordemDias.indexOf(b.dia_semana)
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Disponibilidade de {nomeProfissional}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {disponibilidadeOrdenada.length > 0 ? (
            disponibilidadeOrdenada.map((disp) => (
              <div
                key={disp.id}
                className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="font-medium text-gray-900 dark:text-white">
                  {diasTraduzidos[disp.dia_semana]}
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  {disp.hora_inicio.slice(0, 5)} às {disp.hora_fim.slice(0, 5)}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-red-500 dark:text-red-400 py-4 font-medium">
              Profissional sem horários disponíveis
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisponibilidadeModal;
