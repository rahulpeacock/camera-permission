import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <div className='p-2'>
      <h3 className='text-2xl font-semibold'>Welcome Home!</h3>
    </div>
  );
}
