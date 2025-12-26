import React, { createContext, useContext, useState, ReactNode } from 'react';

export type KitStatus = 'pendente' | 'aprovado' | 'bloqueado';
export type KitTipo = 'video' | 'audio' | 'meme' | 'card';
export type LeadStatus = 'novo' | 'contatado' | 'engajado' | 'multiplicador';
export type UserProfile = 'Admin' | 'Jurídico' | 'Liderança' | 'Apoiador';

export interface Kit {
  id: string;
  titulo: string;
  tipo: KitTipo;
  status: KitStatus;
  territorio: string;
  dataAtualizacao: string;
  descricao: string;
  textoCopiavel: string;
  urlDownload: string;
}

export interface Lead {
  id: string;
  nome: string;
  status: LeadStatus;
  territorio: string;
  email: string;
  telefone: string;
  ultimoContato: string;
}

export interface Boato {
  id: string;
  titulo: string;
  nivel: 'baixo' | 'medio' | 'alto' | 'critico';
  status: 'monitorando' | 'aguardando_juridico' | 'resposta_aprovada' | 'neutralizado';
  tema: string;
  territorio: string;
  dataDeteccao: string;
  fonte: string;
  volumeViralizacao: number; // 0-100
  linhaOficial?: string;
  kitsRelacionados: string[];
}

export interface LogEvento {
  id: string;
  acao: string;
  usuario: string;
  timestamp: string;
  detalhes: string;
}

export interface ArgumentoGerado {
  id: string;
  pergunta: string;
  resposta: string;
  fontes: { titulo: string; url: string }[];
  status: 'pendente_revisao' | 'aprovado' | 'rejeitado';
  dataCriacao: string;
}

export interface PendingApproval {
  id: string;
  tipo: 'kit' | 'argumento';
  itemId: string;
  titulo: string;
  conteudo: string;
  solicitante: string;
  dataSolicitacao: string;
  compliance: {
    semDeepfake: boolean;
    comFontes: boolean;
    semOfensas: boolean;
  };
}

interface GovMeshContextType {
  kits: Kit[];
  leads: Lead[];
  boatos: Boato[];
  logs: LogEvento[];
  argumentos: ArgumentoGerado[];
  pendingApprovals: PendingApproval[];
  userProfile: UserProfile;
  isLocked: boolean;
  isElectoralMode: boolean;
  isSystemLocked: boolean;
  setUserProfile: (profile: UserProfile) => void;
  setKits: React.Dispatch<React.SetStateAction<Kit[]>>;
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  setBoatos: React.Dispatch<React.SetStateAction<Boato[]>>;
  addLog: (log: Omit<LogEvento, 'id' | 'timestamp'> & { modulo?: string; territorio?: string }) => void;
  addArgumento: (arg: Omit<ArgumentoGerado, 'id' | 'dataCriacao'>) => void;
  updateLeadStatus: (leadId: string, newStatus: LeadStatus) => void;
  approveItem: (approvalId: string) => void;
  rejectItem: (approvalId: string, motivo: string) => void;
  updateCompliance: (approvalId: string, field: keyof PendingApproval['compliance'], value: boolean) => void;
  setIsLocked: (locked: boolean) => void;
  setIsElectoralMode: (mode: boolean) => void;
  toggleKillSwitch: () => void;
}

const GovMeshContext = createContext<GovMeshContextType | undefined>(undefined);

