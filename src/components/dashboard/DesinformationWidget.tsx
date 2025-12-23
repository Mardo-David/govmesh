import { useGovMesh } from '@/contexts/GovMeshContext';
import { AlertTriangle, AlertOctagon, ChevronRight, Flame, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const nivelConfig = {
  critico: { 
    label: 'CRÍTICO', 
    color: 'bg-destructive text-destructive-foreground',
    icon: AlertOctagon,
  },
  alto: { 
    label: 'ALTO', 
    color: 'bg-warning text-warning-foreground',
    icon: AlertTriangle,
  },
  medio: { 
    label: 'MÉDIO', 
    color: 'bg-accent text-accent-foreground',
    icon: AlertTriangle,
  },
  baixo: { 
    label: 'BAIXO', 
    color: 'bg-muted text-muted-foreground',
    icon: AlertTriangle,
  },
};

export function DesinformationWidget() {
  const { boatos } = useGovMesh();
  const navigate = useNavigate();

  // Get top 3 critical boatos
  const criticalBoatos = boatos
    .filter(b => b.nivel === 'critico' || b.nivel === 'alto')
    .sort((a, b) => b.volumeViralizacao - a.volumeViralizacao)
    .slice(0, 3);

  if (criticalBoatos.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card rounded-xl p-6 border-success/30 bg-success/5"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-success/20 text-success">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Alertas de Desinformação</h3>
        </div>
        <div className="text-center py-6">
          <Shield className="w-12 h-12 text-success/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Nenhum boato crítico no momento</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="glass-card rounded-xl p-6 border-destructive/30 bg-destructive/5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="p-2 rounded-lg bg-destructive/20 text-destructive"
          >
            <AlertOctagon className="w-5 h-5" />
          </motion.div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Alertas de Desinformação</h3>
            <p className="text-xs text-muted-foreground">Boatos mais críticos agora</p>
          </div>
        </div>
        <span className="px-2 py-1 rounded-full bg-destructive text-destructive-foreground text-xs font-bold">
          {criticalBoatos.length} ativos
        </span>
      </div>

      <div className="space-y-3">
        {criticalBoatos.map((boato, idx) => {
          const nivel = nivelConfig[boato.nivel];
          const NivelIcon = nivel.icon;

          return (
            <motion.div
              key={boato.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + idx * 0.1 }}
              onClick={() => navigate('/boatos')}
              className={cn(
                'p-3 rounded-lg border cursor-pointer transition-all hover:scale-[1.02]',
                boato.nivel === 'critico' 
                  ? 'bg-destructive/10 border-destructive/30 hover:bg-destructive/20' 
                  : 'bg-warning/10 border-warning/30 hover:bg-warning/20'
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn('p-1.5 rounded-md shrink-0', nivel.color)}>
                  <NivelIcon className="w-3 h-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground line-clamp-1">{boato.titulo}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{boato.territorio}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{boato.fonte}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Flame className={cn(
                    'w-3 h-3',
                    boato.volumeViralizacao > 80 ? 'text-destructive' : 'text-warning'
                  )} />
                  <span className={cn(
                    'text-xs font-bold',
                    boato.volumeViralizacao > 80 ? 'text-destructive' : 'text-warning'
                  )}>
                    {boato.volumeViralizacao}%
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <button 
        onClick={() => navigate('/boatos')}
        className="w-full mt-4 py-2 text-sm text-destructive hover:text-destructive/80 transition-colors font-medium flex items-center justify-center gap-1"
      >
        Acessar War Room
        <ChevronRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
