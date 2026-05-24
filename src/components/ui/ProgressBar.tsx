import { cn } from '../../lib/utils';

interface ProgressBarProps {
  progress: number; // 0 to 1
  className?: string;
  indicatorClassName?: string;
}

export function ProgressBar({ progress, className, indicatorClassName }: ProgressBarProps) {
  return (
    <div className={cn("w-full h-2 bg-gray-200 rounded-full overflow-hidden", className)}>
      <div 
        className={cn("h-full bg-blue-600 transition-all duration-300 ease-out", indicatorClassName)}
        style={{ width: `${Math.max(0, Math.min(100, progress * 100))}%` }}
      />
    </div>
  );
}
