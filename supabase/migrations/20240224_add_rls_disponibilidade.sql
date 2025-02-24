-- Enable RLS
alter table public.disponibilidade_profissional enable row level security;

-- Create policies
create policy "Usuários autenticados podem visualizar disponibilidade"
on public.disponibilidade_profissional for select
using (
  auth.role() = 'authenticated'
);

create policy "Usuários autenticados podem inserir disponibilidade"
on public.disponibilidade_profissional for insert
with check (
  auth.role() = 'authenticated'
);

create policy "Usuários autenticados podem atualizar disponibilidade"
on public.disponibilidade_profissional for update
using (
  auth.role() = 'authenticated'
)
with check (
  auth.role() = 'authenticated'
);

create policy "Usuários autenticados podem deletar disponibilidade"
on public.disponibilidade_profissional for delete
using (
  auth.role() = 'authenticated'
);