// Mock Data - 8 Regiões de Sergipe
const mockKits: Kit[] = [
  { id: 'k1', titulo: 'Vídeo: Segurança Pública em Sergipe', tipo: 'video', status: 'aprovado', territorio: 'Grande Aracaju', dataAtualizacao: '2024-01-15', descricao: 'Vídeo institucional sobre investimentos na PMSE e redução da criminalidade', textoCopiavel: '✅ Mais segurança para Sergipe! José da Silva investe na PMSE e reduz criminalidade em 18%. #SergipeMaisSeguro', urlDownload: '/kits/video-seguranca.mp4' },
  { id: 'k2', titulo: 'Card: HUSE em Números', tipo: 'card', status: 'pendente', territorio: 'Grande Aracaju', dataAtualizacao: '2024-01-14', descricao: 'Card para redes sociais com dados de saúde do HUSE', textoCopiavel: '📊 HUSE: +15 leitos de UTI | 50 mil atendimentos/mês | Saúde estadual que funciona!', urlDownload: '/kits/card-huse.png' },
  { id: 'k3', titulo: 'Áudio: Jingle Campanha José da Silva', tipo: 'audio', status: 'aprovado', territorio: 'Grande Aracaju', dataAtualizacao: '2024-01-13', descricao: 'Jingle oficial para carros de som em Sergipe', textoCopiavel: '🎵 O povo quer, o povo vai ter! Vote certo, vote José da Silva! #SergipeMelhor', urlDownload: '/kits/jingle.mp3' },
  { id: 'k4', titulo: 'Meme: Resposta Fake DESO', tipo: 'meme', status: 'bloqueado', territorio: 'Agreste Central', dataAtualizacao: '2024-01-12', descricao: 'Meme para combater fake sobre privatização da DESO', textoCopiavel: '😂 A DESO é do povo sergipano e vai continuar sendo! Não caia em fake news.', urlDownload: '/kits/meme-deso.jpg' },
  { id: 'k5', titulo: 'Vídeo: Rodovias de Sergipe', tipo: 'video', status: 'aprovado', territorio: 'Centro Sul', dataAtualizacao: '2024-01-11', descricao: 'Compilado de obras em rodovias estaduais', textoCopiavel: '💬 Estradas novas para Sergipe! Veja as obras da SE-170 e SE-438.', urlDownload: '/kits/rodovias.mp4' },
  { id: 'k6', titulo: 'Card: Hospitais Regionais', tipo: 'card', status: 'pendente', territorio: 'Alto Sertão', dataAtualizacao: '2024-01-10', descricao: 'Card com dados de investimento em hospitais regionais', textoCopiavel: '📚 Saúde no interior! 3 novos hospitais regionais para o sertão sergipano.', urlDownload: '/kits/card-hospitais.png' },
  { id: 'k7', titulo: 'Áudio: Spot Desenvolvimento São Francisco', tipo: 'audio', status: 'aprovado', territorio: 'Baixo São Francisco', dataAtualizacao: '2024-01-09', descricao: 'Spot sobre desenvolvimento da região do São Francisco', textoCopiavel: '📻 O Rio São Francisco vai voltar a pulsar! José da Silva cuida de Sergipe.', urlDownload: '/kits/spot-saofrancisco.mp3' },
  { id: 'k8', titulo: 'Card: Arraiá do Povo 2024', tipo: 'card', status: 'pendente', territorio: 'Leste Sergipano', dataAtualizacao: '2024-01-08', descricao: 'Material sobre cultura e turismo - Arraiá do Povo', textoCopiavel: '🎉 Arraiá do Povo: o maior São João do Nordeste é de Sergipe!', urlDownload: '/kits/card-arraia.png' },
  { id: 'k9', titulo: 'Vídeo: Ponte Aracaju-Barra', tipo: 'video', status: 'aprovado', territorio: 'Grande Aracaju', dataAtualizacao: '2024-01-07', descricao: 'Vídeo sobre a nova Ponte Aracaju-Barra dos Coqueiros', textoCopiavel: '📋 Ponte nova ligando Aracaju à Barra! Infraestrutura que transforma Sergipe.', urlDownload: '/kits/ponte-aracaju-barra.mp4' },
  { id: 'k10', titulo: 'Card: Orla de Aracaju', tipo: 'card', status: 'aprovado', territorio: 'Grande Aracaju', dataAtualizacao: '2024-01-06', descricao: 'Card sobre revitalização da Orla de Atalaia', textoCopiavel: '🏖️ Orla de Atalaia renovada! Turismo e lazer para todos os sergipanos.', urlDownload: '/kits/card-orla.png' },
];

