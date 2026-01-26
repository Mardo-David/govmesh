import { useState } from 'react';
import { 
  Activity, 
  Search, 
  Filter, 
  TrendingUp, 
  MessageCircle, 
  AlertTriangle, 
  Share2, 
  MapPin, 
  Zap,
  ArrowRight, 
  ShieldAlert,
  ThumbsDown,
  Maximize2,
  CheckCircle2,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

const COLORS = {
  danger: '#FF3B30',
  success: '#34C759',
  info:    '#007AFF',
  warning: '#FFCC00',
};

const narratives = [
  { id: 1, topic: 'Falta de Médicos (HUSE)', sentiment: 'danger', volume: 85, trend: 'up' },
  { id: 2, topic: 'Nova Ponte Aracaju-Barra', sentiment: 'success', volume: 60, trend: 'up' },
  { id: 3, topic: 'Trânsito Av. Beira Mar', sentiment: 'info', volume: 45, trend: 'stable' },
  { id: 4, topic: 'Atraso Salarial Educação', sentiment: 'danger', volume: 30, trend: 'down' },
  { id: 5, topic: 'Inauguração Lagarto', sentiment: 'success', volume: 25, trend: 'up' },
];

const feedAlerts = [
  { 
    id: 1, 
    network: 'Instagram', 
    user: '@influencer_aracaju', 
    summary: 'Vídeo viralizando sobre buracos na Zona Norte. Tom de denúncia forte.',
    risk: 'danger',
    viralScore: 92,
    time: '15 min atrás',
    relatedWa: 45
  },
  { 
    id: 2, 
    network: 'WhatsApp', 
    user: 'Grupos do Agreste', 
    summary: 'Áudio de liderança reclamando de promessa não cumprida em Itabaiana.',
    risk: 'warning',
    viralScore: 88,
    time: '32 min atrás',
    relatedWa: 120
  },
  { 
    id: 3, 
    network: 'Portal de Notícias', 
    user: 'Sergipe Hoje', 
    summary: 'Matéria elogiando a organização do evento de ontem.',
    risk: 'success',
    viralScore: 65,
    time: '1h atrás',
    relatedWa: 12
  }
];

export default function RadarPage() {
  const [selectedNarrative, setSelectedNarrative] = useState<number | null>(null);
  const [isCounterAttackOpen, setIsCounterAttackOpen] = useState(false);
  const [activeAlert, setActiveAlert] = useState<any>(null);

  const handleCreateMission = (alert: any) => {
    setActiveAlert(alert);
    setIsCounterAttackOpen(true);
  };

  const confirmMission = () => {
    setIsCounterAttackOpen(false);
    toast.success('Protocolo Disparado!', {
      description: `Kit enviado para ${activeAlert.relatedWa} líderes nas regiões afetadas.`,
      icon: <Zap className="w-5 h-5" style={{ color: COLORS.warning }} />,
      duration: 5000,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Activity className="w-6 h-6" style={{ color: COLORS.info }} />
            Radar das Redes
          </h1>
          <p className="text-muted-foreground">Monitoramento Estratégico e Defesa Digital</p>
        </div>
        
        <div className="flex items-center gap-2 bg-card border border-border p-1 rounded-lg">
          <Button variant="ghost" size="sm" className="text-xs bg-primary/10 text-primary">Últimas 24h</Button>
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">7 Dias</Button>
          <div className="w-px h-4 bg-border mx-1" />
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            <Filter className="w-3 h-3" /> Filtros
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl border-l-4" style={{ borderLeftColor: COLORS.danger }}>
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-muted-foreground uppercase">Sentimento Geral</span>
            <ThumbsDown className="w-4 h-4" style={{ color: COLORS.danger }} />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black" style={{ color: COLORS.danger }}>35%</span>
            <span className="text-xs font-medium opacity-80" style={{ color: COLORS.danger }}>Negativo</span>
          </div>
          <Progress value={35} className="h-1.5 mt-3 bg-red-900/20 [&>div]:bg-[#FF3B30]" />
          <p className="text-xs text-muted-foreground mt-2">Alerta: +5% vs ontem</p>
        </div>

        <div className="glass-card p-4 rounded-xl border-l-4" style={{ borderLeftColor: COLORS.info }}>
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-muted-foreground uppercase">Volume de Menções</span>
            <MessageCircle className="w-4 h-4" style={{ color: COLORS.info }} />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-foreground">12.4k</span>
            <span className="text-xs font-medium text-green-500 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" /> +15%
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-3">Pico às 19:00 (Grande Aracaju)</p>
        </div>

        <div className="glass-card p-4 rounded-xl border-l-4 border-l-gray-500">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-muted-foreground uppercase">Share of Voice</span>
            <Share2 className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex items-center gap-4 mt-2">
            <div className="relative w-12 h-12">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-secondary" />
                <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={125} strokeDashoffset={125 - (125 * 0.45)} className="text-primary" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">45%</span>
            </div>
            <div className="text-xs text-muted-foreground">
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-primary" /> Nós</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-secondary" /> Adversários</div>
            </div>
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl border-l-4 bg-red-500/5 animate-pulse-slow" style={{ borderLeftColor: COLORS.danger }}>
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase" style={{ color: COLORS.danger }}>Ataques Detectados</span>
            <ShieldAlert className="w-4 h-4" style={{ color: COLORS.danger }} />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black" style={{ color: COLORS.danger }}>3</span>
            <span className="text-xs font-medium opacity-80" style={{ color: COLORS.danger }}>Em viralização</span>
          </div>
          <Button size="sm" className="w-full mt-3 h-7 text-xs bg-[#FF3B30] hover:bg-[#D73027] text-white border-none">
            Ver War Room
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        <div className="lg:col-span-3 space-y-4">
          <div className="glass-card p-4 rounded-xl border-border/50 h-full">
            <h3 className="text-sm font-bold text-muted-foreground uppercase mb-4 flex items-center gap-2">
              <Search className="w-4 h-4" /> Temas Quentes
            </h3>
            <div className="flex flex-wrap gap-2 content-start">
              {narratives.map((item) => {
                let colorClass = '';
                let borderClass = '';
                let textClass = '';
                
                if (item.sentiment === 'danger') {
                  colorClass = 'bg-[#FF3B30]/10 hover:bg-[#FF3B30]/20';
                  borderClass = 'border-[#FF3B30]/30';
                  textClass = 'text-[#FF3B30]';
                } else if (item.sentiment === 'success') {
                  colorClass = 'bg-[#34C759]/10 hover:bg-[#34C759]/20';
                  borderClass = 'border-[#34C759]/30';
                  textClass = 'text-[#34C759]';
                } else {
                  colorClass = 'bg-[#007AFF]/10 hover:bg-[#007AFF]/20';
                  borderClass = 'border-[#007AFF]/30';
                  textClass = 'text-[#007AFF]';
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedNarrative(item.id === selectedNarrative ? null : item.id)}
                    className={`
                      px-3 py-2 rounded-full text-xs font-bold transition-all duration-300 border ${colorClass} ${borderClass} ${textClass}
                      ${selectedNarrative === item.id ? 'ring-2 ring-offset-2 ring-offset-background' : ''}
                    `}
                    style={{ fontSize: `${Math.max(0.7, item.volume / 60)}rem`, borderColor: 'inherit' }}
                  >
                    {item.topic}
                  </button>
                );
              })}
            </div>
            
            <div className="mt-8 p-3 rounded-lg border border-yellow-500/20 bg-yellow-500/5">
              <h4 className="text-xs font-bold mb-2 flex items-center gap-2" style={{ color: COLORS.warning }}>
                <Zap className="w-3 h-3" /> Insight da IA
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                A narrativa sobre "Falta de Médicos" está crescendo 12% a cada hora na capital. Sugerimos ativar o Kit "Investimentos na Saúde".
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-muted-foreground uppercase">Feed de Combate</h3>
            <Badge variant="outline" className="animate-pulse text-red-500 border-red-500">Ao Vivo</Badge>
          </div>
          
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {feedAlerts.map((alert) => (
              <div key={alert.id} className="glass-card p-4 rounded-xl border-border/50 hover:border-primary/30 transition-all group">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px] h-5">{alert.network}</Badge>
                    <span className="text-xs text-muted-foreground font-mono">{alert.time}</span>
                  </div>
                  {alert.risk === 'danger' && (
                    <Badge className="text-[10px] gap-1 text-white border-none" style={{ backgroundColor: COLORS.danger }}>
                      <AlertTriangle className="w-3 h-3" /> CRISE
                    </Badge>
                  )}
                  {alert.risk === 'warning' && (
                    <Badge className="text-[10px] gap-1 text-black border-none" style={{ backgroundColor: COLORS.warning }}>
                      <Info className="w-3 h-3" /> ATENÇÃO
                    </Badge>
                  )}
                   {alert.risk === 'success' && (
                    <Badge className="text-[10px] gap-1 text-white border-none" style={{ backgroundColor: COLORS.success }}>
                      <CheckCircle2 className="w-3 h-3" /> POSITIVO
                    </Badge>
                  )}
                </div>
                
                <h4 className="font-bold text-foreground text-sm mb-1">{alert.user}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  {alert.summary}
                </p>

                {alert.risk === 'danger' && (
                  <div className="mb-3 p-2 rounded flex items-start gap-2 border border-yellow-500/20 bg-yellow-500/5">
                    <Zap className="w-4 h-4 shrink-0 mt-0.5" style={{ color: COLORS.warning }} />
                    <p className="text-xs font-medium" style={{ color: COLORS.warning }}>
                      Atenção: Este tema apareceu em {alert.relatedWa} áudios no WhatsApp.
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  {alert.risk === 'success' ? (
                     <Button 
                     size="sm" 
                     className="w-full text-white gap-2 border-none hover:opacity-90"
                     style={{ backgroundColor: COLORS.success }}
                   >
                     <Share2 className="w-4 h-4" /> Impulsionar Conquista
                   </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      className="w-full text-white gap-2 border-none hover:opacity-90"
                      style={{ backgroundColor: alert.risk === 'danger' ? COLORS.danger : COLORS.info }}
                      onClick={() => handleCreateMission(alert)}
                    >
                      <ShieldAlert className="w-4 h-4" /> 
                      {alert.risk === 'danger' ? 'Disparar Contra-Ataque' : 'Gerar Resposta'}
                    </Button>
                  )}
                  
                  <Button size="sm" variant="outline" className="w-10 px-0">
                    <Maximize2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MAPA TÁTICO SERGIPE - V2 COM SVG DO ESTADO */}
        <div className="lg:col-span-4 flex flex-col h-full">
          <div className="glass-card rounded-xl border-border/50 flex-1 overflow-hidden relative flex flex-col bg-[#0f172a]">
            <div className="p-4 border-b border-border/50 bg-secondary/20 z-10">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4" style={{ color: COLORS.info }} /> 
                Inteligência Territorial (SE)
              </h3>
              <p className="text-xs text-muted-foreground">Cruzamento: Redes (Azul) vs. Zap (Amarelo)</p>
            </div>

            {/* MAP CONTAINER */}
            <div className="flex-1 relative w-full h-full flex items-center justify-center p-6">
              {/* Background Grid */}
              <div className="absolute inset-0 opacity-10" 
                style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
              />
              
              {/* SVG DO ESTADO DE SERGIPE (SIMULADO) */}
              <div className="relative w-full max-w-[300px] aspect-[3/4]">
                {/* Contorno do Mapa */}
                <svg viewBox="0 0 100 130" className="w-full h-full drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                  {/* Shape de Sergipe (Aproximado) */}
                  <path 
                    d="M 20 10 L 60 5 L 80 20 L 90 60 L 70 110 L 30 120 L 10 80 L 20 10 Z" 
                    fill="#1e293b" 
                    stroke="#475569" 
                    strokeWidth="1"
                    className="opacity-80"
                  />
                  {/* Rios ou Divisas internas (Opcional, decorativo) */}
                  <path d="M 60 5 L 65 30 L 90 60" fill="none" stroke="#334155" strokeWidth="0.5" />
                </svg>

                {/* --- PONTOS NO MAPA (Posicionados sobre o SVG) --- */}

                {/* 1. Propriá (Norte/Rio) */}
                <div className="absolute top-[5%] right-[30%] group">
                  <div className="w-2 h-2 rounded-full animate-pulse bg-yellow-500 shadow-[0_0_8px_#EAB308]" />
                  <span className="text-[9px] text-white/60 absolute top-3 -left-2">Propriá</span>
                </div>

                {/* 2. Itabaiana (Agreste) */}
                <div className="absolute top-[45%] left-[30%] group">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 border-2 border-black/50 shadow-[0_0_10px_#EAB308] animate-ping absolute opacity-30" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500 relative z-10" />
                  <span className="text-[9px] text-white/80 font-bold absolute top-3 -left-4 bg-black/40 px-1 rounded">Itabaiana</span>
                </div>

                {/* 3. ARACAJU (Leste/Costa) - MANCHA AZUL */}
                <div className="absolute top-[55%] right-[5%] group">
                   {/* Aura de calor */}
                   <div className="w-12 h-12 -top-4 -left-4 rounded-full bg-blue-500/20 blur-xl absolute animate-pulse" />
                   <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-[0_0_15px_#3B82F6]" />
                   <span className="text-[10px] text-white font-bold absolute top-4 -left-3 drop-shadow-md">ARACAJU</span>
                </div>

                {/* 4. Lagarto (Centro-Sul) */}
                <div className="absolute bottom-[20%] left-[35%] group">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                  <span className="text-[9px] text-white/50 absolute top-2 -left-2">Lagarto</span>
                </div>

              </div>
            </div>

            {/* LEGENDA */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-sm p-2 rounded border border-white/5 flex justify-between px-4">
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_5px_#3B82F6]" />
                 <span className="text-[10px] text-gray-300">Capital (Redes)</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_5px_#EAB308]" />
                 <span className="text-[10px] text-gray-300">Interior (Zap)</span>
               </div>
            </div>

          </div>
        </div>

      </div>

      <Dialog open={isCounterAttackOpen} onOpenChange={setIsCounterAttackOpen}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2" style={{ color: COLORS.danger }}>
              <ShieldAlert className="w-5 h-5" /> WAR ROOM: Iniciar Defesa
            </DialogTitle>
            <DialogDescription>
              Você está prestes a mobilizar a base para neutralizar um ataque.
            </DialogDescription>
          </DialogHeader>

          {activeAlert && (
            <div className="bg-secondary/30 p-4 rounded-lg border border-border/50 my-2">
              <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Alvo do Combate</p>
              <p className="text-sm font-medium text-foreground">{activeAlert.summary}</p>
              <div className="mt-3 flex gap-2">
                <Badge variant="outline" className="text-yellow-500 border-yellow-500/30 bg-yellow-500/5">
                  {activeAlert.relatedWa} Líderes Afetados (Interior)
                </Badge>
                <Badge variant="outline" className="text-red-500 border-red-500/30 bg-red-500/5">
                  Prioridade Máxima
                </Badge>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Ação Recomendada:</label>
            <div className="p-3 rounded-lg border border-primary/50 bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg text-primary">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Disparar Kit "A Verdade"</p>
                  <p className="text-xs text-muted-foreground">Vídeo + Texto para Grupos de WhatsApp</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-primary" />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsCounterAttackOpen(false)}>Cancelar</Button>
            <Button className="text-white border-none hover:bg-red-700" style={{ backgroundColor: COLORS.danger }} onClick={confirmMission}>
              Confirmar e Disparar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}