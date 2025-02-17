import React, { useState, useEffect } from 'react';
import { X, User, Briefcase, Mail, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCompany } from '../contexts/CompanyContext';

interface Professional {
  id: number;
  nome: string;
  id_profissao: number;
  email: string | null;
  foto: string | null;
  nivel: boolean | null;
}

interface Profissao {
  id: number;
  profissao: string;
  id_empresa: number;
}

interface NewProfessionalModalProps {
  isOpen: boolean;
  onClose: () => void;
  professional: Professional | null;
  profissoes: Profissao[];
}

interface FormData {
  nome: string;
  id_profissao: number;
  email: string;
  nivel: boolean;
}

interface FormErrors {
  nome?: string;
  id_profissao?: string;
  email?: string;
}

export default function NewProfessionalModal({ 
  isOpen, 
  onClose, 
  professional, 
  profissoes 
}: NewProfessionalModalProps) {
  const { company } = useCompany();
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    id_profissao: 0,
    email: '',
    nivel: false
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (professional) {
      setFormData({
        nome: professional.nome,
        id_profissao: professional.id_profissao,
        email: professional.email || '',
        nivel: professional.nivel || false
      });
      setErrors({});
      setTouched({});
    } else {
      setFormData({
        nome: '',
        id_profissao: profissoes[0]?.id || 0,
        email: '',
        nivel: false
      });
    }
  }, [professional, profissoes]);

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !company?.id) return;

    setLoading(true);
    try {
      const data = {
        ...formData,
        id_empresa: company.id
      };

      if (professional) {
        // Atualizar profissional existente
        const { error } = await supabase
          .from('profissionais')
          .update(data)
          .eq('id', professional.id);

        if (error) throw error;
      } else {
        // Criar novo profissional
        const { error } = await supabase
          .from('profissionais')
          .insert([data]);

        if (error) throw error;
      }

      onClose();
    } catch (error) {
      console.error('Erro ao salvar profissional:', error);
      alert('Erro ao salvar profissional. Por favor, tente novamente.');
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
                  <option key={profissao.id} value={profissao.id}>
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