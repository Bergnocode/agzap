import React, { useState, useEffect } from 'react';
import { X, User, Briefcase, Mail, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCompany } from '../contexts/CompanyContext';
import { useAuth } from '../contexts/AuthContext';
import DisponibilidadeForm from './DisponibilidadeForm';

interface Professional {
  id: bigint;
  nome: string;
  id_profissao: bigint;
  email: string | null;
  nivel: boolean;
  id_empresa: bigint;
}

interface Profissao {
  id: bigint;
  profissao: string;
  id_empresa: string;
}

interface NewProfessionalModalProps {
  isOpen: boolean;
  onClose: () => void;
  professional: Professional | null;
  profissoes: Profissao[];
}

interface FormData {
  nome: string;
  id_profissao: string;
  email: string;
  nivel: boolean;
  senha?: string;
}

interface FormErrors {
  nome?: string;
  id_profissao?: string;
  email?: string;
  senha?: string;
}

interface Disponibilidade {
  id?: bigint;
  dia_semana: 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta' | 'sabado' | 'domingo';
  hora_inicio: string;
  hora_fim: string;
  ativo: boolean;
  id_profissional: bigint;
  id_empresa: bigint;
}

export default function NewProfessionalModal({ 
  isOpen, 
  onClose, 
  professional, 
  profissoes 
}: NewProfessionalModalProps) {
  const { company } = useCompany();
  const { user } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    id_profissao: '',
    email: '',
    nivel: false,
  });

  const [disponibilidade, setDisponibilidade] = useState<Disponibilidade[]>(professional?.disponibilidade || []);

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (professional) {
      // Se for edição, carrega os dados do profissional
      setFormData({
        nome: professional.nome,
        id_profissao: professional.id_profissao.toString(),
        email: professional.email || '',
        nivel: professional.nivel,
      });

      // Carregar disponibilidade
      fetchDisponibilidade(professional.id);
    } else {
      // Se for novo cadastro, limpa todos os campos
      setFormData({
        nome: '',
        id_profissao: '',
        email: '',
        nivel: false,
      });
      setDisponibilidade([]);
    }
  }, [professional]);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        nome: '',
        id_profissao: '',
        email: '',
        nivel: false,
      });
      setDisponibilidade([]);
      setErrors({});
      setTouched({});
    }
  }, [isOpen]);

  const fetchDisponibilidade = async (profissionalId: bigint) => {
    try {
      const { data, error } = await supabase
        .from('disponibilidade_profissional')
        .select('id, dia_semana, hora_inicio, hora_fim, ativo')
        .eq('id_profissional', profissionalId)
        .eq('ativo', true)
        .order('dia_semana');

      if (error) {
        console.error('Erro ao buscar disponibilidade:', error);
        return;
      }

      console.log('Disponibilidade carregada:', data);
      setDisponibilidade(data || []);
    } catch (error) {
      console.error('Erro ao buscar disponibilidade:', error);
    }
  };

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.id_profissao) {
      newErrors.id_profissao = 'Profissão é obrigatória';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!professional && !formData.senha?.trim()) {
      newErrors.senha = 'Senha é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    setLoading(true);

    try {
      if (!user) {
        throw new Error('Usuário não está autenticado');
      }

      // Buscar o ID da empresa do usuário
      const { data: empresaData, error: empresaError } = await supabase
        .from('empresa')
        .select('id')
        .eq('criador', user.id)
        .single();

      if (empresaError) throw empresaError;
      if (!empresaData) throw new Error('Empresa não encontrada');

      const data = {
        nome: formData.nome,
        id_profissao: parseInt(formData.id_profissao),
        email: formData.email || null,
        nivel: formData.nivel,
        id_empresa: empresaData.id
      };

      if (!professional) {
        data.senha = formData.senha;
      }

      console.log('Dados a serem salvos:', data);

      if (professional) {
        // Atualizar profissional existente
        const { error } = await supabase
          .from('profissionais')
          .update(data)
          .eq('id', professional.id);

        if (error) throw error;

        // Para cada horário na lista
        for (const disp of disponibilidade) {
          if (disp.id) {
            // Atualiza horário existente
            const { error: dispError } = await supabase
              .from('disponibilidade_profissional')
              .update({
                dia_semana: disp.dia_semana,
                hora_inicio: disp.hora_inicio,
                hora_fim: disp.hora_fim,
                id_empresa: empresaData.id,
                ativo: true
              })
              .eq('id', disp.id);

            if (dispError) throw dispError;
          } else {
            // Insere novo horário
            const { error: dispError } = await supabase
              .from('disponibilidade_profissional')
              .insert({
                id_profissional: professional.id,
                dia_semana: disp.dia_semana,
                hora_inicio: disp.hora_inicio,
                hora_fim: disp.hora_fim,
                ativo: true,
                id_empresa: empresaData.id
              });

            if (dispError) throw dispError;
          }
        }
      } else {
        // Criar novo profissional
        const { data: newProfessional, error } = await supabase
          .from('profissionais')
          .insert([data])
          .select()
          .single();

        if (error) throw error;

        // Inserir horários para o novo profissional
        if (newProfessional && disponibilidade.length > 0) {
          const horarios = disponibilidade.map(disp => ({
            id_profissional: newProfessional.id,
            dia_semana: disp.dia_semana,
            hora_inicio: disp.hora_inicio,
            hora_fim: disp.hora_fim,
            ativo: true,
            id_empresa: empresaData.id
          }));

          const { error: dispError } = await supabase
            .from('disponibilidade_profissional')
            .insert(horarios);

          if (dispError) throw dispError;
        }
      }

      // Só fecha se todas as operações foram bem sucedidas
      if (!professional || (professional && !disponibilidade.some(d => !d.id))) {
        onClose();
      }
    } catch (error: any) {
      console.error('Erro ao salvar profissional:', error);
      alert(`Erro ao salvar profissional: ${error.message || 'Por favor, tente novamente.'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : value
    }));
    
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative w-full max-w-2xl rounded-xl shadow-lg bg-white dark:bg-gray-800 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {professional ? 'Editar Profissional' : 'Cadastro de Novo Profissional'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <User className="w-4 h-4 inline-block mr-2" />
                Nome Completo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                onBlur={() => handleBlur('nome')}
                className={`w-full rounded-lg border bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 
                  text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-primary focus:ring-opacity-50
                  ${touched.nome && errors.nome ? 'border-red-500' : ''}`}
                disabled={loading}
              />
              {touched.nome && errors.nome && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.nome}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Briefcase className="w-4 h-4 inline-block mr-2" />
                Profissão <span className="text-red-500">*</span>
              </label>
              <select
                name="id_profissao"
                value={formData.id_profissao}
                onChange={handleInputChange}
                onBlur={() => handleBlur('id_profissao')}
                className={`w-full rounded-lg border bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 
                  text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-primary focus:ring-opacity-50
                  ${touched.id_profissao && errors.id_profissao ? 'border-red-500' : ''}`}
                disabled={loading}
              >
                <option value="">Selecione uma profissão</option>
                {profissoes.map(profissao => (
                  <option key={profissao.id} value={profissao.id.toString()}>
                    {profissao.profissao}
                  </option>
                ))}
              </select>
              {touched.id_profissao && errors.id_profissao && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.id_profissao}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Mail className="w-4 h-4 inline-block mr-2" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={() => handleBlur('email')}
                className={`w-full rounded-lg border bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 
                  text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-primary focus:ring-opacity-50
                  ${touched.email && errors.email ? 'border-red-500' : ''}`}
                disabled={loading}
              />
              {touched.email && errors.email && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            {!professional && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <AlertCircle className="w-4 h-4 inline-block mr-2" />
                  Senha <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="senha"
                    value={formData.senha || ''}
                    onChange={handleInputChange}
                    className={`w-full rounded-lg border bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 
                      text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-primary focus:ring-opacity-50 pr-10
                      ${touched.senha && errors.senha ? 'border-red-500' : ''}`}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 dark:text-gray-400"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
                {touched.senha && errors.senha && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.senha}
                  </p>
                )}
              </div>
            )}

            <div className="flex items-center">
              <input
                type="checkbox"
                name="nivel"
                checked={formData.nivel}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary border-gray-300 rounded"
                disabled={loading}
              />
              <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Administrador
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Disponibilidade
              </label>
              <DisponibilidadeForm
                disponibilidadeInicial={disponibilidade}
                idProfissional={professional?.id || 0n}
                onChange={setDisponibilidade}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 
                  dark:hover:bg-gray-700 rounded-lg transition-colors"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-[#00D856] hover:bg-[#00bf4b] 
                  rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Salvando...' : professional ? 'Salvar Alterações' : 'Cadastrar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}