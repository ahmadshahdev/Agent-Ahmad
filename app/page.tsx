import { siteConfig } from "@/config/site";
import { Sparkles, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <section className="py-2xl flex flex-col items-center justify-center text-center space-y-md min-h-[60vh]">
      <div className="inline-flex items-center gap-xs px-sm py-1 rounded-full bg-primary-light border border-primary-border text-xs font-body font-semibold text-primary">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Foundation Ready</span>
      </div>

      <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-neutralDark max-w-2xl leading-tight">
        Welcome to <span className="text-primary">{siteConfig.name}&apos;s</span> Portfolio
      </h1>

      <p className="font-body text-base sm:text-lg text-neutralLight-muted max-w-xl">
        {siteConfig.tagline}
      </p>

      <div className="pt-md grid grid-cols-1 sm:grid-cols-3 gap-md max-w-xl w-full text-left">
        <div className="p-md rounded-xl bg-surface border border-neutralLight-border shadow-subtle flex items-start gap-xs">
          <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <h2 className="font-heading font-semibold text-sm text-neutralDark">Design System</h2>
            <p className="font-body text-xs text-neutralLight-muted">Tokens & Fonts active</p>
          </div>
        </div>
        <div className="p-md rounded-xl bg-surface border border-neutralLight-border shadow-subtle flex items-start gap-xs">
          <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <h2 className="font-heading font-semibold text-sm text-neutralDark">Layout Shell</h2>
            <p className="font-body text-xs text-neutralLight-muted">Nav & Footer responsive</p>
          </div>
        </div>
        <div className="p-md rounded-xl bg-surface border border-neutralLight-border shadow-subtle flex items-start gap-xs">
          <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <h2 className="font-heading font-semibold text-sm text-neutralDark">{siteConfig.agentName}</h2>
            <p className="font-body text-xs text-neutralLight-muted">Config ready</p>
          </div>
        </div>
      </div>
    </section>
  );
}
