import { useState } from 'react';
import { 
  Activity, Search, Filter, TrendingUp, MessageCircle, 
  Share2, Zap, ShieldAlert, ThumbsDown, 
  MapPin 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogFooter
} from '@/components/ui/dialog';

// --- MAPA REAL (Leaflet) ---
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Cores do Sistema
const COLORS = {
  danger: '#ef4444', 
  success: '#22c55e', 
  info:    '#3b82f6', 
  warning: '#eab308', 
};

// Dados Mockados
const narratives = [
  { id: 1, topic: 'Falta de Médicos (HUSE)', sentiment: 'danger', volume: 85, trend: 'up' },
  { id: 2, topic: 'Nova Ponte Aracaju-Barra', sentiment: 'success', volume: 60, trend: 'up' },
  { id: 3, topic: 'Trânsito Av. Beira Mar', sentiment: 'info', volume: 45, trend: 'stable' },
  { id: 4, topic: 'Atraso Salarial Educação', sentiment: 'danger', volume: 30, trend: 'down' },
  { id: 5, topic: 'Inauguração Lagarto', sentiment: 'success', volume: 25, trend: 'up' },
];

const feedAlerts = [
  { id: 1, network: 'Instagram', user: '@influencer_aracaju', summary: 'Vídeo viralizando sobre buracos na Zona Norte.', risk: 'danger', time: '15 min atrás', relatedWa: 45 },
  { id: 2, network: 'WhatsApp', user: 'Grupos do Agreste', summary: 'Áudio de liderança reclamando de promessa em Itabaiana.', risk: 'warning', time: '32 min atrás', relatedWa: 120 },
  { id: 3, network: 'Portal SE', user: 'Sergipe Hoje', summary: 'Matéria elogiando evento de ontem.', risk: 'success', time: '1h atrás', relatedWa: 12 }
];

// --- CONFIGURAÇÃO GEOESPACIAL DE SERGIPE ---
// Coordenadas Reais para o Leaflet
const sergipeCenter: [number, number] = [-10.57, -37.38]; 
const cities = [
  { name: "Aracaju (Capital)", lat: -10.9472, lng: -37.0731, status: "danger", info: "Crise nas Redes Sociais" },
  { name: "Itabaiana", lat: -10.6850, lng: -37.4270, status: "warning", info: "Alertas via WhatsApp" },
  { name: "Lagarto", lat: -10.9170, lng: -37.6500, status: "success", info: "Região Estável" },
  { name: "Propriá", lat: -10.2128, lng: -36.8417, status: "info", info: "Monitoramento de Rotina" },
  { name: "Nossa Sra. do Socorro", lat: -10.8536, lng: -37.1265, status: "danger", info: "Reclamações crescentes" },
];

