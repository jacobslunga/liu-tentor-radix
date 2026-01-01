import { WarningCircleIcon, CheckIcon } from "@phosphor-icons/react";
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
import { useForm } from "react-hook-form";
import { useMetadata } from "@/hooks/useMetadata";
import { useTranslation } from "@/hooks/useTranslation";
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
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  const { t } = useTranslation();

  useMetadata({
    title: `LiU Tentor | ${t("feedbackTitle")}`,
    description: t("feedbackDescription"),
    keywords:
      "feedback, återkoppling, kontakt, support, Linköpings Universitet, LiU, hjälp",
    ogTitle: `LiU Tentor | ${t("feedbackTitle")}`,
    ogDescription: t("feedbackDescription"),
    ogType: "website",
    twitterCard: "summary",
    twitterTitle: `LiU Tentor | ${t("feedbackTitle")}`,
    twitterDescription: t("feedbackDescription"),
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
          t("nameDescription")
        )}
      </span>
    </div>
  );

  return (
    <div className="w-full max-w-2xl">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-2">
        {t("feedbackTitle")}
      </h1>
      <p className="text-sm text-muted-foreground mb-6">
        {t("feedbackDescription")}
      </p>

      {/* Success/Error States */}
      {isSuccess !== null && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-8"
        >
          {isSuccess ? (
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckIcon
                  weight="bold"
                  className="h-6 w-6 text-green-600 dark:text-green-400"
                />
              </div>
              <div>
                <h2 className="text-xl font-medium mb-1">
                  {t("feedbackSuccessTitle") || "Thank you!"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t("feedbackSuccessMessage")}
                </p>
              </div>
              <Button size="sm">
                <Link to="/">{t("homeLink")}</Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <WarningCircleIcon
                  weight="bold"
                  className="h-6 w-6 text-red-600 dark:text-red-400"
                />
              </div>
              <div>
                <h2 className="text-xl font-medium mb-1">
                  {t("feedbackErrorTitle") || "Something went wrong"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t("feedbackErrorMessage")}
                </p>
              </div>
              <Button size="sm" onClick={() => setIsSuccess(null)}>
                {t("tryAgainButton")}
              </Button>
            </div>
          )}
        </motion.div>
      )}

      {/* Form */}
      {isSuccess === null && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("nameLegend")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("namePlaceholder")}
                      className="h-9"
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
                      placeholder={t("emailPlaceholder")}
                      className="h-9"
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
                  <FormLabel>{t("partOfWebsiteLegend")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("partOfWebsitePlaceholder")}
                      className="h-9"
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
                  <FormLabel isRequired>{t("messageLegend")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("messagePlaceholder")}
                      className="min-h-[120px] resize-none"
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

            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-muted-foreground">
                <span className="text-destructive">*</span> {t("requiredField")}
              </p>
              <Button type="submit" size="sm">
                {t("submitButton")}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default FeedbackPage;
