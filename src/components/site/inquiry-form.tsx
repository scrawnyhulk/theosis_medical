import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/site/field";
import { FormSuccess } from "@/components/site/form-success";
import { sendSiteForm } from "@/lib/send-site-form";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name."),
  email: z.string().trim().email("Enter a working email."),
  facility: z.string().trim().min(2, "Enter a facility or group."),
  dates: z.string().trim(),
  message: z
    .string()
    .trim()
    .min(12, "A little more detail helps the practice prepare."),
});

type Values = z.infer<typeof schema>;

const STORAGE_KEY = "theosis-inquiries";

function persist(values: Values) {
  try {
    const prev = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as unknown[];
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([{ ...values, at: new Date().toISOString() }, ...prev].slice(0, 20)),
    );
  } catch {
    /* playground only — never mail the live inbox */
  }
}

export function InquiryForm() {
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", facility: "", dates: "", message: "" },
  });

  async function onSubmit(values: Values) {
    persist(values);
    setSendError(null);
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
      setSent(true);
    } catch {
      setSendError(
        "Could not send just now. Call 765.487.0777 or email nick@theosismedical.com.",
      );
    }
  }

  if (sent) {
    return (
      <FormSuccess
        title="Received. Thank you."
        body="I will follow up at the email you provided. For something that cannot wait, call."
        onAgain={() => {
          form.reset();
          setSent(false);
          setSendError(null);
        }}
      />
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="rounded-xl bg-surface p-5 text-fg shadow-border sm:p-8"
      noValidate
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Your name" error={form.formState.errors.name?.message}>
          <Input id="name" autoComplete="name" placeholder="Jordan Hale" {...form.register("name")} />
        </Field>
        <Field id="email" label="Email" error={form.formState.errors.email?.message}>
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
          <Input id="facility" placeholder="Hospital or clinic" {...form.register("facility")} />
        </Field>
        <Field id="dates" label="Dates needed">
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
        <Button type="submit" size="lg" className="w-full">
          Send inquiry
          <ArrowRight />
        </Button>
        {sendError ? <p className="text-sm text-danger">{sendError}</p> : null}
        <p className="text-sm text-muted">
          No account required. I will never spam you or sell your email.
        </p>
      </div>
    </form>
  );
}
