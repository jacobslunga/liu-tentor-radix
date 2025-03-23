import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { supabase } from '@/supabase/supabaseClient';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { SquareLibrary } from 'lucide-react';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email({ message: 'Ogiltig e-postadress' }),
  password: z
    .string()
    .min(6, { message: 'Lösenordet måste innehålla minst 6 tecken' }),
});

type LoginFormType = z.infer<typeof loginSchema>;

const LoginPage: FC = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const navigate = useNavigate();

  const form = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormType) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      if (error) throw error;

      setIsSuccess(true);
      navigate('/admin/dashboard/review');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setIsSuccess(false);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center w-screen h-screen'>
      {/* Rubrik och logotyp */}
      <h1 className='text-2xl absolute top-10 lg:text-3xl font-logo tracking-tight text-center flex flex-row items-center justify-center space-x-2'>
        <SquareLibrary className='text-primary' size={32} />
        <p>LiU Tentor</p>
      </h1>

      {/* Inloggningskort */}
      <Card className='w-96'>
        <CardHeader>
          <CardTitle>Logga in</CardTitle>
          <CardDescription>
            Fyll i dina uppgifter för att logga in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              {/* E-postfält */}
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder='E-post'
                        {...field}
                        aria-label='E-post'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Lösenordsfält */}
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder='Lösenord'
                        {...field}
                        aria-label='Lösenord'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Inloggningsknapp */}
              <Button type='submit' className='w-full'>
                Logga in
              </Button>

              {/* Felmeddelande */}
              {isSuccess === false && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className='text-red-600 text-center mt-2'
                >
                  {errorMessage}
                </motion.p>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
