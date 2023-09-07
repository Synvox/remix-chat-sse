import { twComponent, tw } from "~/util/twComponent";

export const Message = twComponent("div", tw`flex flex-col gap-0.5`, {
  origin: {
    left: tw`items-start`,
    right: tw`items-end`,
  },
});
export const MessageBubble = twComponent(
  "div",
  tw`inline-flex max-w-[68ch] flex-col rounded-2xl px-3 py-1 text-base text-body`,
  {
    origin: {
      left: tw`bg-border [.theme-light_&]:bg-background`,
      right: tw`theme-primary bg-foreground`,
    },
  },
);
export const MessageAuthor = twComponent("div", tw`text-xs text-light`, {});
