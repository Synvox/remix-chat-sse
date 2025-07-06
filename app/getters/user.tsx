import { DataFunctionArgs, createCookie, redirect } from "@remix-run/node";
import { sql } from "~/sql.server";
import { User } from "~/types";

export const sessionCookie = createCookie("session", {});

export async function getUser(ctx: DataFunctionArgs) {
  const cookie = await sessionCookie.parse(ctx.request.headers.get("cookie"));

  if (!cookie?.userId) {
    throw redirect("/login");
  }

  const user = await sql`
    select *
    from users
    where id = ${cookie.userId}
    limit 1
  `.first<User>();

  if (!user) {
    throw redirect("/login", {
      headers: {
        "set-cookie": await sessionCookie.serialize({ userId: "" }),
      },
    });
  }

  return user;
}

export async function cookieForUserId(userId: number) {
  const headers = new Headers();
  headers.set("set-cookie", await sessionCookie.serialize({ userId }));
  return headers;
}
