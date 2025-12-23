import { Users, FolderCheck, AlertTriangle, TrendingUp } from 'lucide-react';
import { useGovMesh } from '@/contexts/GovMeshContext';
import { KPICard } from '@/components/dashboard/KPICard';
import { EngagementChart } from '@/components/dashboard/EngagementChart';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { DesinformationWidget } from '@/components/dashboard/DesinformationWidget';
import { RegionalCommandCenter } from '@/components/dashboard/RegionalCommandCenter';

export default function Dashboard() {
  // Pegamos os dados do contexto. Certifique-se de que o contexto já tenha "José da Silva" e o e-mail correto.
  const { leads, kits, boatos, userProfile } = useGovMesh();

  // Cálculos de KPI baseados nos mocks do seu computador
  const liderancasAtivas = leads.filter(l => l.status === 'multiplicador' || l.status === 'engajado').length;
  const kitsAprovados = kits.filter(k => k.status === 'aprovado').length;
  const boatosAlerta = boatos.filter(b => b.nivel === 'critico' || b.nivel === 'alto').length;
  const taxaConversao = leads.length > 0 
    ? Math.round((leads.filter(l => l.status === 'multiplicador').length / leads.length) * 100) 
    : 0;

  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in">
      {/* Page Header - Contexto Sergipe */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">Dashboard de Governança</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            <span className="hidden sm:inline">Bem-vindo, </span>
            <span className="text-primary font-semibold">GovMesh Admin</span>
            <span className="hidden md:inline">. Gestão Estratégica: Campanha 2026</span>
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full border border-border/50">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="hidden sm:inline">Portal Seguro • </span>Atualizado agora
        </div>
      </div>

      {/* KPI Cards - Grid responsivo */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <KPICard
          title="Lideranças Ativas"
          value={liderancasAtivas}
          subtitle={`de ${leads.length} total`}
          icon={Users}
          trend={{ value: 12, isPositive: true }}
          variant="primary"
          delay={100}
        />
        <KPICard
          title="Conteúdos Aprovados"
          value={kitsAprovados}
          subtitle={`de ${kits.length} kits`}
          icon={FolderCheck}
          trend={{ value: 8, isPositive: true }}
          variant="success"
          delay={200}
        />
        <KPICard
          title="Alertas de Crise"
          value={boatosAlerta}
          subtitle="atenção imediata"
          icon={AlertTriangle}
          trend={{ value: 5, isPositive: false }}
          variant="warning"
          delay={300}
        />
        <KPICard
          title="Taxa de Engajamento"
          value={`${taxaConversao}%`}
          subtitle="leads → multiplicadores"
          icon={TrendingUp}
          trend={{ value: 3, isPositive: true }}
          variant="accent"
          delay={400}
        />
      </div>

      {/* Charts & Widgets Grid - Correção de Simetria Manual */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 items-stretch">
        {/* Gráfico Principal - Ocupa 2 colunas e estica para preencher a altura */}
        <div className="lg:col-span-2 flex flex-col w-full">
          <EngagementChart className="h-full w-full flex-1" />
        </div>
        
        {/* Centro de Comando Regional - Estica para casar com a altura do gráfico acima */}
        <div className="flex flex-col w-full">
          <RegionalCommandCenter className="h-full w-full flex-1" />
        </div>
      </div>

      {/* Seção de Monitoramento de Crise e Atividade Recente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 items-stretch">
        <DesinformationWidget className="h-full" />
        <RecentActivity className="h-full" />
      </div>

      {/* Distribuição de Conteúdo e Status Final */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Card de Distribuição por Tipo */}
        <div className="glass-card rounded-xl p-4 md:p-6 border-border/50 animate-fade-in" style={{ animationDelay: '700ms' }}>
          <h3 className="text-base md:text-lg font-semibold text-foreground mb-4">Distribuição de Kits Digitais</h3>
          <div className="space-y-3 md:space-y-4">
            {[
              { tipo: 'Vídeos de Campanha', count: kits.filter(k => k.tipo === 'video').length, color: 'bg-primary' },
              { tipo: 'Áudios / Podcasts', count: kits.filter(k => k.tipo === 'audio').length, color: 'bg-accent' },
              { tipo: 'Cards Sociais', count: kits.filter(k => k.tipo === 'card').length, color: 'bg-success' },
              { tipo: 'Memes e Virais', count: kits.filter(k => k.tipo === 'meme').length, color: 'bg-warning' },
            ].map((item, index) => (
              <div key={item.tipo} className="animate-slide-in-left" style={{ animationDelay: `${800 + index * 100}ms` }}>
                <div className="flex items-center justify-between mb-1 md:mb-2">
                  <span className="text-xs md:text-sm text-muted-foreground">{item.tipo}</span>
                  <span className="text-xs md:text-sm font-semibold text-foreground">{item.count}</span>
                </div>
                <div className="h-1.5 md:h-2 bg-secondary/50 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${item.color} rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(0,0,0,0.2)]`}
                    style={{ width: `${kits.length > 0 ? (item.count / kits.length) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Sumário de Status Final */}
          <div className="mt-4 md:mt-6 pt-4 border-t border-border/50">
            <div className="grid grid-cols-3 gap-2 md:gap-4 text-center">
              <div>
                <p className="text-lg md:text-2xl font-bold text-success">{kits.filter(k => k.status === 'aprovado').length}</p>
                <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider">Prontos</p>
              </div>
              <div>
                <p className="text-lg md:text-2xl font-bold text-warning">{kits.filter(k => k.status === 'pendente').length}</p>
                <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider">Revisão</p>
              </div>
              <div>
                <p className="text-lg md:text-2xl font-bold text-destructive">{kits.filter(k => k.status === 'bloqueado').length}</p>
                <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider">Barrados</p>
              </div>
            </div>
          </div>
        </div>

        {/* Repetimos o widget de atividade recente ou outro widget de interesse para fechar o grid */}
        <RecentActivity className="h-full" />
      </div>
    </div>
  );
}