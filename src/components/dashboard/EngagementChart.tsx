import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Dados das 8 Regiões de Planejamento de Sergipe com valores realistas
const data = [
  { territorio: 'Grande Aracaju', sigla: 'GA', engajamento: 78, leads: 245, votos: 185000 },
  { territorio: 'Agreste Central', sigla: 'AC', engajamento: 65, leads: 168, votos: 98000 },
  { territorio: 'Centro Sul', sigla: 'CS', engajamento: 58, leads: 142, votos: 87000 },
  { territorio: 'Sul Sergipano', sigla: 'SS', engajamento: 52, leads: 118, votos: 72000 },
  { territorio: 'Baixo São Francisco', sigla: 'BSF', engajamento: 45, leads: 95, votos: 65000 },
  { territorio: 'Alto Sertão', sigla: 'AS', engajamento: 62, leads: 135, votos: 82000 },
  { territorio: 'Médio Sertão', sigla: 'MS', engajamento: 48, leads: 87, votos: 54000 },
  { territorio: 'Leste Sergipano', sigla: 'LS', engajamento: 55, leads: 110, votos: 68000 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="glass-card rounded-lg p-3 border border-border/50 bg-background/80 backdrop-blur-md shadow-xl">
        <p className="text-sm font-medium text-foreground mb-2">{item.territorio}</p>
        <div className="space-y-1">
          <p className="text-xs text-primary">
            Engajamento: <span className="font-semibold">{payload[0].value}%</span>
          </p>
          <p className="text-xs text-muted-foreground">
            Lideranças: <span className="font-semibold">{item.leads}</span>
          </p>
          <p className="text-xs text-accent">
            Votos Mobilizados: <span className="font-semibold">{item.votos.toLocaleString('pt-BR')}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

// Adicionamos a prop className para permitir o ajuste de simetria pelo pai (Dashboard)
export function EngagementChart({ className }: { className?: string }) {
  return (
    <div 
      className={`glass-card rounded-xl p-6 border border-border/50 animate-fade-in h-full flex flex-col ${className}`} 
      style={{ animationDelay: '400ms' }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Mobilização Regional Sergipe - José da Silva</h3>
          <p className="text-sm text-muted-foreground">Taxa de engajamento de apoiadores por região</p>
        </div>
        
        {/* Legendas Compactas */}
        <div className="flex flex-wrap items-center gap-3 text-[10px] md:text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-[#14b8a6] shadow-[0_0_8px_rgba(20,184,166,0.4)]" />
            <span className="text-muted-foreground">Alto (&gt;60%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-[#06b6d4]" />
            <span className="text-muted-foreground">Médio (40-60%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-muted" />
            <span className="text-muted-foreground">Baixo (&lt;40%)</span>
          </div>
        </div>
      </div>
      
      {/* Container do Gráfico que ocupa o espaço restante */}
      <div className="flex-1 min-h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.3} />
            <XAxis 
              dataKey="sigla" 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ fill: 'hsl(var(--primary))', opacity: 0.05 }} 
            />
            <Bar dataKey="engajamento" radius={[4, 4, 0, 0]} barSize={48}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`}
                  fill={
                    entry.sigla === 'GA' 
                      ? '#14b8a6' // Grande Aracaju com destaque
                      : entry.engajamento > 60 
                        ? '#14b8a6' 
                        : entry.engajamento >= 40 
                          ? '#06b6d4' 
                          : 'hsl(var(--muted))'
                  }
                  style={entry.sigla === 'GA' ? {
                    filter: 'drop-shadow(0 0 6px rgba(20,184,166,0.5))'
                  } : undefined}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Stats Summary - Rodapé do Card */}
      <div className="mt-6 pt-4 border-t border-border/40 grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-lg md:text-xl font-bold text-foreground">~1.200</p>
          <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Total de Lideranças</p>
        </div>
        <div>
          <p className="text-lg md:text-xl font-bold text-primary">~850.000</p>
          <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Alcance Estimado</p>
        </div>
        <div>
          <p className="text-lg md:text-xl font-bold text-accent">~15.400</p>
          <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Kits Baixados</p>
        </div>
      </div>
    </div>
  );
}