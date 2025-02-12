import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface Company {
  id: number;
  nome: string;
}

interface CompanyContextType {
  company: Company | null;
  loading: boolean;
  error: string | null;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCompanyData() {
      try {
        if (!user) {
          setCompany(null);
          setLoading(false);
          return;
        }

        setLoading(true);
        console.log('Buscando empresa para o usuário:', user.id);

        // Busca o usuário e sua empresa vinculada
        const { data: userData, error: userError } = await supabase
          .from('usuario')
          .select(`
            id_empresa,
            empresa:id_empresa (
              id,
              nome
            )
          `)
          .eq('uid', user.id)
          .single();

        console.log('Dados do usuário:', userData);
        console.log('Erro ao buscar usuário:', userError);

        if (userError) {
          console.error('Erro ao buscar usuário:', userError);
          setError('Erro ao buscar dados do usuário');
          setCompany(null);
          return;
        }

        if (userData?.empresa) {
          console.log('Empresa encontrada:', userData.empresa);
          setCompany(userData.empresa);
          setError(null);
        } else {
          console.log('Usuário sem empresa vinculada');
          setError('Usuário não possui empresa vinculada');
          setCompany(null);
        }
      } catch (err: any) {
        console.error('Erro ao carregar dados da empresa:', err);
        setError(err.message);
        setCompany(null);
      } finally {
        setLoading(false);
      }
    }

    loadCompanyData();
  }, [user]);

  return (
    <CompanyContext.Provider value={{ company, loading, error }}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompany deve ser usado dentro de um CompanyProvider');
  }
  return context;
}
