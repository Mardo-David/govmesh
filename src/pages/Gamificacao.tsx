import { AppLayout } from '@/components/layout/AppLayout';
import { 
  Trophy, 
  Target, 
  ShieldCheck, 
  TrendingUp, 
  Medal, 
  Star, 
  Users, 
  Zap,
  Crown,
  MapPin,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';

export default function GamificacaoPage() {
  // Mock: Dados do Usuário Logado
  const myStats = {
    level: 12,
    xp: 2450,
    nextLevelXp: 3000,
    rank: 'Capitão Regional',
    territorio: 'Grande Aracaju',
    trustScore: 980
  };

  // Mock: Ranking de Lideranças de Sergipe
  const leaderboard = [
    { id: 1, nome: 'Carlos Menezes', territorio: 'Aracaju', pontos: 15400, avatar: 'CM', medal: '🥇' },
    { id: 2, nome: 'Ana Santos', territorio: 'Itabaiana', pontos: 12350, avatar: 'AS', medal: '🥈' },
    { id: 3, nome: 'Roberto Lima', territorio: 'Lagarto', pontos: 10200, avatar: 'RL', medal: '🥉' },
    { id: 4, nome: 'Juliana Torres', territorio: 'Socorro', pontos: 9800, avatar: 'JT', medal: null },
    { id: 5, nome: 'Ricardo Alves', territorio: 'Estância', pontos: 8500, avatar: 'RA', medal: null },
  ];

  // Mock: Missões do Dia
  const missoes = [
    { id: 1, titulo: 'Cadastrar 5 novos eleitores', progresso: 3, total: 5, xp: 500, icon: Users },
    { id: 2, titulo: 'Compartilhar Kit "Segurança"', progresso: 10, total: 10, xp: 300, icon: Zap },
    { id: 3, titulo: 'Validar lista de Lagarto', progresso: 0, total: 1, xp: 1000, icon: ShieldCheck },
  ];

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in pb-10">
        
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
              <Trophy className="w-8 h-8 text-primary" />
              Gamificação & Trust Score
            </h1>
            <p className="text-muted-foreground">
              Acompanhe seu desempenho e a fidelidade da sua base.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full border border-border">
            <Crown className="w-5 h-5 text-yellow-500" />
            <span className="font-bold text-foreground">{myStats.rank}</span>
            <span className="text-xs text-muted-foreground ml-1">• Nível {myStats.level}</span>
          </div>
        </div>

        {/* Seção 1: Trust Score (O "Score de Crédito" Político) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* O Medidor de Score */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-1 glass-card rounded-xl p-6 border-l-4 border-l-primary flex flex-col items-center justify-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <ShieldCheck className="w-32 h-32" />
            </div>
            <h3 className="text-lg font-semibold text-muted-foreground mb-4">Seu Trust Score</h3>
            <div className="relative w-40 h-40 flex items-center justify-center">
              {/* Círculo de Fundo */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="transparent"
                  className="text-secondary"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray={440}
                  strokeDashoffset={440 - (440 * myStats.trustScore) / 1000}
                  className="text-primary transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-black text-foreground">{myStats.trustScore}</span>
                <span className="text-xs uppercase font-bold text-green-500">Excelente</span>
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Sua base de dados possui alta confiabilidade e engajamento verificado.
            </p>
          </motion.div>

          {/* Análise de Fatores */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="md:col-span-2 glass-card rounded-xl p-6 border-border/50"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              Análise de Qualidade da Base
            </h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Dados Completos (CPF, Endereço)</span>
                  <span className="font-bold text-foreground">98%</span>
                </div>
                <Progress value={98} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Engajamento no WhatsApp</span>
                  <span className="font-bold text-foreground">75%</span>
                </div>
                <Progress value={75} className="h-2 bg-secondary" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Participação em Eventos</span>
                  <span className="font-bold text-yellow-500">42% (Atenção)</span>
                </div>
                <Progress value={42} className="h-2 bg-secondary [&>div]:bg-yellow-500" />
              </div>
            </div>
            
            <div className="mt-6 p-4 rounded-lg bg-secondary/30 border border-border/50 flex gap-3 items-start">
              <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-foreground">Dica da IA</h4>
                <p className="text-xs text-muted-foreground">
                  Para aumentar seu Trust Score para 990, valide os endereços de 15 eleitores em Lagarto que estão marcados como "Pendentes".
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Seção 2: Missões e Ranking */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Missões Diárias */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 glass-card rounded-xl p-6 border-border/50"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Missões Ativas
              </h3>
              <Badge variant="outline" className="text-primary border-primary/30">
                XP Total: +1800
              </Badge>
            </div>

            <div className="space-y-4">
              {missoes.map((missao) => (
                <div key={missao.id} className="p-4 rounded-xl bg-secondary/30 border border-border/30 hover:border-primary/30 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <missao.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{missao.titulo}</h4>
                        <p className="text-xs text-muted-foreground">Recompensa: <span className="text-yellow-500 font-bold">+{missao.xp} XP</span></p>
                      </div>
                    </div>
                    {missao.progresso === missao.total ? (
                      <Badge className="bg-green-500 hover:bg-green-600">Concluído</Badge>
                    ) : (
                      <span className="text-xs font-mono text-muted-foreground">
                        {missao.progresso}/{missao.total}
                      </span>
                    )}
                  </div>
                  <Progress value={(missao.progresso / missao.total) * 100} className="h-1.5" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Ranking (Leaderboard) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-xl p-0 border-border/50 overflow-hidden flex flex-col"
          >
            <div className="p-6 bg-gradient-to-b from-primary/10 to-transparent border-b border-border/50">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Medal className="w-5 h-5 text-yellow-500" />
                Top Lideranças SE
              </h3>
              <p className="text-xs text-muted-foreground mt-1">Atualizado em tempo real</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {leaderboard.map((user, index) => (
                <div 
                  key={user.id} 
                  className={`flex items-center gap-3 p-3 rounded-lg ${index === 0 ? 'bg-yellow-500/10 border border-yellow-500/30' : 'bg-secondary/30'}`}
                >
                  <div className="w-8 h-8 flex items-center justify-center font-bold text-muted-foreground">
                    {user.medal || `#${index + 1}`}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-sm text-foreground">
                    {user.avatar}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-foreground">{user.nome}</h4>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {user.territorio}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block text-sm font-bold text-primary">{user.pontos.toLocaleString()}</span>
                    <span className="text-[10px] text-muted-foreground">pts</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-border/50 bg-secondary/20 text-center">
              <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground hover:text-primary">
                Ver Ranking Completo
              </Button>
            </div>
          </motion.div>

        </div>
      </div>
    </AppLayout>
  );
}