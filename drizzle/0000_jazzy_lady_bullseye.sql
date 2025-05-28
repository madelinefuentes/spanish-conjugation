CREATE TABLE `conjugations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`verb_id` text NOT NULL,
	`mood` text NOT NULL,
	`tense` text NOT NULL,
	`person` text NOT NULL,
	`conjugation` text NOT NULL,
	`translation` text NOT NULL,
	FOREIGN KEY (`verb_id`) REFERENCES `verbs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `srs_reviews` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`conjugation_id` text NOT NULL,
	`stability` integer NOT NULL,
	`difficulty` integer NOT NULL,
	`elapsed_days` integer NOT NULL,
	`scheduled_days` integer NOT NULL,
	`reps` integer NOT NULL,
	`lapses` integer NOT NULL,
	`state` text NOT NULL,
	`last_review_at` integer NOT NULL,
	FOREIGN KEY (`conjugation_id`) REFERENCES `conjugations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `verbs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`infinitive` text NOT NULL,
	`meaning` text NOT NULL,
	`type` text NOT NULL,
	`group` text NOT NULL,
	`status` text NOT NULL
);
