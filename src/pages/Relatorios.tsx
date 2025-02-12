import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Download, FileText } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const performanceData = [
  { name: 'Jan', atendimentos: 400, receita: 2400, satisfacao: 85 },
  { name: 'Fev', atendimentos: 300, receita: 1398, satisfacao: 90 },
  { name: 'Mar', atendimentos: 500, receita: 3800, satisfacao: 88 },
  { name: 'Abr', atendimentos: 278, receita: 3908, satisfacao: 92 },
  { name: 'Mai', atendimentos: 189, receita: 4800, satisfacao: 95 },
  { name: 'Jun', atendimentos: 239, receita: 3800, satisfacao: 87 },
];

export default function Relatorios() {
  const { darkMode } = useTheme();

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Relatórios
          </h1>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Relatórios disponíveis para download
          </p>
        </div>
        <button className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center">
          <Download className="w-5 h-5 mr-2" />
          Baixar Relatório
        </button>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Gráfico de Atendimentos */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
          <h3 className={`text-lg font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Atendimentos por Mês
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                <XAxis dataKey="name" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                    border: 'none',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                  labelStyle={{ color: darkMode ? '#ffffff' : '#000000' }}
                />
                <Bar dataKey="atendimentos" fill="#00D856" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Satisfação */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
          <h3 className={`text-lg font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Índice de Satisfação
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                <XAxis dataKey="name" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                    border: 'none',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                  labelStyle={{ color: darkMode ? '#ffffff' : '#000000' }}
                />
                <Line
                  type="monotone"
                  dataKey="satisfacao"
                  stroke="#00D856"
                  strokeWidth={2}
                  dot={{ fill: '#00D856', strokeWidth: 2 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}