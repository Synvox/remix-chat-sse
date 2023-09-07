import { twComponent, tw } from "~/util/twComponent";

export const Stack = twComponent(
  "div",
  "flex flex-col",
  {
    gap: {
      none: tw`gap-0`,
      xsmall: tw`gap-1`,
      small: tw`gap-2`,
      medium: tw`gap-5`,
      large: tw`gap-10`,
      xlarge: tw`gap-20`,
      xxlarge: tw`gap-40`,
    },
    align: {
      start: tw`items-start`,
      center: tw`items-center`,
      end: tw`items-end`,
      stretch: tw`items-stretch`,
      between: tw`items-between`,
    },
    justify: {
      start: tw`justify-start`,
      center: tw`justify-center`,
      end: tw`justify-end`,
      stretch: tw`justify-stretch`,
      between: tw`justify-between`,
    },
    direction: {
      row: tw`flex-row`,
      column: tw`flex-col`,
    },
  },
  {
    gap: "medium",
    align: "stretch",
    justify: "start",
    direction: "column",
  },
);
