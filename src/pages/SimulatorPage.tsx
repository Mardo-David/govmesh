import { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, Video, ShieldAlert, Camera, 
  Truck, Target, Play, Pause, RotateCcw, Mic, 
  Check, CheckCheck, Phone, ChevronLeft, Bot, 
  Image as ImageIcon, Zap, FastForward, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';

// --- ARQUITETURA DE DADOS (TIPOS) ---

type StepType = 'typing' | 'text' | 'audio' | 'forwarded' | 'image' | 'video' | 'button' | 'system';

interface Step {
  id: string;
  type: StepType;
  sender: 'user' | 'agent' | 'system';
  content?: string;
  mediaMeta?: string; // Duração, nome do arquivo, legenda
  delayMs: number; // Tempo de espera ANTES de executar este passo
  backstageKeys?: string[]; // Quais chips técnicos acender
}

interface Scenario {
  id: string;
  title: string;
  description: string;
  icon: any;
  techSummary: string;
  techChips: string[];
  steps: Step[];
}

// --- DADOS DOS CENÁRIOS (ROTEIROS) ---

const SCENARIOS: Scenario[] = [
  {
    id: 'onboarding',
    title: 'Onboarding & Segurança',
    description: 'Entrada segura e validação.',
    icon: ShieldAlert,
    techSummary: 'Validação de identidade em tempo real e registro legal.',
    techChips: ['CRM Lookup', 'Role Detection', 'LGPD Consent', 'Audit Log'],
    steps: [
      { id: '1', type: 'text', sender: 'user', content: 'Oi, quero ajudar na campanha.', delayMs: 500 },
      { id: '2', type: 'typing', sender: 'agent', delayMs: 800 },
      { id: '3', type: 'text', sender: 'agent', content: 'Olá! Sou a IA do Candidato Zé. Para liberar seu acesso, digite apenas o seu CPF.', delayMs: 1500, backstageKeys: ['CRM Lookup'] },
      { id: '4', type: 'text', sender: 'user', content: '000.111.222-33', delayMs: 2500 },
      { id: '5', type: 'typing', sender: 'agent', delayMs: 600 },
      { id: '6', type: 'text', sender: 'agent', content: '✅ Identifiquei você, Carlos (Capitão Regional).', delayMs: 1200, backstageKeys: ['Role Detection'] },
      { id: '7', type: 'text', sender: 'agent', content: 'Para continuar, você concorda com nossos termos de uso e LGPD?', delayMs: 1000 },
      { id: '8', type: 'button', sender: 'agent', content: '👍 LI E CONCORDO', delayMs: 500, backstageKeys: ['LGPD Consent'] },
      { id: '9', type: 'typing', sender: 'agent', delayMs: 600 },
      { id: '10', type: 'text', sender: 'agent', content: 'Acesso liberado! 🔓 O que vamos fazer hoje?', delayMs: 1000, backstageKeys: ['Audit Log'] },
    ]
  },
  {
    id: 'kits',
    title: 'Entrega de Munição',
    description: 'Distribuição de materiais nativos.',
    icon: Video,
    techSummary: 'Entendimento semântico e envio de mídia sem links externos.',
    techChips: ['Audio Transcription', 'Intent Detection', 'Approved Kits DB', 'Native Send'],
    steps: [
      { id: '1', type: 'audio', sender: 'user', mediaMeta: '0:08', content: 'audio_request.mp3', delayMs: 500, backstageKeys: ['Audio Transcription'] },
      { id: '2', type: 'typing', sender: 'agent', delayMs: 1000 },
      { id: '3', type: 'text', sender: 'agent', content: 'Entendido, Carlos! 🏥', delayMs: 1200, backstageKeys: ['Intent Detection'] },
      { id: '4', type: 'text', sender: 'agent', content: 'Aqui está o vídeo oficial aprovado pelo jurídico. Pode encaminhar!', delayMs: 1000, backstageKeys: ['Approved Kits DB'] },
      { id: '5', type: 'video', sender: 'agent', content: 'Hospital_Novo.mp4', mediaMeta: 'Saúde levada a sério! Compartilhe a verdade.', delayMs: 1500, backstageKeys: ['Native Send'] },
    ]
  },
  {
    id: 'fakenews',
    title: 'Caça-Fantasmas',
    description: 'Combate a Fake News.',
    icon: ShieldAlert,
    techSummary: 'Detecção de viralidade e resposta oficial instantânea.',
    techChips: ['Viral Match', 'War Room DB', 'Official Response', 'Instant Reply'],
    steps: [
      { id: '1', type: 'forwarded', sender: 'user', content: 'Dizem que o Zé vai fechar a escola do bairro...', delayMs: 800, backstageKeys: ['Viral Match'] },
      { id: '2', type: 'typing', sender: 'agent', delayMs: 600 },
      { id: '3', type: 'text', sender: 'agent', content: '🚨 Atenção! Isso é FAKE NEWS.', delayMs: 800, backstageKeys: ['War Room DB'] },
      { id: '4', type: 'text', sender: 'agent', content: 'Já analisamos esse boato. A verdade é que a escola será reformada.', delayMs: 1200 },
      { id: '5', type: 'image', sender: 'agent', content: 'card_desmentido.jpg', mediaMeta: 'FATO ou FAKE?', delayMs: 1000, backstageKeys: ['Official Response'] },
      { id: '6', type: 'text', sender: 'agent', content: 'Mande esse card agora no grupo onde você viu a mentira!', delayMs: 1000, backstageKeys: ['Instant Reply'] },
    ]
  },
  {
    id: 'ocr',
    title: 'Cadastro via Foto',
    description: 'OCR e Visão Computacional.',
    icon: Camera,
    techSummary: 'Extração de dados de imagem para cadastro automático.',
    techChips: ['Vision OCR', 'Field Extraction', 'CRM Format', 'Error Check'],
    steps: [
      { id: '1', type: 'text', sender: 'user', content: 'Consegui mais um apoio aqui!', delayMs: 500 },
      { id: '2', type: 'image', sender: 'user', content: 'titulo_eleitor.jpg', mediaMeta: 'Foto enviada', delayMs: 1000, backstageKeys: ['Vision OCR'] },
      { id: '3', type: 'typing', sender: 'agent', delayMs: 1500 },
      { id: '4', type: 'text', sender: 'agent', content: 'Boa! Li os dados aqui:\nNome: Maria da Silva\nZona: 123 / Seção: 045', delayMs: 1000, backstageKeys: ['Field Extraction'] },
      { id: '5', type: 'text', sender: 'agent', content: 'Posso confirmar o cadastro dela na sua base de Lagarto?', delayMs: 1000, backstageKeys: ['CRM Format'] },
      { id: '6', type: 'text', sender: 'user', content: 'Pode sim.', delayMs: 1500, backstageKeys: ['Error Check'] },
    ]
  },
  {
    id: 'logistica',
    title: 'Logística (Frota)',
    description: 'Gestão de recursos.',
    icon: Truck,
    techSummary: 'Categorização de ativos e agendamento logístico.',
    techChips: ['Entity Categorization', 'Resource Logistics', 'Event Scheduling'],
    steps: [
      { id: '1', type: 'text', sender: 'user', content: 'Tenho um carro pra adesivar.', delayMs: 500 },
      { id: '2', type: 'typing', sender: 'agent', delayMs: 800 },
      { id: '3', type: 'text', sender: 'agent', content: 'Show! Qual o modelo e cor? 🚗', delayMs: 1000, backstageKeys: ['Entity Categorization'] },
      { id: '4', type: 'text', sender: 'user', content: 'É um Gol Prata.', delayMs: 2000 },
      { id: '5', type: 'typing', sender: 'agent', delayMs: 800 },
      { id: '6', type: 'text', sender: 'agent', content: 'Anotado. Você prefere o adesivo do vidro traseiro todo (perfurado) ou só o lateral?', delayMs: 1500, backstageKeys: ['Resource Logistics'] },
      { id: '7', type: 'text', sender: 'user', content: 'O vidro todo.', delayMs: 2000 },
      { id: '8', type: 'text', sender: 'agent', content: 'Perfeito. Sábado teremos um Pit Stop na Praça da Matriz. Te aviso o horário!', delayMs: 1500, backstageKeys: ['Event Scheduling'] },
    ]
  },
  {
    id: 'metas',
    title: 'Gerente de Metas',
    description: 'Follow-up ativo.',
    icon: Target,
    techSummary: 'Monitoramento de performance e gatilhos de inatividade.',
    techChips: ['Gamification Progress', 'Inactivity Trigger', 'CRM Update'],
    steps: [
      { id: '1', type: 'typing', sender: 'agent', delayMs: 500 },
      { id: '2', type: 'text', sender: 'agent', content: 'E aí, Carlos! 👋', delayMs: 1000 },
      { id: '3', type: 'text', sender: 'agent', content: 'Vi que faltam só 2 cadastros para você bater a meta da semana e ganhar +500 XP.', delayMs: 1500, backstageKeys: ['Gamification Progress'] },
      { id: '4', type: 'text', sender: 'agent', content: 'Conseguiu falar com aquele seu vizinho que estava indeciso?', delayMs: 1000, backstageKeys: ['Inactivity Trigger'] },
      { id: '5', type: 'text', sender: 'user', content: 'Falei sim, ele garantiu o voto!', delayMs: 2500 },
      { id: '6', type: 'typing', sender: 'agent', delayMs: 800 },
      { id: '7', type: 'text', sender: 'agent', content: 'Excelente! Já atualizei aqui. 🚀 Falta só 1 agora!', delayMs: 1200, backstageKeys: ['CRM Update'] },
    ]
  }
];

// --- COMPONENTES AUXILIARES ---

const MessageBubble = ({ step, onButtonClick }: { step: Step, onButtonClick: () => void }) => {
  const isUser = step.sender === 'user';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={cn("flex w-full mb-2", isUser ? "justify-end" : "justify-start")}
    >
      <div className={cn(
        "max-w-[85%] rounded-lg p-2 text-sm relative shadow-sm",
        isUser ? "bg-[#005c4b] text-white rounded-tr-none" : "bg-[#202c33] text-gray-100 rounded-tl-none"
      )}>
        {/* Encaminhada */}
        {step.type === 'forwarded' && (
          <div className="flex items-center gap-1 text-[10px] italic text-gray-400 mb-1">
            <FastForward className="w-3 h-3" /> Encaminhada
          </div>
        )}

        {/* Conteúdo Texto */}
        {(step.type === 'text' || step.type === 'forwarded') && (
          <p className="leading-relaxed whitespace-pre-wrap">{step.content}</p>
        )}

        {/* Audio Player Fake */}
        {step.type === 'audio' && (
          <div className="flex items-center gap-3 pr-2 min-w-[140px]">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-slate-700/50 flex items-center justify-center">
                 <Mic className={cn("w-4 h-4", isUser ? "text-green-300" : "text-blue-400")} />
              </div>
            </div>
            <div className="flex-1">
               <div className="h-1 bg-white/30 rounded-full w-full mb-1 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: '100%' }} 
                    transition={{ duration: 2 }}
                    className="h-full bg-blue-400"
                  />
               </div>
               <span className="text-[10px] opacity-80">{step.mediaMeta} • Reproduzido</span>
            </div>
          </div>
        )}

        {/* Imagem / Video */}
        {(step.type === 'image' || step.type === 'video') && (
          <div className="space-y-1">
             <div className="bg-slate-800 h-32 w-48 rounded flex items-center justify-center text-slate-500 bg-cover bg-center relative overflow-hidden" 
                  style={{ backgroundImage: step.type === 'image' ? 'linear-gradient(45deg, #1f2937 25%, #374151 25%)' : undefined }}>
                {step.type === 'video' && <div className="absolute inset-0 flex items-center justify-center bg-black/40"><Play className="w-8 h-8 text-white fill-white" /></div>}
                {step.type === 'image' && <ImageIcon className="w-8 h-8 opacity-50" />}
             </div>
             {step.mediaMeta && <p className="text-xs pt-1">{step.mediaMeta}</p>}
          </div>
        )}

        {/* Botão Interativo */}
        {step.type === 'button' && (
          <div className="space-y-2">
             <p className="opacity-80 pb-2 border-b border-white/10 text-xs text-center">Ação necessária</p>
             <button 
                onClick={onButtonClick}
                className="w-full py-1.5 text-blue-400 font-bold hover:bg-white/5 rounded text-center transition-colors animate-pulse"
             >
               {step.content}
             </button>
          </div>
        )}

        {/* Metadata */}
        <div className="flex justify-end items-center gap-1 mt-1 opacity-60">
           <span className="text-[9px]">10:42</span>
           {isUser && <CheckCheck className="w-3 h-3 text-blue-400" />}
        </div>
      </div>
    </motion.div>
  );
};

