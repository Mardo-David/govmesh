import { useState } from 'react';
import { Search, Bell, ChevronDown, User, Shield, Scale, Users, Menu, Hexagon, ShieldCheck, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGovMesh, UserProfile } from '@/contexts/GovMeshContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar } from './Sidebar';
import { cn } from '@/lib/utils';

const profileIcons: Record<UserProfile, React.ReactNode> = {
  'Admin': <Shield className="w-4 h-4" />,
  'Jurídico': <Scale className="w-4 h-4" />,
  'Liderança': <Users className="w-4 h-4" />,
  'Apoiador': <User className="w-4 h-4" />,
};

const profileColors: Record<UserProfile, string> = {
  'Admin': 'bg-primary/20 text-primary',
  'Jurídico': 'bg-accent/20 text-accent',
  'Liderança': 'bg-success/20 text-success',
  'Apoiador': 'bg-warning/20 text-warning',
};

export function Header() {
  const { userProfile, setUserProfile, boatos, isSystemLocked } = useGovMesh();
  const criticalAlerts = boatos.filter(b => b.nivel === 'critico' || b.nivel === 'alto').length;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const profiles: UserProfile[] = ['Admin', 'Jurídico', 'Liderança', 'Apoiador'];

  return (
    <header className="h-14 md:h-16 border-b border-border bg-card/50 backdrop-blur-xl px-3 md:px-6 flex items-center justify-between sticky top-0 z-50">
      {/* Mobile Menu Button & Logo */}
      <div className="flex items-center gap-3 md:hidden">
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <Menu className="w-5 h-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 bg-sidebar border-sidebar-border">
            <Sidebar onNavigate={() => setMobileMenuOpen(false)} />
          </SheetContent>
        </Sheet>
        
        {/* Mobile Logo with Shield Status */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Hexagon className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-foreground">GovMesh</span>
          
          {/* Shield Status Indicator */}
          <motion.div
            animate={isSystemLocked ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.8, repeat: isSystemLocked ? Infinity : 0 }}
            className={cn(
              'p-1.5 rounded-full transition-all duration-300',
              isSystemLocked 
                ? 'bg-red-500/20 shadow-lg shadow-red-500/30' 
                : 'bg-primary/10'
            )}
          >
            {isSystemLocked ? (
              <ShieldAlert className="w-4 h-4 text-red-500" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-primary" />
            )}
          </motion.div>
        </div>
      </div>

      {/* Desktop - Logo do Candidato com Shield Status */}
      <div className="hidden md:flex items-center gap-4 flex-1 max-w-xl">
        <div className="flex items-center gap-3 mr-4">
          {/* Substituímos o span de texto pela imagem do logo */}
          <img 
            src="/logo-campanha.png" 
            alt="Logo Campanha" 
            className="h-10 w-auto object-contain" 
          />
          
          <motion.div
            animate={isSystemLocked ? { scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] } : {}}
            transition={{ duration: 0.8, repeat: isSystemLocked ? Infinity : 0 }}
            className={cn(
              'p-1.5 rounded-full transition-all duration-300',
              isSystemLocked 
                ? 'bg-red-500/20 shadow-lg shadow-red-500/40' 
                : 'bg-primary/10'
            )}
          >
            {isSystemLocked ? (
              <ShieldAlert className="w-4 h-4 text-red-500" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-primary" />
            )}
          </motion.div>
        </div>
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar kits, leads, territórios..."
            className="pl-10 bg-secondary/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-secondary transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center">
          <Bell className="w-5 h-5 text-muted-foreground" />
          {criticalAlerts > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center font-medium animate-pulse">
              {criticalAlerts}
            </span>
          )}
        </button>

        {/* Profile Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={`flex items-center gap-1 md:gap-2 px-2 md:px-3 py-2 rounded-lg transition-all min-h-[40px] ${profileColors[userProfile]} hover:opacity-80`}>
              {profileIcons[userProfile]}
              <span className="font-medium text-sm hidden sm:inline">{userProfile}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-popover border-border">
            {profiles.map((profile) => (
              <DropdownMenuItem
                key={profile}
                onClick={() => setUserProfile(profile)}
                className={`flex items-center gap-2 cursor-pointer min-h-[44px] ${userProfile === profile ? 'bg-secondary' : ''}`}
              >
                {profileIcons[profile]}
                <span>{profile}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}