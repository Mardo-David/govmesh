import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  Shield, 
  TrendingUp, 
  ExternalLink, 
  Plus, 
  ChevronDown, 
  ChevronRight,
  Radio,
  Target,
  AlertOctagon,
  CheckCircle,
  Clock,
  Eye,
  FolderOpen,
  Flame,
  Hash
} from 'lucide-react';
import { useGovMesh, Boato } from '@/contexts/GovMeshContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const nivelConfig = {
  critico: { 
    label: 'CRÍTICO', 
    color: 'bg-destructive text-destructive-foreground', 
    borderColor: 'border-destructive/50',
    icon: AlertOctagon,
    glow: 'shadow-destructive/30'
  },
  alto: { 
    label: 'ALTO', 
    color: 'bg-warning text-warning-foreground', 
    borderColor: 'border-warning/50',
    icon: AlertTriangle,
    glow: 'shadow-warning/30'
  },
  medio: { 
    label: 'MÉDIO', 
    color: 'bg-accent text-accent-foreground', 
    borderColor: 'border-accent/50',
    icon: Eye,
    glow: 'shadow-accent/30'
  },
  baixo: { 
    label: 'BAIXO', 
    color: 'bg-muted text-muted-foreground', 
    borderColor: 'border-muted',
    icon: Eye,
    glow: ''
  },
};

const statusConfig = {
  monitorando: { label: 'Monitorando', color: 'bg-accent/20 text-accent', icon: Eye },
  aguardando_juridico: { label: 'Aguardando Jurídico', color: 'bg-warning/20 text-warning', icon: Clock },
  resposta_aprovada: { label: 'Resposta Aprovada', color: 'bg-success/20 text-success', icon: CheckCircle },
  neutralizado: { label: 'Neutralizado', color: 'bg-muted text-muted-foreground', icon: Shield },
};