const mockLeads: Lead[] = [
  // Novos
  { id: 'l1', nome: 'Carlos Menezes', status: 'novo', territorio: 'Grande Aracaju', email: 'carlos@email.com', telefone: '(79) 99999-9999', ultimoContato: '2024-01-15' },
  { id: 'l2', nome: 'Ana Santos', status: 'novo', territorio: 'Agreste Central', email: 'ana@email.com', telefone: '(79) 98888-8888', ultimoContato: '2024-01-14' },
  { id: 'l3', nome: 'Roberto Lima', status: 'novo', territorio: 'Centro Sul', email: 'roberto@email.com', telefone: '(79) 97777-7777', ultimoContato: '2024-01-13' },
  { id: 'l4', nome: 'Maria Oliveira', status: 'novo', territorio: 'Sul Sergipano', email: 'maria@email.com', telefone: '(79) 96666-6666', ultimoContato: '2024-01-12' },
  { id: 'l5', nome: 'João Pereira', status: 'novo', territorio: 'Baixo São Francisco', email: 'joao@email.com', telefone: '(79) 95555-5555', ultimoContato: '2024-01-11' },

  // Contatados
  { id: 'l6', nome: 'Fernanda Costa', status: 'contatado', territorio: 'Alto Sertão', email: 'fernanda@email.com', telefone: '(79) 94444-4444', ultimoContato: '2024-01-10' },
  { id: 'l7', nome: 'Pedro Alves', status: 'contatado', territorio: 'Médio Sertão', email: 'pedro@email.com', telefone: '(79) 93333-3333', ultimoContato: '2024-01-09' },
  { id: 'l8', nome: 'Juliana Souza', status: 'contatado', territorio: 'Leste Sergipano', email: 'juliana@email.com', telefone: '(79) 92222-2222', ultimoContato: '2024-01-08' },
  { id: 'l9', nome: 'Lucas Ferreira', status: 'contatado', territorio: 'Grande Aracaju', email: 'lucas@email.com', telefone: '(79) 91111-1111', ultimoContato: '2024-01-07' },
  { id: 'l10', nome: 'Patricia Rocha', status: 'contatado', territorio: 'Agreste Central', email: 'patricia@email.com', telefone: '(79) 90000-0000', ultimoContato: '2024-01-06' },

  // Engajados
  { id: 'l11', nome: 'Marcos Dias', status: 'engajado', territorio: 'Centro Sul', email: 'marcos@email.com', telefone: '(79) 91234-5678', ultimoContato: '2024-01-05' },
  { id: 'l12', nome: 'Camila Torres', status: 'engajado', territorio: 'Sul Sergipano', email: 'camila@email.com', telefone: '(79) 98765-4321', ultimoContato: '2024-01-04' },
  { id: 'l13', nome: 'Ricardo Alves', status: 'engajado', territorio: 'Estância', email: 'ricardo@email.com', telefone: '(79) 99888-7777', ultimoContato: '2024-01-18' },
  { id: 'l14', nome: 'Beatriz Silva', status: 'engajado', territorio: 'Nossa Senhora da Glória', email: 'bia@email.com', telefone: '(79) 98877-6655', ultimoContato: '2024-01-19' },
  { id: 'l15', nome: 'Felipe Santos', status: 'engajado', territorio: 'Itabaiana', email: 'felipe@email.com', telefone: '(79) 97766-5544', ultimoContato: '2024-01-20' },

  // Multiplicadores
  { id: 'l16', nome: 'Mariana Costa', status: 'multiplicador', territorio: 'Lagarto', email: 'mariana@email.com', telefone: '(79) 96655-4433', ultimoContato: '2024-01-21' },
  { id: 'l17', nome: 'José Wellington', status: 'multiplicador', territorio: 'Propriá', email: 'jose@email.com', telefone: '(79) 95544-3322', ultimoContato: '2024-01-22' },
  { id: 'l18', nome: 'Cláudia Nunes', status: 'multiplicador', territorio: 'Tobias Barreto', email: 'claudia@email.com', telefone: '(79) 94433-2211', ultimoContato: '2024-01-23' },
  { id: 'l19', nome: 'Sérgio Lima', status: 'multiplicador', territorio: 'São Cristóvão', email: 'sergio@email.com', telefone: '(79) 93322-1100', ultimoContato: '2024-01-24' },
  { id: 'l20', nome: 'Valéria Rocha', status: 'multiplicador', territorio: 'Simão Dias', email: 'valeria@email.com', telefone: '(79) 92211-0099', ultimoContato: '2024-01-25' },
];
const mockBoatos: Boato[] = [
  { 
    id: 'b1', 
    titulo: 'Fake sobre privatização da DESO', 
    nivel: 'critico', 
    status: 'aguardando_juridico',
    tema: 'Fake sobre Infraestrutura',
    territorio: 'Grande Aracaju', 
    dataDeteccao: '2024-01-15', 
    fonte: 'WhatsApp',
    volumeViralizacao: 95,
    linhaOficial: undefined,
    kitsRelacionados: ['k4']
  },
  { 
    id: 'b2', 
    titulo: 'Boato sobre atraso em obras da Ponte Aracaju-Barra', 
    nivel: 'alto', 
    status: 'resposta_aprovada',
    tema: 'Desinformação sobre Obras',
    territorio: 'Grande Aracaju', 
    dataDeteccao: '2024-01-14', 
    fonte: 'Twitter/X',
    volumeViralizacao: 78,
    linhaOficial: 'As obras da Ponte Aracaju-Barra estão dentro do cronograma. Confira as imagens aéreas atualizadas no Portal da Transparência.',
    kitsRelacionados: ['k9']
  },
  { 
    id: 'b3', 
    titulo: 'Desinformação sobre escala de médicos no HUSE', 
    nivel: 'critico', 
    status: 'aguardando_juridico',
    tema: 'Fake sobre Saúde',
    territorio: 'Grande Aracaju', 
    dataDeteccao: '2024-01-13', 
    fonte: 'Facebook',
    volumeViralizacao: 88,
    linhaOficial: undefined,
    kitsRelacionados: ['k2']
  },
  { 
    id: 'b4', 
    titulo: 'Rumor sobre fechamento de hospital regional em Itabaiana', 
    nivel: 'medio', 
    status: 'monitorando',
    tema: 'Desinformação Local',
    territorio: 'Agreste Central', 
    dataDeteccao: '2024-01-12', 
    fonte: 'Instagram',
    volumeViralizacao: 34,
    linhaOficial: undefined,
    kitsRelacionados: []
  },
  { 
    id: 'b5', 
    titulo: 'Manipulação de dados sobre segurança em Lagarto', 
    nivel: 'alto', 
    status: 'resposta_aprovada',
    tema: 'Fake sobre Segurança',
    territorio: 'Centro Sul', 
    dataDeteccao: '2024-01-11', 
    fonte: 'Telegram',
    volumeViralizacao: 65,
    linhaOficial: 'Os dados da SSP-SE mostram queda de 22% nos índices de criminalidade em Lagarto. Consulte o relatório oficial.',
    kitsRelacionados: ['k1']
  },
  { 
    id: 'b6', 
    titulo: 'Áudio de IA imitando José da Silva', 
    nivel: 'critico', 
    status: 'aguardando_juridico',
    tema: 'Deepfake',
    territorio: 'Alto Sertão', 
    dataDeteccao: '2024-01-10', 
    fonte: 'WhatsApp',
    volumeViralizacao: 92,
    linhaOficial: undefined,
    kitsRelacionados: ['k3']
  },
];

