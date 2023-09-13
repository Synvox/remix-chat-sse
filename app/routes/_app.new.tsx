import { mdiArrowLeft } from "@mdi/js";
import { DataFunctionArgs, json } from "@remix-run/node";
import { useFetcher, useLoaderData, useNavigate } from "@remix-run/react";
import { useId, useState } from "react";
import { ButtonLink } from "~/components/Button";
import { iconOf } from "~/components/Icon";
import { Input, InputWrap } from "~/components/Input";
import {
  List,
  ListItemDetails,
  ListItemTitle,
  ListLink,
} from "~/components/List";
import { Nav } from "~/components/Nav";
import { Panel, PanelContent } from "~/components/Panel";
import { UserSchema, getUser } from "~/models/user";
import { sql } from "~/sql.server";
import { useHotkeys } from "react-hotkeys-hook";

const ArrowLeft = iconOf(mdiArrowLeft);

export async function loader(ctx: DataFunctionArgs) {
  const user = await getUser(ctx);
  const searchParams = new URL(ctx.request.url).searchParams;
  const query = searchParams.get("q") || "";

  if (!query) {
    return json({
      users: [],
    });
  }

  const users = await sql`
    select
      users.*
    from users
    where similarity(users.name || ' ' || users.email, ${query}) > 0.001
    and users.id <> ${user.id}
    order by users.name || ' ' || users.email <-> ${query} asc
    limit 10
  `.all(UserSchema);

  return json({ users });
}

export default function () {
  const listId = useId();
  let { users } = useLoaderData<typeof loader>();
  const [focusedUserIndex, setFocusedUserIndex] = useState(0);

  let fetcher = useFetcher();
  if (fetcher.data?.users) users = fetcher.data.users;
  const navigate = useNavigate();

  return (
    <Panel bg="foreground" id="panel-new">
      <Nav partialBorder="bottom" className="py-4">
        <ButtonLink
          className="lg:hidden"
          elevation="small"
          variant="secondary"
          bg="foregroundLighter"
          shape="circle"
          to="#panel-nav"
        >
          <ArrowLeft />
        </ButtonLink>
        <fetcher.Form className="flex flex-1" method="GET" action=".">
          <InputWrap elevation="small" bg="foregroundLighter">
            To:
            <Input
              placeholder="Search"
              autoFocus
              name="q"
              onChange={(e) => {
                fetcher.submit(e.target.form);
                setFocusedUserIndex(0);
              }}
              role="combobox"
              aria-controls={listId}
              aria-autocomplete="list"
              aria-expanded={users.length > 0}
              data-active-option={`${listId}-item${focusedUserIndex + 1}`}
              aria-activedescendant=""
              onKeyDown={(e) => {
                if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setFocusedUserIndex((i) => Math.max(0, i - 1));
                } else if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setFocusedUserIndex((i) => Math.min(users.length - 1, i + 1));
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  navigate(
                    `../${users[focusedUserIndex].id}#panel-user-${users[focusedUserIndex].id}`,
                  );
                }
              }}
            />
            <button hidden />
          </InputWrap>
        </fetcher.Form>
      </Nav>
      <PanelContent padding="none" scroll="vertical">
        <List dividers="none">
          {users.map((user, index) => (
            <ListLink
              id={`${listId}-item${index + 1}`}
              shape="rounded"
              key={user.id}
              to={`../${user.id}#panel-user-${user.id}`}
              activeTheme="primary"
              className={focusedUserIndex === index ? "active" : undefined}
              role="option"
            >
              <ListItemTitle>{user.name}</ListItemTitle>
              <ListItemDetails>{user.email}</ListItemDetails>
            </ListLink>
          ))}
        </List>
      </PanelContent>
    </Panel>
  );
}
