import { useState } from 'react';
import { Download, Copy, History, Video, Music, Image, FileImage, Check, X, Clock, Filter, Lock } from 'lucide-react';
import { useGovMesh, Kit, KitTipo, KitStatus } from '@/contexts/GovMeshContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const tipoConfig: Record<KitTipo, { icon: typeof Video; label: string; color: string }> = {
  video: { icon: Video, label: 'Vídeo', color: 'bg-primary/20 text-primary' },
  audio: { icon: Music, label: 'Áudio', color: 'bg-accent/20 text-accent' },
  meme: { icon: FileImage, label: 'Meme', color: 'bg-warning/20 text-warning' },
  card: { icon: Image, label: 'Card', color: 'bg-success/20 text-success' },
};

const statusConfig: Record<KitStatus, { icon: typeof Check; label: string; color: string }> = {
  aprovado: { icon: Check, label: 'Aprovado', color: 'bg-success/20 text-success border-success/30' },
  pendente: { icon: Clock, label: 'Pendente', color: 'bg-warning/20 text-warning border-warning/30' },
  bloqueado: { icon: X, label: 'Bloqueado', color: 'bg-destructive/20 text-destructive border-destructive/30' },
};

function LockedActionButton({ 
  onClick, 
  disabled, 
  isLocked, 
  children, 
  className 
}: { 
  onClick: () => void; 
  disabled: boolean; 
  isLocked: boolean; 
  children: React.ReactNode;
  className?: string;
}) {
  const button = (
    <Button
      size="sm"
      variant="outline"
      className={cn(
        'flex-1 bg-secondary/50 border-border/50',
        !disabled && !isLocked && 'hover:border-primary/50 hover:bg-primary/10',
        (disabled || isLocked) && 'opacity-50 cursor-not-allowed',
        className
      )}
      onClick={onClick}
      disabled={disabled || isLocked}
    >
      {isLocked ? (
        <>
          <Lock className="w-4 h-4 mr-1" />
          Bloqueado
        </>
      ) : (
        children
      )}
    </Button>
  );

  if (isLocked) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="flex-1">{button}</span>
          </TooltipTrigger>
          <TooltipContent 
            side="top" 
            className="bg-destructive text-destructive-foreground border-destructive"
          >
            <div className="flex items-center gap-2">
              <Lock className="w-3 h-3" />
              <span>Ação bloqueada pelo Protocolo de Emergência</span>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
}

