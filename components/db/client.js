import { openDatabaseSync } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "../../drizzle/migrations";
// import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { useSQLiteDevTools } from "expo-sqlite-devtools";

export const DATABASE_NAME = "conjugoDb.sqlite";

const expoDb = openDatabaseSync(DATABASE_NAME, { enableChangeListener: true });
export const db = drizzle(expoDb);

export function useDatabaseMigration() {
  useSQLiteDevTools(expoDb);
  return useMigrations(db, migrations);
}

export const clearDatabase = async () => {
  try {
    await expoDb.execAsync(`
      PRAGMA foreign_keys = OFF;

      BEGIN TRANSACTION;
      DELETE FROM verbs;
      DELETE FROM conjugations;
      DELETE FROM srs_reviews;
      COMMIT;

      PRAGMA foreign_keys = ON;
    `);
    console.log("Database cleared!");
  } catch (error) {
    console.log("Error", "Failed to clear the database.");
  }
};
