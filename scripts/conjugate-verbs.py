import os
import json
import pandas as pd
from dotenv import load_dotenv
from mlconjug3 import Conjugator
from deep_translator import GoogleTranslator
from wordfreq import word_frequency
# from deepl import DeepLClient  

load_dotenv()
# auth_key = os.getenv("DEEPL_API_KEY")
# deepl_client = DeepLClient(auth_key)

translator = GoogleTranslator(source='es', target='en')
conjugator = Conjugator(language='es')

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

tenses_map = {
    "present": ("Indicativo", "Indicativo presente"),
    "preterite": ("Indicativo", "Indicativo pretérito perfecto simple"),
    "imperfect": ("Indicativo", "Indicativo pretérito imperfecto"),
    "future": ("Indicativo", "Indicativo futuro"),
    "conditional": ("Condicional", "Condicional Condicional")
}

def generate_conjugation_data(input_csv: str, output_json: str, sample_size: int = 50):
    df = pd.read_csv(input_csv).sample(sample_size, random_state=42)
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
                                translation = translator.translate(full_spanish)
                            except Exception as e:
                                print(f"Translation error for '{full_spanish}': {e}")
                                translation = ""

                            if custom_pronoun not in tense_block:
                                tense_block[custom_pronoun] = {
                                    "conjugation": conj_form,
                                    "translation": translation
                                }

                    entry["conjugations"]["indicative"][tense_key] = tense_block

                except Exception as e:
                    print(f"Error with tense '{tense_name}' for verb '{verb}': {e}")

            output.append(entry)
            print(f"Completed verb: {verb}")

        except Exception as e:
            print(f"Error with verb '{verb}': {e}")

    with open(output_json, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"\nSaved conjugated data to {output_json}")


def add_frequency_to_json(json_path: str) -> None:
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    for entry in data:
        conjugations = entry.get("conjugations", {})
        indicative = conjugations.get("indicative", {})
        present_tense = indicative.get("present", {})
        third_person_entry = present_tense.get("él", {})
        conjugated_form = third_person_entry.get("conjugation", "")

        form_freq = word_frequency(conjugated_form, 'es') if conjugated_form else 0.0
        entry["form_frequency"] = form_freq

    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"Updated frequency data saved to {json_path}")

# generate_conjugation_data("common-spanish-verbs.csv", "conjugated_verbs.json")
add_frequency_to_json("conjugated_verbs.json")
