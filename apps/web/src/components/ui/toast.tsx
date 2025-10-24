import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToastStore } from '@/lib/store';

export function Toaster() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'rounded-xl shadow-lg p-4 flex items-start gap-3 animate-slide-up bg-white border-l-4',
            toast.variant === 'destructive' && 'border-l-[#A50C0A]',
            toast.variant === 'success' && 'border-l-[#333A1A]',
            toast.variant === 'default' && 'border-l-[#9C7750]'
          )}
        >
          <div className="flex-1">
            {toast.title && (
              <div className="font-semibold text-[#333A1A] mb-1">{toast.title}</div>
            )}
            {toast.description && (
              <div className="text-sm text-[#9C7750]">{toast.description}</div>
            )}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-[#9C7750] hover:text-[#333A1A] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

