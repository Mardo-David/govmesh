import { motion } from 'framer-motion';
import { Download, Filter, Search, Terminal, Clock } from 'lucide-react';
import { useGovMesh } from '@/contexts/GovMeshContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const actionColors: Record<string, string> = {
  'Kit aprovado': 'text-success',
  'Item aprovado': 'text-success',
  'Kit baixado': 'text-primary',
  'Texto copiado': 'text-accent',
  'Lead atualizado': 'text-primary',
  'Lead movido': 'text-accent',
  'Boato detectado': 'text-destructive',
  'Acesso ao sistema': 'text-muted-foreground',
  'Relatório exportado': 'text-muted-foreground',
  'Argumento gerado': 'text-primary',
  'Revisão jurídica solicitada': 'text-warning',
  'Item reprovado': 'text-destructive',
  'Modo Eleitoral ativado': 'text-destructive',
  'Modo Eleitoral desativado': 'text-success',
  'KILL SWITCH ATIVADO': 'text-destructive font-bold',
  'Sistema desbloqueado': 'text-success',
};

const getModuleFromLog = (detalhes: string): string => {
  const match = detalhes.match(/^\[([^\]]+)\]/);
  return match ? match[1] : 'Sistema';
};

const getTerritorioFromLog = (detalhes: string): string => {
  const parts = detalhes.split(' - ');
  return parts.length > 1 ? parts[parts.length - 1] : '-';
};

export default function AuditoriaPage() {
  const { logs } = useGovMesh();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUser, setFilterUser] = useState<string>('todos');

  const uniqueUsers = [...new Set(logs.map(l => l.usuario))];

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.acao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.detalhes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.usuario.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesUser = filterUser === 'todos' || log.usuario === filterUser;

    return matchesSearch && matchesUser;
  });

  return (
    <AppLayout>
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
              <Terminal className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              Auditoria
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Registro de todas as ações no sistema
            </p>
          </div>
          <Button variant="outline" size="sm" className="bg-secondary/50 border-border/50 self-start md:self-auto min-h-[44px]">
            <Download className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Exportar </span>CSV
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-center">
          <div className="relative flex-1 max-w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar nos logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-secondary/50 border-border/50 h-11"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-muted-foreground shrink-0">Usuário:</span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={filterUser === 'todos' ? 'default' : 'outline'}
                className={cn(
                  'min-h-[40px] min-w-[60px]',
                  filterUser === 'todos' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary/50 border-border/50'
                )}
                onClick={() => setFilterUser('todos')}
              >
                Todos
              </Button>
              {uniqueUsers.map(user => (
                <Button
                  key={user}
                  size="sm"
                  variant={filterUser === user ? 'default' : 'outline'}
                  className={cn(
                    'min-h-[40px] shrink-0',
                    filterUser === user 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary/50 border-border/50'
                  )}
                  onClick={() => setFilterUser(user)}
                >
                  {user}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Terminal-style Log Display */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card rounded-xl border-border/50 overflow-hidden font-mono"
        >
          {/* Terminal Header */}
          <div className="flex items-center gap-2 px-3 md:px-4 py-2 bg-secondary/80 border-b border-border/50">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-destructive/80" />
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-warning/80" />
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-success/80" />
            </div>
            <span className="text-[10px] md:text-xs text-muted-foreground ml-2">govmesh-audit.log</span>
          </div>

          {/* Log Content - Mobile optimized */}
          <div className="p-3 md:p-4 max-h-[500px] md:max-h-[600px] overflow-y-auto overflow-x-auto bg-background/50">
            <table className="w-full text-[10px] md:text-xs">
              <thead>
                <tr className="text-muted-foreground border-b border-border/30">
                  <th className="text-left py-2 px-2 w-[100px] md:w-[140px]">TIMESTAMP</th>
                  <th className="text-left py-2 px-2 w-[60px] md:w-[80px] hidden md:table-cell">USER</th>
                  <th className="text-left py-2 px-2 w-[120px] md:w-[180px]">ACTION</th>
                  <th className="text-left py-2 px-2 w-[80px] md:w-[100px] hidden lg:table-cell">MODULE</th>
                  <th className="text-left py-2 px-2 w-[80px] md:w-[100px] hidden lg:table-cell">TERRITORY</th>
                  <th className="text-left py-2 px-2 hidden md:table-cell">DETAILS</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log, idx) => {
                  const modulo = getModuleFromLog(log.detalhes);
                  const territorio = getTerritorioFromLog(log.detalhes);
                  const detalhesLimpo = log.detalhes.replace(/^\[[^\]]+\]\s*/, '').split(' - ')[0];

                  return (
                    <motion.tr
                      key={log.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      className="border-b border-border/20 hover:bg-secondary/30 transition-colors"
                    >
                      <td className="py-2 px-2 text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 hidden sm:block" />
                          <span className="truncate">{log.timestamp}</span>
                        </div>
                      </td>
                      <td className="py-2 px-2 text-accent hidden md:table-cell">{log.usuario}</td>
                      <td className={cn('py-2 px-2 truncate max-w-[120px] md:max-w-none', actionColors[log.acao] || 'text-foreground')}>
                        {log.acao}
                      </td>
                      <td className="py-2 px-2 text-primary hidden lg:table-cell">{modulo}</td>
                      <td className="py-2 px-2 text-muted-foreground hidden lg:table-cell">{territorio}</td>
                      <td className="py-2 px-2 text-foreground/80 truncate max-w-[200px] md:max-w-[300px] hidden md:table-cell">
                        {detalhesLimpo}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>

            {filteredLogs.length === 0 && (
              <div className="text-center py-8 md:py-12 text-muted-foreground">
                <Terminal className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Nenhum log encontrado</p>
              </div>
            )}
          </div>

          {/* Terminal Footer */}
          <div className="px-3 md:px-4 py-2 bg-secondary/50 border-t border-border/30 flex items-center justify-between">
            <span className="text-[10px] md:text-xs text-muted-foreground">
              <span className="text-success">●</span> {filteredLogs.length} registros
            </span>
            <span className="text-[10px] md:text-xs text-muted-foreground">
              Total: {logs.length} logs
            </span>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
