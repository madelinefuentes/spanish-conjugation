import { Model } from "@nozbe/watermelondb";
import { children, text } from "@nozbe/watermelondb/decorators";

export default class Verb extends Model {
  static table = "verbs";
  static associations = {
    conjugations: { type: "has_many", foreignKey: "verb_id" },
  };

  @text("infinitive") infinitive;
  @text("meaning") meaning;
  @text("type") type;
  @text("group") group;
  @text("status") status;

  @children("conjugations") conjugations;
}
