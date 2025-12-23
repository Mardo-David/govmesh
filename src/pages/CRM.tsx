import { useState } from 'react';
import { User, Phone, Mail, MapPin, ChevronRight, ChevronLeft, Check, Star, ArrowRight, Lock } from 'lucide-react';
import { useGovMesh, Lead, LeadStatus } from '@/contexts/GovMeshContext';
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

const statusColumns: { status: LeadStatus; label: string; color: string }[] = [
  { status: 'novo', label: 'Novo', color: 'border-muted-foreground/30 bg-muted/30' },
  { status: 'contatado', label: 'Contatado', color: 'border-accent/30 bg-accent/10' },
  { status: 'engajado', label: 'Engajado', color: 'border-primary/30 bg-primary/10' },
  { status: 'multiplicador', label: 'Multiplicador', color: 'border-success/30 bg-success/10' },
];

function MoveButton({ 
  direction, 
  disabled, 
  isBlocked, 
  onClick,
  size = 'sm'
}: { 
  direction: 'left' | 'right';
  disabled: boolean;
  isBlocked: boolean;
  onClick: () => void;
  size?: 'sm' | 'default';
}) {
  const Icon = direction === 'left' ? ChevronLeft : ChevronRight;
  const isDisabled = disabled || isBlocked;

  const button = (
    <Button
      size={size}
      variant={size === 'sm' ? 'ghost' : 'outline'}
      className={cn(
        size === 'default' && 'flex-1 bg-secondary/50 border-border/50',
        'min-h-[44px] min-w-[44px]',
        isDisabled && 'opacity-50 cursor-not-allowed'
      )}
      disabled={isDisabled}
      onClick={onClick}
    >
      {isBlocked ? (
        <Lock className="w-3 h-3" />
      ) : (
        <>
          {direction === 'left' && <Icon className={cn(size === 'sm' ? 'w-4 h-4' : 'w-5 h-5', size === 'default' && 'mr-1')} />}
          {size === 'default' && (direction === 'left' ? 'Mover Esquerda' : 'Mover Direita')}
          {direction === 'right' && <Icon className={cn(size === 'sm' ? 'w-4 h-4' : 'w-5 h-5', size === 'default' && 'ml-1')} />}
        </>
      )}
    </Button>
  );

  if (isBlocked) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className={size === 'default' ? 'flex-1' : ''}>{button}</span>
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

function LeadCard({ lead, onMove, isBlocked }: { lead: Lead; onMove: (leadId: string, direction: 'left' | 'right') => void; isBlocked: boolean }) {
  const [showDetails, setShowDetails] = useState(false);
  const currentIndex = statusColumns.findIndex(col => col.status === lead.status);
  const canMoveLeft = currentIndex > 0;
  const canMoveRight = currentIndex < statusColumns.length - 1;

  return (
    <>
      <div 
        className={cn(
          'glass-card rounded-lg p-3 md:p-4 border-border/50 hover:border-primary/30 transition-all duration-200 cursor-pointer animate-fade-in group',
          isBlocked && 'opacity-70'
        )}
        onClick={() => setShowDetails(true)}
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center shrink-0">
            <span className="text-sm font-semibold text-foreground">
              {lead.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground text-sm truncate">{lead.nome}</p>
            <p className="text-xs text-muted-foreground truncate hidden md:block">{lead.territorio}</p>
          </div>
        </div>

        {/* Quick Actions - Larger touch targets */}
        <div className="flex gap-2 mt-3 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
          <MoveButton
            direction="left"
            disabled={!canMoveLeft}
            isBlocked={isBlocked}
            onClick={() => onMove(lead.id, 'left')}
          />
          <MoveButton
            direction="right"
            disabled={!canMoveRight}
            isBlocked={isBlocked}
            onClick={() => onMove(lead.id, 'right')}
          />
        </div>
      </div>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="bg-card border-border max-w-[95vw] md:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                <span className="text-lg font-semibold">
                  {lead.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
              </div>
              <div>
                <p className="text-base">{lead.nome}</p>
                <Badge variant="outline" className="text-xs mt-1">
                  {statusColumns.find(c => c.status === lead.status)?.label}
                </Badge>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
                <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-foreground truncate">{lead.email}</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
                <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-foreground">{lead.telefone}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
              <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-sm text-foreground">{lead.territorio}</span>
            </div>

            <div className="text-xs text-muted-foreground">
              Último contato: {lead.ultimoContato}
            </div>

            {/* Blocked Warning */}
            {isBlocked && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                <Lock className="w-4 h-4 shrink-0" />
                <span>Movimentação bloqueada pelo Protocolo de Emergência</span>
              </div>
            )}

            {/* Move Actions */}
            <div className="flex gap-2 pt-4 border-t border-border">
              <MoveButton
                direction="left"
                disabled={!canMoveLeft}
                isBlocked={isBlocked}
                size="default"
                onClick={() => {
                  onMove(lead.id, 'left');
                  setShowDetails(false);
                }}
              />
              <MoveButton
                direction="right"
                disabled={!canMoveRight}
                isBlocked={isBlocked}
                size="default"
                onClick={() => {
                  onMove(lead.id, 'right');
                  setShowDetails(false);
                }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function MultiplicadorCard({ lead }: { lead: Lead }) {
  return (
    <div className="glass-card rounded-lg p-3 md:p-4 border-success/30 bg-success/5 animate-fade-in">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-success/30 to-primary/30 flex items-center justify-center shrink-0 relative">
          <span className="text-sm font-semibold text-foreground">
            {lead.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </span>
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-success flex items-center justify-center">
            <Star className="w-3 h-3 text-success-foreground" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground text-sm truncate">{lead.nome}</p>
          <p className="text-xs text-muted-foreground truncate hidden md:block">{lead.territorio}</p>
        </div>
      </div>

      {/* Portal Access Badge */}
      <div className="mt-3 p-2 rounded-lg bg-success/20 border border-success/30 flex items-center gap-2">
        <Check className="w-4 h-4 text-success shrink-0" />
        <span className="text-xs text-success font-medium truncate">Acesso ao Portal Liberado</span>
      </div>
    </div>
  );
}

export default function CRMPage() {
  const { leads, updateLeadStatus, isLocked, isSystemLocked } = useGovMesh();

  const isBlocked = isLocked || isSystemLocked;

  const handleMove = (leadId: string, direction: 'left' | 'right') => {
    if (isBlocked) return;

    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    const currentIndex = statusColumns.findIndex(col => col.status === lead.status);
    const newIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= statusColumns.length) return;

    const newStatus = statusColumns[newIndex].status;
    updateLeadStatus(leadId, newStatus);

    if (newStatus === 'multiplicador') {
      toast.success('🌟 Novo Multiplicador!', {
        description: `${lead.nome} agora tem acesso ao Portal de Lideranças.`,
      });
    } else {
      toast.success('Lead movido!', {
        description: `${lead.nome} → ${statusColumns[newIndex].label}`,
      });
    }
  };

  return (
    <AppLayout>
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">CRM de Mobilização</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gerencie o funil de lideranças territoriais
            </p>
          </div>
          <div className="flex items-center gap-2 md:gap-4 text-sm">
            {isBlocked && (
              <div className="flex items-center gap-2 px-2 md:px-3 py-1.5 rounded-full bg-destructive/10 border border-destructive/20">
                <Lock className="w-4 h-4 text-destructive" />
                <span className="text-destructive font-medium text-xs md:text-sm">Bloqueado</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-success" />
              <span className="text-muted-foreground text-xs md:text-sm">
                <span className="text-foreground font-medium">{leads.filter(l => l.status === 'multiplicador').length}</span> mult.
              </span>
            </div>
          </div>
        </div>

        {/* Kanban Board - Horizontal scroll on mobile */}
        <div className="overflow-x-auto -mx-3 px-3 md:mx-0 md:px-0">
          <div className="grid grid-cols-4 gap-3 md:gap-4 min-w-[800px] md:min-w-0">
            {statusColumns.map((column, colIdx) => {
              const columnLeads = leads.filter(l => l.status === column.status);

              return (
                <div
                  key={column.status}
                  className={cn(
                    'rounded-xl p-3 md:p-4 border min-h-[400px] md:min-h-[500px] animate-fade-in',
                    column.color
                  )}
                  style={{ animationDelay: `${colIdx * 100}ms` }}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between mb-3 md:mb-4">
                    <h3 className="font-semibold text-foreground text-sm md:text-base">{column.label}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {columnLeads.length}
                    </Badge>
                  </div>

                  {/* Cards */}
                  <div className="space-y-2 md:space-y-3">
                    {columnLeads.map((lead, idx) => (
                      <div key={lead.id} style={{ animationDelay: `${(colIdx * 100) + (idx * 50)}ms` }}>
                        {column.status === 'multiplicador' ? (
                          <MultiplicadorCard lead={lead} />
                        ) : (
                          <LeadCard lead={lead} onMove={handleMove} isBlocked={isBlocked} />
                        )}
                      </div>
                    ))}

                    {columnLeads.length === 0 && (
                      <div className="text-center py-6 md:py-8 text-muted-foreground text-xs md:text-sm">
                        Nenhum lead
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
