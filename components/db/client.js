// app/db/client.js
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import { openDatabaseSync } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "../../drizzle/migrations";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";

export const DATABASE_NAME = "conjugations.db";

const SQLITE_DIR = FileSystem.documentDirectory + "SQLite/";
const DB_PATH = SQLITE_DIR + DATABASE_NAME;

export async function ensureBundledDb() {
  const exists = await FileSystem.getInfoAsync(DB_PATH);
  if (exists.exists) return;

  const dirInfo = await FileSystem.getInfoAsync(SQLITE_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(SQLITE_DIR, { intermediates: true });
  }

  const asset = Asset.fromModule(require("../assets/conjugations.db"));
  await asset.downloadAsync();
  if (!asset.localUri) throw new Error("Could not resolve bundled DB asset");
  await FileSystem.copyAsync({ from: asset.localUri, to: DB_PATH });
}

let expoDb = null;
let drizzle = null;

// call this once on app startup (before using the db anywhere)
export async function initDb() {
  if (drizzle) return drizzle;

  await ensureBundledDb();

  expoDb = openDatabaseSync(DATABASE_NAME, { enableChangeListener: true });

  try {
    expoDb.execSync("PRAGMA foreign_keys=ON;");
    expoDb.execSync("PRAGMA journal_mode=WAL;");
  } catch (e) {
    // ignore if not supported in env
  }

  drizzle = drizzle(expoDb);
  return drizzle;
}

// use this if you need a reference after initDb() has run
export function getDb() {
  if (!drizzle) throw new Error("Call initDb() once before getDb()");
  return drizzle;
}

export function useDatabaseMigration() {
  if (!expoDb || !drizzle) {
    throw new Error("Call initDb() before useDatabaseMigration()");
  }
  useDrizzleStudio(expoDb);
  return useMigrations(drizzle, migrations);
}

export async function clearDatabase() {
  if (!expoDb) throw new Error("Call initDb() before clearDatabase()");
  try {
    await expoDb.execAsync(`
      PRAGMA foreign_keys = OFF;
      BEGIN IMMEDIATE;
      DELETE FROM verbs;
      DELETE FROM conjugations;
      DELETE FROM srs_reviews
      COMMIT;
      PRAGMA foreign_keys = ON;
    `);
    try {
      await expoDb.execAsync(`DELETE FROM srs_reviews;`);
    } catch {}
    console.log("Database cleared!");
  } catch (error) {
    console.log("Error", "Failed to clear the database.", error);
  }
}
