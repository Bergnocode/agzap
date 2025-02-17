import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Disponibilidade {
  id?: number;
  dia_semana: string;
  hora_inicio: string;
  hora_fim: string;
  ativo: boolean;
}

interface DisponibilidadeFormProps {
  disponibilidadeInicial: Disponibilidade[];
  onChange: (novaDisponibilidade: Disponibilidade[]) => void;
}

const diasDaSemana = [
  { valor: 'segunda', label: 'Segunda-feira' },
  { valor: 'terca', label: 'Terça-feira' },
  { valor: 'quarta', label: 'Quarta-feira' },
  { valor: 'quinta', label: 'Quinta-feira' },
  { valor: 'sexta', label: 'Sexta-feira' },
  { valor: 'sabado', label: 'Sábado' },
  { valor: 'domingo', label: 'Domingo' }
];

const DisponibilidadeForm: React.FC<DisponibilidadeFormProps> = ({ 
  disponibilidadeInicial, 
  onChange 
}) => {
  const [disponibilidade, setDisponibilidade] = useState<Disponibilidade[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('Disponibilidade inicial:', disponibilidadeInicial);
    setDisponibilidade(disponibilidadeInicial || []);
  }, [disponibilidadeInicial]);

  const adicionarDisponibilidade = () => {
    const novaDisp = {
      dia_semana: 'segunda',
      hora_inicio: '08:00',
      hora_fim: '17:00',
      ativo: true
    };
    const novaLista = [...disponibilidade, novaDisp];
    console.log('Adicionando disponibilidade:', novaLista);
    setDisponibilidade(novaLista);
    onChange(novaLista);
  };

  const removerDisponibilidade = async (index: number) => {
    if (!confirm('Tem certeza que deseja excluir este horário?')) {
      return;
    }

    setLoading(true);
    try {
      const horario = disponibilidade[index];
      console.log('Tentando excluir horário:', horario);
      
      if (horario.id) {
        // Primeira tentativa: DELETE direto
        const { error: deleteError } = await supabase
          .from('disponibilidade_profissional')
          .delete()
          .eq('id', horario.id);

        console.log('Primeira tentativa de exclusão:', deleteError);

        if (deleteError) {
          // Segunda tentativa: DELETE com SQL
          const { error: sqlError } = await supabase
            .from('disponibilidade_profissional')
            .delete()
            .eq('id', horario.id)
            .neq('id', 0); // Força a execução do DELETE

          console.log('Segunda tentativa de exclusão:', sqlError);

          if (sqlError) {
            console.error('Erro ao excluir horário:', sqlError);
            alert('Erro ao excluir horário. Por favor, tente novamente.');
            return;
          }
        }

        // Verifica se o horário foi realmente excluído
        const { data: checkData, error: checkError } = await supabase
          .from('disponibilidade_profissional')
          .select('id')
          .eq('id', horario.id)
          .maybeSingle();

        console.log('Verificação após exclusão:', { checkData, checkError });

        if (checkData) {
          // Última tentativa: UPDATE para inativo
          const { error: updateError } = await supabase
            .from('disponibilidade_profissional')
            .update({ ativo: false })
            .eq('id', horario.id);

          console.log('Tentativa de inativação:', updateError);

          if (updateError) {
            console.error('Erro ao inativar horário:', updateError);
            alert('Erro ao excluir horário. Por favor, tente novamente.');
            return;
          }
        }
      }

      // Remove da lista local
      const novaLista = disponibilidade.filter((_, i) => i !== index);
      console.log('Nova lista após remoção:', novaLista);
      setDisponibilidade(novaLista);
      onChange(novaLista);

    } catch (error) {
      console.error('Erro ao remover horário:', error);
      alert('Erro ao excluir horário. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const validateHorario = (inicio: string, fim: string): boolean => {
    if (!inicio || !fim) return true;
    
    // Converte os horários para minutos para facilitar a comparação
    const [horaInicio, minInicio] = inicio.split(':').map(Number);
    const [horaFim, minFim] = fim.split(':').map(Number);

    const minutosInicio = horaInicio * 60 + minInicio;
    const minutosFim = horaFim * 60 + minFim;

    return minutosFim > minutosInicio;
  };

  const handleChange = (index: number, field: keyof Disponibilidade, value: string | boolean) => {
    const novaLista = [...disponibilidade];
    const horarioAtual = novaLista[index];

    // Atualiza o valor primeiro
    const novoHorario = {
      ...horarioAtual,
      [field]: value
    };

    // Depois valida
    if (field === 'hora_inicio' || field === 'hora_fim') {
      if (novoHorario.hora_inicio && novoHorario.hora_fim) {
        if (!validateHorario(novoHorario.hora_inicio, novoHorario.hora_fim)) {
          alert('O horário de fim deve ser maior que o horário de início');
          return;
        }
      }
    }

    // Se passou na validação, atualiza a lista
    novaLista[index] = novoHorario;
    console.log('Nova lista após alteração:', novaLista);
    setDisponibilidade(novaLista);
    onChange(novaLista);
  };

  return (
    <div className="space-y-4">
      {disponibilidade.map((disp, index) => (
        <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <select
            value={disp.dia_semana}
            onChange={(e) => handleChange(index, 'dia_semana', e.target.value)}
            className="flex-1 rounded-lg border bg-white dark:bg-gray-600 border-gray-200 dark:border-gray-500 text-gray-900 dark:text-white px-3 py-2"
            disabled={loading}
          >
            {diasDaSemana.map(dia => (
              <option key={dia.valor} value={dia.valor}>
                {dia.label}
              </option>
            ))}
          </select>
          
          <input
            type="time"
            value={disp.hora_inicio}
            onChange={(e) => handleChange(index, 'hora_inicio', e.target.value)}
            className="rounded-lg border bg-white dark:bg-gray-600 border-gray-200 dark:border-gray-500 text-gray-900 dark:text-white px-3 py-2"
            disabled={loading}
          />
          
          <input
            type="time"
            value={disp.hora_fim}
            onChange={(e) => handleChange(index, 'hora_fim', e.target.value)}
            className="rounded-lg border bg-white dark:bg-gray-600 border-gray-200 dark:border-gray-500 text-gray-900 dark:text-white px-3 py-2"
            disabled={loading}
          />
          
          <button
            type="button"
            onClick={() => removerDisponibilidade(index)}
            className="p-2 text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
            title="Remover horário"
            disabled={loading}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      ))}
      
      <button
        type="button"
        onClick={adicionarDisponibilidade}
        className="flex items-center text-[#00D856] hover:text-[#00bf4b] transition-colors disabled:opacity-50"
        disabled={loading}
      >
        <Plus className="w-5 h-5 mr-2" />
        Adicionar Horário
      </button>
    </div>
  );
};

export default DisponibilidadeForm;
