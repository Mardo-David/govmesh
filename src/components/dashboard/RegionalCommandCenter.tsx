import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, TrendingUp, AlertTriangle, CheckCircle, 
  Users, Download, Target, ChevronRight, Zap, Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useGovMesh } from '@/contexts/GovMeshContext';
import { REGIOES_SERGIPE, MUNICIPIOS_POR_REGIAO, type RegiaoSergipe } from '@/data/sergipeRegioes';

// Dados das regiões com posicionamento geográfico aproximado
const regiaoData: Record<RegiaoSergipe, {
  gridPosition: string;
  demandas: string[];
  destaque: string;
}> = {
  'Grande Aracaju': {
    gridPosition: 'col-start-2 row-start-2',
    demandas: ['Mobilidade urbana', 'Segurança pública', 'Revitalização da Orla'],
    destaque: 'Capital e maior eleitorado',
  },
  'Agreste Central': {
    gridPosition: 'col-start-2 row-start-1',
    demandas: ['Fortalecimento do comércio', 'Estradas vicinais', 'Agricultura familiar'],
    destaque: 'Polo comercial do interior',
  },
  'Centro Sul': {
    gridPosition: 'col-start-1 row-start-2',
    demandas: ['Indústria têxtil', 'Rodovias estaduais', 'Hospitais regionais'],
    destaque: 'Maior região em área',
  },
  'Sul Sergipano': {
    gridPosition: 'col-start-2 row-start-3',
    demandas: ['Turismo costeiro', 'Pesca artesanal', 'Saneamento básico'],
    destaque: 'Potencial turístico',
  },
  'Baixo São Francisco': {
    gridPosition: 'col-start-1 row-start-1',
    demandas: ['Revitalização do Rio', 'Irrigação', 'Piscicultura'],
    destaque: 'Desenvolvimento ribeirinho',
  },
  'Alto Sertão': {
    gridPosition: 'col-start-1 row-start-1',
    demandas: ['Cisternas e água', 'Energia solar', 'Agricultura de sequeiro'],
    destaque: 'Convivência com o semiárido',
  },
  'Médio Sertão': {
    gridPosition: 'col-start-1 row-start-1',
    demandas: ['Estradas rurais', 'Saúde no campo', 'Educação técnica'],
    destaque: 'Pecuária leiteira',
  },
  'Leste Sergipano': {
    gridPosition: 'col-start-2 row-start-1',
    demandas: ['Indústria petrolífera', 'Meio ambiente', 'Turismo ecológico'],
    destaque: 'Polo energético',
  },
};

// Sparkline mini component
function Sparkline({ data, color = 'primary' }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 60;
    const y = 20 - ((value - min) / range) * 16;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width="60" height="24" className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={`hsl(var(--${color}))`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={60}
        cy={20 - ((data[data.length - 1] - min) / range) * 16}
        r="3"
        fill={`hsl(var(--${color}))`}
      />
    </svg>
  );
}

