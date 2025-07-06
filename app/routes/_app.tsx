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
import {
  Form,
  Outlet,
  ShouldRevalidateFunction,
  useFetcher,
} from "@remix-run/react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useRef, useState } from "react";
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
import { getUser } from "~/getters/user";
import { useLiveLoader } from "~/hooks/useLiveLoader";
import { sql } from "~/sql.server";
import { Thread } from "~/types";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader(ctx: DataFunctionArgs) {
  const user = await getUser(ctx);
  const queryParams = new URL(ctx.request.url).searchParams;
  const per = Math.min(10000, Number(queryParams.get("per")) || 32);

  const threads = await sql`
    select
      threads.*,
      date_trunc('day', messages.created_at) as last_message_day,
      messages.body as last_message_body,
      to_user.name as to_user_name
    from
      threads
      join messages on messages.id = threads.last_message_id
      join users to_user on to_user.id = threads.to_user_id
    where
      threads.from_user_id = ${user.id}
    order by
      messages.created_at desc
  `.paginate<
    Thread & {
      lastMessageDay: string;
      lastMessageBody: string;
      toUserName: string;
    }
  >({
    page: 0,
    per,
  });

  return {
    per,
    user,
    threads,
    hasMore: threads.length === per,
  };
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
  const { threads: threadsFromLoader, user } = useLiveLoader<typeof loader>();
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    document.body.classList.remove("theme-light", "theme-dark");
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  const fetcher = useFetcher<typeof loader>();
  const threads = fetcher.data?.threads || threadsFromLoader;

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

  const parentRef = useRef(null);
  const rowVirtualizer = useVirtualizer({
    count: threadsGroupedByDay.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => {
      const { threads } = threadsGroupedByDay[index];
      return 48 + threads.length * 54.5 + 16;
    },
    initialRect: {
      height: 1440,
      width: 320,
    },
  });

  useEffect(() => {
    const per = Number(fetcher.data?.per || 0);

    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

    if (
      lastItem &&
      lastItem.index === threadsGroupedByDay.length - 1 &&
      fetcher.state === "idle" &&
      fetcher?.data?.hasMore !== false
    ) {
      fetcher.load(`/resources/threads?per=${per * 2}`);
    }
  }, [fetcher.state === "idle", rowVirtualizer.getVirtualItems()]);

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
        <PanelContent padding="none" scroll="vertical" ref={parentRef}>
          <List
            dividers="none"
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
            }}
          >
            {threads.length > 0 && (
              <div
                style={{
                  height: rowVirtualizer.getVirtualItems()[0].start + "px",
                }}
              />
            )}
            {rowVirtualizer.getVirtualItems().map((virtualItem) => {
              const { day, threads } = threadsGroupedByDay[virtualItem.index];

              return (
                <ListGroup key={day}>
                  <ListDivider
                    position="sticky"
                    bg="background"
                    border="bottom"
                  >
                    {new Intl.DateTimeFormat("en-US", {
                      dateStyle: "long",
                    }).format(new Date(day))}
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
                      <ListItemDetails>
                        {thread.lastMessageBody}
                      </ListItemDetails>
                      {thread.isUnread && (
                        <div className="absolute bottom-0 right-6 top-0 flex h-full items-center [.active>&]:hidden">
                          <Circle className="absolute top-1/2 h-3 w-3 -translate-y-1/2 fill-primary" />
                        </div>
                      )}
                    </ListLink>
                  ))}
                </ListGroup>
              );
            })}
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
