import React, { useState, useEffect } from 'react';
import { X, User, Briefcase, Mail, Phone, ToggleLeft as Toggle, AlertCircle } from 'lucide-react';

interface NewProfessionalModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  professional?: {
    id: number;
    name: string;
    specialty: string;
    email: string;
    phone: string;
    status?: 'active' | 'inactive';
  } | null;
}

interface FormData {
  name: string;
  specialty: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
}

interface FormErrors {
  name?: string;
  specialty?: string;
  email?: string;
  phone?: string;
}

export default function NewProfessionalModal({ isOpen, onClose, darkMode, professional }: NewProfessionalModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    specialty: '',
    email: '',
    phone: '',
    status: 'active'
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Atualiza o formulário quando receber um profissional para edição
  useEffect(() => {
    if (professional) {
      setFormData({
        name: professional.name,
        specialty: professional.specialty,
        email: professional.email,
        phone: professional.phone,
        status: professional.status || 'active'
      });
      // Limpa os estados de erro e campos tocados
      setErrors({});
      setTouched({});
    } else {
      // Reseta o formulário quando for um novo cadastro
      setFormData({
        name: '',
        specialty: '',
        email: '',
        phone: '',
        status: 'active'
      });
    }
  }, [professional]);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.specialty.trim()) {
      newErrors.specialty = 'Especialidade é obrigatória';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (!/^\d{10,11}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Telefone inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Aqui você implementaria a lógica para salvar ou atualizar o profissional
      console.log('Dados do formulário:', formData);
      console.log('Modo:', professional ? 'Edição' : 'Novo');
      onClose();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpa o erro quando o usuário começa a digitar
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className={`relative w-full max-w-2xl rounded-xl shadow-lg ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } p-6 transform transition-all duration-300 ease-in-out`}>
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {professional ? 'Editar Profissional' : 'Cadastro de Novo Profissional'}
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                <User className="w-4 h-4 inline-block mr-2" />
                Nome Completo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                onBlur={() => handleBlur('name')}
                className={`w-full rounded-lg border ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-200 text-gray-900'
                } px-4 py-2 focus:ring-2 focus:ring-primary focus:ring-opacity-50 ${
                  touched.name && errors.name ? 'border-red-500' : ''
                }`}
              />
              {touched.name && errors.name && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                <Briefcase className="w-4 h-4 inline-block mr-2" />
                Especialidade/Cargo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="specialty"
                value={formData.specialty}
                onChange={handleInputChange}
                onBlur={() => handleBlur('specialty')}
                className={`w-full rounded-lg border ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-200 text-gray-900'
                } px-4 py-2 focus:ring-2 focus:ring-primary focus:ring-opacity-50 ${
                  touched.specialty && errors.specialty ? 'border-red-500' : ''
                }`}
              />
              {touched.specialty && errors.specialty && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.specialty}
                </p>
              )}
            </div>

            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                <Mail className="w-4 h-4 inline-block mr-2" />
                Email Profissional <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={() => handleBlur('email')}
                className={`w-full rounded-lg border ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-200 text-gray-900'
                } px-4 py-2 focus:ring-2 focus:ring-primary focus:ring-opacity-50 ${
                  touched.email && errors.email ? 'border-red-500' : ''
                }`}
              />
              {touched.email && errors.email && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                <Phone className="w-4 h-4 inline-block mr-2" />
                Telefone de Contato <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                onBlur={() => handleBlur('phone')}
                className={`w-full rounded-lg border ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-200 text-gray-900'
                } px-4 py-2 focus:ring-2 focus:ring-primary focus:ring-opacity-50 ${
                  touched.phone && errors.phone ? 'border-red-500' : ''
                }`}
              />
              {touched.phone && errors.phone && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.phone}
                </p>
              )}
            </div>

            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                <Toggle className="w-4 h-4 inline-block mr-2" />
                Status <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className={`w-full rounded-lg border ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-200 text-gray-900'
                } px-4 py-2 focus:ring-2 focus:ring-primary focus:ring-opacity-50`}
              >
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-4 mt-8">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded-lg border ${
                  darkMode ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-600'
                } hover:bg-gray-100 dark:hover:bg-gray-700`}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-lg transition-colors duration-200"
              >
                {professional ? 'Atualizar' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}