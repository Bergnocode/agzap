import React, { useState, useEffect } from 'react';
import { 
  Calendar,
  User,
  Search,
  Filter as FilterIcon,
  X,
  ChevronDown,
  RotateCcw,
  Clock,
  CalendarDays,
  CalendarRange
} from 'lucide-react';

interface FilterState {
  dateRange: {
    start: string;
    end: string;
  };
  viewMode: 'day' | 'week' | 'month';
  professional: {
    name: string;
    specialty: string;
    status: 'all' | 'active' | 'inactive';
  };
  appointmentId: string;
  sortBy: 'name' | 'specialty' | 'date';
  sortOrder: 'asc' | 'desc';
}

interface SearchHistory {
  id: string;
  timestamp: number;
}

export default function Filtros({ darkMode }: { darkMode: boolean }) {
  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    dateRange: {
      start: '',
      end: ''
    },
    viewMode: 'week',
    professional: {
      name: '',
      specialty: '',
      status: 'all'
    },
    appointmentId: '',
    sortBy: 'date',
    sortOrder: 'desc'
  });

  // Search history state
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [showFilters, setShowFilters] = useState(true);
  const [resultsCount, setResultsCount] = useState(0);

  // Load last filters from session storage
  useEffect(() => {
    const savedFilters = sessionStorage.getItem('appointmentFilters');
    if (savedFilters) {
      setFilters(JSON.parse(savedFilters));
    }
  }, []);

  // Save filters to session storage when they change
  useEffect(() => {
    sessionStorage.setItem('appointmentFilters', JSON.stringify(filters));
    // Simulate API call to update results
    updateResults();
  }, [filters]);

  // Simulate API call to get results count
  const updateResults = () => {
    // This would be replaced with actual API call
    setTimeout(() => {
      setResultsCount(Math.floor(Math.random() * 100) + 1);
    }, 300);
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      dateRange: {
        start: '',
        end: ''
      },
      viewMode: 'week',
      professional: {
        name: '',
        specialty: '',
        status: 'all'
      },
      appointmentId: '',
      sortBy: 'date',
      sortOrder: 'desc'
    });
  };

  // Add ID to search history
  const addToSearchHistory = (id: string) => {
    setSearchHistory(prev => {
      const newHistory = [
        { id, timestamp: Date.now() },
        ...prev.filter(item => item.id !== id)
      ].slice(0, 5);
      return newHistory;
    });
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Filtros de Agendamentos
          </h1>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {resultsCount} resultados encontrados
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={resetFilters}
            className={`px-4 py-2 rounded-lg border ${
              darkMode 
                ? 'border-gray-700 text-gray-300 hover:bg-gray-800' 
                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            } flex items-center gap-2`}
          >
            <RotateCcw className="w-4 h-4" />
            Limpar Filtros
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <FilterIcon className="w-4 h-4" />
            {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
          </button>
        </div>
      </div>

      {showFilters && (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 mb-8`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Período */}
            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                <Calendar className="w-4 h-4 inline-block mr-2" />
                Período
              </label>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <input
                    type="date"
                    value={filters.dateRange.start}
                    onChange={(e) => setFilters({
                      ...filters,
                      dateRange: { ...filters.dateRange, start: e.target.value }
                    })}
                    className={`w-full rounded-lg border ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-200 text-gray-900'
                    } px-4 py-2 focus:ring-2 focus:ring-primary focus:ring-opacity-50`}
                  />
                  <input
                    type="date"
                    value={filters.dateRange.end}
                    onChange={(e) => setFilters({
                      ...filters,
                      dateRange: { ...filters.dateRange, end: e.target.value }
                    })}
                    className={`w-full rounded-lg border ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-200 text-gray-900'
                    } px-4 py-2 focus:ring-2 focus:ring-primary focus:ring-opacity-50`}
                  />
                </div>
                <div className="flex gap-2">
                  {(['day', 'week', 'month'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setFilters({ ...filters, viewMode: mode })}
                      className={`flex-1 px-4 py-2 rounded-lg text-sm ${
                        filters.viewMode === mode
                          ? 'bg-primary text-white'
                          : darkMode
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      } transition-colors duration-200`}
                    >
                      {mode === 'day' && <Clock className="w-4 h-4 inline-block mr-1" />}
                      {mode === 'week' && <CalendarDays className="w-4 h-4 inline-block mr-1" />}
                      {mode === 'month' && <CalendarRange className="w-4 h-4 inline-block mr-1" />}
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Profissional */}
            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                <User className="w-4 h-4 inline-block mr-2" />
                Profissional
              </label>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Nome do profissional"
                  value={filters.professional.name}
                  onChange={(e) => setFilters({
                    ...filters,
                    professional: { ...filters.professional, name: e.target.value }
                  })}
                  className={`w-full rounded-lg border ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                  } px-4 py-2 focus:ring-2 focus:ring-primary focus:ring-opacity-50`}
                />
                <input
                  type="text"
                  placeholder="Especialidade"
                  value={filters.professional.specialty}
                  onChange={(e) => setFilters({
                    ...filters,
                    professional: { ...filters.professional, specialty: e.target.value }
                  })}
                  className={`w-full rounded-lg border ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                  } px-4 py-2 focus:ring-2 focus:ring-primary focus:ring-opacity-50`}
                />
                <select
                  value={filters.professional.status}
                  onChange={(e) => setFilters({
                    ...filters,
                    professional: { ...filters.professional, status: e.target.value as 'all' | 'active' | 'inactive' }
                  })}
                  className={`w-full rounded-lg border ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-200 text-gray-900'
                  } px-4 py-2 focus:ring-2 focus:ring-primary focus:ring-opacity-50`}
                >
                  <option value="all">Todos os status</option>
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
              </div>
            </div>

            {/* ID do Agendamento */}
            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                <Search className="w-4 h-4 inline-block mr-2" />
                ID do Agendamento
              </label>
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar por ID"
                    value={filters.appointmentId}
                    onChange={(e) => {
                      setFilters({ ...filters, appointmentId: e.target.value });
                      if (e.target.value) {
                        addToSearchHistory(e.target.value);
                      }
                    }}
                    className={`w-full rounded-lg border ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                    } px-4 py-2 focus:ring-2 focus:ring-primary focus:ring-opacity-50`}
                  />
                  {filters.appointmentId && (
                    <button
                      onClick={() => setFilters({ ...filters, appointmentId: '' })}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {searchHistory.length > 0 && (
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <p className="mb-2">Pesquisas recentes:</p>
                    <div className="flex flex-wrap gap-2">
                      {searchHistory.map((item) => (
                        <button
                          key={item.timestamp}
                          onClick={() => setFilters({ ...filters, appointmentId: item.id })}
                          className={`px-2 py-1 rounded-lg ${
                            darkMode
                              ? 'bg-gray-700 hover:bg-gray-600'
                              : 'bg-gray-100 hover:bg-gray-200'
                          } transition-colors duration-200`}
                        >
                          {item.id}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Ordenação */}
          <div className="mt-6 flex items-center gap-4">
            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Ordenar por:
            </span>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({
                ...filters,
                sortBy: e.target.value as 'name' | 'specialty' | 'date'
              })}
              className={`rounded-lg border ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-200 text-gray-900'
              } px-4 py-2 focus:ring-2 focus:ring-primary focus:ring-opacity-50`}
            >
              <option value="name">Nome</option>
              <option value="specialty">Especialidade</option>
              <option value="date">Data</option>
            </select>
            <button
              onClick={() => setFilters({
                ...filters,
                sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc'
              })}
              className={`p-2 rounded-lg ${
                darkMode
                  ? 'hover:bg-gray-700'
                  : 'hover:bg-gray-100'
              } transition-colors duration-200`}
            >
              <ChevronDown
                className={`w-5 h-5 transform transition-transform duration-200 ${
                  filters.sortOrder === 'desc' ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}