// --- PÁGINA PRINCIPAL ---

export default function SimulatorPage() {
  const [activeScenarioId, setActiveScenarioId] = useState(SCENARIOS[0].id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [cursor, setCursor] = useState(0); // Qual passo estamos
  const [speed, setSpeed] = useState(1);
  const [activeBackstageKeys, setActiveBackstageKeys] = useState<Set<string>>(new Set());
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentScenario = SCENARIOS.find(s => s.id === activeScenarioId)!;
  const currentStep = currentScenario.steps[cursor];
  const isFinished = cursor >= currentScenario.steps.length;

  // Reset ao trocar cenário
  useEffect(() => {
    setIsPlaying(false);
    setCursor(0);
    setActiveBackstageKeys(new Set());
  }, [activeScenarioId]);

  // Engine de Playback
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isPlaying && !isFinished && currentStep) {
      // Se for botão, PAUSA e espera clique.
      if (currentStep.type === 'button') {
        setIsPlaying(false);
        return;
      }

      const realDelay = currentStep.delayMs / speed;

      timeout = setTimeout(() => {
        // Ativar chips do backstage do passo atual
        if (currentStep.backstageKeys) {
          setActiveBackstageKeys(prev => {
            const next = new Set(prev);
            currentStep.backstageKeys?.forEach(k => next.add(k));
            return next;
          });
        }
        
        setCursor(c => c + 1);
      }, realDelay);
    }

    return () => clearTimeout(timeout);
  }, [isPlaying, cursor, currentStep, speed, isFinished]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [cursor, currentStep?.type]);

  // Controles
  const handlePlayPause = () => {
    if (isFinished) {
      setCursor(0);
      setActiveBackstageKeys(new Set());
    }
    setIsPlaying(!isPlaying);
  };

  const handleReplay = () => {
    setCursor(0);
    setActiveBackstageKeys(new Set());
    setIsPlaying(true);
  };

  const handleButtonClick = () => {
    // Avança manual quando clica no botão do chat
    setCursor(c => c + 1);
    setIsPlaying(true);
  };

  // Renderização dos passos visíveis (até o cursor)
  // Nota: Se o currentStep for 'typing', ele não entra na lista "visibleHistory", ele é renderizado à parte
  const visibleHistory = currentScenario.steps.slice(0, cursor).filter(s => s.type !== 'typing');
  const isTyping = currentStep?.type === 'typing' && isPlaying;

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 animate-fade-in flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Bot className="w-8 h-8 text-primary" />
            Cérebro do WhatsApp
          </h1>
          <p className="text-muted-foreground mt-1">Simulador de fluxos e capacidades do Agente GovMesh.</p>
        </div>
        
        {/* Controls Bar */}
        <div className="flex items-center gap-4 bg-card border border-border p-2 rounded-xl shadow-sm">
          <div className="flex items-center gap-1">
             <Button variant="ghost" size="icon" onClick={handlePlayPause} className={cn("h-8 w-8", isPlaying && "text-green-500")}>
               {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
             </Button>
             <Button variant="ghost" size="icon" onClick={handleReplay} className="h-8 w-8">
               <RotateCcw className="w-4 h-4" />
             </Button>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2 px-2">
             <span className="text-xs font-bold text-muted-foreground">Velocidade: {speed}x</span>
             <div className="flex gap-1">
               {[1, 1.5, 2].map(s => (
                 <button 
                   key={s} 
                   onClick={() => setSpeed(s)}
                   className={cn("w-6 h-6 text-[10px] rounded border transition-all", speed === s ? "bg-primary text-white border-primary" : "bg-transparent text-muted-foreground border-border")}
                 >
                   {s}x
                 </button>
               ))}
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-[600px]">
        
        {/* COLUNA 1: MENU (3 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar h-[calc(100vh-200px)]">
          {SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => setActiveScenarioId(scenario.id)}
              className={cn(
                "flex items-start gap-3 p-4 rounded-xl text-left transition-all duration-300 border group relative overflow-hidden",
                activeScenarioId === scenario.id 
                  ? "bg-primary/10 border-primary shadow-md" 
                  : "bg-card hover:bg-card/80 border-border"
              )}
            >
              {activeScenarioId === scenario.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />}
              <div className={cn(
                "p-2 rounded-lg shrink-0 transition-colors",
                activeScenarioId === scenario.id ? "bg-primary text-white" : "bg-secondary text-muted-foreground group-hover:text-foreground"
              )}>
                <scenario.icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className={cn("font-bold text-sm", activeScenarioId === scenario.id ? "text-primary" : "text-foreground")}>
                  {scenario.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {scenario.description}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* COLUNA 2: PHONE STAGE (5 cols) */}
        <div className="lg:col-span-5 flex items-center justify-center bg-black/5 rounded-3xl border border-black/5 relative p-4">
           {/* MOCKUP */}
           <div className="relative w-full max-w-[350px] aspect-[9/19.5] bg-black rounded-[2.5rem] border-[8px] border-slate-800 shadow-2xl overflow-hidden flex flex-col z-10">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-b-xl z-20 flex justify-center items-end pb-1">
                 <div className="w-12 h-1 bg-slate-800 rounded-full" />
              </div>

              {/* Header WhatsApp */}
              <div className="bg-[#202c33] px-4 pt-8 pb-3 flex items-center gap-3 border-b border-white/5 z-10 shadow-md">
                 <ChevronLeft className="w-6 h-6 text-blue-400 -ml-2" />
                 <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white">
                   <Bot className="w-5 h-5" />
                 </div>
                 <div className="flex-1 cursor-pointer">
                   <h3 className="text-gray-100 text-sm font-semibold flex items-center gap-1">
                     GovMesh Assist <CheckCheck className="w-3 h-3 text-green-500" />
                   </h3>
                   <p className="text-[10px] text-gray-400">Conta comercial oficial</p>
                 </div>
              </div>

              {/* Chat Area */}
              <div 
                ref={scrollRef}
                className="flex-1 bg-[#0b141a] p-4 overflow-y-auto space-y-1 relative scroll-smooth"
                style={{ backgroundImage: 'radial-gradient(#1f2c34 1px, transparent 1px)', backgroundSize: '20px 20px' }}
              >
                <div className="text-[10px] text-center text-[#8696a0] bg-[#182229] py-1 px-3 rounded-lg mx-auto w-fit mb-4 shadow-sm select-none">
                  🔒 As mensagens são protegidas com criptografia de ponta-a-ponta.
                </div>

                {visibleHistory.map((step) => (
                  <MessageBubble key={step.id} step={step} onButtonClick={handleButtonClick} />
                ))}

                {isTyping && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start mb-2">
                    <div className="bg-[#202c33] rounded-lg rounded-tl-none p-3 flex gap-1 items-center h-9 w-16 justify-center">
                      <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </motion.div>
                )}
                
                <div className="h-4" /> {/* Spacer footer */}
              </div>

              {/* Footer Input */}
              <div className="bg-[#202c33] p-2 flex items-center gap-2 pb-5 pt-3">
                 <div className="flex-1 bg-[#2a3942] rounded-full h-9 flex items-center px-4 text-gray-400 text-sm justify-between">
                   <span>Mensagem</span>
                   <FileText className="w-4 h-4 opacity-50" />
                 </div>
                 <div className="w-10 h-10 bg-[#005c4b] rounded-full flex items-center justify-center shadow-lg">
                   <Mic className="w-5 h-5 text-white" />
                 </div>
              </div>
           </div>
        </div>

        {/* COLUNA 3: BACKSTAGE (4 cols) */}
        <div className="lg:col-span-4 flex flex-col justify-center">
           <AnimatePresence mode="wait">
             <motion.div 
               key={currentScenario.id}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="bg-card border border-border p-6 rounded-2xl relative overflow-hidden shadow-xl"
             >
               {/* Background Tech Effect */}
               <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                 <Zap className="w-32 h-32 rotate-12" />
               </div>

               <Badge className="bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 mb-6 border-purple-500/20">
                 NOS BASTIDORES
               </Badge>
               
               <h3 className="text-xl font-bold text-foreground mb-4">
                 Processamento em Tempo Real
               </h3>
               
               <p className="text-muted-foreground leading-relaxed text-sm mb-6">
                 {currentScenario.techSummary}
               </p>

               <div className="space-y-3">
                 <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Pipeline de Execução:</p>
                 <div className="flex flex-col gap-2">
                   {currentScenario.techChips.map((chip, idx) => {
                     const isActive = activeBackstageKeys.has(chip);
                     return (
                       <div 
                         key={chip}
                         className={cn(
                           "flex items-center justify-between p-3 rounded-lg border transition-all duration-500",
                           isActive 
                             ? "bg-green-500/10 border-green-500/30 text-green-400 translate-x-2 shadow-[0_0_10px_rgba(34,197,94,0.1)]" 
                             : "bg-secondary/30 border-border text-muted-foreground"
                         )}
                       >
                         <div className="flex items-center gap-3 text-sm font-medium">
                           <div className={cn("w-2 h-2 rounded-full", isActive ? "bg-green-500 animate-pulse" : "bg-gray-600")} />
                           {chip}
                         </div>
                         {isActive && <Check className="w-4 h-4 animate-in zoom-in" />}
                       </div>
                     );
                   })}
                 </div>
               </div>

               {/* Status Bar */}
               <div className="mt-8 pt-6 border-t border-border flex justify-between items-center">
                 <div className="text-xs text-muted-foreground">Latência média: <span className="text-green-400 font-mono">45ms</span></div>
                 <div className="flex gap-1">
                   <div className="w-1 h-3 bg-green-500 rounded-full animate-pulse" />
                   <div className="w-1 h-2 bg-green-500/50 rounded-full" />
                   <div className="w-1 h-4 bg-green-500/80 rounded-full animate-pulse delay-75" />
                 </div>
               </div>
             </motion.div>
           </AnimatePresence>
        </div>

      </div>
    </div>
  );
}