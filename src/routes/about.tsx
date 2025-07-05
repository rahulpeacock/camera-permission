import { Link, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/about')({
  component: () => (
    <div>
      Hello /about!{' '}
      <div>
        <Link to='/'>Back to Home</Link>
      </div>
    </div>
  ),
});
