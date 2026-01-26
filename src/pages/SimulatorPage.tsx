import { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, Video, ShieldAlert, Camera, 
  Truck, Target, Play, Mic, Check, CheckCheck, 
  MoreVertical, Phone, ChevronLeft, Bot, User,
  FileVideo, Image as ImageIcon, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// --- TIPOS E DADOS ---

type MessageType = 'text' | 'audio' | 'image' | 'video' | 'button' | 'system';

interface Message {
  id: number;
  sender: 'user' | 'ai';
  type: MessageType;
  content: string;
  mediaMeta?: string; // Para duração de áudio, nome de arquivo, etc.
  delay: number; // Tempo para "digitar"
}

interface Scenario {
  id: string;
  title: string;
  icon: any;
  description: string;
  techContext: string; // O box "Nos Bastidores"
  messages: Message[];
}

const SCENARIOS: Scenario[] = [
  {
    id: 'onboarding',
    title: 'Onboarding & Segurança',
    icon: ShieldAlert,
    description: 'Entrada segura e validação de dados.',
    techContext: 'O sistema valida o CPF na base do CRM em milissegundos e registra o aceite legal (LGPD) para auditoria futura, eliminando a necessidade de formulários em papel.',
    messages: [
      { id: 1, sender: 'user', type: 'text', content: 'Oi, quero ajudar na campanha.', delay: 500 },
      { id: 2, sender: 'ai', type: 'text', content: 'Olá! Sou a IA do Candidato Zé. Para liberar seu acesso, digite apenas o seu CPF.', delay: 1500 },
      { id: 3, sender: 'user', type: 'text', content: '000.111.222-33', delay: 3000 },
      { id: 4, sender: 'ai', type: 'text', content: '✅ Identifiquei você, Carlos (Capitão Regional).', delay: 1000 },
      { id: 5, sender: 'ai', type: 'text', content: 'Para continuar, você concorda com nossos termos de uso e LGPD?', delay: 800 },
      { id: 6, sender: 'ai', type: 'button', content: '👍 LI E CONCORDO', delay: 500 },
      { id: 7, sender: 'ai', type: 'text', content: 'Acesso liberado! 🔓 O que vamos fazer hoje?', delay: 1000 },
    ]
  },
  {
    id: 'kits',
    title: 'Entrega de Munição',
    icon: Video,
    description: 'Distribuição de materiais sem links externos.',
    techContext: 'A IA transcreveu o áudio, entendeu a intenção semântica ("vídeo" + "hospital"), buscou no banco de kits aprovados e enviou o arquivo nativo para maximizar a conversão.',
    messages: [
      { id: 1, sender: 'user', type: 'audio', content: 'Pessoal tá pedindo aquele vídeo sobre o novo hospital aqui no grupo da família.', mediaMeta: '0:08', delay: 500 },
      { id: 2, sender: 'ai', type: 'text', content: 'Entendido, Carlos! 🏥', delay: 1500 },
      { id: 3, sender: 'ai', type: 'text', content: 'Aqui está o vídeo oficial aprovado pelo jurídico. Pode encaminhar!', delay: 1000 },
      { id: 4, sender: 'ai', type: 'video', content: 'video_hospital_versao_final.mp4', mediaMeta: 'Saúde levada a sério!', delay: 1500 },
    ]
  },
  {
    id: 'fakenews',
    title: 'O "Caça-Fantasmas"',
    icon: ShieldAlert, // Usando ShieldAlert como proxy para combate a fake news
    description: 'Defesa automática contra boatos.',
    techContext: 'O sistema reconheceu o texto viral através de hash matching, cruzou com o banco de boatos do War Room e devolveu o card de desmentido oficial instantaneamente.',
    messages: [
      { id: 1, sender: 'user', type: 'text', content: '↪️ Encaminhada: Dizem que o Zé vai fechar a escola do bairro...', delay: 500 },
      { id: 2, sender: 'ai', type: 'text', content: '🚨 Atenção! Isso é FAKE NEWS.', delay: 1000 },
      { id: 3, sender: 'ai', type: 'text', content: 'Já analisamos esse boato. A verdade é que a escola será reformada.', delay: 1000 },
      { id: 4, sender: 'ai', type: 'image', content: 'card_desmentido_escola.jpg', mediaMeta: 'FATO ou FAKE?', delay: 1200 },
      { id: 5, sender: 'ai', type: 'text', content: 'Mande esse card agora no grupo onde você viu a mentira!', delay: 1000 },
    ]
  },
  {
    id: 'ocr',
    title: 'Cadastro via Foto',
    icon: Camera,
    description: 'Fim da digitação manual com OCR.',
    techContext: 'A Visão Computacional extraiu os dados da imagem (OCR), ignorou o fundo da mesa, validou a Zona/Seção com o TSE e formatou o cadastro no CRM sem erro humano.',
    messages: [
      { id: 1, sender: 'user', type: 'text', content: 'Consegui mais um apoio aqui!', delay: 500 },
      { id: 2, sender: 'user', type: 'image', content: 'foto_titulo_eleitor.jpg', mediaMeta: 'Enviando foto...', delay: 1500 },
      { id: 3, sender: 'ai', type: 'text', content: 'Boa! Li os dados aqui:\nNome: Maria da Silva\nZona: 123 / Seção: 045', delay: 2000 },
      { id: 4, sender: 'ai', type: 'text', content: 'Posso confirmar o cadastro dela na sua base de Lagarto?', delay: 1000 },
      { id: 5, sender: 'user', type: 'text', content: 'Pode sim.', delay: 1500 },
    ]
  },
  {
    id: 'logistica',
    title: 'Logística de Frota',
    icon: Truck,
    description: 'Organização de recursos e adesivaço.',
    techContext: 'A IA categorizou o recurso "Veículo" no perfil do voluntário e já preparou a logística do adesivaço baseada no modelo do carro, atualizando o inventário.',
    messages: [
      { id: 1, sender: 'user', type: 'text', content: 'Tenho um carro pra adesivar.', delay: 500 },
      { id: 2, sender: 'ai', type: 'text', content: 'Show! Qual o modelo e cor? 🚗', delay: 1000 },
      { id: 3, sender: 'user', type: 'text', content: 'É um Gol Prata.', delay: 2000 },
      { id: 4, sender: 'ai', type: 'text', content: 'Anotado. Você prefere o adesivo do vidro traseiro todo (perfurado) ou só o lateral?', delay: 1500 },
      { id: 5, sender: 'user', type: 'text', content: 'O vidro todo.', delay: 2000 },
      { id: 6, sender: 'ai', type: 'text', content: 'Perfeito. Sábado teremos um Pit Stop na Praça da Matriz. Te aviso o horário!', delay: 1500 },
    ]
  },
  {
    id: 'metas',
    title: 'Gerente de Metas',
    icon: Target,
    description: 'Cobrança ativa e gamificação.',
    techContext: 'O sistema monitorou o progresso da gamificação e iniciou a conversa ativamente (Gatilho de Inatividade) para motivar o líder a concluir a missão antes do prazo.',
    messages: [
      { id: 1, sender: 'ai', type: 'text', content: 'E aí, Carlos! 👋', delay: 500 },
      { id: 2, sender: 'ai', type: 'text', content: 'Vi que faltam só 2 cadastros para você bater a meta da semana e ganhar +500 XP.', delay: 1000 },
      { id: 3, sender: 'ai', type: 'text', content: 'Conseguiu falar com aquele seu vizinho que estava indeciso?', delay: 1500 },
      { id: 4, sender: 'user', type: 'text', content: 'Falei sim, ele garantiu o voto!', delay: 2500 },
      { id: 5, sender: 'ai', type: 'text', content: 'Excelente! Já atualizei aqui. 🚀 Falta só 1 agora!', delay: 1000 },
    ]
  },
];

export default function SimulatorPage() {
  const [activeScenarioId, setActiveScenarioId] = useState(SCENARIOS[0].id);
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeScenario = SCENARIOS.find(s => s.id === activeScenarioId) || SCENARIOS[0];

  // Engine de Simulação de Chat
  useEffect(() => {
    setVisibleMessages([]); // Limpa o chat
    setIsTyping(false);
    
    let currentIndex = 0;
    let timeouts: NodeJS.Timeout[] = [];

    const playNextMessage = () => {
      if (currentIndex >= activeScenario.messages.length) return;

      const message = activeScenario.messages[currentIndex];
      
      // Simula "Digitando..." antes da mensagem da IA
      if (message.sender === 'ai') {
        setIsTyping(true);
      }

      const timeout = setTimeout(() => {
        setIsTyping(false);
        setVisibleMessages(prev => [...prev, message]);
        currentIndex++;
        
        // Scroll automático
        if (scrollRef.current) {
          setTimeout(() => {
            scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
          }, 100);
        }

        playNextMessage(); // Chama a próxima
      }, message.delay);

      timeouts.push(timeout);
    };

    // Inicia a sequência
    playNextMessage();

    return () => timeouts.forEach(clearTimeout);
  }, [activeScenarioId]);

  return (
    <div className="min-h-screen bg-background p-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Bot className="w-8 h-8 text-primary" />
            Cérebro do WhatsApp
          </h1>
          <p className="text-muted-foreground mt-1">Simulador interativo das capacidades do Agente GovMesh.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-180px)] min-h-[700px]">
        
        {/* COLUNA 1: MENU DE CENÁRIOS */}
        <div className="lg:col-span-3 flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Cenários de Uso</h3>
          {SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => setActiveScenarioId(scenario.id)}
              className={cn(
                "flex items-start gap-4 p-4 rounded-xl text-left transition-all duration-300 border group",
                activeScenarioId === scenario.id 
                  ? "bg-primary/10 border-primary shadow-[0_0_15px_rgba(147,51,234,0.15)]" 
                  : "bg-card hover:bg-card/80 border-border"
              )}
            >
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
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {scenario.description}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* COLUNA 2: O PALCO (PHONE MOCKUP) */}
        <div className="lg:col-span-5 flex items-center justify-center relative">
          {/* Fundo Decorativo */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-full blur-3xl opacity-50" />
          
          {/* MOCKUP DO CELULAR */}
          <div className="relative w-[340px] h-[680px] bg-black rounded-[3rem] border-[8px] border-slate-800 shadow-2xl overflow-hidden flex flex-col shrink-0 z-10">
            {/* Ilha Dinâmica / Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-xl z-20 flex justify-center items-center">
               <div className="w-16 h-4 bg-slate-900 rounded-full flex items-center gap-2 px-2">
                 <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
               </div>
            </div>

            {/* Header do WhatsApp */}
            <div className="bg-[#202c33] p-4 pt-10 flex items-center gap-3 border-b border-white/5 z-10">
               <Button variant="ghost" size="icon" className="text-blue-400 -ml-2 h-8 w-8"><ChevronLeft className="w-6 h-6" /></Button>
               <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white">
                 <Bot className="w-5 h-5" />
               </div>
               <div className="flex-1">
                 <h3 className="text-gray-100 text-sm font-semibold flex items-center gap-1">
                   GovMesh Assist <CheckCheck className="w-3 h-3 text-green-500" />
                 </h3>
                 <p className="text-[10px] text-gray-400">Conta comercial oficial</p>
               </div>
               <div className="flex gap-3 text-blue-400">
                 <Phone className="w-5 h-5" />
                 <Video className="w-5 h-5" />
               </div>
            </div>

            {/* Área de Chat (Scrollable) */}
            <div 
              ref={scrollRef}
              className="flex-1 bg-[#0b141a] p-4 overflow-y-auto space-y-3 relative"
              style={{ backgroundImage: 'radial-gradient(#1f2c34 1px, transparent 1px)', backgroundSize: '20px 20px' }}
            >
              {/* Criptografia msg */}
              <div className="text-[10px] text-center text-[#8696a0] bg-[#182229] py-1 px-3 rounded-lg mx-auto w-fit mb-4 shadow-sm">
                🔒 As mensagens são protegidas com criptografia de ponta-a-ponta.
              </div>

              <AnimatePresence mode='popLayout'>
                {visibleMessages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className={cn(
                      "flex w-full",
                      msg.sender === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    <div className={cn(
                      "max-w-[85%] rounded-lg p-2 text-sm relative shadow-md",
                      msg.sender === 'user' 
                        ? "bg-[#005c4b] text-white rounded-tr-none" 
                        : "bg-[#202c33] text-gray-100 rounded-tl-none"
                    )}>
                      {/* LÓGICA DE RENDERIZAÇÃO POR TIPO */}
                      
                      {msg.type === 'text' && (
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      )}

                      {msg.type === 'audio' && (
                        <div className="flex items-center gap-3 pr-2 min-w-[140px]">
                          <div className="relative">
                            <div className="w-8 h-8 rounded-full bg-slate-700/50 flex items-center justify-center">
                               <Mic className={cn("w-4 h-4", msg.sender === 'user' ? "text-green-300" : "text-blue-400")} />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#005c4b]" />
                          </div>
                          <div className="flex-1">
                             <div className="h-1 bg-white/30 rounded-full w-full mb-1" />
                             <span className="text-[10px] opacity-80">{msg.mediaMeta} • Reproduzido</span>
                          </div>
                        </div>
                      )}

                      {msg.type === 'image' && (
                        <div className="space-y-1">
                           <div className="bg-slate-800 h-32 w-48 rounded flex items-center justify-center text-slate-500 bg-cover bg-center" style={{ backgroundImage: 'linear-gradient(45deg, #1f2937 25%, #374151 25%, #374151 50%, #1f2937 50%, #1f2937 75%, #374151 75%, #374151 100%)' }}>
                              <ImageIcon className="w-8 h-8 opacity-50" />
                           </div>
                           <p className="text-xs pt-1">{msg.mediaMeta}</p>
                        </div>
                      )}

                      {msg.type === 'video' && (
                        <div className="flex items-center gap-3 p-1">
                           <div className="w-10 h-10 bg-black/40 rounded flex items-center justify-center">
                             <Play className="w-5 h-5 fill-white text-white" />
                           </div>
                           <div>
                             <p className="text-xs font-semibold">{msg.content}</p>
                             <p className="text-[10px] opacity-70">MP4 • 2.4 MB</p>
                           </div>
                        </div>
                      )}

                      {msg.type === 'button' && (
                        <div className="space-y-2">
                           <p className="opacity-80 pb-2 border-b border-white/10 text-xs text-center">Selecione uma opção</p>
                           <button className="w-full py-1 text-blue-400 font-semibold hover:bg-white/5 rounded text-center">
                             {msg.content}
                           </button>
                        </div>
                      )}

                      {/* Metadata (Hora e Check) */}
                      <div className="flex justify-end items-center gap-1 mt-1 opacity-60">
                         <span className="text-[9px]">10:42</span>
                         {msg.sender === 'user' && <CheckCheck className="w-3 h-3 text-blue-400" />}
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                    <div className="bg-[#202c33] rounded-lg rounded-tl-none p-3 flex gap-1 items-center h-9">
                      <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer do Chat (Input Fake) */}
            <div className="bg-[#202c33] p-2 flex items-center gap-2 pb-6">
               <Button variant="ghost" size="icon" className="text-gray-400 h-8 w-8"><MessageSquare className="w-5 h-5" /></Button>
               <div className="flex-1 bg-[#2a3942] rounded-full h-9 flex items-center px-4 text-gray-400 text-sm">
                 Mensagem
               </div>
               <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center shadow-lg">
                 <Mic className="w-5 h-5 text-white" />
               </div>
            </div>
          </div>
        </div>

        {/* COLUNA 3: NOS BASTIDORES */}
        <div className="lg:col-span-4 flex flex-col justify-center">
           <motion.div 
             key={activeScenario.id}
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.2 }}
             className="bg-card border border-border p-6 rounded-2xl relative overflow-hidden"
           >
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <Zap className="w-24 h-24 rotate-12" />
             </div>

             <div className="relative z-10">
               <Badge className="bg-primary/20 text-primary hover:bg-primary/20 mb-4 border-none">
                 NOS BASTIDORES
               </Badge>
               
               <h3 className="text-xl font-bold text-foreground mb-4">
                 O que a IA fez aqui?
               </h3>
               
               <p className="text-muted-foreground leading-relaxed text-base">
                 {activeScenario.techContext}
               </p>

               <div className="mt-6 pt-6 border-t border-border flex flex-col gap-3">
                 <div className="flex items-center gap-3 text-sm text-foreground/80">
                   <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                     <Check className="w-4 h-4" />
                   </div>
                   Integração Nativa (API Oficial)
                 </div>
                 <div className="flex items-center gap-3 text-sm text-foreground/80">
                   <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
                     <Check className="w-4 h-4" />
                   </div>
                   Sem instalar App extra
                 </div>
               </div>
             </div>
           </motion.div>
        </div>

      </div>
    </div>
  );
}