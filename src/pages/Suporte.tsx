import { useState } from 'react';
import { Book, Scale, HelpCircle, MessageCircle, ExternalLink, ChevronRight, FileText, Shield, Users, Headphones, Download, Smartphone, Share, MoreVertical, Plus, CheckCircle2, Play } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const supportCards = [
  {
    id: 'manual',
    icon: Book,
    title: 'Manual de Governança',
    description: 'Guia completo de uso do GovMesh com tutoriais passo-a-passo para todas as funcionalidades do sistema.',
    color: 'from-primary to-primary/60',
    actions: [
      { label: 'Acessar Manual', icon: FileText },
      { label: 'Download PDF', icon: ExternalLink },
    ],
  },
  {
    id: 'compliance',
    icon: Scale,
    title: 'Compliance Jurídico Eleitoral',
    description: 'Documentação sobre regras eleitorais, limites de campanha e orientações legais para conteúdo.',
    color: 'from-accent to-accent/60',
    actions: [
      { label: 'Ver Diretrizes', icon: Shield },
      { label: 'Consultar TSE', icon: ExternalLink },
    ],
  },
  {
    id: 'duvidas',
    icon: HelpCircle,
    title: 'Central de Dúvidas Técnicas',
    description: 'FAQ com respostas para as dúvidas mais frequentes sobre o uso do sistema e suas funcionalidades.',
    color: 'from-success to-success/60',
    actions: [
      { label: 'Ver FAQ', icon: FileText },
      { label: 'Buscar Dúvida', icon: HelpCircle },
    ],
  },
  {
    id: 'chat',
    icon: MessageCircle,
    title: 'Chat com Consultor',
    description: 'Atendimento em tempo real com nossa equipe de consultores especializados em campanha.',
    color: 'from-warning to-warning/60',
    actions: [
      { label: 'Iniciar Chat', icon: Headphones },
      { label: 'Agendar Chamada', icon: Users },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function SuportePage() {
  const [activeInstallTab, setActiveInstallTab] = useState('iphone');
  const [showDemo, setShowDemo] = useState(false);

  const handleAction = (cardTitle: string, actionLabel: string) => {
    toast.info(`${actionLabel}`, {
      description: `Abrindo ${cardTitle.toLowerCase()}...`,
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-primary" />
              Central de Suporte
            </h1>
            <p className="text-muted-foreground mt-1">
              Documentação, orientações e atendimento para a Campanha José da Silva
            </p>
          </div>
        </div>

        {/* How to Install Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-xl border-2 border-primary/30 overflow-hidden"
        >
          <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              {/* Left side - Info */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Como Instalar o GovMesh</h3>
                    <p className="text-sm text-muted-foreground">Instale o app no seu telemóvel em segundos</p>
                  </div>
                </div>

                {/* Benefits */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { icon: Download, text: 'Acesso Offline' },
                    { icon: CheckCircle2, text: 'Notificações' },
                    { icon: Smartphone, text: 'Tela Inicial' },
                  ].map((benefit, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 border border-border/30"
                    >
                      <benefit.icon className="w-4 h-4 text-primary" />
                      <span className="text-sm text-foreground">{benefit.text}</span>
                    </div>
                  ))}
                </div>

                {/* Platform Tabs */}
                <Tabs value={activeInstallTab} onValueChange={setActiveInstallTab} className="w-full">
                  <TabsList className="w-full bg-secondary/50">
                    <TabsTrigger value="iphone" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      🍎 iPhone
                    </TabsTrigger>
                    <TabsTrigger value="android" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      🤖 Android
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="iphone" className="mt-4 space-y-3">
                    <div className="space-y-3">
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30"
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                          <span className="text-sm font-bold text-primary">1</span>
                        </div>
                        <div>
                          <p className="text-sm text-foreground">Abra o Safari e acesse <strong>govmesh.app</strong></p>
                        </div>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30"
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                          <span className="text-sm font-bold text-primary">2</span>
                        </div>
                        <div>
                          <p className="text-sm text-foreground">Toque no botão <strong>Compartilhar</strong></p>
                          <div className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400">
                            <Share className="w-4 h-4" />
                            <span className="text-xs font-medium">Compartilhar</span>
                          </div>
                        </div>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30"
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                          <span className="text-sm font-bold text-primary">3</span>
                        </div>
                        <div>
                          <p className="text-sm text-foreground">Selecione <strong>"Adicionar à Tela de Início"</strong></p>
                          <div className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-secondary border border-border/50">
                            <Plus className="w-4 h-4 text-foreground" />
                            <span className="text-xs font-medium text-foreground">Adicionar à Tela de Início</span>
                          </div>
                        </div>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-success/10 border border-success/30"
                      >
                        <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-4 h-4 text-success" />
                        </div>
                        <p className="text-sm text-foreground">Toque em <strong>"Adicionar"</strong> e pronto!</p>
                      </motion.div>
                    </div>
                  </TabsContent>

                  <TabsContent value="android" className="mt-4 space-y-3">
                    <div className="space-y-3">
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30"
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                          <span className="text-sm font-bold text-primary">1</span>
                        </div>
                        <div>
                          <p className="text-sm text-foreground">Abra o Chrome e acesse <strong>govmesh.app</strong></p>
                        </div>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30"
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                          <span className="text-sm font-bold text-primary">2</span>
                        </div>
                        <div>
                          <p className="text-sm text-foreground">Toque no <strong>menu</strong> (3 pontos)</p>
                          <div className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-secondary border border-border/50">
                            <MoreVertical className="w-4 h-4 text-foreground" />
                          </div>
                        </div>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30"
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                          <span className="text-sm font-bold text-primary">3</span>
                        </div>
                        <div>
                          <p className="text-sm text-foreground">Toque em <strong>"Instalar aplicativo"</strong></p>
                          <div className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-secondary border border-border/50">
                            <Download className="w-4 h-4 text-foreground" />
                            <span className="text-xs font-medium text-foreground">Instalar aplicativo</span>
                          </div>
                        </div>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-success/10 border border-success/30"
                      >
                        <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-4 h-4 text-success" />
                        </div>
                        <p className="text-sm text-foreground">Confirme tocando em <strong>"Instalar"</strong> e pronto!</p>
                      </motion.div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Right side - Demo Video Placeholder */}
              <div className="w-full md:w-64 shrink-0">
                <div 
                  onClick={() => setShowDemo(true)}
                  className="relative aspect-[9/16] rounded-2xl bg-gradient-to-br from-secondary to-secondary/50 border border-border/50 overflow-hidden cursor-pointer group"
                >
                  {/* Phone mockup */}
                  <div className="absolute inset-3 rounded-xl bg-background/80 backdrop-blur flex flex-col items-center justify-center gap-3">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center"
                    >
                      <Smartphone className="w-8 h-8 text-primary-foreground" />
                    </motion.div>
                    <div className="text-center px-4">
                      <p className="text-sm font-semibold text-foreground">Veja a Demo</p>
                      <p className="text-xs text-muted-foreground mt-1">Clique para ver como instalar</p>
                    </div>
                  </div>

                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg"
                    >
                      <Play className="w-6 h-6 text-primary-foreground ml-1" />
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Support Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {supportCards.map((card) => (
            <motion.div
              key={card.id}
              variants={itemVariants}
              className="glass-card rounded-xl border-border/50 overflow-hidden group hover:border-primary/30 transition-all duration-300"
            >
              {/* Card Header with Gradient */}
              <div className={`h-2 bg-gradient-to-r ${card.color}`} />
              
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shrink-0`}>
                    <card.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {card.description}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {card.actions.map((action, idx) => (
                    <Button
                      key={idx}
                      variant={idx === 0 ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleAction(card.title, action.label)}
                      className={idx === 0 
                        ? 'bg-gradient-to-r from-primary to-accent hover:opacity-90' 
                        : 'border-border/50 hover:border-primary/50'
                      }
                    >
                      <action.icon className="w-4 h-4 mr-2" />
                      {action.label}
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-xl p-6 border-border/50"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">Links Úteis</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Portal TSE', url: 'https://www.tse.jus.br', icon: Scale },
              { label: 'Transparência SE', url: 'https://transparencia.se.gov.br', icon: FileText },
              { label: 'Diário Oficial SE', url: 'https://segrase.se.gov.br', icon: Book },
              { label: 'Governo de Sergipe', url: 'https://www.se.gov.br', icon: Shield },
            ].map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 hover:bg-secondary border border-border/30 hover:border-primary/30 transition-all group"
              >
                <link.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                <span className="text-sm text-muted-foreground group-hover:text-foreground">{link.label}</span>
                <ExternalLink className="w-3 h-3 text-muted-foreground ml-auto" />
              </a>
            ))}
          </div>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-xl p-6 border-border/50 bg-gradient-to-r from-primary/5 to-accent/5"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Headphones className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Precisa de ajuda urgente?</h3>
                <p className="text-sm text-muted-foreground">
                  Nossa equipe está disponível 24/7 durante o período eleitoral.
                </p>
              </div>
            </div>
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 glow-primary"
              onClick={() => toast.success('Conectando com suporte...')}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Falar com Suporte Agora
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Demo Modal */}
      <AnimatePresence>
        {showDemo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDemo(false)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-2xl p-6 max-w-md w-full border border-border"
            >
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Smartphone className="w-10 h-10 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Demonstração de Instalação</h3>
                <p className="text-muted-foreground text-sm">
                  Esta é uma demonstração simulada. Para instalar o GovMesh, siga os passos descritos na seção "Como Instalar" acima.
                </p>
                <div className="aspect-video rounded-xl bg-secondary/50 flex items-center justify-center border border-border/50">
                  <div className="text-center">
                    <Play className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Vídeo demonstrativo</p>
                  </div>
                </div>
                <Button onClick={() => setShowDemo(false)} className="w-full">
                  Fechar
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