const mockLogs: LogEvento[] = [
  { id: 'log1', acao: 'Kit aprovado', usuario: 'Admin', timestamp: '2024-01-15 14:30', detalhes: 'Kit Segurança Pública Sergipe aprovado' },
  { id: 'log2', acao: 'Lead atualizado', usuario: 'Liderança', timestamp: '2024-01-15 13:45', detalhes: 'Status alterado para multiplicador - Itabaiana' },
  { id: 'log3', acao: 'Boato detectado', usuario: 'Sistema', timestamp: '2024-01-15 12:00', detalhes: 'Alerta automático - Fake DESO em Grande Aracaju' },
  { id: 'log4', acao: 'Acesso ao sistema', usuario: 'Jurídico', timestamp: '2024-01-15 11:30', detalhes: 'Login realizado - Portal Governo SE' },
  { id: 'log5', acao: 'Relatório exportado', usuario: 'Admin', timestamp: '2024-01-15 10:15', detalhes: 'Relatório mensal Sergipe gerado' },
];

const mockPendingApprovals: PendingApproval[] = [
  { 
    id: 'pa1', 
    tipo: 'kit', 
    itemId: 'k2', 
    titulo: 'Card: Saúde em Números', 
    conteudo: 'Card para redes sociais com dados de saúde', 
    solicitante: 'Marketing',
    dataSolicitacao: '2024-01-14 09:30',
    compliance: { semDeepfake: true, comFontes: false, semOfensas: true }
  },
  { 
    id: 'pa2', 
    tipo: 'kit', 
    itemId: 'k6', 
    titulo: 'Card: Educação Transformadora', 
    conteudo: 'Card com dados de investimento em educação', 
    solicitante: 'Comunicação',
    dataSolicitacao: '2024-01-14 10:15',
    compliance: { semDeepfake: true, comFontes: true, semOfensas: true }
  },
  { 
    id: 'pa3', 
    tipo: 'kit', 
    itemId: 'k8', 
    titulo: 'Meme: Comparativo Gestões', 
    conteudo: 'Meme comparando antes/depois da gestão', 
    solicitante: 'Redes Sociais',
    dataSolicitacao: '2024-01-14 11:00',
    compliance: { semDeepfake: false, comFontes: true, semOfensas: false }
  },
  { 
    id: 'pa4', 
    tipo: 'argumento', 
    itemId: 'arg1', 
    titulo: 'Argumento sobre Saúde Pública', 
    conteudo: 'Resposta gerada por IA sobre investimentos em saúde', 
    solicitante: 'Liderança Regional',
    dataSolicitacao: '2024-01-14 14:30',
    compliance: { semDeepfake: true, comFontes: true, semOfensas: true }
  },
];

