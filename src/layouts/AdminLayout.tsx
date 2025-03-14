import Leftbar from '@/components/auth/LeftBar';
import { supabase } from '@/supabase/supabaseClient';
import { FC, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const AdminLayout: FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        navigate('/');
      }
    };

    checkUser();
  }, [navigate]);

  return (
    <div className='flex flex-col items-center justify-center w-screen h-screen'>
      <Leftbar />
      <div className='w-[80%] absolute h-screen flex flex-col items-center justify-center right-0'>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
