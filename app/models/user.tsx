import { DataFunctionArgs, createCookie, redirect } from "@remix-run/node";
import { number, object, string } from "zod";
import { sql } from "~/sql.server";

export const UserSchema = object({
  id: number(),
  name: string(),
  email: string(),
});

export const sessionCookie = createCookie("session", {});

export async function getUser(ctx: DataFunctionArgs) {
  const cookie = await sessionCookie.parse(ctx.request.headers.get("cookie"));

  if (!cookie?.userId) {
    throw redirect("/login");
  }

  const user = await sql`
    select *
    from public.users
    where id = ${cookie.userId}
    limit 1
  `.first(UserSchema);

  if (!user) {
    throw redirect("/login", {
      headers: {
        "set-cookie": await sessionCookie.serialize({ userId: "" }),
      },
    });
  }

  return user;
}
