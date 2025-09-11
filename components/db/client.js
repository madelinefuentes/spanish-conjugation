// app/db/client.js
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import { openDatabaseSync } from "expo-sqlite";
import { drizzle as createDrizzle } from "drizzle-orm/expo-sqlite";
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

  const asset = Asset.fromModule(require("../../assets/conjugations.db"));
  await asset.downloadAsync();
  if (!asset.localUri) throw new Error("Could not resolve bundled DB asset");
  await FileSystem.copyAsync({ from: asset.localUri, to: DB_PATH });
}

let expoDb = null;
let drizzleClient = null;

// call once at app startup
export async function initDb() {
  if (drizzleClient) return drizzleClient;

  await ensureBundledDb();

  expoDb = openDatabaseSync(DATABASE_NAME, { enableChangeListener: true });

  try {
    expoDb.execSync("PRAGMA foreign_keys=ON;");
    expoDb.execSync("PRAGMA journal_mode=WAL;");
  } catch (e) {}

  drizzleClient = createDrizzle(expoDb);
  return drizzleClient;
}

// after initDb()
export function getDb() {
  if (!drizzleClient) throw new Error("Called initDb() before getDb()");
  return drizzleClient;
}

export function useDatabaseMigration() {
  if (!expoDb || !drizzleClient) {
    throw new Error("Called initDb() before useDatabaseMigration()");
  }
  useDrizzleStudio(expoDb);
  return useMigrations(drizzleClient, migrations);
}

export async function clearDatabase() {
  if (!expoDb) throw new Error("Call initDb() before clearDatabase()");
  try {
    await expoDb.execAsync(`
      PRAGMA foreign_keys = OFF;
      BEGIN IMMEDIATE;
      DELETE FROM verbs;
      DELETE FROM conjugations;
      DELETE FROM srs_reviews;
      COMMIT;
      PRAGMA foreign_keys = ON;
    `);

    console.log("Database cleared!");
  } catch (error) {
    console.log("Error", "Failed to clear the database.", error);
  }
}
