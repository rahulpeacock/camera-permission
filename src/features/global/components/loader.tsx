import { cn } from '@/lib/utils';

export function SemiCircularLoader({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width='20' height='20' viewBox='0 0 20 20' className={cn('animate-spin animation-duration-300 stroke-foreground', className)} {...props}>
      <title>loader</title>
      {/* <circle cx='10' cy='10' r='8' stroke-width='2' stroke='var(--gray-700)' fill='none' stroke-linecap='round' /> */}
      <circle
        cx='10'
        cy='10'
        r='8'
        strokeWidth='2'
        fill='none'
        strokeDasharray='0.5 1px'
        strokeLinecap='round'
        pathLength='1'
        strokeDashoffset='0px'
      />
    </svg>
  );
}