// Ícone Customizado (Ponto Piscante via CSS HTML)
const createBlinkingIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="
      width: 12px;
      height: 12px;
      background-color: ${color};
      border-radius: 50%;
      box-shadow: 0 0 10px ${color};
      animation: pulse 1.5s infinite;
      border: 2px solid white;
    "></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
    popupAnchor: [0, -10]
  });
};

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
      description: `Ação tática iniciada na região.`,
      icon: <Zap className="w-5 h-5 text-yellow-500" />,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Injeção de CSS para animação do mapa */}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(255, 255, 255, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
        }
        .leaflet-popup-content-wrapper, .leaflet-popup-tip {
          background: #1e293b !important;
          color: white !important;
          border: 1px solid #334155;
        }
        .leaflet-container {
          background: #111 !important;
          border-radius: 0.75rem;
        }
      `}</style>

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-500" />
            Radar das Redes
          </h1>
          <p className="text-muted-foreground">Monitoramento Estratégico em Tempo Real</p>
        </div>
        <div className="flex items-center gap-2 bg-card border border-border p-1 rounded-lg">
          <Button variant="ghost" size="sm" className="text-xs bg-primary/10 text-primary">Últimas 24h</Button>
          <div className="w-px h-4 bg-border mx-1" />
          <Button variant="ghost" size="sm" className="gap-1 text-xs"><Filter className="w-3 h-3" /> Filtros</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl border-l-4 border-l-red-500">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-muted-foreground uppercase">Sentimento</span>
            <ThumbsDown className="w-4 h-4 text-red-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-red-500">35%</span>
            <span className="text-xs font-medium text-red-400">Negativo</span>
          </div>
          <Progress value={35} className="h-1.5 mt-3 bg-red-500/20 [&>div]:bg-red-500" />
        </div>

        <div className="glass-card p-4 rounded-xl border-l-4 border-l-blue-500">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-muted-foreground uppercase">Volume</span>
            <MessageCircle className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-foreground">12.4k</span>
            <span className="text-xs font-medium text-green-500 flex items-center"><TrendingUp className="w-3 h-3 mr-1" /> +15%</span>
          </div>
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
            </div>
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl border-l-4 border-l-red-500 bg-red-500/5 animate-pulse-slow">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-red-500 uppercase">Ataques</span>
            <ShieldAlert className="w-4 h-4 text-red-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-red-500">3</span>
            <span className="text-xs font-medium text-red-400">Virais</span>
          </div>
          <Button size="sm" variant="destructive" className="w-full mt-3 h-7 text-xs">Ver War Room</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        {/* Coluna Esquerda: Temas */}
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
                    px-3 py-2 rounded-full text-xs font-bold transition-all border
                    ${item.sentiment === 'danger' ? 'bg-red-500/10 border-red-500/30 text-red-400' : ''}
                    ${item.sentiment === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : ''}
                    ${item.sentiment === 'info' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : ''}
                  `}
                >
                  {item.topic}
                </button>
              ))}
            </div>
            <div className="mt-8 p-3 rounded-lg border border-yellow-500/20 bg-yellow-500/5">
              <h4 className="text-xs font-bold mb-2 flex items-center gap-2 text-yellow-500"><Zap className="w-3 h-3" /> Insight da IA</h4>
              <p className="text-xs text-muted-foreground">Falta de médicos crescendo 12%/hora. Sugestão: Vídeo de esclarecimento.</p>
            </div>
          </div>
        </div>

        {/* Coluna Central: Feed */}
        <div className="lg:col-span-5 space-y-4">
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {feedAlerts.map((alert) => (
              <div key={alert.id} className="glass-card p-4 rounded-xl border-border/50 hover:border-primary/30">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px] h-5">{alert.network}</Badge>
                    <span className="text-xs text-muted-foreground">{alert.time}</span>
                  </div>
                  {alert.risk === 'danger' && <Badge className="bg-red-500 text-[10px]">CRISE</Badge>}
                  {alert.risk === 'warning' && <Badge className="bg-yellow-500 text-black text-[10px]">ATENÇÃO</Badge>}
                  {alert.risk === 'success' && <Badge className="bg-green-500 text-[10px]">POSITIVO</Badge>}
                </div>
                <h4 className="font-bold text-sm mb-1">{alert.user}</h4>
                <p className="text-sm text-muted-foreground mb-3">{alert.summary}</p>
                <Button 
                  size="sm" 
                  className={`w-full text-white border-none ${alert.risk === 'danger' ? 'bg-red-600' : 'bg-blue-600'}`}
                  onClick={() => handleCreateMission(alert)}
                >
                  {alert.risk === 'danger' ? 'Disparar Contra-Ataque' : 'Gerar Resposta'}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Coluna Direita: O MAPA REAL (Leaflet) */}
        <div className="lg:col-span-4 flex flex-col h-[600px]">
          <div className="glass-card rounded-xl border-border/50 flex-1 overflow-hidden relative flex flex-col bg-[#111]">
            <div className="p-4 border-b border-white/10 bg-[#1e1e1e] z-10 flex justify-between items-center">
              <h3 className="text-sm font-bold text-gray-200 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500" /> Inteligência Territorial
              </h3>
              <div className="flex gap-1 items-center">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] text-red-500 font-bold">AO VIVO</span>
              </div>
            </div>

            {/* MAPA COM TEMA DARK MATTER (GRATUITO) */}
            <div className="flex-1 w-full h-full relative z-0">
               <MapContainer 
                  center={sergipeCenter} 
                  zoom={9} 
                  style={{ height: '100%', width: '100%' }}
                  zoomControl={false}
                  attributionControl={false}
               >
                 {/* O segredo: CartoDB Dark Matter (Estilo Hacker Grátis) */}
                 <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                 />

                 {cities.map((city) => {
                    let color = COLORS.info;
                    if (city.status === 'danger') color = COLORS.danger;
                    if (city.status === 'warning') color = COLORS.warning;
                    if (city.status === 'success') color = COLORS.success;

                    return (
                      <Marker 
                        key={city.name} 
                        position={[city.lat, city.lng]} 
                        icon={createBlinkingIcon(color)}
                      >
                        <Popup>
                          <div className="text-xs font-bold mb-1">{city.name}</div>
                          <div className="text-[10px]">{city.info}</div>
                        </Popup>
                      </Marker>
                    )
                 })}
               </MapContainer>

               {/* Legenda Flutuante */}
               <div className="absolute bottom-4 left-4 z-[9999] bg-black/80 p-2 rounded border border-white/10 text-[10px] text-gray-400">
                  <div className="flex items-center gap-2 mb-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Crise</div>
                  <div className="flex items-center gap-2 mb-1"><div className="w-2 h-2 rounded-full bg-yellow-500"></div> Alerta</div>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Monitoramento</div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isCounterAttackOpen} onOpenChange={setIsCounterAttackOpen}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader><DialogTitle className="text-red-500">WAR ROOM</DialogTitle></DialogHeader>
          <div className="p-4 bg-secondary/30 rounded border border-border">
             <p className="text-sm font-bold">Disparo Tático</p>
             <p className="text-xs text-muted-foreground">Região: {activeAlert?.user || 'Geral'}</p>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsCounterAttackOpen(false)}>Cancelar</Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={confirmMission}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}