import { TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/shared/lib/utils';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn('form-input min-h-[96px] resize-y', className)} {...props} />
  ),
);

Textarea.displayName = 'Textarea';
