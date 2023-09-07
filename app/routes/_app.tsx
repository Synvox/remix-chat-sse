import {
  mdiCircle,
  mdiMagnify,
  mdiPlus,
  mdiWeatherNight,
  mdiWeatherSunny,
} from "@mdi/js";
import {
  json,
  type DataFunctionArgs,
  type V2_MetaFunction,
} from "@remix-run/node";
import { Form, Outlet, ShouldRevalidateFunction } from "@remix-run/react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { date, object, string } from "zod";
import { Button } from "~/components/Button";
import { iconOf } from "~/components/Icon";
import { Input, InputWrap } from "~/components/Input";
import {
  List,
  ListDivider,
  ListGroup,
  ListItemDetails,
  ListItemTitle,
  ListLink,
} from "~/components/List";
import { Nav, NavHGroup, NavSubTitle, NavTitle } from "~/components/Nav";
import { Panel, PanelContent, Panels } from "~/components/Panel";
import { useLiveLoader } from "~/hooks/useLiveLoader";
import { ThreadSchema } from "~/models/threads";
import { getUser } from "~/models/user";
import { sql } from "~/sql.server";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader(ctx: DataFunctionArgs) {
  const user = await getUser(ctx);
  return json({
    user,
    threads: await sql`
      select
        threads.*,
        date_trunc('day', messages.created_at) as last_message_day,
        messages.body as last_message_body,
        to_user.name as to_user_name
      from threads
      join messages on messages.id = threads.last_message_id
      join users to_user on to_user.id = threads.to_user_id
      where threads.from_user_id = ${user.id}
      order by messages.created_at desc
    `.paginate({
      page: 0,
      per: 200,
      schema: ThreadSchema.merge(
        object({
          lastMessageDay: date(),
          lastMessageBody: string(),
          toUserName: string(),
        }),
      ),
    }),
  });
}

export const shouldRevalidate: ShouldRevalidateFunction = ({
  currentParams,
  defaultShouldRevalidate,
  nextParams,
}) => {
  if (currentParams.userId !== nextParams.userId) return true;

  return defaultShouldRevalidate;
};

const NewIcon = iconOf(mdiPlus);
const SunIcon = iconOf(mdiWeatherSunny);
const NightIcon = iconOf(mdiWeatherNight);
const SearchIcon = iconOf(mdiMagnify);
const Circle = iconOf(mdiCircle);

export default function Index() {
  const { threads, user } = useLiveLoader<typeof loader>();
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    document.body.classList.remove("theme-light", "theme-dark");
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  // In the future it'd be nice to have infinite scroll here.
  // This could run in SQL or on the server but it'll have to be
  // client side when infinite scroll is implemented so we'll
  // leave it here for now.
  const threadsGroupedByDay = threads.reduce(
    (acc, thread) => {
      const day = new Date(thread.lastMessageDay!).toISOString() || "";
      if (!acc.length) {
        return [
          {
            day,
            threads: [thread],
          },
        ];
      }

      if (acc[acc.length - 1].day === day) {
        acc[acc.length - 1].threads.push(thread);
      } else {
        acc.push({
          day,
          threads: [thread],
        });
      }

      return acc;
    },
    [] as { day: string; threads: typeof threads }[],
  );

  return (
    <Panels>
      <Panel size="small" bg="background" id="panel-nav">
        <Nav justify="between">
          <NavTitle size="large">Messages</NavTitle>
          <Form action="new#panel-new">
            <Button
              elevation="small"
              variant="secondary"
              bg="foreground"
              shape="circle"
            >
              <NewIcon />
            </Button>
          </Form>
        </Nav>
        <Nav justify="between">
          <InputWrap elevation="small" bg="foreground">
            <SearchIcon />
            <Input placeholder="Search" />
          </InputWrap>
        </Nav>
        <PanelContent padding="none" scroll="vertical">
          <List dividers="none">
            {threadsGroupedByDay.map(({ day, threads }) => (
              <ListGroup>
                <ListDivider position="sticky" bg="background" border="bottom">
                  {dayjs(day).format("dddd, MMMM D")}
                </ListDivider>
                {threads.map((thread) => (
                  <ListLink
                    key={thread.toUserId}
                    to={`${thread.toUserId}#panel-user-${thread.toUserId}`}
                    activeTheme="primary"
                    shape="rounded"
                    className="pr-8"
                  >
                    <ListItemTitle>{thread.toUserName}</ListItemTitle>
                    <ListItemDetails>{thread.lastMessageBody}</ListItemDetails>
                    {thread.isUnread && (
                      <div className="absolute bottom-0 right-6 top-0 flex h-full items-center [.active>&]:hidden">
                        <Circle className="absolute top-1/2 h-3 w-3 -translate-y-1/2 fill-primary" />
                      </div>
                    )}
                  </ListLink>
                ))}
              </ListGroup>
            ))}
          </List>
        </PanelContent>
        <Nav partialBorder="top" justify="between">
          <Button
            variant="tertiary"
            shape="circle"
            bg="background"
            onClick={
              theme === "dark"
                ? () => setTheme("light")
                : () => setTheme("dark")
            }
          >
            {theme === "dark" ? <NightIcon /> : <SunIcon />}
          </Button>
          <NavHGroup className="flex flex-col items-end">
            <NavTitle>{user.name}</NavTitle>
            <NavSubTitle className="flex items-center gap-1">
              <Circle className="h-3 w-3 fill-current text-green-500" />
              Online
            </NavSubTitle>
          </NavHGroup>
        </Nav>
      </Panel>
      <Outlet />
    </Panels>
  );
}
