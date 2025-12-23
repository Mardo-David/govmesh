import { useGovMesh } from '@/contexts/GovMeshContext';
import { AlertTriangle, AlertOctagon, Info, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const nivelConfig = {
  critico: {
    icon: AlertOctagon,
    color: 'bg-destructive/20 text-destructive border-destructive/30',
    badge: 'bg-destructive text-destructive-foreground',
  },
  alto: {
    icon: AlertTriangle,
    color: 'bg-warning/20 text-warning border-warning/30',
    badge: 'bg-warning text-warning-foreground',
  },
  medio: {
    icon: AlertTriangle,
    color: 'bg-accent/20 text-accent border-accent/30',
    badge: 'bg-accent text-accent-foreground',
  },
  baixo: {
    icon: Info,
    color: 'bg-muted text-muted-foreground border-border',
    badge: 'bg-muted text-muted-foreground',
  },
};

export function AlertsWidget() {
  const { boatos } = useGovMesh();
  
  const sortedBoatos = [...boatos].sort((a, b) => {
    const order = { critico: 0, alto: 1, medio: 2, baixo: 3 };
    return order[a.nivel] - order[b.nivel];
  });

  return (
    <div className="glass-card rounded-xl p-6 border-border/50 animate-fade-in" style={{ animationDelay: '600ms' }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Alertas de Boatos</h3>
          <p className="text-sm text-muted-foreground">Monitoramento em tempo real</p>
        </div>
        <span className="px-2 py-1 rounded-full bg-destructive/20 text-destructive text-xs font-medium">
          {boatos.filter(b => b.nivel === 'critico' || b.nivel === 'alto').length} críticos
        </span>
      </div>

      <div className="space-y-3">
        {sortedBoatos.slice(0, 4).map((boato, index) => {
          const config = nivelConfig[boato.nivel];
          const Icon = config.icon;
          
          return (
            <div
              key={boato.id}
              className={cn(
                'p-4 rounded-lg border transition-all hover:scale-[1.01] cursor-pointer animate-slide-in-left',
                config.color
              )}
              style={{ animationDelay: `${700 + index * 100}ms` }}
            >
              <div className="flex items-start gap-3">
                <Icon className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground line-clamp-1">{boato.titulo}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', config.badge)}>
                      {boato.nivel.toUpperCase()}
                    </span>
                    <span className="text-xs text-muted-foreground">{boato.territorio}</span>
                    <span className="text-xs text-muted-foreground">• {boato.fonte}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </div>
            </div>
          );
        })}
      </div>

      <button className="w-full mt-4 py-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium flex items-center justify-center gap-1">
        Ver todos os alertas
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
