import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen text-center'>
      <h1 className='text-6xl font-bold mb-4'>404</h1>
      <p className='text-2xl mb-8'>Page Not Found</p>
      <Link to='/' className='text-primary underline'>
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
