import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import ConfirmationDialog from './ConfirmationDialog';

interface Disponibilidade {
  id?: bigint;
  dia_semana: 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta' | 'sabado' | 'domingo';
  hora_inicio: string;
  hora_fim: string;
  ativo: boolean;
  id_profissional: bigint;
  id_empresa: string;
}

interface DisponibilidadeFormProps {
  disponibilidadeInicial: Disponibilidade[];
  idProfissional: bigint;
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

const DisponibilidadeForm = ({ 
  disponibilidadeInicial, 
  idProfissional,
  onChange 
}: DisponibilidadeFormProps) => {
  const [disponibilidade, setDisponibilidade] = useState<Disponibilidade[]>([]);
  const [loading, setLoading] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [horarioToDelete, setHorarioToDelete] = useState<number | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    setDisponibilidade(disponibilidadeInicial || []);
  }, [disponibilidadeInicial, user]);

  const adicionarDisponibilidade = () => {
    if (!user) {
      alert('Você precisa estar autenticado para adicionar disponibilidade');
      return;
    }

    const novaDisp: Disponibilidade = {
      dia_semana: 'segunda',
      hora_inicio: '08:00',
      hora_fim: '17:00',
      ativo: true,
      id_profissional: idProfissional,
      id_empresa: user.id
    };
    const novaLista = [...disponibilidade, novaDisp];
    setDisponibilidade(novaLista);
    onChange(novaLista);
  };

  const handleDelete = (index: number) => {
    setHorarioToDelete(index);
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    if (horarioToDelete === null) return;
    
    try {
      const horario = disponibilidade[horarioToDelete];
      
      if (horario.id) {
        const { error: deleteError } = await supabase
          .from('disponibilidade_profissional')
          .delete()
          .eq('id', horario.id)
          .eq('id_empresa', user.id);

        if (deleteError) {
          throw deleteError;
        }
      }

      const novaLista = disponibilidade.filter((_, i) => i !== horarioToDelete);
      setDisponibilidade(novaLista);
      onChange(novaLista);

    } catch (error: any) {
      console.error('Erro ao remover horário:', error);
      alert(`Erro ao excluir horário: ${error.message || 'Por favor, tente novamente.'}`);
    } finally {
      setShowConfirmDelete(false);
      setHorarioToDelete(null);
    }
  };

  const validateHorario = (inicio: string, fim: string): boolean => {
    if (!inicio || !fim) return true;
    
    const [horaInicio, minInicio] = inicio.split(':').map(Number);
    const [horaFim, minFim] = fim.split(':').map(Number);

    const minutosInicio = horaInicio * 60 + minInicio;
    const minutosFim = horaFim * 60 + minFim;

    return minutosFim > minutosInicio;
  };

  const handleChange = (index: number, field: keyof Disponibilidade, value: string | boolean) => {
    if (!user) {
      alert('Você precisa estar autenticado para alterar disponibilidade');
      return;
    }

    const novaLista = [...disponibilidade];
    const horarioAtual = novaLista[index];

    const novoHorario = {
      ...horarioAtual,
      [field]: value,
      id_empresa: user.id
    };

    if (field === 'hora_inicio' || field === 'hora_fim') {
      if (novoHorario.hora_inicio && novoHorario.hora_fim) {
        if (!validateHorario(novoHorario.hora_inicio, novoHorario.hora_fim)) {
          alert('O horário de fim deve ser maior que o horário de início');
          return;
        }
      }
    }

    novaLista[index] = novoHorario as Disponibilidade;
    setDisponibilidade(novaLista);
    onChange(novaLista);
  };

  if (!user) {
    return (
      <div className="text-center p-4">
        <p>Você precisa estar autenticado para gerenciar disponibilidade.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {disponibilidade.map((disp, index) => (
        <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <select
            value={disp.dia_semana}
            onChange={(e) => handleChange(index, 'dia_semana', e.target.value as any)}
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
            onClick={() => handleDelete(index)}
            className="text-red-500 hover:text-red-700 disabled:opacity-50"
            disabled={loading}
          >
            <Trash2 size={20} />
          </button>
        </div>
      ))}

      <button
        onClick={adicionarDisponibilidade}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        disabled={loading}
      >
        <Plus size={20} />
        Adicionar Horário
      </button>

      <ConfirmationDialog
        isOpen={showConfirmDelete}
        onClose={() => {
          setShowConfirmDelete(false);
          setHorarioToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Excluir Horário"
        message="Tem certeza que deseja excluir este horário?"
        confirmText="Excluir"
        cancelText="Cancelar"
      />
    </div>
  );
};

export default DisponibilidadeForm;
