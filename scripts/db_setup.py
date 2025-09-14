# db_setup.py
import sqlite3
from pathlib import Path

DB_PATH = Path("conjugations.db")

DDL = """
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS tenses (
  id TEXT PRIMARY KEY,               -- e.g. "ind_pres"
  name_es TEXT NOT NULL,             -- "Presente"
  name_en TEXT NOT NULL,             -- "Present"
  mood    TEXT NOT NULL,             -- "indicative" | "subjunctive" | "imperative" | "periphrastic"
  description TEXT
);

CREATE TABLE IF NOT EXISTS verbs (
  id INTEGER PRIMARY KEY,
  infinitive TEXT NOT NULL UNIQUE,   -- "ser"
  meaning    TEXT,                   -- "to be (essential/permanent)"
  type       TEXT,                   -- "regular" / "irregular" / etc.
  frequency  REAL DEFAULT 0,
  participle_es TEXT,
  participle_en TEXT,
  gerund_es    TEXT,
  gerund_en    TEXT
);

CREATE TABLE IF NOT EXISTS conjugations (
  id INTEGER PRIMARY KEY,
  verb_id   INTEGER NOT NULL REFERENCES verbs(id),
  tense_id  TEXT    NOT NULL REFERENCES tenses(id),
  person    TEXT    NOT NULL,        -- "yo","tú","ud","él","ella","nos","uds","ellos","ellas"
  es_form   TEXT    NOT NULL,
  en_form   TEXT
);

CREATE TABLE IF NOT EXISTS srs_reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  conjugation_id INTEGER NOT NULL REFERENCES conjugations(id),
  due_at INTEGER NOT NULL,          -- unix timestamp
  stability INTEGER NOT NULL,
  difficulty INTEGER NOT NULL,
  scheduled_days INTEGER NOT NULL,
  learning_steps INTEGER NOT NULL,
  reps INTEGER NOT NULL,
  lapses INTEGER NOT NULL,
  state TEXT NOT NULL,              -- e.g. 'learning', 'review'
  last_review_at INTEGER
);

CREATE INDEX IF NOT EXISTS idx_conj_lookup
  ON conjugations(verb_id, tense_id);
"""

def ensure_db(db_path=DB_PATH):
    db_path.parent.mkdir(parents=True, exist_ok=True)
    with sqlite3.connect(db_path) as conn:
        conn.executescript(DDL)
        conn.commit()

def get_conn(db_path=DB_PATH):
    conn = sqlite3.connect(db_path)
    conn.execute("PRAGMA foreign_keys=ON;")
    conn.execute("PRAGMA journal_mode=WAL;")
    return conn

def upsert_tense(conn, tense_id, name_es, name_en, mood, description=None):
    conn.execute(
        """
        INSERT INTO tenses (id, name_es, name_en, mood, description)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          name_es    = excluded.name_es,
          name_en    = excluded.name_en,
          mood       = excluded.mood,
          description= excluded.description
        """,
        (tense_id, name_es, name_en, mood, description)
    )

def upsert_verb(
    conn,
    infinitive,
    meaning=None,
    type=None,
    frequency=0.0,
    participle_es=None,
    participle_en=None,
    gerund_es=None,
    gerund_en=None,
):
    conn.execute(
        """
        INSERT INTO verbs (infinitive, meaning, type, frequency,
                           participle_es, participle_en, gerund_es, gerund_en)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(infinitive) DO UPDATE SET
          meaning       = COALESCE(excluded.meaning, verbs.meaning),
          type          = COALESCE(excluded.type, verbs.type),
          frequency     = MAX(verbs.frequency, excluded.frequency),
          participle_es = COALESCE(NULLIF(excluded.participle_es,''), verbs.participle_es),
          participle_en = COALESCE(NULLIF(excluded.participle_en,''), verbs.participle_en),
          gerund_es     = COALESCE(NULLIF(excluded.gerund_es,''), verbs.gerund_es),
          gerund_en     = COALESCE(NULLIF(excluded.gerund_en,''), verbs.gerund_en)
        """,
        (
            infinitive.strip().lower(),
            meaning,
            type,
            float(frequency),
            participle_es,
            participle_en,
            gerund_es,
            gerund_en,
        ),
    )
    row = conn.execute(
        "SELECT id FROM verbs WHERE infinitive = ?",
        (infinitive.strip().lower(),),
    ).fetchone()
    return int(row[0])

def upsert_conjugation(conn, verb_id, tense_id, person, es_form, en_form=None):
    conn.execute(
        """
        INSERT INTO conjugations (verb_id, tense_id, person, es_form, en_form)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(verb_id, tense_id, person) DO UPDATE SET
          es_form = excluded.es_form,
          en_form = COALESCE(NULLIF(excluded.en_form, ''), conjugations.en_form)
        """,
        (verb_id, tense_id, person, es_form, en_form)
    )

if __name__ == "__main__":
    ensure_db()
    print(f"created {DB_PATH.resolve()}")
