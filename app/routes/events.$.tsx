import type { DataFunctionArgs } from "@remix-run/node";
import { eventStream } from "remix-utils";
import { getUser } from "~/models/user";

import { emitter } from "~/realtimeActions";

export async function loader(ctx: DataFunctionArgs) {
  const user = await getUser(ctx);
  const path = `/${ctx.params["*"]}`;

  return eventStream(ctx.request.signal, (send) => {
    const handler = ({ userId }: { userId: number }) => {
      if (userId === user.id) send({ data: Date.now().toString() });
    };

    emitter.addListener(path, handler);
    return () => {
      emitter.removeListener(path, handler);
    };
  });
}
