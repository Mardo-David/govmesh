import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Share, MoreVertical, Plus, Smartphone, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [showModal, setShowModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone 
      || document.referrer.includes('android-app://');
    
    setIsStandalone(isInStandaloneMode);

    // Detect platform
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    const isAndroidDevice = /android/.test(userAgent);
    
    setIsIOS(isIOSDevice);
    setIsAndroid(isAndroidDevice);

    // Listen for install prompt (Android/Chrome)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Show modal after a delay on mobile if not installed
    const isMobile = isIOSDevice || isAndroidDevice;
    if (isMobile && !isInStandaloneMode) {
      const hasSeenPrompt = localStorage.getItem('govmesh-install-prompt-seen');
      if (!hasSeenPrompt) {
        const timer = setTimeout(() => {
          setShowModal(true);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowModal(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('govmesh-install-prompt-seen', 'true');
    setShowModal(false);
  };

  if (isStandalone) return null;

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="max-w-md mx-4 bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <span className="block">Instalar GovMesh</span>
              <span className="block text-sm font-normal text-muted-foreground">no seu Telemóvel</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Benefits */}
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Tenha acesso rápido ao sistema de governança direto da tela inicial:
            </p>
            <div className="space-y-2">
              {[
                'Acesso offline aos dados da campanha',
                'Notificações de alertas em tempo real',
                'Carregamento ultra-rápido',
              ].map((benefit, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * idx }}
                  className="flex items-center gap-2 text-sm"
                >
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span className="text-foreground">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Platform-specific instructions */}
          <div className="space-y-4">
            {isIOS && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-secondary/50 border border-border/50 space-y-4"
              >
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-gray-800 flex items-center justify-center">
                    <span className="text-xs">🍎</span>
                  </div>
                  iPhone / iPad
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-primary">1</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">Toque no botão <strong>Compartilhar</strong></p>
                      <div className="mt-1 inline-flex items-center gap-1 px-2 py-1 rounded bg-blue-500/20 text-blue-400">
                        <Share className="w-4 h-4" />
                        <span className="text-xs">Compartilhar</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-primary">2</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">Selecione <strong>"Adicionar à Tela de Início"</strong></p>
                      <div className="mt-1 inline-flex items-center gap-1 px-2 py-1 rounded bg-secondary">
                        <Plus className="w-4 h-4 text-foreground" />
                        <span className="text-xs text-foreground">Adicionar à Tela de Início</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-success">3</span>
                    </div>
                    <p className="text-sm text-foreground">Toque em <strong>"Adicionar"</strong> no canto superior direito</p>
                  </div>
                </div>
              </motion.div>
            )}

            {isAndroid && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-secondary/50 border border-border/50 space-y-4"
              >
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-green-600/20 flex items-center justify-center">
                    <span className="text-xs">🤖</span>
                  </div>
                  Android
                </h4>
                
                {deferredPrompt ? (
                  <Button
                    onClick={handleInstallClick}
                    className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
                    size="lg"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Instalar Agora
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-primary">1</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-foreground">Toque no <strong>menu</strong> (3 pontos)</p>
                        <div className="mt-1 inline-flex items-center gap-1 px-2 py-1 rounded bg-secondary">
                          <MoreVertical className="w-4 h-4 text-foreground" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-primary">2</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-foreground">Selecione <strong>"Instalar aplicativo"</strong></p>
                        <div className="mt-1 inline-flex items-center gap-1 px-2 py-1 rounded bg-secondary">
                          <Download className="w-4 h-4 text-foreground" />
                          <span className="text-xs text-foreground">Instalar aplicativo</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-success">3</span>
                      </div>
                      <p className="text-sm text-foreground">Confirme tocando em <strong>"Instalar"</strong></p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {!isIOS && !isAndroid && (
              <div className="p-4 rounded-xl bg-secondary/50 border border-border/50 text-center">
                <p className="text-sm text-muted-foreground">
                  Abra este site no seu telemóvel para instalar o aplicativo.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleDismiss}
            className="flex-1 border-border/50"
          >
            Agora não
          </Button>
          {deferredPrompt && (
            <Button
              onClick={handleInstallClick}
              className="flex-1 bg-gradient-to-r from-primary to-accent"
            >
              <Download className="w-4 h-4 mr-2" />
              Instalar
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}