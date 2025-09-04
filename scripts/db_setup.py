# db_setup.py
import sqlite3
from pathlib import Path

DB_PATH = Path("conjugations.db")

DDL = """
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS verbs (
  id INTEGER PRIMARY KEY,
  infinitive TEXT NOT NULL UNIQUE,   -- e.g. "esperar"
  meaning    TEXT,                   -- e.g. "to hope; to wait"
  type       TEXT,                   -- e.g. "Regular" / "Irregular"
  frequency  REAL DEFAULT 0
  participle_es TEXT,                -- "esperado"
  participle_en TEXT,                -- "hoped"
  gerund_es    TEXT,                 -- "esperando"
  gerund_en    TEXT                  -- "hoping"
);

CREATE TABLE IF NOT EXISTS conjugations (
  id INTEGER PRIMARY KEY,
  verb_id  INTEGER NOT NULL REFERENCES verbs(id),
  mood     TEXT NOT NULL,            -- e.g. "Indicativo"
  tense    TEXT NOT NULL,            -- e.g. "present" | "preterite"
  person   TEXT NOT NULL,            -- pronoun
  es_form  TEXT NOT NULL,            -- "espero"
  en_form  TEXT,                     -- "I hope"
  UNIQUE (verb_id, mood, tense, person)
);

CREATE INDEX IF NOT EXISTS idx_conj_lookup
  ON conjugations(verb_id, mood, tense);
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

def upsert_conjugation(conn, verb_id, mood, tense, person, es_form, en_form=None):
    conn.execute(
        """
        INSERT INTO conjugations (verb_id, mood, tense, person, es_form, en_form)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(verb_id, mood, tense, person) DO UPDATE SET
          es_form = excluded.es_form,
          en_form = COALESCE(NULLIF(excluded.en_form, ''), conjugations.en_form)
        """,
        (verb_id, mood, tense, person, es_form, en_form)
    )

if __name__ == "__main__":
    ensure_db()
    print(f"✅ created {DB_PATH.resolve()}")
