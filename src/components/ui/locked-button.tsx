import { ReactNode, forwardRef } from 'react';
import { Lock } from 'lucide-react';
import { Button, ButtonProps } from './button';
import { useGovMesh } from '@/contexts/GovMeshContext';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip';

interface LockedButtonProps extends ButtonProps {
  children: ReactNode;
  lockedText?: string;
}

export const LockedButton = forwardRef<HTMLButtonElement, LockedButtonProps>(
  ({ children, lockedText, className, disabled, ...props }, ref) => {
    const { isSystemLocked } = useGovMesh();
    const isDisabled = disabled || isSystemLocked;

    const button = (
      <Button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          isSystemLocked && 'opacity-50 cursor-not-allowed',
          className
        )}
        {...props}
      >
        {isSystemLocked ? (
          <>
            <Lock className="w-4 h-4 mr-1" />
            {lockedText || 'Bloqueado'}
          </>
        ) : (
          children
        )}
      </Button>
    );

    if (isSystemLocked) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-flex">{button}</span>
            </TooltipTrigger>
            <TooltipContent 
              side="top" 
              className="bg-destructive text-destructive-foreground border-destructive"
            >
              <div className="flex items-center gap-2">
                <Lock className="w-3 h-3" />
                <span>Ação bloqueada pelo Protocolo de Emergência</span>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return button;
  }
);

LockedButton.displayName = 'LockedButton';
