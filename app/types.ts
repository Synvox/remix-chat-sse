export type Migration = {
  id: number;
  name: string;
  batch: number;
  migratedAt: Date;
};

export type MigrationsLock = {
  isLocked: boolean;
};

export type Message = {
  id: number;
  createdAt: Date;
  body: string;
  fromUserId: number;
  toUserId: number;
};

export type Thread = {
  fromUserId: number;
  toUserId: number;
  isUnread: boolean;
  lastMessageId: number;
};

export type User = {
  id: number;
  name: string;
  email: string;
};
