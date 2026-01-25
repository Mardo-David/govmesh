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
  Maximize2
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

// --- MOCK DATA ---
const narratives = [
  { id: 1, topic: 'Falta de Médicos HUSE', sentiment: 'negative', volume: 85, trend: 'up' },
  { id: 2, topic: 'Obras da Ponte', sentiment: 'positive', volume: 60, trend: 'up' },
  { id: 3, topic: 'Trânsito Centro', sentiment: 'neutral', volume: 45, trend: 'stable' },
  { id: 4, topic: 'Salários Atrasados', sentiment: 'negative', volume: 30, trend: 'down' },
  { id: 5, topic: 'Novo Parque', sentiment: 'positive', volume: 25, trend: 'up' },
];

const feedAlerts = [
  { 
    id: 1, 
    network: 'Instagram', 
    user: '@influencer_local', 
    summary: 'Influenciador critica buracos na Av. Beira Mar e cita promessas não cumpridas.',
    risk: 'alto',
    viralScore: 92,
    time: '15 min atrás',
    relatedWa: 45
  },
  { 
    id: 2, 
    network: 'Twitter/X', 
    user: '@cidadao_atento', 
    summary: 'Thread viralizando sobre falta de medicamentos na farmácia popular.',
    risk: 'alto',
    viralScore: 88,
    time: '32 min atrás',
    relatedWa: 120
  },
  { 
    id: 3, 
    network: 'TikTok', 
    user: '@humor_se', 
    summary: 'Sátira sobre o discurso de ontem. Tom humorístico, mas com críticas veladas.',
    risk: 'medio',
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
    toast.success('Missão de Contra-Ataque Disparada!', {
      description: `Kit de resposta enviado para ${activeAlert.relatedWa} líderes na região afetada.`,
      icon: <Zap className="w-5 h-5 text-yellow-500" />,
      duration: 5000,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header & Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" />
            Radar das Redes
          </h1>
          <p className="text-muted-foreground">Monitoramento de sentimento e detecção de ataques em tempo real</p>
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

      {/* 1. TOP: KPIs de Temperatura */}
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
          <p className="text-xs text-muted-foreground mt-2">Crítico: +5% vs ontem</p>
        </div>

        <div className="glass-card p-4 rounded-xl border-l-4 border-l-primary">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-muted-foreground uppercase">Volume de Menções</span>
            <MessageCircle className="w-4 h-4 text-primary" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-foreground">12.4k</span>
            <span className="text-xs font-medium text-green-500 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" /> +15%
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-3">Pico às 19:00 (HUSE)</p>
        </div>

        <div className="glass-card p-4 rounded-xl border-l-4 border-l-accent">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-muted-foreground uppercase">Share of Voice</span>
            <Share2 className="w-4 h-4 text-accent" />
          </div>
          <div className="flex items-center gap-4 mt-2">
            <div className="relative w-12 h-12">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-secondary" />
                <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={125} strokeDashoffset={125 - (125 * 0.45)} className="text-accent" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">45%</span>
            </div>
            <div className="text-xs text-muted-foreground">
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-accent" /> Nós (45%)</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-secondary" /> Outros (55%)</div>
            </div>
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl border-l-4 border-l-red-600 bg-red-500/5 animate-pulse-slow">
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

      {/* --- MAIN DASHBOARD GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        
        {/* COL 1: Nuvem de Narrativas (3 cols) */}
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
                    ${item.sentiment === 'negative' ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20' : ''}
                    ${item.sentiment === 'positive' ? 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20' : ''}
                    ${item.sentiment === 'neutral' ? 'bg-secondary border-border text-muted-foreground hover:bg-secondary/80' : ''}
                    ${selectedNarrative === item.id ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}
                  `}
                  style={{ fontSize: `${Math.max(0.7, item.volume / 60)}rem` }}
                >
                  {item.topic}
                </button>
              ))}
            </div>
            
            <div className="mt-8 p-3 rounded-lg bg-secondary/30 border border-border/50">
              <h4 className="text-xs font-bold text-foreground mb-2">Insight da IA</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                A narrativa sobre "Falta de Médicos" está crescendo 12% a cada hora. Recomenda-se publicar vídeo do novo concurso da saúde.
              </p>
            </div>
          </div>
        </div>

        {/* COL 2: Feed de Alertas (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-muted-foreground uppercase">Feed de Combate (Tempo Real)</h3>
            <Badge variant="outline" className="animate-pulse border-red-500 text-red-500">Ao Vivo</Badge>
          </div>
          
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {feedAlerts.map((alert) => (
              <div key={alert.id} className="glass-card p-4 rounded-xl border-border/50 hover:border-primary/30 transition-all group">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px] h-5">{alert.network}</Badge>
                    <span className="text-xs text-muted-foreground font-mono">{alert.time}</span>
                  </div>
                  {alert.risk === 'alto' && (
                    <Badge className="bg-red-500 hover:bg-red-600 text-[10px] gap-1">
                      <AlertTriangle className="w-3 h-3" /> ALTO RISCO
                    </Badge>
                  )}
                </div>
                
                <h4 className="font-bold text-foreground text-sm mb-1">{alert.user}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  {alert.summary}
                </p>

                {alert.risk === 'alto' && (
                  <div className="mb-3 p-2 rounded bg-yellow-500/10 border border-yellow-500/20 flex items-start gap-2">
                    <Zap className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-yellow-500/90 font-medium">
                      Atenção: Este tema apareceu em {alert.relatedWa} áudios no WhatsApp.
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="w-full bg-red-600 hover:bg-red-700 text-white gap-2"
                    onClick={() => handleCreateMission(alert)}
                  >
                    <ShieldAlert className="w-4 h-4" /> Disparar Contra-Ataque
                  </Button>
                  <Button size="sm" variant="outline" className="w-10 px-0">
                    <Maximize2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COL 3: Mapa Tático (4 cols) */}
        <div className="lg:col-span-4 flex flex-col h-full">
          <div className="glass-card rounded-xl border-border/50 flex-1 overflow-hidden relative flex flex-col">
            <div className="p-4 border-b border-border/50 bg-secondary/20 z-10">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" /> Cruzamento Territorial
              </h3>
              <p className="text-xs text-muted-foreground">Manchas (Social) vs. Pins (WhatsApp)</p>
            </div>

            {/* Fake Map Container */}
            <div className="flex-1 bg-[#0f172a] relative overflow-hidden">
              <div className="absolute inset-0 opacity-20" 
                style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
              />
              
              <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/3 right-1/3 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />

              <div className="absolute top-[40%] left-[30%] group cursor-pointer">
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-ping absolute" />
                <div className="w-3 h-3 bg-yellow-500 rounded-full relative border-2 border-black" />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/90 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  Bairro América: 12 áudios
                </div>
              </div>

              <div className="absolute bottom-[30%] right-[40%] group cursor-pointer">
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-ping absolute delay-75" />
                <div className="w-3 h-3 bg-yellow-500 rounded-full relative border-2 border-black" />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/90 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  Bugio: 35 áudios (Crítico)
                </div>
              </div>

              <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md p-3 rounded-lg border border-border/30">
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-muted-foreground">Social</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <span className="text-muted-foreground">Lideranças (Zap)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Modal de Contra-Ataque */}
      <Dialog open={isCounterAttackOpen} onOpenChange={setIsCounterAttackOpen}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-red-500 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" /> Iniciar Protocolo de Resposta
            </DialogTitle>
            <DialogDescription>
              Você está prestes a gerar uma missão para a rede de lideranças.
            </DialogDescription>
          </DialogHeader>

          {activeAlert && (
            <div className="bg-secondary/30 p-4 rounded-lg border border-border/50 my-2">
              <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Alvo do Combate</p>
              <p className="text-sm font-medium text-foreground">{activeAlert.summary}</p>
              <div className="mt-3 flex gap-2">
                <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/30">
                  {activeAlert.relatedWa} Líderes Afetados
                </Badge>
                <Badge variant="outline">Urgência: Alta</Badge>
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
                  <p className="text-sm font-bold text-foreground">Disparar Kit "Verdade Saneamento"</p>
                  <p className="text-xs text-muted-foreground">Vídeo + Texto para WhatsApp</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-primary" />
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