import { useState } from 'react';
import { 
  Ear, Play, Pause, FileText, ArrowRight, 
  BrainCircuit, AlertTriangle, Stethoscope, 
  Tractor, Shield, MapPin, CheckCircle2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- CORES SEMÂNTICAS (INTELIGÊNCIA) ---
const THEME = {
  primary: '#8b5cf6', // Violeta (Intelligence)
  secondary: '#a78bfa',
  accent: '#c4b5fd',
  darkBg: '#1e1b4b', // Fundo muito escuro azul/roxo
};

// --- DADOS MOCKADOS (SERGIPE) ---
const painPoints = [
  { id: 1, label: "Pavimentação (Lagarto)", size: 'lg', summary: "85 lideranças citaram buracos nas vias principais dificultando o acesso.", type: 'infra' },
  { id: 2, label: "Falta de Remédios (Capital)", size: 'lg', summary: "Denúncias recorrentes sobre falta de insulina nos postos da Zona Norte.", type: 'health' },
  { id: 3, label: "Segurança Escolar (Socorro)", size: 'md', summary: "Mães preocupadas com rondas no horário de saída.", type: 'security' },
  { id: 4, label: "Água (Sertão)", size: 'sm', summary: "Carros-pipa não estão chegando em Poço Redondo.", type: 'water' },
];

const audioReports = [
  { 
    id: 1, 
    user: "Capitão Jonas", 
    role: "Liderança Regional (Lagarto)", 
    avatar: "CJ",
    duration: "0:45",
    tags: ["Infraestrutura", "Crítico"],
    transcript: "Olha governador, o pessoal aqui do povoado tá reclamando muito da <span class='text-purple-400 font-bold bg-purple-500/10 px-1 rounded'>estrada vicinal</span>. O caminhão da feira não passa, tá uma buraqueira só. O plano fala em rodovia, mas a gente precisa é de <span class='text-purple-400 font-bold bg-purple-500/10 px-1 rounded'>piçarra batida</span> agora.",
  },
  { 
    id: 2, 
    user: "Dra. Ana", 
    role: "Apoiadora (Propriá)", 
    avatar: "DA",
    duration: "1:12",
    tags: ["Saúde", "Urgente"],
    transcript: "A situação no <span class='text-purple-400 font-bold bg-purple-500/10 px-1 rounded'>Hospital Regional</span> tá difícil. Faltou dipirona ontem. O povo não quer saber de obra nova, quer <span class='text-purple-400 font-bold bg-purple-500/10 px-1 rounded'>médico no plantão</span>.",
  }
];

// --- ÍCONES CUSTOMIZADOS PARA O MAPA ---
const createIcon = (iconName: string) => {
  let svg = '';
  // Ícones simples desenhados via SVG string para o Leaflet
  if (iconName === 'health') svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.28 3.6-1.28 5.14 0 .34.66.17 1.48-.43 1.94l-5 4.96C18.15 21.46 17.62 21.46 17.09 20.9l-5-4.96c-.6-.46-.77-1.28-.43-1.94 1.54-1.28 3.65-1.28 5.14 0z"></path></svg>`; // Simplificado para exemplo, usaremos classes CSS
  
  // Como SVG string é complexo, vamos usar classes CSS com emojis ou icones simples para o mockup
  let content = '';
  let bgColor = '';
  
  if (iconName === 'health') { content = '🏥'; bgColor = '#ef4444'; } // Propriá
  if (iconName === 'infra')  { content = '🚜'; bgColor = '#eab308'; } // Lagarto/Interior
  if (iconName === 'security') { content = '👮'; bgColor = '#3b82f6'; } // Socorro/Capital

  return L.divIcon({
    className: 'custom-map-icon',
    html: `<div style="
      background-color: #1e293b;
      border: 2px solid ${bgColor};
      border-radius: 50%;
      width: 30px; 
      height: 30px; 
      display: flex; 
      align-items: center; 
      justify-content: center;
      font-size: 16px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.3);
    ">${content}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
};

const mapPoints = [
  { lat: -10.2128, lng: -36.8417, type: 'health', label: 'Propriá: Saúde' },
  { lat: -10.9170, lng: -37.6500, type: 'infra', label: 'Lagarto: Estradas' },
  { lat: -10.9472, lng: -37.0731, type: 'security', label: 'Aracaju: Segurança' },
];

export default function EscutaAtiva() {
  const [playingId, setPlayingId] = useState<number | null>(null);

  const togglePlay = (id: number) => {
    if (playingId === id) setPlayingId(null);
    else setPlayingId(id);
  };

  const handleGenerateBriefing = () => {
    toast.success('Aditivo ao Plano Gerado!', {
      description: 'Briefing estratégico enviado para o WhatsApp do Candidato.',
      icon: <BrainCircuit className="w-5 h-5 text-purple-500" />,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Ear className="w-6 h-6 text-purple-500" />
            Escuta Ativa & Plano Dinâmico
          </h1>
          <p className="text-muted-foreground">Transformando desabafos da rua em inteligência de governo.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-purple-500 text-purple-400 bg-purple-500/10 px-3 py-1">
            <BrainCircuit className="w-3 h-3 mr-2" /> IA Ativa
          </Badge>
          <span className="text-xs text-muted-foreground">Última análise: Agora</span>
        </div>
      </div>

      {/* CAMADA 1: DIAGNÓSTICO & MAPA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* KPI & CLUSTER DE DORES (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* KPIs Rápidos */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Card className="p-4 bg-card/50 border-purple-500/20">
              <span className="text-xs text-muted-foreground uppercase">Áudios Processados (7d)</span>
              <div className="text-2xl font-bold text-purple-400 mt-1">1.450</div>
            </Card>
            <Card className="p-4 bg-card/50 border-purple-500/20">
              <span className="text-xs text-muted-foreground uppercase">Sentimento da Base</span>
              <div className="flex items-end gap-2 mt-1">
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                  <div className="h-full bg-green-500 w-[30%]" />
                  <div className="h-full bg-yellow-500 w-[50%]" />
                  <div className="h-full bg-red-500 w-[20%]" />
                </div>
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>Pos</span>
                <span>Neutro (Preocupado)</span>
                <span>Neg</span>
              </div>
            </Card>
            <Card className="p-4 bg-card/50 border-purple-500/20 hidden md:block">
              <span className="text-xs text-muted-foreground uppercase">Tópicos Críticos</span>
              <div className="text-2xl font-bold text-foreground mt-1">4</div>
            </Card>
          </div>

          {/* Nuvem de Dores (Bubbles) */}
          <div className="flex-1 bg-gradient-to-br from-card to-background border border-border rounded-xl p-6 relative overflow-hidden">
             <div className="absolute top-4 left-4 text-sm font-bold text-purple-300 flex items-center gap-2">
               <BrainCircuit className="w-4 h-4" /> Cluster de Demandas (IA)
             </div>
             
             <div className="mt-8 flex flex-wrap gap-4 items-center justify-center min-h-[200px]">
                {painPoints.map((point) => (
                  <div 
                    key={point.id}
                    className={`
                      relative group cursor-pointer rounded-full flex items-center justify-center text-center font-bold text-white transition-all hover:scale-105 shadow-lg
                      ${point.size === 'lg' ? 'w-32 h-32 text-sm bg-purple-600/90' : ''}
                      ${point.size === 'md' ? 'w-24 h-24 text-xs bg-purple-600/70' : ''}
                      ${point.size === 'sm' ? 'w-16 h-16 text-[10px] bg-purple-600/50' : ''}
                    `}
                  >
                    {point.label}
                    
                    {/* Tooltip da IA */}
                    <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity w-48 bg-black/90 p-2 rounded text-[10px] font-normal pointer-events-none z-10 border border-purple-500/30">
                      {point.summary}
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* MAPA DE CALOR (4 cols) */}
        <div className="lg:col-span-4 h-[400px] lg:h-auto rounded-xl overflow-hidden border border-border relative">
          <div className="absolute top-4 right-4 z-[400] bg-black/80 px-2 py-1 rounded text-[10px] text-white border border-white/10">
            Geografia da Dor
          </div>
          <MapContainer 
            center={[-10.57, -37.38]} 
            zoom={8} 
            style={{ height: '100%', width: '100%', background: '#0f172a' }}
            zoomControl={false}
            attributionControl={false}
          >
            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
            {mapPoints.map((p, idx) => (
              <Marker key={idx} position={[p.lat, p.lng]} icon={createIcon(p.type)}>
                <Popup>{p.label}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* CAMADA 2 & 3: FEED E ESTRATÉGIA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* FEED DE ÁUDIOS (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-sm font-bold text-muted-foreground uppercase flex items-center gap-2">
            <FileText className="w-4 h-4" /> A Prova Real (Feed Transcrito)
          </h3>

          {audioReports.map((report) => (
            <div key={report.id} className="bg-card/40 border border-border/50 rounded-xl p-4 hover:border-purple-500/30 transition-all group">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-lg">
                  {report.avatar}
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-foreground text-sm">{report.user}</h4>
                      <p className="text-xs text-muted-foreground">{report.role}</p>
                    </div>
                    <div className="flex gap-2">
                       {report.tags.map(tag => (
                         <Badge key={tag} variant="secondary" className="text-[10px] h-5 bg-purple-500/10 text-purple-300 border-none">
                           {tag}
                         </Badge>
                       ))}
                    </div>
                  </div>

                  {/* Player Whisper Style */}
                  <div className="bg-black/30 rounded-lg p-2 flex items-center gap-3 border border-white/5">
                    <button 
                      onClick={() => togglePlay(report.id)}
                      className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center hover:bg-purple-500 transition-colors shrink-0"
                    >
                      {playingId === report.id ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white ml-0.5" />}
                    </button>
                    
                    {/* Visualização de Onda Sonora (Fake) */}
                    <div className="flex-1 h-8 flex items-center gap-0.5 overflow-hidden">
                      {[...Array(40)].map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-1 rounded-full transition-all duration-300 ${playingId === report.id ? 'bg-purple-400 animate-pulse' : 'bg-slate-700'}`}
                          style={{ 
                            height: `${Math.max(20, Math.random() * 100)}%`,
                            opacity: playingId === report.id ? 1 : 0.5 
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono">{report.duration}</span>
                  </div>

                  {/* Transcrição com Highlight */}
                  <div className="bg-secondary/20 p-3 rounded-lg text-sm text-gray-300 leading-relaxed border-l-2 border-purple-500">
                    <p dangerouslySetInnerHTML={{ __html: report.transcript }} />
                  </div>

                  <div className="flex justify-end">
                    <Button variant="ghost" size="sm" className="text-xs text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 gap-2">
                      <CheckCircle2 className="w-3 h-3" /> Transformar em Diretriz
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ESTRATÉGIA (5 cols) */}
        <div className="lg:col-span-5 space-y-4 sticky top-4">
          <div className="bg-gradient-to-b from-[#1e1b4b] to-card border border-purple-500/30 rounded-xl p-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <BrainCircuit className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="font-bold text-foreground">Inteligência de Governo</h3>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-yellow-500 text-sm">Alerta de Divergência</h4>
                    <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                      O Plano de Governo Oficial foca em <b className="text-white">"Grandes Rodovias"</b>, mas 70% dos relatos do interior pedem <b className="text-white">"Estradas Vicinais e Piçarras"</b> para escoamento.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-purple-500/5 border border-purple-500/10 rounded-lg">
                <h4 className="font-bold text-purple-300 text-sm mb-2 flex items-center gap-2">
                  <Tractor className="w-4 h-4" /> Sugestão de Ajuste
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Ajustar discurso no comício de Itabaiana. Substituir a menção à "Duplicação da BR" por "Programa Caminhos da Roça".
                </p>
              </div>

              <Button 
                onClick={handleGenerateBriefing}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-[0_0_15px_rgba(147,51,234,0.3)]"
              >
                Gerar Aditivo ao Plano <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              
              <p className="text-[10px] text-center text-muted-foreground">
                IA treinada com base no Plano de Governo v2.pdf
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}