import { ExternalLink, Play } from "lucide-react";

type VideoCardProps = {
  videoId: string;
  title: string;
  credit: string;
  summary: string;
  anchor?: string;
};

export function VideoCard({ videoId, title, credit, summary, anchor }: VideoCardProps) {
  const href = `https://www.youtube.com/watch?v=${videoId}`;
  const thumb = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <article id={anchor} className="scroll-mt-24 overflow-hidden rounded-xl bg-surface shadow-border">
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="group relative block aspect-video bg-ink"
      >
        <img
          src={thumb}
          alt=""
          className="h-full w-full object-cover opacity-90 transition-opacity duration-150 group-hover:opacity-100"
        />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-accent text-accent-fg shadow-border">
            <Play className="size-6 fill-current" />
          </span>
          <span className="sr-only">Watch on YouTube: {title}</span>
        </span>
      </a>
      <div className="p-5 sm:p-6">
        <p className="text-xs font-medium tracking-widest text-muted uppercase">Watch · {credit}</p>
        <h3 className="mt-2 font-display text-2xl font-semibold tracking-wide">{title}</h3>
        <p className="mt-3 leading-relaxed text-muted">{summary}</p>
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-accent hover:text-fg"
        >
          Watch on YouTube
          <ExternalLink className="size-4" />
        </a>
      </div>
    </article>
  );
}
