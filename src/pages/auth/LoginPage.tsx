import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { supabase } from "@/supabase/supabaseClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock, AlertCircle, Loader2 } from "lucide-react";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { LogoIcon } from "@/components/LogoIcon";
import { Helmet } from "react-helmet-async";

const loginSchema = z.object({
  email: z.string().email({ message: "Ogiltig e-postadress" }),
  password: z
    .string()
    .min(6, { message: "Lösenordet måste innehålla minst 6 tecken" }),
});

type LoginFormType = z.infer<typeof loginSchema>;

const LoginPage: FC = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormType) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      if (error) throw error;

      navigate("/admin/dashboard/review");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex flex-col items-center justify-center p-4">
      <Helmet>
        <title>Admin Login | LiU Tentor</title>
      </Helmet>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8 relative z-10"
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <LogoIcon className="w-16 h-16" />
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-3xl lg:text-4xl font-logo text-foreground">
              LiU Tentor
            </h1>
            <p className="text-muted-foreground text-sm">Administratörspanel</p>
          </div>
        </div>
      </motion.div>

      {/* Login Card */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="backdrop-blur-sm bg-card/95 border border-border/50 shadow-2xl">
          <CardHeader className="space-y-4 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <LogIn className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-semibold">Logga in</CardTitle>
              <CardDescription className="text-base mt-2">
                Ange dina administrativa uppgifter för att komma åt panelen
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium">
                        E-postadress
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="admin@example.com"
                            className="pl-10 h-11"
                            disabled={isLoading}
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium">
                        Lösenord
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="password"
                            placeholder="••••••••"
                            className="pl-10 h-11"
                            disabled={isLoading}
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Error Message */}
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-2"
                  >
                    <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                    <p className="text-sm text-destructive">{errorMessage}</p>
                  </motion.div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-11 text-base font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Loggar in...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 mr-2" />
                      Logga in
                    </>
                  )}
                </Button>
              </form>
            </Form>

            {/* Footer */}
            <div className="pt-4 border-t border-border/30">
              <p className="text-xs text-center text-muted-foreground">
                Endast för behöriga administratörer
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-8 text-center relative z-10"
      >
        <p className="text-xs text-muted-foreground">
          LiU Tentor Administrative Panel v2.0
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
