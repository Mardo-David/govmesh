import { ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertOctagon, ShieldAlert, Lock } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useGovMesh } from '@/contexts/GovMeshContext';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { isElectoralMode, isLocked, isSystemLocked } = useGovMesh();

  // Haptic feedback when system locks
  useEffect(() => {
    if (isSystemLocked && 'vibrate' in navigator) {
      // 3 strong short pulses
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
      {/* Kill Switch Pulsing Border - Enhanced Full Screen Glow */}
      {isSystemLocked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 pointer-events-none z-40"
        >
          {/* Corner glow effects */}
          <motion.div
            animate={{ 
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 bg-gradient-to-br from-red-500/30 via-transparent to-red-500/30"
          />
          <motion.div
            animate={{ 
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            className="absolute inset-0 bg-gradient-to-tr from-red-600/20 via-transparent to-red-600/20"
          />
          
          {/* Pulsing border */}
          <motion.div
            animate={{ 
              boxShadow: [
                'inset 0 0 0 4px rgba(239, 68, 68, 0.3), inset 0 0 60px rgba(239, 68, 68, 0.1)',
                'inset 0 0 0 6px rgba(239, 68, 68, 0.7), inset 0 0 100px rgba(239, 68, 68, 0.2)',
                'inset 0 0 0 4px rgba(239, 68, 68, 0.3), inset 0 0 60px rgba(239, 68, 68, 0.1)',
              ]
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0"
          />
        </motion.div>
      )}

      {/* Blocking Overlay with Message - Mobile Enhanced */}
      <AnimatePresence>
        {isSystemLocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[55] pointer-events-none flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="bg-black/80 backdrop-blur-md rounded-2xl p-6 md:p-8 border-2 border-red-500/50 shadow-2xl shadow-red-500/20 max-w-sm mx-auto text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center"
              >
                <Lock className="w-8 h-8 md:w-10 md:h-10 text-red-400" />
              </motion.div>
              <motion.h2
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-lg md:text-xl font-bold text-red-400 mb-2"
              >
                ACESSO BLOQUEADO
              </motion.h2>
              <p className="text-red-300/80 text-sm md:text-base">
                PELA COORDENAÇÃO
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emergency Banner */}
      <AnimatePresence>
        {isSystemLocked && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-red-600 via-red-500 to-red-600 shadow-lg"
          >
            <div className="md:ml-64 px-4 md:px-6 py-2 md:py-3">
              <div className="flex items-center justify-center gap-2 md:gap-3">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  <ShieldAlert className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </motion.div>
                <motion.span
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="font-bold text-white text-xs md:text-lg tracking-wide text-center"
                >
                  <span className="hidden md:inline">SISTEMA EM MODO DE SEGURANÇA — AÇÕES DE CAMPO BLOQUEADAS</span>
                  <span className="md:hidden">MODO DE SEGURANÇA</span>
                </motion.span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="hidden md:block"
                >
                  <AlertOctagon className="w-6 h-6 text-white" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden md:block fixed left-0 top-0 z-40">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className={cn(
        'md:ml-64 min-h-screen flex flex-col transition-all duration-300',
        isSystemLocked && 'pt-10 md:pt-14'
      )}>
        <Header />
        <main className="flex-1 p-3 md:p-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}