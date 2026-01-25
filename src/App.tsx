import { useEffect } from 'react';
import { Outlet } from 'react-router-dom'; // <--- OBRIGATÓRIO: O segredo para o conteúdo aparecer
import { motion, AnimatePresence } from 'framer-motion';
import { AlertOctagon, ShieldAlert, Lock } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useGovMesh } from '@/contexts/GovMeshContext';
import { cn } from '@/lib/utils';

export function AppLayout() {
  const { isElectoralMode, isLocked, isSystemLocked } = useGovMesh();

  useEffect(() => {
    if (isSystemLocked && 'vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }
  }, [isSystemLocked]);

  return (
    <div className={cn(
      'min-h-screen bg-background transition-all duration-300',
      isElectoralMode && 'ring-2 ring-destructive ring-inset',
      isLocked && 'ring-4 ring-destructive/50 ring-inset',
      isSystemLocked && 'grayscale-[30%]'
    )}>
      {/* Sistema de Bloqueio (Mantido Original) */}
      {isSystemLocked && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 pointer-events-none z-40">
          <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }} className="absolute inset-0 bg-gradient-to-br from-red-500/30 via-transparent to-red-500/30" />
          <motion.div animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }} className="absolute inset-0 bg-gradient-to-tr from-red-600/20 via-transparent to-red-600/20" />
          <motion.div animate={{ boxShadow: ['inset 0 0 0 4px rgba(239, 68, 68, 0.3)', 'inset 0 0 0 6px rgba(239, 68, 68, 0.7)', 'inset 0 0 0 4px rgba(239, 68, 68, 0.3)'] }} transition={{ duration: 1.5, repeat: Infinity }} className="absolute inset-0" />
        </motion.div>
      )}

      <AnimatePresence>
        {isSystemLocked && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[55] pointer-events-none flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} className="bg-black/80 backdrop-blur-md rounded-2xl p-8 border-2 border-red-500/50 shadow-2xl text-center">
              <Lock className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-red-400">ACESSO BLOQUEADO</h2>
              <p className="text-red-300">PELA COORDENAÇÃO</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="hidden md:block fixed left-0 top-0 z-40">
        <Sidebar />
      </div>

      <div className={cn('md:ml-64 min-h-screen flex flex-col transition-all duration-300', isSystemLocked && 'pt-14')}>
        <Header />
        <main className="flex-1 p-6 overflow-x-hidden">
          {/* O Outlet é onde o React injeta o Dashboard, Radar, etc. */}
          <Outlet /> 
        </main>
      </div>
    </div>
  );
}