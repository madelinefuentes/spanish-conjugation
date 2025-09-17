import { openDatabaseSync } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "../../drizzle/migrations";

export const PRESET_DB_NAME = "conjugations.db"; // asset-copied by SQLiteProvider
export const USER_DB_NAME = "userData.sqlite"; // app-writable

const presetSqlite = openDatabaseSync(PRESET_DB_NAME, {
  enableChangeListener: true,
});
const userSqlite = openDatabaseSync(USER_DB_NAME, {
  enableChangeListener: true,
});

export const presetDb = drizzle(presetSqlite);
export const userDb = drizzle(userSqlite);

export const useUserDatabaseMigration = () => {
  return useMigrations(userDb, migrations);
};
