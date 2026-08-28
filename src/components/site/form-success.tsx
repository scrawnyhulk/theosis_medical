import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FormSuccess({
  title,
  body,
  onAgain,
}: {
  title: string;
  body: string;
  onAgain: () => void;
}) {
  return (
    <div className="flex min-h-72 flex-col justify-center rounded-xl bg-surface px-6 py-10 text-fg shadow-border sm:px-8">
      <span className="mb-5 inline-flex size-11 items-center justify-center rounded-full bg-accent text-accent-fg">
        <Check className="size-5" strokeWidth={2.25} />
      </span>
      <h3 className="font-display text-3xl leading-tight tracking-tight">{title}</h3>
      <p className="mt-3 max-w-md text-muted">{body}</p>
      <Button type="button" variant="outline" className="mt-8 w-fit" onClick={onAgain}>
        Send another
      </Button>
    </div>
  );
}
