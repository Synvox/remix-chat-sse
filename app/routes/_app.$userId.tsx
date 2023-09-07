import { mdiArrowLeft, mdiArrowRight } from "@mdi/js";
import { json, redirect, type DataFunctionArgs } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat.js";
import { object } from "zod";
import { Button, ButtonLink } from "~/components/Button";
import { iconOf } from "~/components/Icon";
import { Input, InputWrap } from "~/components/Input";
import { Message, MessageAuthor, MessageBubble } from "~/components/Message";
import { Nav, NavTitle } from "~/components/Nav";
import { Panel, PanelContent } from "~/components/Panel";
import { Stack } from "~/components/Stack";
import { useLiveLoader } from "~/hooks/useLiveLoader";
import { MessagesSchema } from "~/models/messages";
import { UserSchema, getUser } from "~/models/user";
import { realtimeActions } from "~/realtimeActions";
import { sql } from "~/sql.server";

dayjs.extend(LocalizedFormat);

const ArrowRight = iconOf(mdiArrowRight);
const ArrowLeft = iconOf(mdiArrowLeft);

export async function loader(ctx: DataFunctionArgs) {
  const userId = ctx.params.userId;
  const user = await getUser(ctx);

  if (user.id === Number(userId)) {
    throw redirect("/");
  }

  const toUser = await sql`
    select *
    from users
    where id = ${userId}
    limit 1
  `.first(UserSchema);

  await sql`
    update threads
    set is_unread = false
    where to_user_id = ${toUser.id}
    and from_user_id = ${user.id}
  `.exec();

  return json({
    toUser,
    messages: await sql`
      select
        messages.*,
        row_to_json(from_user.*) as from_user,
        row_to_json(to_user.*) as to_user
      from messages
      join users from_user
        on from_user.id = messages.from_user_id
      join users to_user
        on to_user.id = messages.from_user_id
      where messages.to_user_id in (${toUser.id}, ${user.id})
      and messages.from_user_id in (${toUser.id}, ${user.id})
      order by messages.created_at desc
    `.paginate({
      page: 0,
      per: 20,
      schema: MessagesSchema.merge(
        object({
          fromUser: UserSchema,
          toUser: UserSchema,
        }),
      ),
    }),
  });
}

export async function action(ctx: DataFunctionArgs) {
  const user = await getUser(ctx);
  const formData = await ctx.request.formData();
  const body = formData.get("body");
  const userId = Number(ctx.params.userId);

  if (!body) {
    return json({}, { status: 400 });
  }

  if (user.id === userId) {
    return json({}, { status: 400 });
  }

  await sql`
    with new_message as (
      insert into messages (body, from_user_id, to_user_id)
      values (${body}, ${user.id}, ${userId})
      returning id
    ),
    receiver_thread as (
      insert into threads (to_user_id, from_user_id, last_message_id, is_unread)
      values (${user.id}, ${userId}, (select id from new_message), true)
      on conflict (to_user_id, from_user_id)
      do update set
        last_message_id = excluded.last_message_id,
        is_unread = excluded.is_unread
    )
    insert into threads (to_user_id, from_user_id, last_message_id, is_unread)
    values (${userId}, ${user.id}, (select id from new_message), false)
    on conflict (to_user_id, from_user_id)
    do update set
      last_message_id = excluded.last_message_id
  `.exec();

  realtimeActions.newMessage(user.id);

  return json({});
}

export default function () {
  const { toUser, messages } = useLiveLoader<typeof loader>();
  const fetcher = useFetcher();

  return (
    <Panel bg="foreground" id={`panel-user-${toUser.id}`}>
      <Nav partialBorder="bottom">
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
        <NavTitle>{toUser.name}</NavTitle>
      </Nav>
      <PanelContent padding="medium" scroll="vertical">
        <div className="flex flex-1 flex-col-reverse justify-start gap-0.5">
          {messages.map((message, index) => {
            const prevMessage = messages[index - 1];
            const nextMessage = messages[index + 1];
            const origin = message.toUserId === toUser.id ? "right" : "left";
            const prevOrigin =
              prevMessage?.toUserId === toUser.id ? "right" : "left";
            const separateTime =
              !nextMessage ||
              new Date(message.createdAt).getTime() -
                new Date(nextMessage?.createdAt).getTime() >
                1000 * 60 * 5;
            return (
              <div key={message.id}>
                {separateTime && (
                  <div className="text-center text-xs text-light opacity-25">
                    {dayjs(message.createdAt).format("LLL")}
                  </div>
                )}
                <Message origin={origin}>
                  <MessageBubble origin={origin}>{message.body}</MessageBubble>
                  {prevOrigin !== origin && (
                    <MessageAuthor>{message.fromUser.name}</MessageAuthor>
                  )}
                </Message>
              </div>
            );
          })}
        </div>
      </PanelContent>
      <Nav justify="center" border="top" bg="foreground">
        <fetcher.Form
          className="flex flex-1"
          action="."
          method="POST"
          onSubmit={(e) => {
            requestAnimationFrame(() => {
              (e.target as HTMLFormElement).reset();
            });
          }}
        >
          <Stack direction="row" className="flex-1">
            <InputWrap
              elevation="small"
              bg="foregroundLighter"
              className="flex-1"
              shape="circle"
            >
              <Input placeholder="Message" name="body" />
              <Button
                elevation="small"
                variant="secondary"
                bg="primary"
                shape="circle"
              >
                <ArrowRight />
              </Button>
            </InputWrap>
          </Stack>
        </fetcher.Form>
      </Nav>
    </Panel>
  );
}
