'use client';

import { Disc3Icon } from 'lucide-react';
import { useFormStatus } from 'react-dom';

export const LoadingFormUI = () => {
  const { pending } = useFormStatus();

  if (!pending) return null;
  return (
    <div className="absolute inset-0 bg-slate-800 bg-opacity-50 rounded-lg flex justify-center items-center pointer-events-none z-10">
      <div className="animate-spin">
        <Disc3Icon className="w-16 h-16 text-white" />
      </div>
    </div>
  );
};
