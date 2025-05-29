PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_srs_reviews` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`conjugation_id` integer NOT NULL,
	`due_at` integer NOT NULL,
	`stability` integer NOT NULL,
	`difficulty` integer NOT NULL,
	`elapsed_days` integer NOT NULL,
	`scheduled_days` integer NOT NULL,
	`learning_steps` integer NOT NULL,
	`reps` integer NOT NULL,
	`lapses` integer NOT NULL,
	`state` text NOT NULL,
	`last_review_at` integer,
	FOREIGN KEY (`conjugation_id`) REFERENCES `conjugations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_srs_reviews`("id", "conjugation_id", "due_at", "stability", "difficulty", "elapsed_days", "scheduled_days", "learning_steps", "reps", "lapses", "state", "last_review_at") SELECT "id", "conjugation_id", "due_at", "stability", "difficulty", "elapsed_days", "scheduled_days", "learning_steps", "reps", "lapses", "state", "last_review_at" FROM `srs_reviews`;--> statement-breakpoint
DROP TABLE `srs_reviews`;--> statement-breakpoint
ALTER TABLE `__new_srs_reviews` RENAME TO `srs_reviews`;--> statement-breakpoint
PRAGMA foreign_keys=ON;