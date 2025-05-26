import { Model } from "@nozbe/watermelondb";
import { field, relation, date } from "@nozbe/watermelondb/decorators";

export default class SrsReview extends Model {
  static table = "srs_reviews";

  static associations = {
    conjugations: { type: "belongs_to", key: "conjugation_id" },
  };

  @field("stability") stability;
  @field("difficulty") difficulty;
  @field("elapsed_days") elapsed_days;
  @field("scheduled_days") scheduled_days;
  @field("reps") reps;
  @field("lapses") lapses;
  @field("state") state;
  @date("last_review_at") last_review;

  @relation("conjugations", "conjugation_id") conjugation;
}
