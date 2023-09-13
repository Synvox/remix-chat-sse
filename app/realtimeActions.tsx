import { EventEmitter } from "events";

// If this app ran on multiple servers, we would need to use a distributed
// pub/sub system like Redis. But for this example, we can use a simple
// EventEmitter.
export const emitter = new EventEmitter();

export const realtimeActions = {
  newMessage: (fromUserId: number, toUserId: number) => {
    emitter.emit("/", { userId: toUserId });
    emitter.emit(`/${fromUserId}`, { userId: toUserId });
  },
};
