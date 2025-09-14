import json
from db_setup import get_conn, ensure_db, upsert_tense, upsert_verb, upsert_conjugation
from wordfreq import word_frequency
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
TENSES_FILE = BASE_DIR / "tenses.json"
VERBS_DIR = BASE_DIR / "verbs"

def load_tenses(conn):
    with open(TENSES_FILE, "r", encoding="utf-8") as f:
        tenses = json.load(f)
    for t in tenses:
        upsert_tense(
            conn,
            tense_id=t["id"],
            name_es=t["name_es"],
            name_en=t["name_en"],
            mood=t["mood"],
            description=t.get("description")
        )

def pick_freq_form(conj):
    form = (conj.get("ind_pres", {}) or {}).get("él", {}) or {}
    if form.get("es"):
        return form["es"]

    return None  

def load_verbs(conn):
    for path in sorted(VERBS_DIR.glob("verbs_*.json")):
        with open(path, "r", encoding="utf-8") as f:
            verbs = json.load(f)

        for v in verbs:
            conj = v.get("conjugations", {}) or {}

            form = pick_freq_form(conj)
            freq = word_frequency(form, "es") if form else 0.0

            verb_id = upsert_verb(
                conn,
                infinitive=v["infinitive_es"],
                meaning=v.get("meaning_en"),
                type=v.get("type"),
                frequency=freq,
                participle_es=v.get("participle_es"),
                participle_en=v.get("participle_en"),
                gerund_es=v.get("gerund_es"),
                gerund_en=v.get("gerund_en"),
            )

            for tense_id, forms in conj.items():
                for person, pair in (forms or {}).items():
                    es_form = (pair or {}).get("es")
                    if not es_form:
                        continue
                    en_form = pair.get("en")
                    upsert_conjugation(conn, verb_id, tense_id, person, es_form, en_form)

def main():
    ensure_db()
    with get_conn() as conn:
        load_tenses(conn)
        load_verbs(conn)
        conn.commit()
    print("Data load complete")

if __name__ == "__main__":
    main()