function KitCard({ kit }: { kit: Kit }) {
  const { addLog, userProfile, isLocked, isSystemLocked } = useGovMesh();
  const [showHistory, setShowHistory] = useState(false);
  const TipoIcon = tipoConfig[kit.tipo].icon;
  const statusInfo = statusConfig[kit.status];
  const StatusIcon = statusInfo.icon;

  const isBlocked = isLocked || isSystemLocked;

  const handleDownload = () => {
    addLog({
      acao: 'Kit baixado',
      usuario: userProfile,
      detalhes: `${kit.titulo} baixado`,
      modulo: 'Kits',
      territorio: kit.territorio,
    });
    toast.success('Download iniciado!', {
      description: `${kit.titulo} está sendo baixado.`,
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(kit.textoCopiavel);
    addLog({
      acao: 'Texto copiado',
      usuario: userProfile,
      detalhes: `Texto do kit "${kit.titulo}" copiado`,
      modulo: 'Kits',
      territorio: kit.territorio,
    });
    toast.success('Texto copiado!', {
      description: 'O texto foi copiado para a área de transferência.',
    });
  };

  const mockHistory = [
    { data: '2024-01-15 14:30', acao: 'Kit aprovado pelo Jurídico', usuario: 'Dr. Silva' },
    { data: '2024-01-14 10:00', acao: 'Enviado para revisão jurídica', usuario: 'Admin' },
    { data: '2024-01-13 16:45', acao: 'Kit criado e submetido', usuario: 'Marketing' },
  ];

  return (
    <>
      <div className={cn(
        'glass-card rounded-xl p-5 border-border/50 hover:border-primary/30 transition-all duration-300 animate-fade-in group',
        isBlocked && 'opacity-70'
      )}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={cn('p-2.5 rounded-lg', tipoConfig[kit.tipo].color)}>
            <TipoIcon className="w-5 h-5" />
          </div>
          <Badge variant="outline" className={cn('text-xs font-medium border', statusInfo.color)}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {statusInfo.label}
          </Badge>
        </div>

        {/* Content */}
        <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{kit.titulo}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{kit.descricao}</p>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
          <span>{kit.territorio}</span>
          <span>•</span>
          <span>{kit.dataAtualizacao}</span>
        </div>

        {/* Text Preview */}
        <div className="bg-secondary/50 rounded-lg p-3 mb-4 border border-border/30">
          <p className="text-xs text-muted-foreground line-clamp-2">{kit.textoCopiavel}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <LockedActionButton
            onClick={handleDownload}
            disabled={kit.status === 'bloqueado'}
            isLocked={isBlocked}
          >
            <Download className="w-4 h-4 mr-1" />
            Baixar
          </LockedActionButton>

          <LockedActionButton
            onClick={handleCopy}
            disabled={false}
            isLocked={isBlocked}
            className="hover:border-accent/50 hover:bg-accent/10"
          >
            <Copy className="w-4 h-4 mr-1" />
            Copiar
          </LockedActionButton>

          <Button
            size="sm"
            variant="ghost"
            className="px-2"
            onClick={() => setShowHistory(true)}
          >
            <History className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* History Dialog */}
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Histórico: {kit.titulo}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            {mockHistory.map((entry, idx) => (
              <div key={idx} className="flex gap-3 p-3 rounded-lg bg-secondary/50 border border-border/30">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-foreground">{entry.acao}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <span>{entry.data}</span>
                    <span>•</span>
                    <span>{entry.usuario}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function KitsPage() {
  const { kits } = useGovMesh();
  const [filterTipo, setFilterTipo] = useState<KitTipo | 'todos'>('todos');
  const [filterStatus, setFilterStatus] = useState<KitStatus | 'todos'>('todos');

  const filteredKits = kits.filter(kit => {
    if (filterTipo !== 'todos' && kit.tipo !== filterTipo) return false;
    if (filterStatus !== 'todos' && kit.status !== filterStatus) return false;
    return true;
  });

  const tipoOptions: (KitTipo | 'todos')[] = ['todos', 'video', 'audio', 'meme', 'card'];
  const statusOptions: (KitStatus | 'todos')[] = ['todos', 'aprovado', 'pendente', 'bloqueado'];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">GovMesh Kits</h1>
            <p className="text-muted-foreground mt-1">
              Materiais de comunicação prontos para uso territorial
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="text-foreground font-medium">{filteredKits.length}</span> kits disponíveis
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Tipo:</span>
          </div>
          <div className="flex gap-2">
            {tipoOptions.map((tipo) => (
              <Button
                key={tipo}
                size="sm"
                variant={filterTipo === tipo ? 'default' : 'outline'}
                className={cn(
                  filterTipo === tipo 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary/50 border-border/50 hover:border-primary/50'
                )}
                onClick={() => setFilterTipo(tipo)}
              >
                {tipo === 'todos' ? 'Todos' : tipoConfig[tipo].label}
              </Button>
            ))}
          </div>

          <div className="w-px h-6 bg-border mx-2" />

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Status:</span>
          </div>
          <div className="flex gap-2">
            {statusOptions.map((status) => (
              <Button
                key={status}
                size="sm"
                variant={filterStatus === status ? 'default' : 'outline'}
                className={cn(
                  filterStatus === status 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary/50 border-border/50 hover:border-primary/50'
                )}
                onClick={() => setFilterStatus(status)}
              >
                {status === 'todos' ? 'Todos' : statusConfig[status].label}
              </Button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredKits.map((kit, idx) => (
            <div key={kit.id} style={{ animationDelay: `${idx * 50}ms` }}>
              <KitCard kit={kit} />
            </div>
          ))}
        </div>

        {filteredKits.length === 0 && (
          <div className="text-center py-12 glass-card rounded-xl border-border/50">
            <p className="text-muted-foreground">Nenhum kit encontrado com os filtros selecionados.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
