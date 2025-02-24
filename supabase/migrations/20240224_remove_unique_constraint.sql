-- Remove a constraint de unicidade
ALTER TABLE disponibilidade_profissional
DROP CONSTRAINT IF EXISTS unique_dia_profissional;
