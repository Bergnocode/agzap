import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, UserCheck, Mail, Building2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useCompany } from '../contexts/CompanyContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DadosGrafico {
  name: string;
  value: number;
}

export default function Dashboard() {
  const { darkMode } = useTheme();
  const { company } = useCompany();
  const { user } = useAuth();
  const [agendamentosHoje, setAgendamentosHoje] = useState(0);
  const [totalClientes, setTotalClientes] = useState(0);
  const [agendamentosSemana, setAgendamentosSemana] = useState(0);
  const [agendamentosMes, setAgendamentosMes] = useState(0);
  const [agendamentosProximos, setAgendamentosProximos] = useState(0);
  const [agendamentosRealizados, setAgendamentosRealizados] = useState(0);
  const [dadosGrafico, setDadosGrafico] = useState<DadosGrafico[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (company?.id) {
      buscarDados();
    }
  }, [company]);

  const buscarDados = async () => {
    try {
      setLoading(true);
      await Promise.all([
        buscarAgendamentosHoje(),
        buscarTotalClientes(),
        buscarAgendamentosSemana(),
        buscarAgendamentosMes(),
        buscarAgendamentosProximos(),
        buscarAgendamentosRealizados(),
        buscarDadosGrafico()
      ]);
    } finally {
      setLoading(false);
    }
  };

  const buscarDadosGrafico = async () => {
    try {
      const hoje = new Date();
      const inicioSemana = startOfWeek(hoje, { weekStartsOn: 0 });
      const fimSemana = endOfWeek(hoje, { weekStartsOn: 0 });
      
      // Gera array com todos os dias da semana
      const diasDaSemana = eachDayOfInterval({ start: inicioSemana, end: fimSemana });

      // Busca agendamentos da semana
      const { data: agendamentos, error } = await supabase
        .from('agendamentos')
        .select('inicio')
        .eq('id_empresa', company?.id)
        .gte('inicio', inicioSemana.toISOString())
        .lte('inicio', fimSemana.toISOString());

      if (error) {
        console.error('Erro ao buscar dados do gráfico:', error);
        return;
      }

      // Processa os dados para o gráfico
      const dados = diasDaSemana.map(dia => {
        const dataFormatada = format(dia, 'yyyy-MM-dd');
        const agendamentosDia = agendamentos?.filter(a => 
          a.inicio.startsWith(dataFormatada)
        ) || [];

        return {
          name: format(dia, 'dd/MM', { locale: ptBR }),
          value: agendamentosDia.length
        };
      });

      console.log('Dados do gráfico:', dados);
      setDadosGrafico(dados);
    } catch (error) {
      console.error('Erro ao buscar dados do gráfico:', error);
    }
  };

  const buscarAgendamentosHoje = async () => {
    try {
      const hoje = new Date();
      const inicioHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 0, 0, 0).toISOString();
      const fimHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 23, 59, 59).toISOString();

      console.log('Buscando agendamentos entre:', { inicioHoje, fimHoje });

      const { data: agendamentos, error } = await supabase
        .from('agendamentos')
        .select('id, data_agendamento, inicio, fim, cliente')
        .eq('id_empresa', company?.id)
        .gte('inicio', inicioHoje)
        .lte('inicio', fimHoje);

      if (error) {
        console.error('Erro ao buscar agendamentos:', error);
        return;
      }

      console.log('Agendamentos encontrados:', agendamentos);
      setAgendamentosHoje(agendamentos?.length || 0);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
    }
  };

  const buscarTotalClientes = async () => {
    try {
      // Busca todos os clientes únicos pelos agendamentos
      const { data: agendamentos, error } = await supabase
        .from('agendamentos')
        .select('cliente')
        .eq('id_empresa', company?.id)
        .not('cliente', 'is', null);

      if (error) {
        console.error('Erro ao buscar clientes:', error);
        return;
      }

      // Filtra clientes únicos
      const clientesUnicos = new Set(agendamentos?.map(a => a.cliente.toLowerCase().trim()) || []);
      console.log('Total de clientes únicos:', clientesUnicos.size);
      
      setTotalClientes(clientesUnicos.size);
    } catch (error) {
      console.error('Erro ao buscar total de clientes:', error);
    }
  };

  const buscarAgendamentosProximos = async () => {
    try {
      const agora = new Date().toISOString();

      // Busca agendamentos futuros
      const { data: agendamentos, error } = await supabase
        .from('agendamentos')
        .select('id, inicio')
        .eq('id_empresa', company?.id)
        .gt('inicio', agora)
        .order('inicio');

      if (error) {
        console.error('Erro ao buscar agendamentos próximos:', error);
        return;
      }

      console.log('Agendamentos próximos encontrados:', agendamentos);
      setAgendamentosProximos(agendamentos?.length || 0);
    } catch (error) {
      console.error('Erro ao buscar agendamentos próximos:', error);
    }
  };

  const buscarAgendamentosRealizados = async () => {
    try {
      const agora = new Date().toISOString();

      // Busca agendamentos já realizados
      const { data: agendamentos, error } = await supabase
        .from('agendamentos')
        .select('id, inicio')
        .eq('id_empresa', company?.id)
        .lt('inicio', agora)
        .order('inicio', { ascending: false });

      if (error) {
        console.error('Erro ao buscar agendamentos realizados:', error);
        return;
      }

      console.log('Agendamentos realizados encontrados:', agendamentos);
      setAgendamentosRealizados(agendamentos?.length || 0);
    } catch (error) {
      console.error('Erro ao buscar agendamentos realizados:', error);
    }
  };

  const buscarAgendamentosSemana = async () => {
    try {
      const hoje = new Date();
      const inicioSemana = new Date(hoje);
      inicioSemana.setHours(0, 0, 0, 0);
      inicioSemana.setDate(hoje.getDate() - hoje.getDay()); // Início da semana (domingo)
      
      const fimSemana = new Date(inicioSemana);
      fimSemana.setDate(inicioSemana.getDate() + 6); // Fim da semana (sábado)
      fimSemana.setHours(23, 59, 59, 999);

      console.log('Buscando agendamentos da semana entre:', {
        inicioSemana: inicioSemana.toISOString(),
        fimSemana: fimSemana.toISOString()
      });

      const { data: agendamentos, error } = await supabase
        .from('agendamentos')
        .select('id, inicio')
        .eq('id_empresa', company?.id)
        .gte('inicio', inicioSemana.toISOString())
        .lte('inicio', fimSemana.toISOString());

      if (error) {
        console.error('Erro ao buscar agendamentos da semana:', error);
        return;
      }

      console.log('Agendamentos da semana encontrados:', agendamentos);
      setAgendamentosSemana(agendamentos?.length || 0);
    } catch (error) {
      console.error('Erro ao buscar agendamentos da semana:', error);
    }
  };

  const buscarAgendamentosMes = async () => {
    try {
      const hoje = new Date();
      const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
      inicioMes.setHours(0, 0, 0, 0);
      
      const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
      fimMes.setHours(23, 59, 59, 999);

      console.log('Buscando agendamentos do mês entre:', {
        inicioMes: inicioMes.toISOString(),
        fimMes: fimMes.toISOString()
      });

      const { data: agendamentos, error } = await supabase
        .from('agendamentos')
        .select('id, inicio')
        .eq('id_empresa', company?.id)
        .gte('inicio', inicioMes.toISOString())
        .lte('inicio', fimMes.toISOString());

      if (error) {
        console.error('Erro ao buscar agendamentos do mês:', error);
        return;
      }

      console.log('Agendamentos do mês encontrados:', agendamentos);
      setAgendamentosMes(agendamentos?.length || 0);
    } catch (error) {
      console.error('Erro ao buscar agendamentos do mês:', error);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <Building2 className="w-5 h-5 mr-2 text-[#00D856]" />
          <span className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {company?.nome || 'Carregando...'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Dashboard
          </h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Resumo dos dados
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total de Clientes</p>
              <h2 className={`text-2xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {loading ? '...' : totalClientes}
              </h2>
            </div>
            <UserCheck className="w-8 h-8 text-[#00D856]" />
          </div>
        </div>

        <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Agendamentos Hoje</p>
              <h2 className={`text-2xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {loading ? '...' : agendamentosHoje}
              </h2>
            </div>
            <Calendar className="w-8 h-8 text-[#00D856]" />
          </div>
        </div>

        <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Agendamentos da Semana</p>
              <h2 className={`text-2xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {loading ? '...' : agendamentosSemana}
              </h2>
            </div>
            <Calendar className="w-8 h-8 text-[#00D856]" />
          </div>
        </div>

        <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Agendamentos do Mês</p>
              <h2 className={`text-2xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {loading ? '...' : agendamentosMes}
              </h2>
            </div>
            <Calendar className="w-8 h-8 text-[#00D856]" />
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg w-full`}>
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Agendamentos da Semana
          </h3>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dadosGrafico}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
                <XAxis 
                  dataKey="name" 
                  stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                />
                <YAxis 
                  stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                    border: 'none',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  }}
                  labelStyle={{ color: darkMode ? '#D1D5DB' : '#374151' }}
                  formatter={(value: number) => [`${value} agendamento${value !== 1 ? 's' : ''}`]}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#00D856" 
                  strokeWidth={2}
                  dot={{ fill: '#00D856', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}