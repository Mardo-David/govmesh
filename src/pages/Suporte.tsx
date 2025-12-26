import { useState } from 'react';
import { 
  Smartphone, 
  Download, 
  CheckCircle2, 
  Share, 
  MoreVertical, 
  Plus, 
  Play, 
  MessageCircle, 
  Mail, 
  Phone, 
  Globe, 
  Building2, 
  User, 
  ArrowRight,
  LifeBuoy
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SuportePage() {
  const [activeInstallTab, setActiveInstallTab] = useState('iphone');
  const [showDemo, setShowDemo] = useState(false);

  // Ações de Contato Fluid-TI
  const handleWhatsApp = () => {
    window.open('https://wa.me/5581999897501', '_blank');
  };

  const handleEmail = () => {
    window.location.href = 'mailto:mardo@fluid-ti.com';
  };

  const handleSite = () => {
    window.open('https://www.fluid-ti.com', '_blank');
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in"> 
        {/* Removido max-w-5xl para ocupar largura total como as outras páginas */}
        
        {/* Cabeçalho */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <LifeBuoy className="w-8 h-8 text-primary" />
            Central de Suporte
          </h1>
          <p className="text-muted-foreground text-base">
            Documentação, orientações e atendimento direto com a equipe técnica.
          </p>
        </div>

        {/* Seção: Como Instalar (Mantendo funcionalidade original) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-xl border-2 border-primary/30 overflow-hidden"
        >
          <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              {/* Lado Esquerdo - Info */}
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

                {/* Benefícios */}
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

                {/* Abas de Plataforma */}
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
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                          <span className="text-sm font-bold text-primary">1</span>
                        </div>
                        <p className="text-sm text-foreground pt-1">Abra o Safari e acesse <strong>govmesh.app</strong></p>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                          <span className="text-sm font-bold text-primary">2</span>
                        </div>
                        <div>
                          <p className="text-sm text-foreground pt-1">Toque no botão <strong>Compartilhar</strong></p>
                          <div className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400">
                            <Share className="w-4 h-4" />
                            <span className="text-xs font-medium">Compartilhar</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                          <span className="text-sm font-bold text-primary">3</span>
                        </div>
                        <div>
                          <p className="text-sm text-foreground pt-1">Selecione <strong>"Adicionar à Tela de Início"</strong></p>
                          <div className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-secondary border border-border/50">
                            <Plus className="w-4 h-4 text-foreground" />
                            <span className="text-xs font-medium text-foreground">Adicionar à Tela de Início</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="android" className="mt-4 space-y-3">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                          <span className="text-sm font-bold text-primary">1</span>
                        </div>
                        <p className="text-sm text-foreground pt-1">Abra o Chrome e acesse <strong>govmesh.app</strong></p>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                          <span className="text-sm font-bold text-primary">2</span>
                        </div>
                        <div>
                          <p className="text-sm text-foreground pt-1">Toque no <strong>menu</strong> (3 pontos)</p>
                          <div className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-secondary border border-border/50">
                            <MoreVertical className="w-4 h-4 text-foreground" />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                          <span className="text-sm font-bold text-primary">3</span>
                        </div>
                        <div>
                          <p className="text-sm text-foreground pt-1">Toque em <strong>"Instalar aplicativo"</strong></p>
                          <div className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-secondary border border-border/50">
                            <Download className="w-4 h-4 text-foreground" />
                            <span className="text-xs font-medium text-foreground">Instalar aplicativo</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Lado Direito - Demo Video Placeholder */}
              <div className="w-full md:w-64 shrink-0 hidden md:block">
                <div 
                  onClick={() => setShowDemo(true)}
                  className="relative aspect-[9/16] rounded-2xl bg-gradient-to-br from-secondary to-secondary/50 border border-border/50 overflow-hidden cursor-pointer group"
                >
                  <div className="absolute inset-3 rounded-xl bg-background/80 backdrop-blur flex flex-col items-center justify-center gap-3">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-pulse">
                      <Smartphone className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <div className="text-center px-4">
                      <p className="text-sm font-semibold text-foreground">Veja a Demo</p>
                      <p className="text-xs text-muted-foreground mt-1">Clique para ver como instalar</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                    <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg">
                      <Play className="w-6 h-6 text-primary-foreground ml-1" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Seção 2: Canais de Atendimento Fluid-TI (Largura Total) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card WhatsApp */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 rounded-xl border-l-4 border-l-green-500 hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <MessageCircle className="w-8 h-8 text-green-600" />
                </div>
                <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full uppercase">
                  Recomendado
                </span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Suporte via WhatsApp</h3>
              <p className="text-muted-foreground mb-6">
                Fale diretamente com <strong>Mardo Carneiro</strong> para resoluções rápidas, dúvidas urgentes ou suporte em tempo real.
              </p>
            </div>
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-12 gap-2 mt-auto"
              onClick={handleWhatsApp}
            >
              <Phone className="w-4 h-4" />
              Iniciar Conversa (81 99989-7501)
            </Button>
          </motion.div>

          {/* Card Email */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6 rounded-xl border-l-4 border-l-blue-500 hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <Mail className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Suporte via Email</h3>
              <p className="text-muted-foreground mb-6">
                Para solicitações formais, envio de relatórios de erros detalhados ou agendamento de manutenção.
              </p>
            </div>
            <Button 
              variant="outline" 
              className="w-full h-12 gap-2 border-blue-200 hover:bg-blue-50 text-blue-700 mt-auto"
              onClick={handleEmail}
            >
              <Mail className="w-4 h-4" />
              Enviar Email (mardo@fluid-ti.com)
            </Button>
          </motion.div>
        </div>

        {/* Seção 3: Informações da Empresa (Rodapé Técnico) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <div className="glass-card rounded-xl overflow-hidden border-border/50">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/50">
              
              {/* Info Empresa */}
              <div className="p-6 flex flex-col items-center md:items-start text-center md:text-left hover:bg-secondary/30 transition-colors">
                <div className="flex items-center gap-2 mb-2 text-primary">
                  <Building2 className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Empresa</span>
                </div>
                <h4 className="text-2xl font-black text-foreground mb-1">Fluid-TI</h4>
                <p className="text-sm text-muted-foreground mb-3">Inteligência e Tecnologia</p>
                <Button variant="link" className="p-0 h-auto text-primary gap-1" onClick={handleSite}>
                  www.fluid-ti.com <ArrowRight className="w-3 h-3" />
                </Button>
              </div>

              {/* Info Responsável */}
              <div className="p-6 flex flex-col items-center md:items-start text-center md:text-left hover:bg-secondary/30 transition-colors">
                <div className="flex items-center gap-2 mb-2 text-primary">
                  <User className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Responsável Técnico</span>
                </div>
                <h4 className="text-lg font-bold text-foreground">Mardo Carneiro</h4>
                <p className="text-sm text-muted-foreground">Diretor Comercial</p>
                <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
                  <Phone className="w-3 h-3" /> 81 99989-7501
                </div>
              </div>

              {/* Info Portal */}
              <div className="p-6 flex flex-col items-center md:items-start text-center md:text-left hover:bg-secondary/30 transition-colors">
                <div className="flex items-center gap-2 mb-2 text-primary">
                  <Globe className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Portal Oficial</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Acesse nosso site para conhecer o portfólio completo e outras soluções.
                </p>
                <Button variant="outline" size="sm" onClick={handleSite} className="w-full md:w-auto">
                  Acessar Portal
                </Button>
              </div>

            </div>
          </div>
        </motion.div>

        {/* Copyright */}
        <div className="text-center pt-8 pb-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} GovMesh. Todos os direitos reservados. 
            Desenvolvido por <span className="font-bold text-foreground">Fluid-TI</span>.
          </p>
        </div>

        {/* Demo Modal (Mantido Original) */}
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
                  <Button onClick={() => setShowDemo(false)} className="w-full">
                    Fechar
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}