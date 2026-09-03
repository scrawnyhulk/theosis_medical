"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type PromptEvent = Event & { prompt: () => Promise<void> };

export function InstallButton() {
  const [promptEvent, setPromptEvent] = useState<PromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone));
    if (standalone) setInstalled(true);

    function onPrompt(e: Event) {
      e.preventDefault();
      setPromptEvent(e as PromptEvent);
    }
    function onInstalled() {
      setInstalled(true);
      setPromptEvent(null);
    }
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed) {
    return <p className="text-sm text-ok">This is already on your home screen.</p>;
  }
  if (!promptEvent) return null;

  return (
    <Button
      size="lg"
      onClick={async () => {
        await promptEvent.prompt();
        setPromptEvent(null);
      }}
    >
      Install Theosis
    </Button>
  );
}
