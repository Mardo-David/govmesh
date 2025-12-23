// 8 Regiões de Planejamento de Sergipe
export const REGIOES_SERGIPE = [
  'Grande Aracaju',
  'Agreste Central', 
  'Centro Sul',
  'Sul Sergipano',
  'Baixo São Francisco',
  'Alto Sertão',
  'Médio Sertão',
  'Leste Sergipano',
] as const;

export type RegiaoSergipe = typeof REGIOES_SERGIPE[number];

export const MUNICIPIOS_POR_REGIAO: Record<RegiaoSergipe, string[]> = {
  'Grande Aracaju': ['Aracaju', 'Nossa Senhora do Socorro', 'São Cristóvão', 'Barra dos Coqueiros'],
  'Agreste Central': ['Itabaiana', 'Ribeirópolis', 'Campo do Brito', 'Macambira'],
  'Centro Sul': ['Lagarto', 'Tobias Barreto', 'Simão Dias', 'Poço Verde'],
  'Sul Sergipano': ['Estância', 'Indiaroba', 'Umbaúba', 'Santa Luzia do Itanhy'],
  'Baixo São Francisco': ['Propriá', 'Neópolis', 'Santana do São Francisco', 'Canhoba'],
  'Alto Sertão': ['Nossa Senhora da Glória', 'Canindé de São Francisco', 'Porto da Folha', 'Monte Alegre de Sergipe'],
  'Médio Sertão': ['Aquidabã', 'Nossa Senhora das Dores', 'Cumbe', 'Feira Nova'],
  'Leste Sergipano': ['Japaratuba', 'Carmópolis', 'Pirambu', 'General Maynard'],
};

// Categorias de Kits para campanha estadual
export const CATEGORIAS_KITS_ESTADUAIS = [
  'Segurança Pública (PMSE)',
  'Saúde Estadual (HUSE e Hospitais Regionais)',
  'Infraestrutura (Rodovias Estaduais)',
  'Desenvolvimento do São Francisco',
  'Cultura e Turismo (Arraiá do Povo/Orla)',
  'Educação Estadual',
  'Desenvolvimento Social',
  'Meio Ambiente',
] as const;

export type CategoriaKitEstadual = typeof CATEGORIAS_KITS_ESTADUAIS[number];
