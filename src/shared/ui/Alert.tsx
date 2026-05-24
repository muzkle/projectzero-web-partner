import { cn } from '@/shared/lib/utils';

type AlertVariant = 'error' | 'success' | 'info' | 'warning';

const variants: Record<AlertVariant, string> = {
  error: 'border-red-200 bg-red-50 text-red-800',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  info: 'border-brand-200 bg-brand-50 text-brand-800',
  warning: 'border-amber-200 bg-amber-50 text-amber-900',
};

interface AlertProps {
  variant?: AlertVariant;
  children: React.ReactNode;
  className?: string;
}

export function Alert({ variant = 'info', children, className }: AlertProps) {
  return (
    <div className={cn('rounded-lg border px-4 py-3 text-sm', variants[variant], className)}>
      {children}
    </div>
  );
}