function BoatoCard({ boato, onOpenKits, onReportVariant }: { 
  boato: Boato; 
  onOpenKits: (boato: Boato) => void;
  onReportVariant: (boato: Boato) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const nivel = nivelConfig[boato.nivel];
  const status = statusConfig[boato.status];
  const NivelIcon = nivel.icon;
  const StatusIcon = status.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'glass-card rounded-xl border-2 overflow-hidden transition-all duration-300',
        nivel.borderColor,
        boato.nivel === 'critico' && 'shadow-lg',
        nivel.glow && `shadow-lg ${nivel.glow}`
      )}
    >
      {/* Header */}
      <div 
        className="p-4 cursor-pointer hover:bg-secondary/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start gap-4">
          {/* Severity Indicator */}
          <motion.div
            animate={boato.nivel === 'critico' ? { scale: [1, 1.1, 1] } : {}}
            transition={{ repeat: boato.nivel === 'critico' ? Infinity : 0, duration: 1.5 }}
            className={cn('p-2.5 rounded-lg', nivel.color)}
          >
            <NivelIcon className="w-5 h-5" />
          </motion.div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Badge className={cn('text-xs font-bold', nivel.color)}>
                {nivel.label}
              </Badge>
              <Badge variant="outline" className={cn('text-xs', status.color)}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {status.label}
              </Badge>
              <Badge variant="outline" className="text-xs text-muted-foreground">
                <Hash className="w-3 h-3 mr-1" />
                {boato.tema}
              </Badge>
            </div>
            <h3 className="font-semibold text-foreground">{boato.titulo}</h3>
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              <span>{boato.territorio}</span>
              <span>•</span>
              <span>{boato.fonte}</span>
              <span>•</span>
              <span>{boato.dataDeteccao}</span>
            </div>
          </div>

          {/* Viralization */}
          <div className="text-right shrink-0">
            <div className="flex items-center gap-2 mb-1">
              <Flame className={cn(
                'w-4 h-4',
                boato.volumeViralizacao > 80 ? 'text-destructive' :
                boato.volumeViralizacao > 50 ? 'text-warning' : 'text-muted-foreground'
              )} />
              <span className={cn(
                'text-lg font-bold',
                boato.volumeViralizacao > 80 ? 'text-destructive' :
                boato.volumeViralizacao > 50 ? 'text-warning' : 'text-foreground'
              )}>
                {boato.volumeViralizacao}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Viralização</p>
            <Progress 
              value={boato.volumeViralizacao} 
              className="h-1.5 mt-1 w-20"
            />
          </div>

          {/* Expand Icon */}
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            className="shrink-0"
          >
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </motion.div>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2 border-t border-border/30 space-y-4">
              {/* Linha Oficial / Antídoto */}
              {boato.linhaOficial ? (
                <div className="p-4 rounded-lg bg-success/10 border border-success/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-success" />
                    <span className="text-sm font-medium text-success">Linha Oficial Aprovada</span>
                  </div>
                  <p className="text-sm text-foreground">{boato.linhaOficial}</p>
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-warning/10 border border-warning/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-warning" />
                    <span className="text-sm font-medium text-warning">Aguardando Resposta Oficial</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Este boato ainda não possui uma linha de resposta aprovada pelo Jurídico.
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={() => onOpenKits(boato)}
                  disabled={boato.kitsRelacionados.length === 0}
                  className="flex-1 bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30"
                >
                  <FolderOpen className="w-4 h-4 mr-2" />
                  Acessar Kit de Resposta
                  {boato.kitsRelacionados.length > 0 && (
                    <Badge className="ml-2 bg-primary/30">{boato.kitsRelacionados.length}</Badge>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onReportVariant(boato)}
                  className="border-warning/50 text-warning hover:bg-warning/10"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Reportar Variante
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function BoatosPage() {
  const { boatos, addLog, userProfile, setBoatos } = useGovMesh();
  const navigate = useNavigate();
  const [filterNivel, setFilterNivel] = useState<string>('todos');
  const [filterTema, setFilterTema] = useState<string>('todos');
  const [reportModal, setReportModal] = useState<{ open: boolean; boatoOriginal?: Boato }>({ open: false });
  const [newVariant, setNewVariant] = useState({ titulo: '', descricao: '', fonte: '', territorio: '' });

  // Get unique themes
  const temas = [...new Set(boatos.map(b => b.tema))];

  // Filter and sort boatos
  const filteredBoatos = boatos
    .filter(b => {
      if (filterNivel !== 'todos' && b.nivel !== filterNivel) return false;
      if (filterTema !== 'todos' && b.tema !== filterTema) return false;
      return true;
    })
    .sort((a, b) => {
      const nivelOrder = { critico: 0, alto: 1, medio: 2, baixo: 3 };
      return nivelOrder[a.nivel] - nivelOrder[b.nivel];
    });

  // Group by theme
  const groupedByTema = filteredBoatos.reduce((acc, boato) => {
    if (!acc[boato.tema]) acc[boato.tema] = [];
    acc[boato.tema].push(boato);
    return acc;
  }, {} as Record<string, Boato[]>);

  const handleOpenKits = (boato: Boato) => {
    addLog({
      acao: 'Kit de resposta acessado',
      usuario: userProfile,
      detalhes: `Kits para "${boato.titulo}" acessados`,
      modulo: 'War Room',
      territorio: boato.territorio,
    });
    navigate('/kits');
    toast.success('Kits filtrados', {
      description: `${boato.kitsRelacionados.length} kits relacionados disponíveis.`,
    });
  };

  const handleReportVariant = (boato?: Boato) => {
    setReportModal({ open: true, boatoOriginal: boato });
    setNewVariant({ 
      titulo: '', 
      descricao: '', 
      fonte: '', 
      territorio: boato?.territorio || '' 
    });
  };

  const handleSubmitVariant = () => {
    if (!newVariant.titulo.trim() || !newVariant.descricao.trim()) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const newBoato: Boato = {
      id: `b${Date.now()}`,
      titulo: newVariant.titulo,
      nivel: 'alto',
      status: 'monitorando',
      tema: reportModal.boatoOriginal?.tema || 'Nova Ameaça',
      territorio: newVariant.territorio || 'Grande Aracaju',
      dataDeteccao: new Date().toLocaleDateString('pt-BR'),
      fonte: newVariant.fonte || 'Reportado internamente',
      volumeViralizacao: 15,
      linhaOficial: undefined,
      kitsRelacionados: [],
    };

    setBoatos(prev => [newBoato, ...prev]);

    addLog({
      acao: 'Nova variante reportada',
      usuario: userProfile,
      detalhes: `Boato "${newVariant.titulo}" reportado${reportModal.boatoOriginal ? ` como variante de "${reportModal.boatoOriginal.titulo}"` : ''}`,
      modulo: 'War Room',
      territorio: newVariant.territorio,
    });

    toast.success('🚨 Variante Reportada', {
      description: 'O time será notificado e o boato entrará em monitoramento.',
    });

    setReportModal({ open: false });
    setNewVariant({ titulo: '', descricao: '', fonte: '', territorio: '' });
  };

  const criticalCount = boatos.filter(b => b.nivel === 'critico').length;
  const pendingCount = boatos.filter(b => b.status === 'aguardando_juridico').length;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Radio className="w-6 h-6 text-destructive animate-pulse" />
              War Room - Monitoramento de Boatos
            </h1>
            <p className="text-muted-foreground mt-1">
              Central de combate à desinformação em tempo real
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/10 border border-destructive/20">
              <AlertOctagon className="w-4 h-4 text-destructive" />
              <span className="text-sm text-destructive font-medium">{criticalCount} críticos</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-warning/10 border border-warning/20">
              <Clock className="w-4 h-4 text-warning" />
              <span className="text-sm text-warning font-medium">{pendingCount} pendentes</span>
            </div>
            <Button onClick={() => handleReportVariant()} className="bg-warning text-warning-foreground hover:bg-warning/90">
              <Plus className="w-4 h-4 mr-2" />
              Reportar Boato
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Severidade:</span>
          </div>
          <div className="flex gap-2">
            {['todos', 'critico', 'alto', 'medio', 'baixo'].map((nivel) => (
              <Button
                key={nivel}
                size="sm"
                variant={filterNivel === nivel ? 'default' : 'outline'}
                className={cn(
                  filterNivel === nivel 
                    ? nivel === 'critico' ? 'bg-destructive text-destructive-foreground' :
                      nivel === 'alto' ? 'bg-warning text-warning-foreground' :
                      'bg-primary text-primary-foreground'
                    : 'bg-secondary/50 border-border/50'
                )}
                onClick={() => setFilterNivel(nivel)}
              >
                {nivel === 'todos' ? 'Todos' : nivelConfig[nivel as keyof typeof nivelConfig]?.label || nivel}
              </Button>
            ))}
          </div>

          <div className="w-px h-6 bg-border mx-2" />

          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Tema:</span>
          </div>
          <Select value={filterTema} onValueChange={setFilterTema}>
            <SelectTrigger className="w-[200px] bg-secondary/50 border-border/50">
              <SelectValue placeholder="Selecione o tema" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os temas</SelectItem>
              {temas.map(tema => (
                <SelectItem key={tema} value={tema}>{tema}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Grouped Boatos */}
        <div className="space-y-6">
          {Object.entries(groupedByTema).map(([tema, boatosDoTema], groupIdx) => (
            <motion.div
              key={tema}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: groupIdx * 0.1 }}
            >
              {/* Theme Header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-secondary/50">
                  <Hash className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">{tema}</h2>
                <Badge variant="outline" className="text-xs">{boatosDoTema.length} boatos</Badge>
                <div className="flex-1 h-px bg-border/50" />
              </div>

              {/* Boatos in Theme */}
              <div className="space-y-3 pl-4 border-l-2 border-border/30">
                {boatosDoTema.map((boato, idx) => (
                  <BoatoCard
                    key={boato.id}
                    boato={boato}
                    onOpenKits={handleOpenKits}
                    onReportVariant={handleReportVariant}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {filteredBoatos.length === 0 && (
          <div className="text-center py-16 glass-card rounded-xl border-border/50">
            <Shield className="w-16 h-16 text-success/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Tudo sob controle</h3>
            <p className="text-muted-foreground">Nenhum boato encontrado com os filtros selecionados.</p>
          </div>
        )}
      </div>

      {/* Report Variant Modal */}
      <Dialog open={reportModal.open} onOpenChange={(open) => setReportModal({ ...reportModal, open })}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              Reportar {reportModal.boatoOriginal ? 'Nova Variante' : 'Novo Boato'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {reportModal.boatoOriginal && (
              <div className="p-3 rounded-lg bg-secondary/50 border border-border/30 text-sm">
                <span className="text-muted-foreground">Variante de: </span>
                <span className="text-foreground font-medium">{reportModal.boatoOriginal.titulo}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Título do Boato *</label>
              <Input
                placeholder="Descreva brevemente o boato..."
                value={newVariant.titulo}
                onChange={(e) => setNewVariant({ ...newVariant, titulo: e.target.value })}
                className="bg-secondary/50 border-border/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Descrição *</label>
              <Textarea
                placeholder="Detalhes sobre o boato, onde foi visto, contexto..."
                value={newVariant.descricao}
                onChange={(e) => setNewVariant({ ...newVariant, descricao: e.target.value })}
                className="min-h-[100px] bg-secondary/50 border-border/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Fonte</label>
                <Input
                  placeholder="WhatsApp, Twitter, etc."
                  value={newVariant.fonte}
                  onChange={(e) => setNewVariant({ ...newVariant, fonte: e.target.value })}
                  className="bg-secondary/50 border-border/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Território</label>
                <Input
                  placeholder="Região de Sergipe..."
                  value={newVariant.territorio}
                  onChange={(e) => setNewVariant({ ...newVariant, territorio: e.target.value })}
                  className="bg-secondary/50 border-border/50"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setReportModal({ open: false })}>
              Cancelar
            </Button>
            <Button onClick={handleSubmitVariant} className="bg-warning text-warning-foreground hover:bg-warning/90">
              <Plus className="w-4 h-4 mr-2" />
              Reportar Boato
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
