import { EventEmitter } from "events";

export const emitter = new EventEmitter();

export const realtimeActions = {
  newMessage: (userId: number) => {
    emitter.emit("/");
    emitter.emit(`/${userId}`);
  },
};
