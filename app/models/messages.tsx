import { date, number, object, string } from "zod";

export const MessagesSchema = object({
  id: number(),
  fromUserId: number(),
  toUserId: number(),
  createdAt: date(),
  body: string(),
});
