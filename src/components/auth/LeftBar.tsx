import { Button } from '@/components/ui/button';
import { SquareLibrary } from 'lucide-react';
import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Leftbar: FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className='w-[20%] flex flex-col items-start p-4 justify-start bg-foreground/5 h-screen fixed left-0'>
      <h1 className='text-lg font-logo tracking-tight text-center flex flex-row items-center justify-center space-x-2'>
        <SquareLibrary className='text-primary w-7 h-7' />
        <p>LiU Tentor</p>
      </h1>
      <nav className='mt-4 flex flex-col space-y-2'>
        <Link to='/admin/dashboard'>
          <Button
            variant={isActive('/admin/dashboard') ? 'default' : 'outline'}
          >
            Dashboard
          </Button>
        </Link>
        <Link to='/admin/dashboard/add-exams'>
          <Button
            variant={
              isActive('/admin/dashboard/add-exams') ? 'default' : 'outline'
            }
          >
            Ladda upp tentor
          </Button>
        </Link>
        <Link to='/admin/dashboard/review'>
          <Button
            variant={
              isActive('/admin/dashboard/review') ? 'default' : 'outline'
            }
          >
            Uppladdade tentor
          </Button>
        </Link>
        <Link to='/admin/dashboard/remove-exams'>
          <Button
            variant={
              isActive('/admin/dashboard/remove-exams') ? 'default' : 'outline'
            }
          >
            Ta bort tentor
          </Button>
        </Link>
      </nav>
    </div>
  );
};

export default Leftbar;
