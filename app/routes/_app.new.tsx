import { mdiArrowLeft } from "@mdi/js";
import { DataFunctionArgs, json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { Fragment } from "react";
import reactStringReplace from "react-string-replace";
import { object, string } from "zod";
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

const ArrowLeft = iconOf(mdiArrowLeft);

type Change = {
  regex: RegExp;
  fn: (match: string, index: number, offset: number) => React.ReactNode;
};

function makeProcessor(...changes: Change[]) {
  return function process(
    input: string | ReturnType<typeof reactStringReplace>,
  ) {
    for (let change of changes) change.regex.lastIndex = 0;

    return Array.from(
      changes.reduce(
        (input, change) => reactStringReplace(input, change.regex, change.fn),
        input,
      ),
    ).map((match, i) => <Fragment key={i}>{match}</Fragment>);
  };
}

const makeBold = makeProcessor({
  regex: /\*(.*?)\*/g,
  fn(match, i) {
    return (
      <span
        key={match + i}
        className="rounded bg-yellow-500 bg-opacity-20 px-0.5 text-yellow-500"
      >
        {match.replace(/\*(.*?)\*/g, "$1")}
      </span>
    );
  },
});

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
      users.*,
      ts_headline('english', users.name, websearch_to_tsquery(${query}), 'StartSel=* StopSel=*') as name_highlighted
    from users
    where (
      to_tsvector(users.name) @@ websearch_to_tsquery(${query})
      or users.name ilike ${query} || '%'
    )
    and users.id <> ${user.id}
    limit 20
  `.all(UserSchema.merge(object({ nameHighlighted: string() })));

  return json({ users });
}

export default function () {
  let { users } = useLoaderData<typeof loader>();

  let fetcher = useFetcher();
  if (fetcher.data?.users) users = fetcher.data.users;

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
            <Input placeholder="Search" autoFocus name="q" />
            <button hidden />
          </InputWrap>
        </fetcher.Form>
      </Nav>
      <PanelContent padding="none" scroll="vertical">
        <List dividers="none">
          {users.map((user) => (
            <ListLink
              key={user.id}
              to={`../${user.id}#panel-user-${user.id}`}
              activeTheme="primary"
              shape="rounded"
            >
              <ListItemTitle>{makeBold(user.nameHighlighted)}</ListItemTitle>
              <ListItemDetails>{user.email}</ListItemDetails>
            </ListLink>
          ))}
        </List>
      </PanelContent>
    </Panel>
  );
}
