import { boolean, number, object } from "zod";

export const ThreadSchema = object({
  fromUserId: number(),
  toUserId: number(),
  lastMessageId: number().nullable(),
  isUnread: boolean(),
});
