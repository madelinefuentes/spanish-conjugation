import { Model } from "@nozbe/watermelondb";
import { text, relation } from "@nozbe/watermelondb/decorators";

export default class Conjugation extends Model {
  static table = "conjugations";

  static associations = {
    verbs: { type: "belongs_to", key: "verb_id" },
    srs_reviews: { type: "has_many", foreignKey: "conjugation_id" }, // 1:1
  };

  @text("mood") mood;
  @text("tense") tense;
  @text("person") person;
  @text("conjugation") conjugation;
  @text("translation") translation;

  @relation("verbs", "verb_id") verb;

  //   async srsReview() {
  //     return await this.collections
  //       .get("srs_reviews")
  //       .query(Q.where("conjugation_id", this.id))
  //       .fetch(1)
  //       .then(([review]) => review ?? null);
  //   }
}
