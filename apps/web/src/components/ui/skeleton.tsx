import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('skeleton rounded-lg bg-[#E5CD9F]', className)} {...props} />;
}

export { Skeleton };

