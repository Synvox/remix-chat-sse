import { tw, twComponent } from "~/util/twComponent";

export const Nav = twComponent(
  "nav",
  tw`panel-nav relative flex min-h-[46px] items-center gap-3 border-border px-4 py-2 [.panel-nav+&]:pt-0`,
  {
    bg: {
      background: tw`bg-background`,
      foreground: tw`bg-foreground`,
      foregroundLighter: tw`bg-foregroundLighter`,
      none: tw``,
    },
    border: {
      top: tw`border-t`,
      bottom: tw`border-b`,
      both: tw`border-b border-t`,
      none: tw``,
    },
    partialBorder: {
      top: tw`before:absolute before:left-4 before:right-4 before:top-0 before:border-t before:border-border`,
      bottom: tw`before:absolute before:bottom-0 before:left-4 before:right-4 before:border-t before:border-border`,
      none: tw``,
    },
    justify: {
      start: tw`justify-start`,
      center: tw`justify-center`,
      end: tw`justify-end`,
      between: tw`justify-between`,
    },
  },
  {
    bg: "none",
    border: "none",
    partialBorder: "none",
    justify: "start",
  },
);

export const NavTitle = twComponent(
  "h2",
  tw`text-l font-semibold text-body`,
  {
    size: {
      normal: tw`text-l`,
      large: tw`text-xl`,
    },
  },
  {
    size: "normal",
  },
);

export const NavHGroup = twComponent("hgroup", tw``, {});

export const NavSubTitle = twComponent(
  "p",
  tw`text-sm font-semibold text-body text-opacity-80`,
  {},
);

export const NavIcon = twComponent(
  "div",
  tw`flex h-7 w-7 items-center justify-center [&>svg]:h-7 [&>svg]:w-7`,
  {
    color: {
      primary: tw`text-primary`,
      secondary: tw`text-body text-opacity-70`,
    },
  },
  {
    color: "primary",
  },
);
