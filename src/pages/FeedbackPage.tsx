import { AlertIcon, CheckIcon } from "@primer/octicons-react";
import { FC, useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { supabase } from "@/supabase/supabaseClient";
import translations from "@/util/translations";
import { useForm } from "react-hook-form";
import { useLanguage } from "@/context/LanguageContext";
import { useMetadata } from "@/hooks/useMetaData";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  partOfWebsite: z.string().max(50).optional(),
  message: z
    .string()
    .min(10, { message: "Meddelande måste innehålla minst 10 symboler" })
    .max(500),
  name: z.string().optional(),
  liu_mail: z
    .string()
    .email({ message: "Ogiltig e-postadress" })
    .regex(/^[a-z]{4,6}[0-9]{3}@student\.liu\.se$/, {
      message: "Endast LiU studentmail tillåten",
    })
    .min(1, { message: "LiU email är obligatoriskt" }),
});

const FeedbackPage: FC = () => {
  const { language } = useLanguage();
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  const getTranslation = (
    key: keyof (typeof translations)[typeof language]
  ) => {
    return translations[language][key];
  };

  useMetadata({
    title: `LiU Tentor | ${getTranslation("feedbackTitle")}`,
    description: getTranslation("feedbackDescription"),
    keywords:
      "feedback, återkoppling, kontakt, support, Linköpings Universitet, LiU, hjälp",
    ogTitle: `LiU Tentor | ${getTranslation("feedbackTitle")}`,
    ogDescription: getTranslation("feedbackDescription"),
    ogType: "website",
    twitterCard: "summary",
    twitterTitle: `LiU Tentor | ${getTranslation("feedbackTitle")}`,
    twitterDescription: getTranslation("feedbackDescription"),
    robots: "index, follow",
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
      name: "",
      partOfWebsite: "",
      liu_mail: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { error } = await supabase.from("feedback").insert([
        {
          name: values.name,
          message: values.message,
          part_of_website: values.partOfWebsite,
          liu_mail: values.liu_mail,
        },
      ]);

      if (error) throw error;
      setIsSuccess(true);
      form.reset();
    } catch (error) {
      setIsSuccess(false);
    }
  }

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "auto",
    });
  }, []);

  const FormLabel: FC<{ isRequired?: boolean; children: React.ReactNode }> = ({
    isRequired = false,
    children,
  }) => (
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm font-normal">{children}</span>
      <span className="text-sm text-muted-foreground">
        {isRequired ? (
          <span className="text-destructive">*</span>
        ) : (
          getTranslation("nameDescription")
        )}
      </span>
    </div>
  );

  return (
    <div className="container max-w-2xl mx-auto px-4 pb-16 grow">
      <div className="relative w-full flex flex-col items-center mb-5 mt-12">
        <h1 className="text-3xl text-foreground font-medium text-center mt-5 mb-4">
          {getTranslation("feedbackTitle")}
        </h1>
        <p className="text-lg text-muted-foreground text-center max-w-xl">
          {getTranslation("feedbackDescription")}
        </p>
      </div>

      {/* Success/Error States */}
      {isSuccess !== null && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border/40 rounded-lg p-8 shadow-sm"
        >
          {isSuccess ? (
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckIcon className="h-10 w-10 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-normal mb-2">
                  {getTranslation("feedbackSuccessTitle") || "Thank you!"}
                </h2>
                <p className="text-foreground/80">
                  {getTranslation("feedbackSuccessMessage")}
                </p>
              </div>
              <Button>
                <Link to="/">{getTranslation("homeButton")}</Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <AlertIcon className="h-10 w-10 text-red-600" />
              </div>
              <div>
                <h2 className="text-2xl font-normal mb-2">
                  {getTranslation("feedbackErrorTitle") ||
                    "Something went wrong"}
                </h2>
                <p className="text-foreground/80">
                  {getTranslation("feedbackErrorMessage")}
                </p>
              </div>
              <Button onClick={() => setIsSuccess(null)}>
                {getTranslation("tryAgainButton")}
              </Button>
            </div>
          )}
        </motion.div>
      )}

      {/* Form */}
      {isSuccess === null && (
        <div className="bg-card border border-border/40 rounded-lg p-6 md:p-8 shadow-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{getTranslation("nameLegend")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={getTranslation("namePlaceholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="liu_mail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel isRequired>LiU Mail</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={getTranslation("emailPlaceholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-muted-foreground mt-1">
                        Format: liuid123@student.liu.se
                      </p>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="partOfWebsite"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {getTranslation("partOfWebsiteLegend")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={getTranslation(
                            "partOfWebsitePlaceholder"
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel isRequired>
                        {getTranslation("messageLegend")}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={getTranslation("messagePlaceholder")}
                          className="min-h-[150px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-muted-foreground mt-1">
                        Minimum 10 characters
                      </p>
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4 pt-2">
                <p className="text-sm text-muted-foreground">
                  <span className="text-destructive">*</span>{" "}
                  {getTranslation("requiredField")}
                </p>
                <Button type="submit" className="w-full">
                  {getTranslation("submitButton")}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
};

export default FeedbackPage;
