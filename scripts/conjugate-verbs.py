import pandas as pd
from mlconjug3 import Conjugator
from deep_translator import GoogleTranslator
import os
from dotenv import load_dotenv
import deepl

load_dotenv()
auth_key = os.getenv("DEEPL_API_KEY")

deepl_client  = deepl.DeepLClient(auth_key)
translator = GoogleTranslator(source='es', target='en')
conjugator = Conjugator(language='es')

df = pd.read_csv("common-spanish-verbs.csv").head(1)

ml_to_custom_pronouns = {
    'yo': ['yo'],
    'tú': ['tú'],
    'él': ['él', 'ella', 'usted'],
    'nosotros': ['nosotros'],
    'ellos': ['ellos', 'ellas', 'ustedes']
}

reflexive_pronouns = {
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

# 4 main tenses
tenses_map = {
    "present": "Indicativo presente",
    "preterite": "Indicativo pretérito perfecto simple",
    "imperfect": "Indicativo pretérito imperfecto",
    "future": "Indicativo futuro"
}

output = []

for _, row in df.iterrows():
    verb = row["Verb"]
    meaning = row["Translation"]
    vtype = row["Irregularity"]

    is_reflexive = verb.endswith("se")
    base_verb = verb[:-2] if is_reflexive else verb

    try:
        conjugation = conjugator.conjugate(base_verb)
        entry = {
            "infinitive": verb,
            "meaning": meaning,
            "type": vtype,
            "conjugations": {
                "indicative": {}
            }
        }

        for tense_key, tense_name in tenses_map.items():
            try:
                tense_data = conjugation.conjug_info['Indicativo'][tense_name]
                tense_block = {}

                for ml_pronoun, conj_form in tense_data.items():
                    if ml_pronoun not in ml_to_custom_pronouns:
                        continue

                    for custom_pronoun in ml_to_custom_pronouns[ml_pronoun]:
                        if is_reflexive:
                            reflexive = reflexive_pronouns[custom_pronoun]
                            full_spanish = f"{reflexive} {conj_form}"
                        else:
                            full_spanish = f"{custom_pronoun} {conj_form}"

                        try:
                            translation = deepl_client.translate_text(full_spanish, source_lang='ES', target_lang='EN-US', glossary='abandon')
                            print(f"{full_spanish} → {translation}")
                        except Exception as e:
                            print(f"Error translating': {e}")

                        if custom_pronoun not in tense_block:
                            tense_block[custom_pronoun] = {
                                "conjugation": conj_form,
                                "translation": translation
                            }

                entry["conjugations"]["indicative"][tense_key] = tense_block

            except Exception as e:
                print(f"Error with tense '{tense_name}' and '{verb}': {e}")

        output.append(entry)

    except Exception as e:
        print(f"Error with verb '{verb}': {e}")

# print(json.dumps(output, indent=2, ensure_ascii=False))
