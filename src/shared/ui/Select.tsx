import { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/shared/lib/utils';

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select ref={ref} className={cn('form-input', className)} {...props}>
      {children}
    </select>
  ),
);

Select.displayName = 'Select';
