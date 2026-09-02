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
  suggestion: z
    .string()
    .trim()
    .min(12, "A little more detail helps — what would you want this to include?"),
});

type Values = z.infer<typeof schema>;

const STORAGE_KEY = "theosis-suggestions";

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

export function SuggestionForm() {
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", suggestion: "" },
  });

  async function onSubmit(values: Values) {
    persist(values);
    setSendError(null);
    try {
      await sendSiteForm({
        kind: "suggestion",
        name: values.name,
        email: values.email,
        fields: { suggestion: values.suggestion },
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
        body="I will read this and follow up at the email you provided if there is something to answer."
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
        <Field
          id="suggest-name"
          label="Your name"
          error={form.formState.errors.name?.message}
        >
          <Input
            id="suggest-name"
            autoComplete="name"
            placeholder="Your name"
            {...form.register("name")}
          />
        </Field>
        <Field
          id="suggest-email"
          label="Email"
          error={form.formState.errors.email?.message}
        >
          <Input
            id="suggest-email"
            type="email"
            autoComplete="email"
            placeholder="you@email.com"
            {...form.register("email")}
          />
        </Field>
        <Field
          id="suggest-message"
          label="Your suggestion"
          error={form.formState.errors.suggestion?.message}
          className="sm:col-span-2"
        >
          <Textarea
            id="suggest-message"
            placeholder="What would make this useful? Hours, pricing, labs, kids, training — whatever is on your mind."
            {...form.register("suggestion")}
          />
        </Field>
      </div>
      <div className="mt-6 flex flex-col gap-4">
        <Button type="submit" size="lg" className="w-full">
          Share a Suggestion
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
