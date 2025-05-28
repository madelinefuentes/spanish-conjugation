import { openDatabaseSync } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "../../drizzle/migrations";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";

export const DATABASE_NAME = "conjugoDb.sqlite";

const expoDb = openDatabaseSync(DATABASE_NAME, { enableChangeListener: true });
export const db = drizzle(expoDb);

export function useDatabaseMigration() {
  useDrizzleStudio(expoDb);
  return useMigrations(db, migrations);
}
