import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, AlertOctagon, Shield, Vote, Lock, Unlock, Power, AlertTriangle, X, ShieldAlert, ShieldOff } from 'lucide-react';
import { useGovMesh } from '@/contexts/GovMeshContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';

export default function ConfiguracoesPage() {
  const { isLocked, setIsLocked, isElectoralMode, setIsElectoralMode, isSystemLocked, toggleKillSwitch, addLog, userProfile } = useGovMesh();
  const [killSwitchModal, setKillSwitchModal] = useState(false);
  const [emergencyModal, setEmergencyModal] = useState(false);

  const handleElectoralMode = (enabled: boolean) => {
    setIsElectoralMode(enabled);
    addLog({
      acao: enabled ? 'Modo Eleitoral ativado' : 'Modo Eleitoral desativado',
      usuario: userProfile,
      detalhes: `Configuração alterada pelo ${userProfile}`,
      modulo: 'Configurações',
    });
    toast.success(enabled ? 'Modo Eleitoral Ativado' : 'Modo Eleitoral Desativado', {
      description: enabled ? 'Bordas de alerta ativadas em toda a aplicação.' : 'Sistema voltou ao modo normal.',
    });
  };

  const handleKillSwitch = () => {
    setIsLocked(true);
    setKillSwitchModal(false);
    addLog({
      acao: 'KILL SWITCH ATIVADO',
      usuario: userProfile,
      detalhes: 'Todos os downloads e geração de IA foram bloqueados',
      modulo: 'Segurança',
    });
    toast.error('🚨 KILL SWITCH ATIVADO', {
      description: 'Todas as funções de download e geração foram desabilitadas.',
      duration: 5000,
    });
  };

  const handleUnlock = () => {
    setIsLocked(false);
    addLog({
      acao: 'Sistema desbloqueado',
      usuario: userProfile,
      detalhes: 'Kill Switch desativado, sistema operacional',
      modulo: 'Segurança',
    });
    toast.success('Sistema Desbloqueado', {
      description: 'Funções de download e geração restauradas.',
    });
  };

  const handleEmergencyProtocol = () => {
    // Haptic feedback on mobile - 3 strong short pulses
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }
    
    toggleKillSwitch();
    setEmergencyModal(false);
    
    if (!isSystemLocked) {
      toast.error('🚨 PROTOCOLO DE EMERGÊNCIA ATIVADO', {
        description: 'Todas as ações de saída de dados foram interrompidas.',
        duration: 8000,
      });
    } else {
      toast.success('✅ Sistema Restaurado', {
        description: 'Protocolo de emergência desativado. Operações normalizadas.',
        duration: 5000,
      });
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Settings className="w-6 h-6 text-primary" />
            Configurações
          </h1>
          <p className="text-muted-foreground mt-1">
            Controles de segurança e configurações do sistema
          </p>
        </div>

        {/* EMERGENCY PROTOCOL - Highlighted Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'rounded-xl p-6 border-2 transition-all duration-300 relative overflow-hidden',
            isSystemLocked 
              ? 'bg-gradient-to-br from-red-950 via-red-900 to-red-950 border-red-500' 
              : 'bg-gradient-to-br from-red-950/50 via-background to-red-950/30 border-red-500/50'
          )}
        >
          {/* Animated background for active state */}
          {isSystemLocked && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          )}

          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <motion.div
                  animate={isSystemLocked ? { 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  } : {}}
                  transition={{ repeat: isSystemLocked ? Infinity : 0, duration: 1 }}
                  className={cn(
                    'p-4 rounded-xl',
                    isSystemLocked 
                      ? 'bg-red-500 text-white shadow-lg shadow-red-500/50' 
                      : 'bg-red-500/20 text-red-400'
                  )}
                >
                  <ShieldAlert className="w-8 h-8" />
                </motion.div>
                <div>
                  <h3 className="font-bold text-xl text-foreground">Protocolo de Segurança Máxima</h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-lg">
                    Bloqueio total do sistema. Ao ativar, todas as ações de saída de dados serão interrompidas imediatamente, incluindo downloads, cópias e geração de IA.
                  </p>
                  
                  <AnimatePresence mode="wait">
                    {isSystemLocked ? (
                      <motion.div
                        key="active"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4"
                      >
                        <div className="flex items-center gap-3 p-4 rounded-lg bg-red-500/20 border border-red-500/50 mb-4">
                          <motion.div
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ repeat: Infinity, duration: 1 }}
                          >
                            <AlertOctagon className="w-6 h-6 text-red-400" />
                          </motion.div>
                          <div>
                            <p className="text-red-400 font-bold">PROTOCOLO ATIVO</p>
                            <p className="text-red-400/80 text-sm">Todas as ações de campo estão bloqueadas</p>
                          </div>
                        </div>
                        <Button
                          size="lg"
                          onClick={() => setEmergencyModal(true)}
                          className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white shadow-lg"
                        >
                          <ShieldOff className="w-5 h-5 mr-2" />
                          Desativar Protocolo de Emergência
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="inactive"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4"
                      >
                        <Button
                          size="lg"
                          onClick={() => setEmergencyModal(true)}
                          className="relative overflow-hidden bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white shadow-lg shadow-red-500/30"
                        >
                          <motion.span
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                          />
                          <ShieldAlert className="w-5 h-5 mr-2" />
                          Ativar Protocolo de Emergência
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Big Red Toggle */}
              <div className="flex flex-col items-center gap-2">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setEmergencyModal(true)}
                  className={cn(
                    'w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300',
                    isSystemLocked 
                      ? 'bg-red-500 shadow-lg shadow-red-500/50' 
                      : 'bg-red-500/30 hover:bg-red-500/50 border-2 border-red-500/50'
                  )}
                >
                  <Power className={cn(
                    'w-8 h-8 transition-colors',
                    isSystemLocked ? 'text-white' : 'text-red-400'
                  )} />
                </motion.div>
                <span className={cn(
                  'text-xs font-medium',
                  isSystemLocked ? 'text-red-400' : 'text-muted-foreground'
                )}>
                  {isSystemLocked ? 'ATIVO' : 'OFF'}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Electoral Mode */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={cn(
            'glass-card rounded-xl p-6 border-2 transition-all duration-300',
            isElectoralMode ? 'border-destructive/50 bg-destructive/5' : 'border-border/50'
          )}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className={cn(
                'p-3 rounded-xl transition-colors',
                isElectoralMode ? 'bg-destructive/20 text-destructive' : 'bg-primary/20 text-primary'
              )}>
                <Vote className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-lg">Modo Eleitoral</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-md">
                  Ativa bordas de alerta vermelhas em toda a aplicação, indicando período eleitoral ativo com regras especiais de comunicação.
                </p>
                {isElectoralMode && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20"
                  >
                    <div className="flex items-center gap-2 text-destructive text-sm font-medium">
                      <AlertTriangle className="w-4 h-4" />
                      Período eleitoral ativo - Comunicação sob regras TSE
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
            <Switch
              checked={isElectoralMode}
              onCheckedChange={handleElectoralMode}
              className="data-[state=checked]:bg-destructive"
            />
          </div>
        </motion.div>

        {/* Kill Switch (Legacy) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={cn(
            'glass-card rounded-xl p-6 border-2 transition-all duration-300',
            isLocked ? 'border-destructive bg-destructive/10' : 'border-border/50'
          )}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <motion.div
                animate={isLocked ? { scale: [1, 1.1, 1] } : {}}
                transition={{ repeat: isLocked ? Infinity : 0, duration: 1.5 }}
                className={cn(
                  'p-3 rounded-xl',
                  isLocked ? 'bg-destructive text-destructive-foreground' : 'bg-warning/20 text-warning'
                )}
              >
                {isLocked ? <Lock className="w-6 h-6" /> : <AlertOctagon className="w-6 h-6" />}
              </motion.div>
              <div>
                <h3 className="font-semibold text-foreground text-lg">Kill Switch de Emergência</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-md">
                  Botão de pânico que desabilita instantaneamente todos os downloads e geração de IA em toda a plataforma.
                </p>
                
                <AnimatePresence mode="wait">
                  {isLocked ? (
                    <motion.div
                      key="locked"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-4"
                    >
                      <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive/20 border border-destructive/30 mb-4">
                        <motion.div
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ repeat: Infinity, duration: 1 }}
                        >
                          <AlertOctagon className="w-6 h-6 text-destructive" />
                        </motion.div>
                        <div>
                          <p className="text-destructive font-semibold">SISTEMA BLOQUEADO</p>
                          <p className="text-destructive/80 text-sm">Downloads e geração de IA desabilitados</p>
                        </div>
                      </div>
                      <Button
                        onClick={handleUnlock}
                        className="bg-success hover:bg-success/90"
                      >
                        <Unlock className="w-4 h-4 mr-2" />
                        Desbloquear Sistema
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="unlocked"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-4"
                    >
                      <Button
                        variant="destructive"
                        onClick={() => setKillSwitchModal(true)}
                        className="relative overflow-hidden group"
                      >
                        <motion.span
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        />
                        <Power className="w-4 h-4 mr-2" />
                        Ativar Kill Switch
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Security Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-xl p-6 border-border/50"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className={cn(
              'p-2 rounded-lg',
              isSystemLocked ? 'bg-destructive/20 text-destructive' : 'bg-success/20 text-success'
            )}>
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-foreground">Status de Segurança</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-secondary/50 border border-border/30">
              <div className="flex items-center gap-2 mb-2">
                <div className={cn(
                  'w-2 h-2 rounded-full',
                  isSystemLocked ? 'bg-destructive animate-pulse' : 'bg-success'
                )} />
                <span className="text-sm font-medium text-foreground">Protocolo</span>
              </div>
              <p className={cn(
                'text-xs',
                isSystemLocked ? 'text-destructive font-bold' : 'text-muted-foreground'
              )}>
                {isSystemLocked ? 'ATIVO' : 'Inativo'}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-secondary/50 border border-border/30">
              <div className="flex items-center gap-2 mb-2">
                <div className={cn(
                  'w-2 h-2 rounded-full',
                  isSystemLocked || isLocked ? 'bg-destructive' : 'bg-success'
                )} />
                <span className="text-sm font-medium text-foreground">Downloads</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {isSystemLocked || isLocked ? 'Bloqueado' : 'Operacional'}
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-secondary/50 border border-border/30">
              <div className="flex items-center gap-2 mb-2">
                <div className={cn(
                  'w-2 h-2 rounded-full',
                  isSystemLocked || isLocked ? 'bg-destructive' : 'bg-success'
                )} />
                <span className="text-sm font-medium text-foreground">Geração IA</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {isSystemLocked || isLocked ? 'Bloqueado' : 'Operacional'}
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-secondary/50 border border-border/30">
              <div className="flex items-center gap-2 mb-2">
                <div className={cn(
                  'w-2 h-2 rounded-full',
                  isElectoralMode ? 'bg-warning animate-pulse' : 'bg-success'
                )} />
                <span className="text-sm font-medium text-foreground">Modo</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {isElectoralMode ? 'Eleitoral' : 'Normal'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Kill Switch Confirmation Modal */}
      <Dialog open={killSwitchModal} onOpenChange={setKillSwitchModal}>
        <DialogContent className="bg-card border-destructive/50">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <AlertOctagon className="w-6 h-6 text-destructive" />
              Confirmar Kill Switch
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Esta ação irá:
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <div className="flex items-center gap-2 text-sm text-foreground">
              <X className="w-4 h-4 text-destructive" />
              Desabilitar todos os downloads de kits
            </div>
            <div className="flex items-center gap-2 text-sm text-foreground">
              <X className="w-4 h-4 text-destructive" />
              Bloquear geração de argumentos por IA
            </div>
            <div className="flex items-center gap-2 text-sm text-foreground">
              <X className="w-4 h-4 text-destructive" />
              Impedir cópia de textos dos kits
            </div>
            <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
              ⚠️ Esta ação será registrada na auditoria
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setKillSwitchModal(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleKillSwitch}>
              <Power className="w-4 h-4 mr-2" />
              Confirmar Ativação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Emergency Protocol Confirmation Modal */}
      <Dialog open={emergencyModal} onOpenChange={setEmergencyModal}>
        <DialogContent className={cn(
          'border-2',
          isSystemLocked ? 'bg-card border-green-500/50' : 'bg-gradient-to-br from-red-950 to-card border-red-500'
        )}>
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              {isSystemLocked ? (
                <>
                  <ShieldOff className="w-6 h-6 text-green-500" />
                  Desativar Protocolo de Emergência?
                </>
              ) : (
                <>
                  <ShieldAlert className="w-6 h-6 text-red-500" />
                  Ativar Protocolo de Segurança Máxima?
                </>
              )}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {isSystemLocked 
                ? 'Ao desativar, todas as funcionalidades serão restauradas.'
                : 'Deseja ativar o bloqueio total do sistema?'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {!isSystemLocked ? (
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/30">
                  <p className="text-red-400 font-semibold mb-2">⚠️ Todas as ações de saída de dados serão interrompidas:</p>
                  <ul className="text-sm text-red-400/80 space-y-1 ml-4">
                    <li>• Downloads de Kits bloqueados</li>
                    <li>• Cópias de texto bloqueadas</li>
                    <li>• Geração de IA bloqueada</li>
                    <li>• Aprovações/Reprovações bloqueadas</li>
                    <li>• Movimentação de Leads bloqueada</li>
                  </ul>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <AlertTriangle className="w-4 h-4" />
                  Esta ação será registrada na auditoria com timestamp e usuário
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-green-500/20 border border-green-500/30">
                <p className="text-green-400 font-semibold">✅ O sistema voltará ao funcionamento normal</p>
                <p className="text-sm text-green-400/80 mt-2">Todas as funcionalidades serão restauradas imediatamente.</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEmergencyModal(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleEmergencyProtocol}
              className={isSystemLocked 
                ? 'bg-green-600 hover:bg-green-500 text-white' 
                : 'bg-red-600 hover:bg-red-500 text-white'
              }
            >
              {isSystemLocked ? (
                <>
                  <ShieldOff className="w-4 h-4 mr-2" />
                  Desativar Protocolo
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4 mr-2" />
                  Confirmar Ativação
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
