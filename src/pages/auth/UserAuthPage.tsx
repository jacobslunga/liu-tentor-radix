import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Mail,
  Lock,
  UserPlus,
  LogIn,
  AlertCircle,
  Loader2,
  GraduationCap,
  CheckCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import translations from "@/util/translations";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/supabase/supabaseClient";
import { LogoIcon } from "@/components/LogoIcon";
import { Helmet } from "react-helmet-async";

const authSchema = z
  .object({
    liu_mail: z
      .string()
      .email({ message: "Ogiltig e-postadress" })
      .regex(/^[a-z]{4,6}[0-9]{3}@student\.liu\.se$/, {
        message: "Endast LiU studentmail tillåten",
      })
      .min(1, { message: "LiU email är obligatoriskt" }),
    password: z
      .string()
      .min(6, { message: "Lösenordet måste innehålla minst 6 tecken" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Lösenordet måste innehålla minst 6 tecken" })
      .optional(),
  })
  .refine(
    (data) => {
      if (data.confirmPassword) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Lösenorden matchar inte",
      path: ["confirmPassword"],
    }
  );

type AuthFormType = z.infer<typeof authSchema>;

const MotionCard = motion(Card);

const UsersAuthPage = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { language } = useLanguage();
  const navigate = useNavigate();

  const getTranslation = (
    key: keyof (typeof translations)[typeof language]
  ) => {
    return translations[language][key];
  };

  const form = useForm<AuthFormType>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      liu_mail: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: AuthFormType) => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      if (mode === "signup" && values.password !== values.confirmPassword) {
        setErrorMessage("Lösenorden matchar inte");
        return;
      }

      if (mode === "login") {
        // Login with Supabase
        const { error } = await supabase.auth.signInWithPassword({
          email: values.liu_mail,
          password: values.password,
        });

        if (error) {
          setErrorMessage(error.message);
          return;
        }

        // Redirect to home page after successful login
        navigate("/");
      } else if (mode === "signup") {
        // Signup with Supabase
        const { error } = await supabase.auth.signUp({
          email: values.liu_mail,
          password: values.password,
        });

        if (error) {
          setErrorMessage(error.message);
          return;
        }

        setSuccessMessage("Kontrollera din e-post för att bekräfta ditt konto");
        // Optionally redirect after a delay
        setTimeout(() => navigate("/"), 3000);
      }
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex flex-col items-center justify-center p-4">
      <Helmet>
        <title>
          {mode === "login" ? "Logga in" : "Skapa konto"} | LiU Tentor
        </title>
      </Helmet>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8 relative z-10"
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <LogoIcon className="w-10 h-10" />
          <h1 className="text-3xl lg:text-4xl font-logo text-foreground">
            LiU Tentor
          </h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Studenternas examensplattform
        </p>
      </motion.div>

      {/* Auth Card */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full max-w-md relative z-10 space-y-4"
      >
        {/* Mode Selector */}
        <Tabs
          defaultValue="login"
          className="w-full"
          onValueChange={(value) => {
            setMode(value as "login" | "signup");
            setErrorMessage(null);
            setSuccessMessage(null);
            form.reset();
          }}
        >
          <TabsList className="grid w-full grid-cols-2 h-12 bg-muted/50 backdrop-blur-sm">
            <TabsTrigger value="login" className="text-sm font-medium">
              <LogIn className="w-4 h-4 mr-2" />
              Logga in
            </TabsTrigger>
            <TabsTrigger value="signup" className="text-sm font-medium">
              <UserPlus className="w-4 h-4 mr-2" />
              Skapa konto
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Auth Form Card */}
        <MotionCard
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="backdrop-blur-sm bg-card/95 border border-border/50 shadow-2xl"
        >
          <CardHeader className="space-y-4 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-semibold">
                {mode === "login"
                  ? getTranslation("welcome_back")
                  : getTranslation("create_account")}
              </CardTitle>
              <CardDescription className="text-base mt-2">
                {mode === "login"
                  ? getTranslation("login_with_liu_mail")
                  : getTranslation("register_with_liu_mail")}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <Form {...form}>
              <motion.form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {/* Email Field */}
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <FormField
                    control={form.control}
                    name="liu_mail"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium">
                          LiU E-postadress
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="abcde123@student.liu.se"
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
                </motion.div>

                {/* Password Field */}
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
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
                </motion.div>

                {/* Confirm Password Field (Signup only) */}
                <AnimatePresence mode="popLayout">
                  {mode === "signup" && (
                    <motion.div
                      layout
                      initial={{ opacity: 0, height: 0, y: -20 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="text-sm font-medium">
                              Bekräfta lösenord
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
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Success Message */}
                <AnimatePresence mode="wait">
                  {successMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex items-center gap-2"
                    >
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <p className="text-sm text-green-800 dark:text-green-200">
                        {successMessage}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error Message */}
                <AnimatePresence mode="wait">
                  {errorMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-2"
                    >
                      <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                      <p className="text-sm text-destructive">{errorMessage}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <motion.div layout>
                  <Button
                    type="submit"
                    className="w-full h-11 text-base font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {mode === "login" ? "Loggar in..." : "Skapar konto..."}
                      </>
                    ) : (
                      <>
                        {mode === "login" ? (
                          <>
                            <LogIn className="w-4 h-4 mr-2" />
                            Logga in
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4 mr-2" />
                            Skapa konto
                          </>
                        )}
                      </>
                    )}
                  </Button>
                </motion.div>
              </motion.form>
            </Form>

            {/* Footer */}
            <div className="pt-4 border-t border-border/30">
              <p className="text-xs text-center text-muted-foreground">
                {mode === "login"
                  ? "Endast för LiU-studenter med giltig studentmail"
                  : "Du kommer få en bekräftelse via e-post efter registrering"}
              </p>
            </div>
          </CardContent>
        </MotionCard>
      </motion.div>

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-8 text-center relative z-10 max-w-md"
      >
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            Plattformen för LiU-studenter att dela och komma åt gamla tentor
          </p>
          <p className="text-xs text-muted-foreground">
            LiU Tentor Student Platform v2.0
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default UsersAuthPage;
