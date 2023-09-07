import { tw, twComponent } from "~/util/twComponent";
import { Link } from "@remix-run/react";

const styles = [
  tw`flex h-9 min-h-[38px] min-w-[38px] flex-shrink-0 items-center justify-center rounded-md text-body transition-all duration-200 ease-in-out will-change-transform active:translate-y-[1px] active:transition-none`,
  {
    variant: {
      secondary: tw`border border-border [&.bg-background]:active:bg-foreground [&.bg-foregroundLighter]:active:bg-foreground [&.bg-foreground]:active:bg-background`,
      tertiary: tw`[&.bg-background]:active:bg-foreground [&.bg-foreground]:active:bg-background`,
    },
    bg: {
      background: tw`bg-background`,
      foregroundLighter: tw`bg-foregroundLighter`,
      foreground: tw`bg-foreground`,
      primary: tw`theme-primary border-border bg-background active:bg-border [&.bg-background]:active:bg-border [&.bg-foreground]:active:bg-border`,
      none: tw``,
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
    variant: "secondary",
    bg: "none",
    elevation: "flat",
    shape: "rounded",
  },
] as const;

export const Button = twComponent("button", ...styles);
export const ButtonLink = twComponent(Link, ...styles);

export const ButtonText = twComponent(
  "span",
  tw`flex items-center gap-0.5 text-sm font-semibold uppercase text-body first:pl-3.5 last:pr-3.5 [&>svg:first-child]:-ml-2 [&>svg:last-child]:-mr-2`,
);
