import { sql } from "~/sql.server";
import { faker } from "@faker-js/faker";
import { UserSchema } from "~/models/user";
import { MessagesSchema } from "~/models/messages";

async function main() {
  await sql`drop table if exists threads`.exec();
  await sql`drop table if exists messages`.exec();
  await sql`drop table if exists users`.exec();

  await sql`
    create table users (
      id serial primary key,
      name text not null,
      email text not null
    );
  `.exec();

  await sql`
    create table messages (
      id serial primary key,
      created_at timestamp with time zone not null default now(),
      body text not null,
      from_user_id integer not null references users(id),
      to_user_id integer not null references users(id)
    );
  `.exec();

  await sql`
    create table threads (
      from_user_id integer not null references users(id),
      to_user_id integer not null references users(id),
      is_unread boolean not null default false,
      last_message_id integer not null references messages(id),
      primary key (from_user_id, to_user_id)
    );
  `.exec();

  const users = await sql`
    insert into users
    ${Array.from({ length: 100 }).map(() => {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const email = faker.internet.email({ firstName, lastName });
      return {
        name: `${firstName} ${lastName}`,
        email,
      };
    })}
    returning *
  `.all(UserSchema);

  for (let i = 0; i < 10000; i++) {
    const body = faker.lorem.sentence();
    const fromUserId = faker.helpers.arrayElement(users).id;
    const toUserId = faker.helpers.arrayElement(users).id;
    if (fromUserId === toUserId) continue;

    await sql`
      with new_message as (
        insert into messages (body, from_user_id, to_user_id, created_at)
        values (${body}, ${fromUserId}, ${toUserId}, now() - '1 hour'::interval * random() * 1000)
        returning id
      ),
      receiver_thread as (
        insert into threads (to_user_id, from_user_id, last_message_id, is_unread)
        values (${fromUserId}, ${toUserId}, (select id from new_message), true)
        on conflict (to_user_id, from_user_id)
        do update set
          last_message_id = excluded.last_message_id,
          is_unread = excluded.is_unread
      )
      insert into threads (to_user_id, from_user_id, last_message_id, is_unread)
      values (${toUserId}, ${fromUserId}, (select id from new_message), false)
      on conflict (to_user_id, from_user_id)
      do update set
        last_message_id = excluded.last_message_id
    `.exec();
  }

  await sql`
    update threads
    set last_message_id = (
      select id
      from messages
      where messages.from_user_id in (threads.from_user_id, threads.to_user_id)
      and messages.to_user_id in (threads.from_user_id, threads.to_user_id)
      order by created_at desc
      limit 1
    )
  `.exec();
}

main()
  .then(() => {
    process.exit(1);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
