import { cn } from "@/lib/cn";
import { Eyebrow } from "./Eyebrow";
import { HighlightText } from "./HighlightText";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="max-w-3xl text-3xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-4xl md:text-[2.9rem]">
        <HighlightText text={title} />
      </h2>
      {lead ? (
        <p className="max-w-2xl text-base leading-relaxed text-[var(--agi-muted)] sm:text-lg">
          {lead}
        </p>
      ) : null}
    </header>
  );
}
