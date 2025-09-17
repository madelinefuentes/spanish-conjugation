CREATE TABLE `conjugations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`verb_id` integer NOT NULL,
	`mood` text NOT NULL,
	`tense` text NOT NULL,
	`person` text NOT NULL,
	`es_form` text NOT NULL,
	`en_form` text NOT NULL,
	FOREIGN KEY (`verb_id`) REFERENCES `verbs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `srs_reviews` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`conjugation_id` integer NOT NULL,
	`due_at` integer NOT NULL,
	`stability` integer NOT NULL,
	`difficulty` integer NOT NULL,
	`scheduled_days` integer NOT NULL,
	`learning_steps` integer NOT NULL,
	`reps` integer NOT NULL,
	`lapses` integer NOT NULL,
	`state` text NOT NULL,
	`last_review_at` integer,
	FOREIGN KEY (`conjugation_id`) REFERENCES `conjugations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tenses` (
	`id` integer PRIMARY KEY NOT NULL,
	`name_es` text NOT NULL,
	`name_en` text NOT NULL,
	`mood` text NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE TABLE `verbs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`infinitive` text NOT NULL,
	`meaning` text,
	`type` text,
	`frequency` real DEFAULT 0,
	`participle_es` text,
	`participle_en` text,
	`gerund_es` text,
	`gerund_en` text
);
