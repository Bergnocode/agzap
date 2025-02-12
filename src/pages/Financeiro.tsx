import React from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  CreditCard,
  Download,
  PieChart,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const financialData = [
  { month: 'Jan', receitas: 4000, despesas: 2400 },
  { month: 'Fev', receitas: 3000, despesas: 1398 },
  { month: 'Mar', receitas: 5000, despesas: 3800 },
  { month: 'Abr', receitas: 2780, despesas: 3908 },
  { month: 'Mai', receitas: 1890, despesas: 4800 },
  { month: 'Jun', receitas: 2390, despesas: 3800 },
];

const transactions = [
  {
    id: 1,
    description: 'Pagamento - Cliente João Silva',
    amount: 350.00,
    type: 'receita',
    date: '2024-03-15',
    status: 'completed'
  },
  {
    id: 2,
    description: 'Fornecedor - Material de Escritório',
    amount: 150.00,
    type: 'despesa',
    date: '2024-03-14',
    status: 'pending'
  },
  {
    id: 3,
    description: 'Assinatura - Software',
    amount: 89.90,
    type: 'despesa',
    date: '2024-03-13',
    status: 'completed'
  }
];

export default function Financeiro({ darkMode }: { darkMode: boolean }) {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Financeiro
          </h1>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Gestão financeira e fluxo de caixa
          </p>
        </div>
        <button className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center">
          <Download className="w-5 h-5 mr-2" />
          Exportar Relatório
        </button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            title: 'Saldo Atual',
            value: 'R$ 45.850,00',
            change: '+15.3%',
            icon: DollarSign,
            trend: 'up'
          },
          {
            title: 'Receitas',
            value: 'R$ 58.250,00',
            change: '+12.5%',
            icon: TrendingUp,
            trend: 'up'
          },
          {
            title: 'Despesas',
            value: 'R$ 12.400,00',
            change: '-8.2%',
            icon: TrendingDown,
            trend: 'down'
          },
          {
            title: 'Projeção Mensal',
            value: 'R$ 62.000,00',
            change: '+18.3%',
            icon: PieChart,
            trend: 'up'
          }
        ].map((item, index) => (
          <div
            key={index}
            className={`${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } p-6 rounded-xl shadow-lg`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {item.title}
              </h3>
              <item.icon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {item.value}
                </p>
                <div className="flex items-center mt-2">
                  {item.trend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4 text-primary mr-1" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${
                    item.trend === 'up' ? 'text-primary' : 'text-red-500'
                  }`}>
                    {item.change}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Gráfico de Fluxo de Caixa */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg mb-8`}>
        <h3 className={`text-lg font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Fluxo de Caixa
        </h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={financialData}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="month" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
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
                dataKey="receitas"
                stroke="#00D856"
                strokeWidth={2}
                dot={{ fill: '#00D856', strokeWidth: 2 }}
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="despesas"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ fill: '#ef4444', strokeWidth: 2 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Últimas Transações */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
        <h3 className={`text-lg font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Últimas Transações
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`${
                darkMode ? 'bg-gray-700' : 'bg-gray-50'
              } border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Descrição</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Data</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Valor</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className={`${
                    darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                  } transition-colors duration-200`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg mr-3 ${
                        transaction.type === 'receita'
                          ? 'bg-primary bg-opacity-10'
                          : 'bg-red-100'
                      }`}>
                        {transaction.type === 'receita' ? (
                          <TrendingUp className={`w-5 h-5 ${
                            transaction.type === 'receita' ? 'text-primary' : 'text-red-500'
                          }`} />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                      <div>
                        <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {transaction.description}
                        </div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {transaction.type === 'receita' ? 'Receita' : 'Despesa'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {new Date(transaction.date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-medium ${
                      transaction.type === 'receita'
                        ? 'text-primary'
                        : 'text-red-500'
                    }`}>
                      {transaction.type === 'receita' ? '+' : '-'}
                      R$ {transaction.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      transaction.status === 'completed'
                        ? 'bg-primary bg-opacity-10 text-primary'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {transaction.status === 'completed' ? 'Concluído' : 'Pendente'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}