export function GovMeshProvider({ children }: { children: ReactNode }) {
  const [kits, setKits] = useState<Kit[]>(mockKits);
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [boatos, setBoatos] = useState<Boato[]>(mockBoatos);
  const [logs, setLogs] = useState<LogEvento[]>(mockLogs);
  const [argumentos, setArgumentos] = useState<ArgumentoGerado[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>(mockPendingApprovals);
  const [userProfile, setUserProfile] = useState<UserProfile>('Admin');
  const [isLocked, setIsLocked] = useState(false);
  const [isElectoralMode, setIsElectoralMode] = useState(false);
  const [isSystemLocked, setIsSystemLocked] = useState(false);

  const toggleKillSwitch = () => {
    const newState = !isSystemLocked;
    setIsSystemLocked(newState);
    addLog({
      acao: newState ? '🚨 KILL SWITCH ATIVADO' : '✅ KILL SWITCH DESATIVADO',
      usuario: userProfile,
      detalhes: newState 
        ? 'Protocolo de Emergência ativado - Todas as ações de saída de dados foram bloqueadas' 
        : 'Protocolo de Emergência desativado - Sistema operacional restaurado',
      modulo: 'Segurança',
      territorio: 'Global',
    });
  };

  const addLog = (log: Omit<LogEvento, 'id' | 'timestamp'> & { modulo?: string; territorio?: string }) => {
    const newLog: LogEvento = {
      ...log,
      id: `log${Date.now()}`,
      timestamp: new Date().toLocaleString('pt-BR'),
      detalhes: log.modulo ? `[${log.modulo}] ${log.detalhes}${log.territorio ? ` - ${log.territorio}` : ''}` : log.detalhes,
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const addArgumento = (arg: Omit<ArgumentoGerado, 'id' | 'dataCriacao'>) => {
    const newArg: ArgumentoGerado = {
      ...arg,
      id: `arg${Date.now()}`,
      dataCriacao: new Date().toLocaleString('pt-BR'),
    };
    setArgumentos(prev => [newArg, ...prev]);
  };

  const updateLeadStatus = (leadId: string, newStatus: LeadStatus) => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId ? { ...lead, status: newStatus } : lead
    ));
    const lead = leads.find(l => l.id === leadId);
    if (lead) {
      addLog({
        acao: 'Lead movido',
        usuario: userProfile,
        detalhes: `${lead.nome} movido para ${newStatus}`,
        modulo: 'CRM',
        territorio: lead.territorio,
      });
    }
  };

  const approveItem = (approvalId: string) => {
    const approval = pendingApprovals.find(p => p.id === approvalId);
    if (!approval) return;

    if (approval.tipo === 'kit') {
      setKits(prev => prev.map(kit => 
        kit.id === approval.itemId ? { ...kit, status: 'aprovado' as const } : kit
      ));
    }

    setPendingApprovals(prev => prev.filter(p => p.id !== approvalId));
    
    addLog({
      acao: 'Item aprovado',
      usuario: userProfile,
      detalhes: `${approval.titulo} aprovado pelo Jurídico`,
      modulo: 'Jurídico',
    });
  };

  const rejectItem = (approvalId: string, motivo: string) => {
    const approval = pendingApprovals.find(p => p.id === approvalId);
    if (!approval) return;

    if (approval.tipo === 'kit') {
      setKits(prev => prev.map(kit => 
        kit.id === approval.itemId ? { ...kit, status: 'bloqueado' as const } : kit
      ));
    }

    setPendingApprovals(prev => prev.filter(p => p.id !== approvalId));
    
    addLog({
      acao: 'Item reprovado',
      usuario: userProfile,
      detalhes: `${approval.titulo} reprovado: ${motivo}`,
      modulo: 'Jurídico',
    });
  };

  const updateCompliance = (approvalId: string, field: keyof PendingApproval['compliance'], value: boolean) => {
    setPendingApprovals(prev => prev.map(p => 
      p.id === approvalId 
        ? { ...p, compliance: { ...p.compliance, [field]: value } }
        : p
    ));
  };

  return (
    <GovMeshContext.Provider value={{
      kits,
      leads,
      boatos,
      logs,
      argumentos,
      pendingApprovals,
      userProfile,
      isLocked,
      isElectoralMode,
      isSystemLocked,
      setUserProfile,
      setKits,
      setLeads,
      setBoatos,
      addLog,
      addArgumento,
      updateLeadStatus,
      approveItem,
      rejectItem,
      updateCompliance,
      setIsLocked,
      setIsElectoralMode,
      toggleKillSwitch,
    }}>
      {children}
    </GovMeshContext.Provider>
  );
}

export function useGovMesh() {
  const context = useContext(GovMeshContext);
  if (!context) {
    throw new Error('useGovMesh must be used within a GovMeshProvider');
  }
  return context;
}
