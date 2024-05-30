'use client';

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircleIcon, InfoIcon, XCircleIcon } from 'lucide-react';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        description,
        action,
        icon,
        ...props
      }) {
        let Icon;
        let IconClass;
        switch (icon) {
          case 'success':
            Icon = CheckCircleIcon;
            IconClass = 'text-green-500';
            break;
          case 'error':
            Icon = XCircleIcon;
            IconClass = 'text-red-500';
            break;
          case 'info':
            Icon = InfoIcon;
            IconClass = 'text-blue-500';
            break;
          default:
            Icon = null;
        }
        return (
          <Toast key={id} {...props}>
            <div className="flex items-center gap-2">
              {Icon && (
                <Icon
                  className={`flex-shrink-0 h-5 w-5 text-gray-400 ${IconClass}`}
                />
              )}

              <div className="flex flex-col">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
