import { type ReactNode } from "react";
import { Reveal } from "./Reveal";

/** Consistent section header: `NN // label` kicker + title + optional lead. */
export function SectionHeading({
  index,
  kicker,
  title,
  lead,
  id,
}: {
  index: string;
  kicker: string;
  title: ReactNode;
  lead?: ReactNode;
  id?: string;
}) {
  return (
    <Reveal className="mb-10 md:mb-14">
      <p className="eyebrow mb-5 flex items-center gap-3">
        <span className="text-neon">{index}</span>
        <span className="h-px w-8 bg-line-2" aria-hidden="true" />
        <span>{kicker}</span>
      </p>
      <h2
        id={id}
        className="display max-w-3xl text-4xl text-chalk text-balance sm:text-5xl md:text-6xl"
      >
        {title}
      </h2>
      {lead && (
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-mist text-pretty">
          {lead}
        </p>
      )}
    </Reveal>
  );
}
