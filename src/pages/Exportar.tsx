import React, { useState } from 'react';
import {
  Download,
  FileText,
  Calendar,
  Settings,
  Clock,
  CheckCircle,
  File,
  Save,
  Filter,
  AlertCircle
} from 'lucide-react';

interface ExportHistory {
  id: number;
  name: string;
  type: string;
  date: string;
  size: string;
  status: 'completed' | 'processing' | 'failed';
}

const exportHistory: ExportHistory[] = [
  {
    id: 1,
    name: 'Relatório Mensal - Março 2024',
    type: 'PDF',
    date: '2024-03-15',
    size: '2.5 MB',
    status: 'completed'
  },
  {
    id: 2,
    name: 'Dados de Clientes',
    type: 'Excel',
    date: '2024-03-14',
    size: '1.8 MB',
    status: 'completed'
  },
  {
    id: 3,
    name: 'Análise Financeira',
    type: 'CSV',
    date: '2024-03-13',
    size: '956 KB',
    status: 'processing'
  }
];

const savedTemplates = [
  {
    id: 1,
    name: 'Template Padrão',
    description: 'Relatório completo com todas as métricas',
    fields: ['dados_cliente', 'financeiro', 'atendimentos']
  },
  {
    id: 2,
    name: 'Relatório Financeiro',
    description: 'Apenas dados financeiros e métricas',
    fields: ['receitas', 'despesas', 'projecoes']
  },
  {
    id: 3,
    name: 'Dados de Clientes',
    description: 'Informações detalhadas dos clientes',
    fields: ['perfil', 'historico', 'preferencias']
  }
];

export default function Exportar({ darkMode }: { darkMode: boolean }) {
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Exportar
          </h1>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Exporte seus dados em diferentes formatos
          </p>
        </div>
        <button className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center">
          <Download className="w-5 h-5 mr-2" />
          Iniciar Exportação
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Configurações de Exportação */}
        <div className="lg:col-span-2">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 mb-8`}>
            <h2 className={`text-lg font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Configurações de Exportação
            </h2>
            
            {/* Formato */}
            <div className="mb-6">
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Formato do Arquivo
              </label>
              <div className="grid grid-cols-3 gap-4">
                {['PDF', 'Excel', 'CSV'].map((format) => (
                  <button
                    key={format}
                    onClick={() => setSelectedFormat(format.toLowerCase())}
                    className={`flex items-center justify-center p-4 rounded-lg border ${
                      selectedFormat === format.toLowerCase()
                        ? 'border-primary bg-primary bg-opacity-10 text-primary'
                        : darkMode
                        ? 'border-gray-700 text-gray-300'
                        : 'border-gray-200 text-gray-600'
                    } hover:border-primary transition-colors duration-200`}
                  >
                    <File className="w-5 h-5 mr-2" />
                    {format}
                  </button>
                ))}
              </div>
            </div>

            {/* Período */}
            <div className="mb-6">
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Período
              </label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className={`rounded-lg border ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-200 text-gray-900'
                  } px-4 py-2 focus:ring-2 focus:ring-primary focus:ring-opacity-50`}
                />
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className={`rounded-lg border ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-200 text-gray-900'
                  } px-4 py-2 focus:ring-2 focus:ring-primary focus:ring-opacity-50`}
                />
              </div>
            </div>

            {/* Campos */}
            <div className="mb-6">
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Campos para Exportação
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['Dados Pessoais', 'Histórico', 'Financeiro', 'Atendimentos', 'Métricas', 'Anexos'].map((field) => (
                  <label
                    key={field}
                    className={`flex items-center p-3 rounded-lg border ${
                      darkMode ? 'border-gray-700' : 'border-gray-200'
                    } cursor-pointer hover:border-primary transition-colors duration-200`}
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                      checked={selectedFields.includes(field)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedFields([...selectedFields, field]);
                        } else {
                          setSelectedFields(selectedFields.filter(f => f !== field));
                        }
                      }}
                    />
                    <span className={`ml-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {field}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Agendamento */}
            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Agendamento
              </label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                />
                <span className={`ml-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Agendar exportação automática
                </span>
              </div>
            </div>
          </div>

          {/* Histórico de Exportações */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
            <h2 className={`text-lg font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Histórico de Exportações
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`${
                    darkMode ? 'bg-gray-700' : 'bg-gray-50'
                  } border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tamanho
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {exportHistory.map((item) => (
                    <tr
                      key={item.id}
                      className={`${
                        darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                      } transition-colors duration-200`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <FileText className={`w-5 h-5 mr-3 ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          }`} />
                          <span className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {item.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {new Date(item.date).toLocaleDateString('pt-BR')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {item.size}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.status === 'completed'
                            ? 'bg-primary bg-opacity-10 text-primary'
                            : item.status === 'processing'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.status === 'completed' && <CheckCircle className="w-4 h-4 mr-1" />}
                          {item.status === 'processing' && <Clock className="w-4 h-4 mr-1" />}
                          {item.status === 'failed' && <AlertCircle className="w-4 h-4 mr-1" />}
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {item.status === 'completed' && (
                          <button className="text-primary hover:text-primary-hover">
                            <Download className="w-5 h-5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Templates Salvos */}
        <div className="lg:col-span-1">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
            <h2 className={`text-lg font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Templates Salvos
            </h2>
            <div className="space-y-4">
              {savedTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`p-4 rounded-lg border ${
                    selectedTemplate === template.id
                      ? 'border-primary bg-primary bg-opacity-5'
                      : darkMode
                      ? 'border-gray-700'
                      : 'border-gray-200'
                  } cursor-pointer hover:border-primary transition-colors duration-200`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {template.name}
                    </h3>
                    <Settings className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                    {template.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {template.fields.map((field, index) => (
                      <span
                        key={index}
                        className={`text-xs px-2 py-1 rounded-full ${
                          darkMode
                            ? 'bg-gray-700 text-gray-300'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {field}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              <button className="w-full mt-4 flex items-center justify-center px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:bg-opacity-10 transition-colors duration-200">
                <Save className="w-4 h-4 mr-2" />
                Salvar Template Atual
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}