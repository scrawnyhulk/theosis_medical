import { useEffect, useState } from "react";
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
import { storeItems } from "@/lib/store";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name."),
  email: z.string().trim().email("Enter a working email."),
  item: z.string().trim().min(1, "Pick a piece."),
  note: z.string().trim().max(800).optional(),
});

type Values = z.infer<typeof schema>;

export function MerchInterestForm({ selectedId }: { selectedId?: string }) {
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      item: selectedId ?? storeItems[0]?.id ?? "",
      note: "",
    },
  });

  useEffect(() => {
    if (selectedId) form.setValue("item", selectedId);
  }, [selectedId, form]);

  async function onSubmit(values: Values) {
    setSendError(null);
    const item = storeItems.find((entry) => entry.id === values.item);
    try {
      await sendSiteForm({
        kind: "merch",
        name: values.name,
        email: values.email,
        fields: {
          Item: item ? `${item.n} — ${item.title}` : values.item,
          Note: values.note ?? "",
        },
      });
      setSent(true);
      form.reset({ name: "", email: "", item: values.item, note: "" });
    } catch {
      setSendError("Could not send right now. Email nick@theosismedical.com and I will get it.");
    }
  }

  if (sent) {
    return (
      <FormSuccess
        title="Got it."
        body="If enough people would actually wear this, I will make it real. I will not spam you or sell your email."
        onAgain={() => setSent(false)}
      />
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <Field label="Name" error={form.formState.errors.name?.message}>
        <Input autoComplete="name" {...form.register("name")} />
      </Field>
      <Field label="Email" error={form.formState.errors.email?.message}>
        <Input type="email" autoComplete="email" {...form.register("email")} />
      </Field>
      <Field label="Which piece" error={form.formState.errors.item?.message}>
        <select
          className="flex h-11 w-full rounded-sm bg-ink px-3.5 font-sans text-base text-fg shadow-[var(--shadow-border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 md:text-sm"
          {...form.register("item")}
        >
          {storeItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.n} — {item.title}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Anything else (optional)" error={form.formState.errors.note?.message}>
        <Textarea rows={4} placeholder="Size, color, something I missed…" {...form.register("note")} />
      </Field>
      {sendError ? <p className="text-sm text-danger">{sendError}</p> : null}
      <p className="text-sm text-muted">I will never spam or sell emails.</p>
      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Sending…" : "I would wear this"}
        <ArrowRight />
      </Button>
    </form>
  );
}
