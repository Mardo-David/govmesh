import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  AlertTriangle,
  FileText,
  Settings,
  HelpCircle,
  Hexagon,
  Sparkles,
  Scale,
  Trophy, // Novo ícone importado
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGovMesh } from '@/contexts/GovMeshContext';

const allNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/', profiles: ['Admin', 'Jurídico', 'Liderança', 'Apoiador'] },
  { icon: FolderKanban, label: 'Kits', path: '/kits', profiles: ['Admin', 'Jurídico', 'Liderança', 'Apoiador'] },
  { icon: Sparkles, label: 'GovMesh Assist', path: '/assist', profiles: ['Admin', 'Jurídico', 'Liderança', 'Apoiador'] },
  { icon: Users, label: 'CRM Mobilização', path: '/crm', profiles: ['Admin', 'Liderança'] },
  
  // Novo Item de Gamificação
  { icon: Trophy, label: 'Gamificação', path: '/gamificacao', profiles: ['Admin', 'Liderança', 'Apoiador'] },
  
  { icon: Scale, label: 'Aprovação Jurídica', path: '/juridico', profiles: ['Admin', 'Jurídico'] },
  { icon: AlertTriangle, label: 'Boatos', path: '/boatos', profiles: ['Admin', 'Jurídico', 'Liderança'] },
  { icon: FileText, label: 'Auditoria', path: '/auditoria', profiles: ['Admin', 'Jurídico'] },
];

const bottomItems = [
  { icon: Settings, label: 'Configurações', path: '/configuracoes', profiles: ['Admin', 'Jurídico'] },
  { icon: HelpCircle, label: 'Suporte', path: '/suporte', profiles: ['Admin', 'Jurídico', 'Liderança', 'Apoiador'] },
];

export { allNavItems, bottomItems };

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const location = useLocation();
  const { userProfile } = useGovMesh();

  // Filtra os itens com base no perfil do usuário
  const navItems = allNavItems.filter(item => item.profiles.includes(userProfile));
  const filteredBottomItems = bottomItems.filter(item => item.profiles.includes(userProfile));

  const handleNavClick = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <aside className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-sidebar-border">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary">
          <Hexagon className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-foreground tracking-tight">GovMesh</h1>
          <p className="text-xs text-muted-foreground">Governança Política</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              className={cn(
                'flex items-center gap-3 px-3 py-3 md:py-2.5 rounded-lg transition-all duration-200 group min-h-[48px] md:min-h-0',
                isActive
                  ? 'bg-primary/15 text-primary border border-primary/20'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <item.icon className={cn(
                'w-5 h-5 transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
              )} />
              <span className="font-medium text-sm">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="py-4 px-3 border-t border-sidebar-border space-y-1">
        {filteredBottomItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              className={cn(
                'flex items-center gap-3 px-3 py-3 md:py-2.5 rounded-lg transition-all duration-200 group min-h-[48px] md:min-h-0',
                isActive
                  ? 'bg-primary/15 text-primary'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
              <span className="font-medium text-sm">{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* User Info */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/50 to-accent/50 flex items-center justify-center">
            <span className="text-sm font-semibold text-foreground">GA</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">GovMesh Admin</p>
            <p className="text-xs text-muted-foreground truncate">admin@govmesh.com.br</p>
          </div>
        </div>
      </div>
    </aside>
  );
}