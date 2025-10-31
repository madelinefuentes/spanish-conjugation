import { openDatabaseSync, useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "../../drizzle/migrations";
import { useEffect } from "react";

export const PRESET_DB_NAME = "conjugations.db"; // asset-copied by SQLiteProvider
export const USER_DB_NAME = "userData-v2.sqlite"; // app-writable

const userSqlite = openDatabaseSync(USER_DB_NAME, {
  enableChangeListener: true,
});

export const userDb = drizzle(userSqlite);

export const useUserDatabaseMigration = () => {
  return useMigrations(userDb, migrations);
};

let _presetDb = null;

export const presetDb = () => {
  if (!_presetDb) throw new Error("presetDb not initialized yet");
  return _presetDb;
};

export const PresetDbInitializer = () => {
  const sqlite = useSQLiteContext();

  useEffect(() => {
    _presetDb = drizzle(sqlite);
  }, [sqlite]);

  return null;
};
