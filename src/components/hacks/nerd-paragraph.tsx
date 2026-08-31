import { Link } from "@tanstack/react-router";

const tokens: Record<
  string,
  | { kind: "hack"; slug: "where-to-start" | "fast-food"; hash?: string; label: string }
  | { kind: "nerd"; topic: string; label: string }
> = {
  hormozi: { kind: "hack", slug: "where-to-start", hash: "hormozi", label: "Go back here" },
  a1c: { kind: "nerd", topic: "a1c", label: "hemoglobin A1c" },
  takeout: { kind: "hack", slug: "fast-food", label: "takeout splurges" },
  energy: { kind: "nerd", topic: "energy", label: "energy" },
  sweeteners: { kind: "nerd", topic: "sweeteners", label: "What are they, exactly?" },
  diabetes: { kind: "nerd", topic: "personal-fat-threshold", label: "causes type 2 diabetes" },
  reverse: { kind: "nerd", topic: "reverse-diabetes", label: "can I reverse it?" },
  grow: { kind: "nerd", topic: "muscle", label: "How do we grow muscle?" },
  whymuscle: {
    kind: "nerd",
    topic: "why-muscle",
    label: "Why you should care about growing muscle",
  },
};

export function NerdParagraph({ text }: { text: string }) {
  const pieces = text.split(/(\[\[\w+\]\])/);
  if (pieces.length === 1) return <p>{text}</p>;

  return (
    <p>
      {pieces.map((piece, i) => {
        const key = piece.match(/^\[\[(\w+)\]\]$/)?.[1];
        const token = key ? tokens[key] : undefined;
        if (!token) return <span key={i}>{piece}</span>;
        if (token.kind === "nerd") {
          return (
            <Link
              key={i}
              to="/hacks/nerd-out/$topic"
              params={{ topic: token.topic }}
              className="font-medium text-accent hover:text-fg"
            >
              {token.label}
            </Link>
          );
        }
        return (
          <Link
            key={i}
            to="/hacks/$slug"
            params={{ slug: token.slug }}
            hash={token.hash}
            className="font-medium text-accent hover:text-fg"
          >
            {token.label}
          </Link>
        );
      })}
    </p>
  );
}
