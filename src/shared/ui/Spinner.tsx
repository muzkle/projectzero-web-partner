import { cn } from '@/shared/lib/utils';

interface SpinnerProps {
  className?: string;
  label?: string;
}

export function Spinner({ className, label = 'Loading' }: SpinnerProps) {
  return (
    <div className={cn('flex items-center justify-center gap-3 py-12', className)} role="status">
      <span className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      <span className="text-sm text-slate-500">{label}</span>
    </div>
  );
}
