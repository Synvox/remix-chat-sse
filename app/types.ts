export type Migration = {
  id: number;
  name: string;
  batch: number;
  migratedAt: Date;
};

export type MigrationsLock = {
  isLocked: boolean;
};
