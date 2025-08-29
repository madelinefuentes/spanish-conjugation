from db_setup import ensure_db, get_conn, upsert_verb, upsert_conjugation
import pandas as pd
from mlconjug3 import Conjugator

conjugator = Conjugator(language='es')

TENSES = {
    # Indicative
    "Present": ("Indicativo", "Indicativo Presente"),
    "Preterite": ("Indicativo", "Indicativo pretérito perfecto simple"),
    "Imperfect": ("Indicativo", "Indicativo Pretérito imperfecto"),
    "Future": ("Indicativo", "Indicativo futuro"),
    "Conditional": ("Condicional", "Condicional Condicional"),

    # "Present Perfect": ("Indicativo", "Indicativo Pretérito perfecto compuesto"),
    # "Past Perfect": ("Indicativo", "Indicativo Pretérito pluscuamperfecto"),
    # "Future Perfect": ("Indicativo", "Indicativo Futuro perfecto"),
    # "Conditional Perfect": ("Condicional", "Condicional perfecto"),

    # # Subjunctive
    # "Subjunctive Present": ("Subjuntivo", "Subjuntivo Presente"),
    # "Subjunctive Imperfect": ("Subjuntivo", "Subjuntivo Pretérito imperfecto 1"), 
    # "Subjunctive Present Perfect": ("Subjuntivo", "Subjuntivo Pretérito perfecto"),
    # "Subjunctive Past Perfect": ("Subjuntivo", "Subjuntivo Pretérito pluscuamperfecto 1"),

    # # Imperative
    # "Imperative Affirmative": ("Imperativo", "Imperativo Afirmativo"),
}

ML_PRONOUNS = {
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

def generate_and_insert(verb, meaning, type):
    is_reflexive = verb.endswith("se")
    base = verb[:-2] if is_reflexive else verb

    cj = conjugator.conjugate(base)
    info = cj.conjug_info

    # ensure_db()

    for tense_en, (mood_es, tense_es) in TENSES.items():
        tense_data = info[mood_es][tense_es]

        for ml_pronoun, conj_form in tense_data.items():
            if ml_pronoun not in ML_PRONOUNS:
                continue

            if (conj_form is not None):
                print(ml_pronoun + " " + conj_form)

if __name__ == "__main__":
    sample_size = 20
    df = pd.read_csv("common-spanish-verbs.csv").head(1)

    for _, row in df.iterrows():
        verb = row["Verb"].lower()
        meaning = row["Translation"]
        type = row["Irregularity"]

        generate_and_insert(verb, meaning, type)
