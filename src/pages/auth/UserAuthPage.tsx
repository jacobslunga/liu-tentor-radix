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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SquareLibrary } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import translations from "@/util/translations";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/supabase/supabaseClient";

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
const MotionFormItem = motion(FormItem);

const UsersAuthPage = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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
    try {
      setErrorMessage(null);

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

        // Redirect to home page after successful signup
        navigate("/");
      }
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-background">
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-2xl absolute top-10 lg:text-3xl font-logo tracking-tight text-center flex flex-row items-center justify-center space-x-2"
      >
        <SquareLibrary className="text-primary" size={32} />
        <p>LiU Tentor</p>
      </motion.h1>

      <div className="w-96 space-y-2">
        <Tabs
          defaultValue="login"
          className="w-full"
          onValueChange={(value) => setMode(value as "login" | "signup")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Logga in</TabsTrigger>
            <TabsTrigger value="signup">Skapa konto</TabsTrigger>
          </TabsList>
        </Tabs>

        <MotionCard
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <CardHeader>
            <CardTitle>
              {mode === "login"
                ? getTranslation("welcome_back")
                : getTranslation("create_account")}
            </CardTitle>
            <CardDescription>
              {mode === "login"
                ? getTranslation("login_with_liu_mail")
                : getTranslation("register_with_liu_mail")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <motion.form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <MotionFormItem
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <FormField
                    control={form.control}
                    name="liu_mail"
                    render={({ field }) => (
                      <FormControl>
                        <Input
                          placeholder="LiU e-post (ex: abcde123@student.liu.se)"
                          {...field}
                        />
                      </FormControl>
                    )}
                  />
                  <FormMessage />
                </MotionFormItem>

                <MotionFormItem
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Lösenord"
                          {...field}
                        />
                      </FormControl>
                    )}
                  />
                  <FormMessage />
                </MotionFormItem>

                <AnimatePresence mode="popLayout">
                  {mode === "signup" && (
                    <MotionFormItem
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
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Bekräfta lösenord"
                              {...field}
                            />
                          </FormControl>
                        )}
                      />
                      <FormMessage />
                    </MotionFormItem>
                  )}
                </AnimatePresence>

                <motion.div layout>
                  <Button type="submit" className="w-full">
                    {mode === "login" ? "Logga in" : "Skapa konto"}
                  </Button>
                </motion.div>

                <AnimatePresence mode="wait">
                  {errorMessage && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-600 text-center mt-2"
                    >
                      {errorMessage}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.form>
            </Form>
          </CardContent>
        </MotionCard>
      </div>
    </div>
  );
};

export default UsersAuthPage;
