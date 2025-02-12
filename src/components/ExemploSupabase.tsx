import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function ExemploSupabase() {
  const [dados, setDados] = useState<any[]>([])
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    async function carregarDados() {
      try {
        // Substitua 'sua_tabela' pelo nome da sua tabela no Supabase
        const { data, error } = await supabase
          .from('sua_tabela')
          .select('*')
        
        if (error) throw error
        
        setDados(data || [])
      } catch (error) {
        setErro(error instanceof Error ? error.message : 'Erro ao carregar dados')
      }
    }

    carregarDados()
  }, [])

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Dados do Supabase</h2>
      
      {erro && (
        <div className="text-red-500 mb-4">
          Erro: {erro}
        </div>
      )}

      <div className="space-y-2">
        {dados.map((item) => (
          <div key={item.id} className="p-2 border rounded">
            {/* Substitua 'nome' pela coluna que você quer mostrar */}
            {item.nome}
          </div>
        ))}
      </div>
    </div>
  )
}
