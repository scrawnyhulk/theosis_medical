import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sendSiteForm } from "@/lib/send-site-form";

const inquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name."),
  email: z.string().trim().email("Enter a working email."),
  facility: z.string().trim().min(2, "Enter a facility or group."),
  dates: z.string().trim(),
  message: z
    .string()
    .trim()
    .min(12, "A little more detail helps the practice prepare."),
});

type InquiryValues = z.infer<typeof inquirySchema>;

const STORAGE_KEY = "theosis-inquiries";

export function InquiryForm() {
  const [submitted, setSubmitted] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const form = useForm<InquiryValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      name: "",
      email: "",
      facility: "",
      dates: "",
      message: "",
    },
  });

  async function onSubmit(values: InquiryValues) {
    setSendError(null);
    const entry = { ...values, at: new Date().toISOString() };
    try {
      const existing = JSON.parse(
        localStorage.getItem(STORAGE_KEY) ?? "[]",
      ) as unknown[];
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([entry, ...existing].slice(0, 20)),
      );
    } catch {
      /* ignore quota / private mode */
    }

    try {
      await sendSiteForm({
        kind: "inquiry",
        name: values.name,
        email: values.email,
        fields: {
          facility: values.facility,
          dates: values.dates,
          message: values.message,
        },
      });
      setSubmitted(true);
    } catch {
      setSendError(
        "Could not send just now. Call 765.487.0777 or email nick@theosismedical.com.",
      );
    }
  }

  if (submitted) {
    return (
      <div className="flex min-h-72 flex-col justify-center rounded-xl bg-surface px-6 py-10 text-fg shadow-[var(--shadow-border)] sm:px-8">
        <span className="mb-5 inline-flex size-11 items-center justify-center rounded-full bg-accent text-accent-fg">
          <Check className="size-5" strokeWidth={2.25} />
        </span>
        <h3 className="font-display text-3xl leading-tight tracking-tight">
          Received. Thank you.
        </h3>
        <p className="mt-3 max-w-md text-muted">
          I will follow up at the email you provided. For something that cannot
          wait, call.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-8 w-fit"
          onClick={() => {
            form.reset();
            setSubmitted(false);
            setSendError(null);
          }}
        >
          Send another
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="rounded-xl bg-surface p-5 text-fg shadow-[var(--shadow-border)] sm:p-8"
      noValidate
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="name"
          label="Your name"
          error={form.formState.errors.name?.message}
        >
          <Input
            id="name"
            autoComplete="name"
            placeholder="Jordan Hale"
            {...form.register("name")}
          />
        </Field>
        <Field
          id="email"
          label="Email"
          error={form.formState.errors.email?.message}
        >
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@hospital.org"
            {...form.register("email")}
          />
        </Field>
        <Field
          id="facility"
          label="Facility"
          error={form.formState.errors.facility?.message}
        >
          <Input
            id="facility"
            placeholder="Hospital or clinic"
            {...form.register("facility")}
          />
        </Field>
        <Field id="dates" label="Dates needed" error={undefined}>
          <Input
            id="dates"
            placeholder="e.g. Oct 12–26, or ongoing"
            {...form.register("dates")}
          />
        </Field>
        <Field
          id="message"
          label="What you need"
          error={form.formState.errors.message?.message}
          className="sm:col-span-2"
        >
          <Textarea
            id="message"
            placeholder="Setting, shift pattern, credentialing timeline — whatever helps."
            {...form.register("message")}
          />
        </Field>
      </div>
      <div className="mt-6 flex flex-col gap-4">
        {sendError ? (
          <p className="text-sm text-danger" role="alert">
            {sendError}
          </p>
        ) : null}
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Sending…" : "Send inquiry"}
          <ArrowRight />
        </Button>
        <p className="text-sm text-muted">
          No account required. Used only to answer this request.
        </p>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <Label htmlFor={id} className="mb-2 block">
        {label}
      </Label>
      {children}
      {error ? (
        <p className="mt-1.5 text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
