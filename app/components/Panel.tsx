import { tw, twComponent } from "~/util/twComponent";

export const Panels = twComponent(
  "div",
  tw`panels flex h-full w-full snap-x snap-mandatory flex-row items-stretch justify-stretch overflow-x-auto overflow-y-clip scroll-smooth`,
);

export const Panel = twComponent(
  "section",
  tw`panel border-r-none [.panels>&]:last:border-r-none inset-0 inline-flex min-w-[320px] snap-center flex-col overflow-hidden scroll-smooth rounded-md border-r-border bg-background text-body lg:flex [.panels>&]:rounded-none [.panels>&]:border-r`,
  {
    elevation: {
      flat: tw``,
      small: tw`z-10 border border-border shadow-sm`,
      medium: tw`z-20 border border-border shadow-md`,
      large: tw`z-30 border border-border shadow-lg`,
      xlarge: tw`z-40 border border-border shadow-xl`,
    },
    size: {
      small: tw`[.panels>&]:flex-shrink-0 [.panels>&]:flex-grow-0 [.panels>&]:basis-[100%] [.panels>&]:lg:basis-[380px]`,
      medium: tw`[.panels>&]:flex-shrink-0 [.panels>&]:flex-grow-0 [.panels>&]:basis-[100%] [.panels>&]:lg:basis-[400px]`,
      large: tw`[.panels>&]:flex-shrink-0 [.panels>&]:flex-grow-0 [.panels>&]:basis-[100%] [.panels>&]:lg:basis-[640px]`,
      xlarge: tw`[.panels>&]:flex-shrink-0 [.panels>&]:flex-grow-0 [.panels>&]:basis-[100%] [.panels>&]:lg:basis-[800px]`,
      auto: tw`[.panels>&]:flex-shrink-0 [.panels>&]:flex-grow-0 [.panels>&]:basis-[100%] [.panels>&]:lg:flex-1`,
    },
    bg: {
      background: tw`bg-background`,
      foreground: tw`bg-foreground`,
      foregroundLighter: tw`bg-foregroundLighter`,
    },
  },
  {
    elevation: "flat",
    size: "auto",
    bg: "background",
  },
);

export const PanelContent = twComponent(
  "div",
  tw`panel-body flex flex-1 flex-col`,
  {
    bg: {
      background: tw`bg-background`,
      foreground: tw`bg-foreground`,
      none: tw``,
    },
    padding: {
      none: tw`p-0`,
      small: tw`p-2`,
      medium: tw`p-4`,
      large: tw`p-4 md:p-8`,
      xlarge: tw`p-4 md:p-16`,
      xxlarge: tw`p-4 md:p-32`,
    },
    scroll: {
      none: tw``,
      vertical: tw`overflow-y-auto`,
    },
  },
  {
    bg: "none",
    padding: "medium",
  },
);
