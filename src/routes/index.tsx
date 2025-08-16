import { Button } from '@/components/ui/button';
import type {} from '@/lib/types';
import { Link, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className='min-h-screen flex items-start justify-center py-8'>
      <div>
        <Button asChild>
          <Link to='/microphone-permission'>Micorphone permission</Link>
        </Button>
      </div>
    </section>
  );
}
