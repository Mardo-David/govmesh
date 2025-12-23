import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, Check, X, AlertTriangle, FileText, Link, MessageSquare, ChevronDown, ChevronUp, Lock } from 'lucide-react';
import { useGovMesh } from '@/contexts/GovMeshContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

function ActionButton({ 
  onClick, 
  disabled, 
  isBlocked, 
  variant,
  children, 
  className 
}: { 
  onClick: () => void; 
  disabled: boolean; 
  isBlocked: boolean; 
  variant: 'approve' | 'reject';
  children: React.ReactNode;
  className?: string;
}) {
  const isDisabled = disabled || isBlocked;

  const button = (
    <Button
      className={cn(
        'flex-1',
        variant === 'approve' && !isBlocked && 'bg-gradient-to-r from-success to-success/80 hover:opacity-90',
        variant === 'reject' && !isBlocked && 'border-destructive/50 text-destructive hover:bg-destructive/10',
        isBlocked && 'opacity-50 cursor-not-allowed',
        className
      )}
      variant={variant === 'reject' ? 'outline' : 'default'}
      onClick={onClick}
      disabled={isDisabled}
    >
      {isBlocked ? (
        <>
          <Lock className="w-4 h-4 mr-2" />
          Bloqueado
        </>
      ) : (
        children
      )}
    </Button>
  );

  if (isBlocked) {
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

export default function JuridicoPage() {
  const { pendingApprovals, approveItem, rejectItem, updateCompliance, userProfile, isLocked, isSystemLocked } = useGovMesh();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [rejectModal, setRejectModal] = useState<{ open: boolean; id: string; titulo: string }>({ open: false, id: '', titulo: '' });
  const [rejectReason, setRejectReason] = useState('');

  const isBlocked = isLocked || isSystemLocked;

  const handleApprove = (id: string, titulo: string) => {
    if (isBlocked) return;

    const approval = pendingApprovals.find(p => p.id === id);
    if (!approval) return;

    const allChecked = approval.compliance.semDeepfake && approval.compliance.comFontes && approval.compliance.semOfensas;
    
    if (!allChecked) {
      toast.error('Checklist incompleto', {
        description: 'Todos os itens de compliance devem estar marcados para aprovar.',
      });
      return;
    }

    approveItem(id);
    toast.success('Item Aprovado!', {
      description: `${titulo} foi aprovado e liberado para uso.`,
    });
  };

  const handleReject = () => {
    if (isBlocked) return;

    if (!rejectReason.trim()) {
      toast.error('Motivo obrigatório', {
        description: 'Informe o motivo da reprovação.',
      });
      return;
    }

    rejectItem(rejectModal.id, rejectReason);
    toast.error('Item Reprovado', {
      description: `${rejectModal.titulo} foi bloqueado.`,
    });
    setRejectModal({ open: false, id: '', titulo: '' });
    setRejectReason('');
  };

  if (userProfile === 'Apoiador') {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <Scale className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Acesso Restrito</h2>
          <p className="text-muted-foreground">Esta área é exclusiva para perfis Jurídico e Admin.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Scale className="w-6 h-6 text-primary" />
              Aprovação Jurídica
            </h1>
            <p className="text-muted-foreground mt-1">
              Revise e aprove materiais antes da publicação
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isBlocked && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/10 border border-destructive/20">
                <Lock className="w-4 h-4 text-destructive" />
                <span className="text-sm text-destructive font-medium">Aprovações Bloqueadas</span>
              </div>
            )}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-warning/10 border border-warning/20">
              <AlertTriangle className="w-4 h-4 text-warning" />
              <span className="text-sm text-warning font-medium">{pendingApprovals.length} pendentes</span>
            </div>
          </div>
        </div>

        {/* Pending Items */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {pendingApprovals.map((approval, idx) => {
              const isExpanded = expandedId === approval.id;
              const allChecked = approval.compliance.semDeepfake && approval.compliance.comFontes && approval.compliance.semOfensas;

              return (
                <motion.div
                  key={approval.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100, height: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  layout
                  className={cn(
                    'glass-card rounded-xl border-border/50 overflow-hidden',
                    isBlocked && 'opacity-70'
                  )}
                >
                  {/* Header */}
                  <div 
                    className="p-4 cursor-pointer hover:bg-secondary/30 transition-colors"
                    onClick={() => setExpandedId(isExpanded ? null : approval.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          'p-2.5 rounded-lg',
                          approval.tipo === 'kit' ? 'bg-primary/20 text-primary' : 'bg-accent/20 text-accent'
                        )}>
                          {approval.tipo === 'kit' ? <FileText className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{approval.titulo}</h3>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <span>Solicitado por {approval.solicitante}</span>
                            <span>•</span>
                            <span>{approval.dataSolicitacao}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {allChecked && !isBlocked && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex items-center gap-1 px-2 py-1 rounded-full bg-success/20 text-success text-xs font-medium"
                          >
                            <Check className="w-3 h-3" />
                            Pronto
                          </motion.div>
                        )}
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 border-t border-border/30 pt-4">
                          {/* Content Preview */}
                          <div className="bg-secondary/50 rounded-lg p-4 mb-4 border border-border/30">
                            <p className="text-sm text-muted-foreground">{approval.conteudo}</p>
                          </div>

                          {/* Blocked Warning */}
                          {isBlocked && (
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm mb-4">
                              <Lock className="w-4 h-4" />
                              <span>Aprovações e reprovações bloqueadas pelo Protocolo de Emergência</span>
                            </div>
                          )}

                          {/* Compliance Checklist */}
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-foreground mb-3">Checklist de Compliance</h4>
                            <div className="space-y-3">
                              {[
                                { key: 'semDeepfake', label: 'Sem Deepfake / Manipulação de Mídia', icon: '🚫' },
                                { key: 'comFontes', label: 'Dados com Fontes Oficiais Verificáveis', icon: '📋' },
                                { key: 'semOfensas', label: 'Sem Ofensas ou Conteúdo Difamatório', icon: '✅' },
                              ].map(({ key, label, icon }) => (
                                <motion.label
                                  key={key}
                                  className={cn(
                                    'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all',
                                    approval.compliance[key as keyof typeof approval.compliance]
                                      ? 'bg-success/10 border-success/30'
                                      : 'bg-secondary/30 border-border/50 hover:border-primary/30'
                                  )}
                                  whileHover={{ scale: 1.01 }}
                                  whileTap={{ scale: 0.99 }}
                                >
                                  <Checkbox
                                    checked={approval.compliance[key as keyof typeof approval.compliance]}
                                    onCheckedChange={(checked) => updateCompliance(approval.id, key as keyof typeof approval.compliance, !!checked)}
                                    className="border-border data-[state=checked]:bg-success data-[state=checked]:border-success"
                                  />
                                  <span className="text-lg">{icon}</span>
                                  <span className="text-sm text-foreground">{label}</span>
                                </motion.label>
                              ))}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-3">
                            <ActionButton
                              variant="approve"
                              onClick={() => handleApprove(approval.id, approval.titulo)}
                              disabled={!allChecked}
                              isBlocked={isBlocked}
                            >
                              <Check className="w-4 h-4 mr-2" />
                              Aprovar
                            </ActionButton>
                            <ActionButton
                              variant="reject"
                              onClick={() => setRejectModal({ open: true, id: approval.id, titulo: approval.titulo })}
                              disabled={false}
                              isBlocked={isBlocked}
                            >
                              <X className="w-4 h-4 mr-2" />
                              Reprovar
                            </ActionButton>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {pendingApprovals.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 glass-card rounded-xl border-border/50"
            >
              <Check className="w-16 h-16 text-success/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Tudo em dia!</h3>
              <p className="text-muted-foreground">Não há itens pendentes de aprovação.</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      <Dialog open={rejectModal.open} onOpenChange={(open) => setRejectModal({ ...rejectModal, open })}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <X className="w-5 h-5 text-destructive" />
              Reprovar Item
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Informe o motivo da reprovação de "<span className="text-foreground">{rejectModal.titulo}</span>":
            </p>
            <Textarea
              placeholder="Descreva o motivo da reprovação..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="min-h-[100px] bg-secondary/50 border-border/50"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectModal({ open: false, id: '', titulo: '' })}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={isBlocked}>
              {isBlocked ? (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Bloqueado
                </>
              ) : (
                'Confirmar Reprovação'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
