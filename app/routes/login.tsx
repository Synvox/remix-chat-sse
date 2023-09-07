import { DataFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import {
  List,
  ListItemButton,
  ListItemDetails,
  ListItemTitle,
} from "~/components/List";
import { Nav, NavTitle } from "~/components/Nav";
import { Panel, PanelContent } from "~/components/Panel";
import { UserSchema, sessionCookie } from "~/models/user";
import { sql } from "~/sql.server";

export async function loader() {
  const users = await sql`
    select *
    from users
  `.all(UserSchema);

  return json({
    users,
  });
}

export async function action(ctx: DataFunctionArgs) {
  const formData = await ctx.request.formData();
  const userId = formData.get("userId");

  return redirect("/", {
    headers: {
      "set-cookie": await sessionCookie.serialize({ userId }),
    },
  });
}

export default function Index() {
  const { users } = useLoaderData<typeof loader>();

  return (
    <Form
      className="flex h-full items-center justify-center"
      method="POST"
      action="."
    >
      <Panel elevation="large" bg="foreground" className="h-[50vh] w-[320px]">
        <Nav partialBorder="bottom">
          <NavTitle>Login As</NavTitle>
        </Nav>
        <PanelContent scroll="vertical" padding="none">
          <List>
            {users.map((user) => (
              <ListItemButton
                key={user.id}
                value={user.id}
                name="userId"
                activeTheme="primary"
                shape="rounded"
              >
                <ListItemTitle>{user.name}</ListItemTitle>
                <ListItemDetails>{user.email}</ListItemDetails>
              </ListItemButton>
            ))}
          </List>
        </PanelContent>
      </Panel>
    </Form>
  );
}
