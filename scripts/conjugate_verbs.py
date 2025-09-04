from db_setup import ensure_db, get_conn, upsert_verb, upsert_conjugation
import pandas as pd
# from mlconjug3 import Conjugator
from verbecc import Conjugator
from wordfreq import word_frequency
from deep_translator import GoogleTranslator

conjugator = Conjugator(lang='es')
translator = GoogleTranslator(source='es', target='en')

TENSES = [
    # Indicative — simple
    ("Indicative", "Present", "indicativo", "presente"),
    ("Indicative", "Preterite", "indicativo", "pretérito-perfecto-simple"),
    ("Indicative", "Imperfect", "indicativo", "pretérito-imperfecto"),
    ("Indicative", "Future", "indicativo", "futuro"),
    ("Indicative", "Conditional Present", "condicional","presente"),  # cond. simple

    # Indicative — perfects
    ("Indicative", "Present Perfect", "indicativo", "pretérito-perfecto-compuesto"),
    ("Indicative", "Past Perfect", "indicativo", "pretérito-pluscuamperfecto"),
    ("Indicative", "Future Perfect", "indicativo", "futuro-perfecto"),
    ("Indicative", "Conditional Perfect", "condicional","perfecto"),  # cond. compuesto

    # Subjunctive
    ("Subjunctive", "Present", "subjuntivo", "presente"),
    ("Subjunctive", "Imperfect", "subjuntivo", "pretérito-imperfecto-1"),  # -ra form
    ("Subjunctive", "Present Perfect", "subjuntivo", "pretérito-perfecto"),
    ("Subjunctive", "Past Perfect", "subjuntivo", "pretérito-pluscuamperfecto-1"),

    # Imperative
    ("Imperative", "Affirmative", "imperativo", "afirmativo"),
    ("Imperative", "Negative", "imperativo", "negativo"),
]

PRONOUNS = {
    "yo": ["yo"],
    "tú": ["tú"],
    "él": ["él", "ella", "usted"],
    "nosotros": ["nosotros"],
    "ellos": ["ellos", "ellas", "ustedes"],
}

REFLEXIVE_PRONOUNS = {
    "yo": "me",
    "tú": "te",
    "él": "se",
    "ella": "se",
    "usted": "se",
    "nosotros": "nos",
    "ellos": "se",
    "ellas": "se",
    "ustedes": "se"
}

def third_person_singular_present(info):
    forms = info.get("indicativo", {}).get("presente", [])

    for item in forms:
        parts = item.strip().split(" ", 1)

        if len(parts) != 2:
            continue

        pronoun, verb_form = parts
        if pronoun == "él":
            return verb_form.strip()
    return None

def generate_and_insert(conn, verb, meaning, type):
    is_reflexive = verb.endswith("se")
    base = verb[:-2] if is_reflexive else verb

    info = conjugator.conjugate(base)["moods"]

    freq_token = third_person_singular_present(info)
    freq = word_frequency(freq_token, "es") if freq_token else 0.0
    verb_id = upsert_verb(conn, verb, meaning, type, freq)

    for (mood_en, tense_en, mood_es, tense_es) in TENSES:
        tense_data = info.get(mood_es, {}).get(tense_es, [])
        if not tense_data:
            continue

        if mood_es == "imperativo":
            persons = ["tú", "usted", "nosotros", "vosotros", "ustedes"]

            for person, conj in zip(persons, tense_data):
                if person == "vosotros":
                    continue

                if is_reflexive:
                    cl = REFLEXIVE_PRONOUNS[person]
                    # doesn't handle accent rule
                    if tense_en == "Affirmative":
                        if person == "nosotros" and conj.endswith("mos"):
                            conj = conj[:-1] + cl         # "...mos" -> "...monos"
                        else:
                            conj = conj + cl              # e.g., "lava" -> "lavate"
                    else:  # Negative imperative
                        if conj.startswith("no "):
                            conj = "no " + cl + " " + conj[3:]
                        else:
                            conj = "no " + cl + " " + conj

                translation = translator.translate(person + " " + conj)

                upsert_conjugation(
                    conn,
                    verb_id,
                    mood=mood_en,
                    tense=tense_en,
                    person=person,
                    es_form=conj,
                    en_form=translation
                )
        else:
            for full_es in tense_data:
                pronoun, conj = full_es.split(" ", 1)

                if pronoun not in PRONOUNS:
                    continue

                for person in PRONOUNS[pronoun]:
                    es_form = conj
                    if is_reflexive:
                        cl = REFLEXIVE_PRONOUNS[person]
                        es_form = cl + " " + conj

                    translation = translator.translate(person + " " + es_form)

                    upsert_conjugation(
                        conn,
                        verb_id,
                        mood=mood_en,
                        tense=tense_en,
                        person=person,
                        es_form=es_form,
                        en_form=translation
                    )

    print(f"inserted {verb} (id={verb_id}, freq={freq:.6f})")

if __name__ == "__main__":
    ensure_db()
    sample_size = 2
    df = pd.read_csv("common-spanish-verbs.csv").head(sample_size)

    with get_conn() as conn:
        for _, row in df.iterrows():
            verb = row["Verb"].lower().strip()
            meaning = row.get("Translation")
            type = row.get("Irregularity")
            generate_and_insert(conn, verb, meaning, type)
        conn.commit()
