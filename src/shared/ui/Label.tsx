import { LabelHTMLAttributes } from 'react';
import { cn } from '@/shared/lib/utils';

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn('form-label', className)} {...props} />;
}
