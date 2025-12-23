import { useGovMesh } from '@/contexts/GovMeshContext';
import { Activity, CheckCircle, AlertTriangle, UserPlus, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

const activityIcons: Record<string, typeof Activity> = {
  'Kit aprovado': CheckCircle,
  'Lead atualizado': UserPlus,
  'Boato detectado': AlertTriangle,
  'Acesso ao sistema': Activity,
  'Relatório exportado': FileText,
};

const activityColors: Record<string, string> = {
  'Kit aprovado': 'bg-success/20 text-success',
  'Lead atualizado': 'bg-primary/20 text-primary',
  'Boato detectado': 'bg-destructive/20 text-destructive',
  'Acesso ao sistema': 'bg-accent/20 text-accent',
  'Relatório exportado': 'bg-muted text-muted-foreground',
};

export function RecentActivity() {
  const { logs } = useGovMesh();

  return (
    <div className="glass-card rounded-xl p-6 border-border/50 animate-fade-in" style={{ animationDelay: '500ms' }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Atividade Recente</h3>
          <p className="text-sm text-muted-foreground">Últimas ações no sistema</p>
        </div>
        <button className="text-sm text-primary hover:text-primary/80 transition-colors font-medium">
          Ver todas
        </button>
      </div>

      <div className="space-y-4">
        {logs.slice(0, 5).map((log, index) => {
          const Icon = activityIcons[log.acao] || Activity;
          const colorClass = activityColors[log.acao] || 'bg-muted text-muted-foreground';
          
          return (
            <div 
              key={log.id}
              className="flex items-start gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors animate-slide-in-left"
              style={{ animationDelay: `${600 + index * 100}ms` }}
            >
              <div className={cn('p-2 rounded-lg shrink-0', colorClass)}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{log.acao}</p>
                <p className="text-xs text-muted-foreground truncate">{log.detalhes}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-muted-foreground">{log.timestamp}</p>
                <p className="text-xs text-muted-foreground/70">{log.usuario}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
