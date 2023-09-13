import { NavLink } from "@remix-run/react";
import { tw, twComponent } from "~/util/twComponent";

const base = tw`relative flex min-h-[36px] appearance-none flex-col justify-center overflow-hidden px-4 py-1.5 transition-colors duration-200 ease-in-out`;
const interactiveItemStyles = [
  base,
  {
    activeTheme: {
      background: tw`hover:bg-background [&.active]:bg-background`,
      foreground: tw`hover:bg-foreground [&.active]:bg-foreground`,
      primary: tw`[&.active]:theme-primary active:bg-background [&.active]:border-transparent [&.active]:bg-background`,
    },
    shape: {
      flat: tw``,
      rounded: tw`m-1 rounded-md px-3`,
    },
    bar: {
      right: tw`after:absolute after:bottom-0 after:right-[-3px] after:top-0 after:w-1.5 after:scale-y-0 after:rounded-full after:bg-primary after:opacity-0 after:transition-all [&.active]:after:scale-y-100 [&.active]:after:opacity-100`,
      none: tw``,
    },
  },
  {
    activeTheme: "background",
    shape: "flat",
    bar: "none",
  },
] as const;

export const ListLink = twComponent(NavLink, ...interactiveItemStyles);
export const ListItemButton = twComponent("button", ...interactiveItemStyles);
export const ListItem = twComponent("div", base, {});
export const ListItemTitle = twComponent("h3", tw`font-semibold text-body`, {});
export const ListItemDetails = twComponent(
  "h3",
  tw`line-clamp-2 text-sm text-light`,
  {},
);
export const List = twComponent(
  "div",
  tw`relative flex flex-col`,
  {
    dividers: {
      line: tw`divide-y divide-border`,
      partial: tw`[&>*:not(:last-child)]:before:absolute [&>*:not(:last-child)]:before:bottom-0 [&>*:not(:last-child)]:before:left-4 [&>*:not(:last-child)]:before:right-4 [&>*:not(:last-child)]:before:border-t [&>*:not(:last-child)]:before:border-border`,
      none: tw``,
    },
  },
  {
    dividers: "none",
  },
);
export const ListDivider = twComponent(
  "h3",
  tw`relative mt-4 flex min-h-[32px] items-center px-4 pb-1 text-sm font-semibold text-body text-opacity-60 first:mt-0`,
  {
    border: {
      top: tw`border-t border-border`,
      bottom: tw`border-b border-border`,
      none: tw``,
    },
    bg: {
      none: tw``,
      background: tw`bg-background`,
      foreground: tw`bg-foreground`,
    },
    partialBorder: {
      top: tw`before:absolute before:left-4 before:right-4 before:top-0 before:border-t before:border-border`,
      bottom: tw`before:absolute before:bottom-0 before:left-4 before:right-4 before:border-t before:border-border`,
      none: tw``,
    },
    position: {
      static: tw``,
      sticky: tw`[.bg-foreground]:from-foreground [.bg-foreground]:to-foreground/90 [.bg-background]:from-background [.bg-background]:to-background/90 sticky top-0 z-10 bg-gradient-to-b backdrop-blur-md`,
    },
  },
  {
    border: "none",
    bg: "none",
    partialBorder: "none",
    position: "static",
  },
);
export const ListGroup = twComponent("div", tw`after:block after:h-4`, {});
