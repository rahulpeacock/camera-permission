import { AlertCircleIcon } from 'lucide-react';

export function ErrorIcon() {
  return (
    <div className='size-9 rounded-lg bg-destructive/10 flex items-center justify-center'>
      <AlertCircleIcon className='text-destructive' size={18} />
    </div>
  );
}
