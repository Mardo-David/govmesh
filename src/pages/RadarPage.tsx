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
  danger: '#ef4444', // Vermelho mais vibrante (Tailwind red-500)
  success: '#22c55e', // Verde (green-500)
  info:    '#3b82f6', // Azul (blue-500)
  warning: '#eab308', // Amarelo (yellow-500)
  darkMap: '#111111', // Fundo Mapbox
  landMap: '#1e1e1e', // Terra Mapbox
};

// Mock Data
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
      icon: <Zap className="w-5 h-5 text-yellow-500" />,
      duration: 5000,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-500" />
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl border-l-4 border-l-red-500">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-muted-foreground uppercase">Sentimento Geral</span>
            <ThumbsDown className="w-4 h-4 text-red-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-red-500">35%</span>
            <span className="text-xs font-medium text-red-400">Negativo</span>
          </div>
          <Progress value={35} className="h-1.5 mt-3 bg-red-500/20 [&>div]:bg-red-500" />
          <p className="text-xs text-muted-foreground mt-2">Alerta: +5% vs ontem</p>
        </div>

        <div className="glass-card p-4 rounded-xl border-l-4 border-l-blue-500">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-muted-foreground uppercase">Volume de Menções</span>
            <MessageCircle className="w-4 h-4 text-blue-500" />
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

        <div className="glass-card p-4 rounded-xl border-l-4 border-l-red-500 bg-red-500/5 animate-pulse-slow">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-red-500 uppercase">Ataques Detectados</span>
            <ShieldAlert className="w-4 h-4 text-red-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-red-500">3</span>
            <span className="text-xs font-medium text-red-400">Em viralização</span>
          </div>
          <Button size="sm" variant="destructive" className="w-full mt-3 h-7 text-xs">
            Ver War Room
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        {/* Temas Quentes */}
        <div className="lg:col-span-3 space-y-4">
          <div className="glass-card p-4 rounded-xl border-border/50 h-full">
            <h3 className="text-sm font-bold text-muted-foreground uppercase mb-4 flex items-center gap-2">
              <Search className="w-4 h-4" /> Temas Quentes
            </h3>
            <div className="flex flex-wrap gap-2 content-start">
              {narratives.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedNarrative(item.id === selectedNarrative ? null : item.id)}
                  className={`
                    px-3 py-2 rounded-full text-xs font-bold transition-all duration-300 border
                    ${item.sentiment === 'danger' ? 'bg-red-500/10 border-red-500/30 text-red-400' : ''}
                    ${item.sentiment === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : ''}
                    ${item.sentiment === 'info' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : ''}
                    ${selectedNarrative === item.id ? 'ring-2 ring-offset-2 ring-offset-background' : ''}
                  `}
                >
                  {item.topic}
                </button>
              ))}
            </div>
            
            <div className="mt-8 p-3 rounded-lg border border-yellow-500/20 bg-yellow-500/5">
              <h4 className="text-xs font-bold mb-2 flex items-center gap-2 text-yellow-500">
                <Zap className="w-3 h-3" /> Insight da IA
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                A narrativa sobre "Falta de Médicos" está crescendo 12% a cada hora na capital. Sugerimos ativar o Kit "Investimentos na Saúde".
              </p>
            </div>
          </div>
        </div>

        {/* Feed de Combate */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-muted-foreground uppercase">Feed de Combate</h3>
            <Badge variant="outline" className="animate-pulse text-red-500 border-red-500">Ao Vivo</Badge>
          </div>
          
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {feedAlerts.map((alert) => (
              <div key={alert.id} className="glass-card p-4 rounded-xl border-border/50 hover:border-primary/30 transition-all">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px] h-5">{alert.network}</Badge>
                    <span className="text-xs text-muted-foreground font-mono">{alert.time}</span>
                  </div>
                  {alert.risk === 'danger' && <Badge className="bg-red-500 text-[10px]">CRISE</Badge>}
                  {alert.risk === 'warning' && <Badge className="bg-yellow-500 text-[10px] text-black">ATENÇÃO</Badge>}
                  {alert.risk === 'success' && <Badge className="bg-green-500 text-[10px]">POSITIVO</Badge>}
                </div>
                
                <h4 className="font-bold text-foreground text-sm mb-1">{alert.user}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  {alert.summary}
                </p>

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className={`w-full text-white gap-2 border-none ${
                      alert.risk === 'danger' ? 'bg-red-600 hover:bg-red-700' : 
                      alert.risk === 'success' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                    onClick={() => handleCreateMission(alert)}
                  >
                    {alert.risk === 'danger' ? <ShieldAlert className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                    {alert.risk === 'danger' ? 'Disparar Contra-Ataque' : 'Gerar Resposta'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MAPA TÁTICO SERGIPE - "MAPBOX STYLE" */}
        <div className="lg:col-span-4 flex flex-col h-full">
          <div className="glass-card rounded-xl border-border/50 flex-1 overflow-hidden relative flex flex-col bg-[#111111]"> {/* Fundo Mapbox Dark */}
            
            {/* Cabeçalho do Mapa */}
            <div className="p-4 border-b border-white/10 bg-[#1e1e1e] z-10 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-gray-200 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-500" /> 
                  Inteligência Territorial (SE)
                </h3>
                <p className="text-[10px] text-gray-500">Monitoramento em Tempo Real</p>
              </div>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] text-red-500 font-bold">LIVE</span>
              </div>
            </div>

            {/* CONTAINER DO MAPA */}
            <div className="flex-1 relative w-full h-full p-6 flex items-center justify-center overflow-hidden">
              
              {/* 1. Grid de Fundo (Textura Mapbox) */}
              <div className="absolute inset-0 opacity-10" 
                style={{ 
                  backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', 
                  backgroundSize: '40px 40px' 
                }} 
              />
              
              {/* 2. SVG DE SERGIPE (Geometria Real) */}
              <div className="relative w-full max-w-[320px] aspect-[4/5]">
                <svg viewBox="0 0 400 500" className="w-full h-full drop-shadow-2xl">
                  <defs>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="15" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>
                  
                  {/* Contorno Brilhante (Glow) */}
                  <path 
                    d="M 120,20 C 160,5 220,10 260,30 L 320,60 L 380,120 L 360,200 L 290,450 L 150,480 L 80,450 L 40,300 L 20,150 Z" 
                    fill="none" 
                    stroke="#3b82f6" 
                    strokeWidth="15" 
                    strokeOpacity="0.1"
                    filter="url(#glow)"
                  />

                  {/* O ESTADO (Shape Dark) */}
                  <path 
                    d="M 120,20 C 160,5 220,10 260,30 L 320,60 L 380,120 L 360,200 L 290,450 L 150,480 L 80,450 L 40,300 L 20,150 Z" 
                    fill="#1e1e1e" 
                    stroke="#444" 
                    strokeWidth="2"
                    className="transition-all duration-1000"
                  />
                  
                  {/* Rios / Estradas (Fake Lines para textura) */}
                  <path d="M 260,30 Q 250,150 290,450" fill="none" stroke="#333" strokeWidth="1" />
                  <path d="M 120,20 Q 200,100 360,200" fill="none" stroke="#333" strokeWidth="1" />
                  <path d="M 40,300 L 360,200" fill="none" stroke="#333" strokeWidth="1" />

                </svg>

                {/* --- PINS ESTRATÉGICOS (Posicionamento CSS sobre o SVG) --- */}

                {/* PROPRIÁ (Norte) */}
                <div className="absolute top-[5%] left-[45%] group cursor-pointer z-20">
                  <div className="flex flex-col items-center">
                    <MapPin className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                    <span className="text-[9px] text-gray-500 font-mono mt-1 group-hover:text-white">PROPRIÁ</span>
                  </div>
                </div>

                {/* ITABAIANA (Centro) */}
                <div className="absolute top-[45%] left-[35%] group cursor-pointer z-20">
                  <div className="relative">
                    <div className="absolute inset-0 bg-yellow-500 rounded-full animate-ping opacity-50"></div>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full border border-black relative z-10"></div>
                  </div>
                  <div className="absolute left-4 top-0 bg-black/80 px-2 py-1 rounded border border-yellow-500/30">
                    <span className="text-[10px] text-yellow-500 font-bold whitespace-nowrap">Itabaiana (Alertas)</span>
                  </div>
                </div>

                {/* ARACAJU (Leste) - O Foco Azul */}
                <div className="absolute top-[50%] right-[15%] group cursor-pointer z-30">
                  <div className="relative flex items-center justify-center">
                     <div className="absolute inset-0 w-16 h-16 bg-blue-500/10 rounded-full blur-xl"></div>
                     <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-[0_0_20px_#3b82f6]"></div>
                     <span className="absolute left-5 text-xs font-black text-white tracking-widest drop-shadow-md">ARACAJU</span>
                  </div>
                </div>

                {/* LAGARTO (Sul) */}
                <div className="absolute bottom-[15%] left-[40%] group cursor-pointer z-20">
                  <div className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-white transition-colors" />
                  <span className="text-[9px] text-gray-600 absolute left-3 -top-1 group-hover:text-white">Lagarto</span>
                </div>

              </div>
            </div>

            {/* Rodapé do Mapa */}
            <div className="absolute bottom-4 right-4 bg-black/80 px-3 py-1 rounded text-[9px] text-gray-500 font-mono border border-white/5">
              GovMesh GeoIntel v2.4
            </div>

          </div>
        </div>
      </div>

      <Dialog open={isCounterAttackOpen} onOpenChange={setIsCounterAttackOpen}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-500">
              <ShieldAlert className="w-5 h-5" /> WAR ROOM: Iniciar Defesa
            </DialogTitle>
            <DialogDescription>
              Você está prestes a mobilizar a base para neutralizar um ataque.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
             <div className="p-4 bg-secondary/30 rounded border border-border">
                <p className="text-sm font-bold">Ação: Disparo em Massa (WhatsApp)</p>
                <p className="text-xs text-muted-foreground">Alvo: Lideranças do Agreste e Grande Aracaju</p>
             </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsCounterAttackOpen(false)}>Cancelar</Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={confirmMission}>
              Confirmar e Disparar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}