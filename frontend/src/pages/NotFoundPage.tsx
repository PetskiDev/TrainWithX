import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {

  return (
    <main className='flex flex-col items-center justify-center min-h-[60vh] text-center px-4'>
      <h1 className='text-6xl font-extrabold text-primary mb-4'>404</h1>
      <p className='text-muted-foreground text-lg mb-6'>
        The page you’re looking for doesn’t exist. But don’t worry, we’ve got
        you covered.
      </p>

      <div className='flex flex-wrap gap-4 justify-center'>
        <Link to='/'>
          <Button variant='ghost'>Go Back Home</Button>
        </Link>
        <Link to='/plans'>
          <Button variant='ghost'>Browse Training Plans</Button>
        </Link>
        <Link to='/creators'>
          <Button variant='ghost'>View Creators</Button>
        </Link>
        <Link to='/help-center'>
          <Button variant='ghost'>Visit Help Center</Button>
        </Link>
      </div>
    </main>
  );
}
