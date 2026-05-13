import type { LucideIcon } from "lucide-react";
import { ClipboardList, Wand2, BookOpenText, PackageOpen } from "lucide-react";
import { Fragment } from "react";

type Step = {
  readonly number: string;
  readonly icon: LucideIcon;
  readonly title: string;
  readonly description: string;
};

const steps: Step[] = [
  {
    number: "01",
    icon: ClipboardList,
    title: "SUBMIT YOUR FORM",
    description:
      "Fill out our short form to help us know your reading preferences.",
  },
  {
    number: "02",
    icon: Wand2,
    title: "WE PICK YOUR BOOK",
    description:
      "We handpick a book just for you based on your set preferences.",
  },
  {
    number: "03",
    icon: PackageOpen,
    title: "WE PACK & SHIP",
    description:
      "Your book is packed with care and shipped right to your doorstep.",
  },
  {
    number: "04",
    icon: BookOpenText,
    title: "YOU READ & ENJOY",
    description:
      "Unbox, read, and enjoy a story picked just for you — yours to keep forever.",
  },
];

/** Thin chevron only — no stem — for step separators. */
function StepChevron() {
  return (
    <svg
      className="h-14 w-7 shrink-0 text-brand-clay sm:h-16 sm:w-8"
      viewBox="0 0 32 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M8 12 L22 36 L8 60"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HowItWorksHome() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-heading"
      className="bg-brand-mist py-6"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-stretch lg:gap-6">
          <div className="max-w-md shrink-0 lg:max-w-[min(16rem,22vw)] xl:max-w-xs">
            <h2
              id="how-heading"
              className="font-display mr-4 text-4xl leading-none font-medium tracking-tight text-brand-void sm:text-5xl lg:text-3xl xl:text-5xl"
            >
              HOW IT WORKS
            </h2>
            <div className="mt-4 h-px w-12 bg-brand-clay" aria-hidden />
            <p className="mt-4 text-lg leading-relaxed font-normal tracking-normal text-brand-earth font-display sm:text-xl lg:text-base xl:text-xl">
              Simple. Personal.
              <br />
              Meaningful.
            </p>
          </div>

          <div
            className="flex min-w-0 flex-1 flex-col gap-5 lg:flex-row lg:items-stretch lg:gap-2"
            role="list"
          >
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Fragment key={step.number}>
                  <div
                    className="flex min-w-0 flex-1 flex-col lg:basis-0"
                    role="listitem"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-display text-3xl font-normal leading-none tracking-tight text-brand-dust sm:text-4xl">
                        {step.number}
                      </span>
                      <Icon
                        className="ml-1 size-8 shrink-0 text-brand-earth sm:size-9"
                        strokeWidth={1.35}
                        aria-hidden
                      />
                    </div>
                    <h3 className="font-display mt-3 text-sm leading-tight font-semibold tracking-normal text-brand-earth sm:text-base">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-brand-earth sm:text-sm">
                      {step.description}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className="hidden shrink-0 items-center justify-center self-center lg:flex"
                      aria-hidden
                    >
                      <StepChevron />
                    </div>
                  )}
                </Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
