# scripts.py
from db_setup import ensure_db, get_conn, upsert_verb, upsert_conjugation
import pandas as pd
from wordfreq import word_frequency
from deep_translator import GoogleTranslator

translator = GoogleTranslator(source="es", target="en")

# person columns expected in conjugations.csv
PERSON_COLS = ["1s", "2s", "3s", "1p", "3p"]

# expand CSV person columns to stored pronouns
PERSON_EXPANSION = {
    "1s": ["yo"],
    "2s": ["tú"],
    "3s": ["él", "ella", "usted"],
    "1p": ["nosotros"],
    "3p": ["ellos", "ellas", "ustedes"],
}

# reflexive clitics by pronoun
REFLEXIVE_CLITIC = {
    "yo": "me",
    "tú": "te",
    "él": "se",
    "ella": "se",
    "usted": "se",
    "nosotros": "nos",
    "ellos": "se",
    "ellas": "se",
    "ustedes": "se",
}

def is_nonempty(x):
    if x is None:
        return False
    if isinstance(x, float) and pd.isna(x):
        return False
    return str(x) != ""

def add_reflexive_if_needed(infinitive, pronoun, form):
    if infinitive.endswith("se"):
        return f"{REFLEXIVE_CLITIC[pronoun]} {form}"
    return form

def translate(text):
    try:
        return translator.translate(text)
    except Exception:
        return "" 


def compute_frequency_from_rows(rows):
    # use 3s of (Mood='Indicative', Tense='Present') if present, else 0.0
    try:
        match = rows[(rows["Mood"] == "Indicative") & (rows["Tense"] == "Present")].head(1)
        if not match.empty:
            token = match.iloc[0]["3s"]
            if is_nonempty(token):
                return float(word_frequency(str(token), "es"))
    except Exception:
        pass
    return 0.0


def load_common_verbs(path):
    df = pd.read_csv(path)
    for col in ["Infinitive", "Meaning", "Type", "Participle_ES", "Participle_EN", "Gerund_ES", "Gerund_EN"]:
        if col not in df.columns:
            df[col] = ""
    return df


def load_conjugations(path):
    df = pd.read_csv(path)

    for col in ["Infinitive", "Mood", "Tense"] + PERSON_COLS:
        if col not in df.columns:
            df[col] = ""

    return df


def upsert_all(conn, verbs_df, conj_df, sample_size):
    # group conjugations by infinitive
    conj_by_inf = conj_df.groupby("Infinitive", dropna=False)

    infinitives = set(verbs_df["Infinitive"].tolist())

    count = 0
    for infinitive in sorted(infinitives, key=lambda x: ("" if x is None else str(x))):
        if sample_size is not None and count >= sample_size:
            break
        count += 1

        meta = verbs_df[verbs_df["Infinitive"] == infinitive].head(1)
        meaning = meta.iloc[0]["Meaning"] if not meta.empty else ""
        vtype = meta.iloc[0]["Type"] if not meta.empty else ""
        participle_es = meta.iloc[0]["Participle_ES"] if not meta.empty else ""
        participle_en = meta.iloc[0]["Participle_EN"] if not meta.empty else ""
        gerund_es = meta.iloc[0]["Gerund_ES"] if not meta.empty else ""
        gerund_en = meta.iloc[0]["Gerund_EN"] if not meta.empty else ""

        try:
            rows = conj_by_inf.get_group(infinitive)
        except KeyError:
            rows = pd.DataFrame(columns=["Mood", "Tense"] + PERSON_COLS)

        # frequency from 3s Indicative Present if available
        freq = compute_frequency_from_rows(rows) if not rows.empty else 0.0

        # upsert verb 
        verb_id = upsert_verb(
            conn,
            infinitive=infinitive,
            meaning=meaning if is_nonempty(meaning) else None,
            type=vtype if is_nonempty(vtype) else None,
            frequency=freq,
            participle_es=participle_es,
            participle_en=participle_en,
            gerund_es=gerund_es,
            gerund_en=gerund_en,
        )

        # upsert conjugations
        if not rows.empty:
            for _, r in rows.iterrows():
                mood = r["Mood"]
                tense = r["Tense"]

                for person_col in PERSON_COLS:
                    base_form = r.get(person_col, "")
                    if not is_nonempty(base_form) or base_form == "-":
                        continue

                    for pronoun in PERSON_EXPANSION[person_col]:
                        es_form = add_reflexive_if_needed(infinitive, pronoun, str(base_form))
                        en_form = translate(f"{pronoun} {es_form}")

                        upsert_conjugation(
                            conn,
                            verb_id=verb_id,
                            mood=str(mood),
                            tense=str(tense),
                            person=pronoun,
                            es_form=es_form,
                            en_form=en_form,
                        )

        print(f"inserted {infinitive} (id={verb_id}, freq={freq:.6f})")


if __name__ == "__main__":
    ensure_db()

    VERBS_CSV = "common-spanish-verbs.csv"
    CONJ_CSV = "conjugations.csv"
    SAMPLE_SIZE = 5

    verbs_df = load_common_verbs(VERBS_CSV)
    conj_df = load_conjugations(CONJ_CSV)

    with get_conn() as conn:
        upsert_all(conn, verbs_df, conj_df, sample_size=SAMPLE_SIZE)
        conn.commit()
