import pandas as pd
from mlconjug3 import Conjugator
from deep_translator import GoogleTranslator
import os
from dotenv import load_dotenv
import deepl
import json

load_dotenv()
auth_key = os.getenv("DEEPL_API_KEY")

deepl_client  = deepl.DeepLClient(auth_key)
translator = GoogleTranslator(source='es', target='en')
conjugator = Conjugator(language='es')

df = pd.read_csv("common-spanish-verbs.csv").sample(50, random_state=42)

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
    "present": ("Indicativo", "Indicativo presente"),
    "preterite": ("Indicativo", "Indicativo pretérito perfecto simple"),
    "imperfect": ("Indicativo", "Indicativo pretérito imperfecto"),
    "future": ("Indicativo", "Indicativo futuro"),
    "conditional": ("Condicional", "Condicional Condicional")
}

ir_conjugation = conjugator.conjugate("ir")

output = []

for _, row in df.iterrows():
    verb = row["Verb"].lower()
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

        for tense_key, (mood, tense_name) in tenses_map.items():
            try:
                tense_data = conjugation.conjug_info[mood][tense_name]
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
                            context = f"Pronoun: {custom_pronoun}\nInfinitive: {verb}\nTense: {tense_name}\nMood: Indicativo"
                            translation = translator.translate(full_spanish)
                            # translation = deepl_client.translate_text(full_spanish, source_lang='ES', target_lang='EN-US', context=context)
                            # print(f"{full_spanish} → {translation}")
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

        # informal_future_block = {}
        # ir_present = ir_conjugation.conjug_info['Indicativo']['Indicativo presente']

        # for ml_pronoun, ir_form in ir_present.items():
        #     if ml_pronoun not in ml_to_custom_pronouns:
        #         continue

        #     for custom_pronoun in ml_to_custom_pronouns[ml_pronoun]:
        #         if is_reflexive:
        #             reflexive = reflexive_pronouns[custom_pronoun]
        #             full_spanish = f"{custom_pronoun} {reflexive} va a {base_verb}"
        #         else:
        #             full_spanish = f"{ir_form} a {base_verb}"

        #         try:
        #             translation = translator.translate(full_spanish)
        #             # translation = deepl_client.translate_text(full_spanish, source_lang='ES', target_lang='EN-US')
        #         except Exception as e:
        #             translation = ""

        #         informal_future_block[custom_pronoun] = {
        #             "conjugation": full_spanish,
        #             "translation": translation
        #         }

        # entry["conjugations"]["indicative"]["informal_future"] = informal_future_block

        output.append(entry)
        # print(entry)
        print(f"Completed verb: {verb}")

    except Exception as e:
        print(f"Error with verb '{verb}': {e}")

with open("conjugated_verbs.json", "w", encoding="utf-8") as f:
    json.dump(output, f, ensure_ascii=False, indent=2)
