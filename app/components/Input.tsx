import { tw, twComponent } from "~/util/twComponent";

export const Input = twComponent(
  "input",
  tw`h-full w-full bg-transparent px-2 leading-4 text-body outline-none`,
);

export const InputWrap = twComponent(
  "div",
  tw`-mx-0.5 flex min-h-[38px] w-[clamp(220px,100%,480px)] flex-1 items-center justify-center gap-1 border border-border px-2.5 outline-none ring-primary ring-offset-2  ring-offset-background transition-shadow focus-within:ring-2 [&>button:first-child]:-ml-2.5 [&>button:last-child]:-mr-2.5`,
  {
    bg: {
      background: tw`bg-background`,
      foreground: tw`bg-foreground`,
      foregroundLighter: tw`bg-foregroundLighter`,
    },
    elevation: {
      flat: tw``,
      small: tw`shadow-sm`,
    },
    shape: {
      rounded: tw`rounded-md`,
      circle: tw`-mx-0.5 rounded-full`,
      square: tw`rounded-none`,
      spaceless: tw`min-h-[unset] min-w-[unset] rounded-none`,
    },
  },
  {
    bg: "background",
    elevation: "flat",
    shape: "rounded",
  },
);