// ATUALIZAÇÃO: Adicionada a prop className para simetria
export function RegionalCommandCenter({ className }: { className?: string }) {
  const { leads, kits, boatos } = useGovMesh();
  const [selectedRegiao, setSelectedRegiao] = useState<RegiaoSergipe | null>(null);

  const getRegiaoStats = (regiao: RegiaoSergipe) => {
    const leadsRegiao = leads.filter(l => l.territorio === regiao);
    const kitsRegiao = kits.filter(k => k.territorio === regiao);
    const boatosRegiao = boatos.filter(b => b.territorio === regiao);
    
    const multiplicadores = leadsRegiao.filter(l => l.status === 'multiplicador').length;
    const engajados = leadsRegiao.filter(l => l.status === 'engajado').length;
    const engajamento = leadsRegiao.length > 0 
      ? Math.round(((multiplicadores + engajados) / leadsRegiao.length) * 100) 
      : 0;
    
    const temBoatoCritico = boatosRegiao.some(b => b.nivel === 'critico');
    const temBoatoAlto = boatosRegiao.some(b => b.nivel === 'alto');
    
    let status: 'estavel' | 'alerta' | 'critico' = 'estavel';
    if (temBoatoCritico) status = 'critico';
    else if (temBoatoAlto || engajamento < 30) status = 'alerta';
    
    const sparklineData = Array.from({ length: 7 }, () => 
      Math.floor(Math.random() * 30) + engajamento - 15
    );
    sparklineData.push(engajamento);
    
    return {
      leads: leadsRegiao.length,
      status,
      engajamento,
      sparklineData,
      boatosCriticos: boatosRegiao.filter(b => b.nivel === 'critico').length
    };
  };

  const statusConfig = {
    estavel: { 
      color: 'border-success/30 bg-success/5', 
      badge: 'bg-success/20 text-success border-success/30',
      label: 'Meta Atingida',
      icon: CheckCircle,
    },
    alerta: { 
      color: 'border-warning/30 bg-warning/5', 
      badge: 'bg-warning/20 text-warning border-warning/30',
      label: 'Alerta de Boato',
      icon: AlertTriangle,
    },
    critico: { 
      color: 'border-destructive/30 bg-destructive/5 animate-pulse', 
      badge: 'bg-destructive/20 text-destructive border-destructive/30',
      label: 'Ação Urgente',
      icon: AlertTriangle,
    },
  };

  const orderedRegioes = [...REGIOES_SERGIPE].sort((a, b) => {
    if (a === 'Grande Aracaju') return -1;
    if (b === 'Grande Aracaju') return 1;
    return 0;
  });

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={cn("glass-card rounded-xl p-6 border border-border/50 h-full flex flex-col", className)}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Centro de Comando Regional</h3>
              <p className="text-xs text-muted-foreground">Monitoramento Sergipe - José da Silva</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-success/10 border border-success/20">
            <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            <span className="text-[10px] font-medium text-success uppercase tracking-wider">Online</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 md:gap-3 flex-1">
          {orderedRegioes.map((regiao, idx) => {
            const stats = getRegiaoStats(regiao);
            const config = statusConfig[stats.status];
            const StatusIcon = config.icon;
            const isGrandeAracaju = regiao === 'Grande Aracaju';

            return (
              <motion.button
                key={regiao}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedRegiao(regiao)}
                className={cn(
                  'relative p-3 rounded-xl border-2 transition-all duration-300 text-left flex flex-col justify-between',
                  config.color,
                  isGrandeAracaju && 'ring-2 ring-primary/20 shadow-lg'
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="min-w-0">
                    <h4 className={cn('font-bold text-xs truncate', isGrandeAracaju ? 'text-primary' : 'text-foreground')}>
                      {regiao}
                    </h4>
                  </div>
                  <StatusIcon className={cn('w-3.5 h-3.5', stats.status === 'estavel' ? 'text-success' : stats.status === 'alerta' ? 'text-warning' : 'text-destructive')} />
                </div>

                <div className="flex items-end justify-between mt-auto">
                  <Sparkline data={stats.sparklineData} color={stats.status === 'critico' ? 'destructive' : stats.status === 'alerta' ? 'warning' : 'primary'} />
                  <div className="text-right">
                    <span className={cn('text-[10px] font-bold', stats.engajamento >= 60 ? 'text-success' : 'text-foreground')}>
                      {stats.engajamento}%
                    </span>
                  </div>
                </div>

                {stats.boatosCriticos > 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full flex items-center justify-center text-[8px] font-bold text-white animate-bounce shadow-lg">
                    {stats.boatosCriticos}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-border/40 grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-lg font-bold text-primary">{leads.length}</p>
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Lideranças</p>
          </div>
          <div>
            <p className="text-lg font-bold text-accent">8</p>
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Regiões SE</p>
          </div>
          <div>
            <p className="text-lg font-bold text-warning">{boatos.filter(b => b.nivel === 'critico').length}</p>
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Alertas</p>
          </div>
        </div>
      </motion.div>

      <Sheet open={!!selectedRegiao} onOpenChange={() => setSelectedRegiao(null)}>
        <SheetContent className="w-full sm:max-w-md bg-background border-border overflow-y-auto">
          {selectedRegiao && (
            <div className="space-y-6 pt-4">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <span className="block text-xl">{selectedRegiao}</span>
                    <span className="text-xs font-normal text-muted-foreground uppercase tracking-widest">Painel de Inteligência Regional</span>
                  </div>
                </SheetTitle>
              </SheetHeader>

              <div className="glass-card p-4 rounded-xl border-border/50">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Municípios da Região</h4>
                <div className="flex flex-wrap gap-1.5">
                  {MUNICIPIOS_POR_REGIAO[selectedRegiao].map(m => (
                    <Badge key={m} variant="secondary" className="text-[10px] font-medium">{m}</Badge>
                  ))}
                </div>
              </div>

              <div className="glass-card p-4 rounded-xl border-border/50">
                <h4 className="text-xs font-bold text-warning uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Zap className="w-3 h-3" /> Demandas Prioritárias - José da Silva
                </h4>
                <div className="space-y-2">
                  {regiaoData[selectedRegiao].demandas.map((d, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-foreground/90 bg-secondary/20 p-2 rounded-lg">
                      <ChevronRight className="w-3.5 h-3.5 text-primary" /> {d}
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/10">
                  <p className="text-[11px] text-muted-foreground italic text-center">
                    "{regiaoData[selectedRegiao].destaque}"
                  </p>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}