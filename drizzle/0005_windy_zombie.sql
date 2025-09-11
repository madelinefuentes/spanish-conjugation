PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_verbs` (
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
--> statement-breakpoint
INSERT INTO `__new_verbs`("id", "infinitive", "meaning", "type", "frequency", "participle_es", "participle_en", "gerund_es", "gerund_en") SELECT "id", "infinitive", "meaning", "type", "frequency", "participle_es", "participle_en", "gerund_es", "gerund_en" FROM `verbs`;--> statement-breakpoint
DROP TABLE `verbs`;--> statement-breakpoint
ALTER TABLE `__new_verbs` RENAME TO `verbs`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `conjugations` ADD `es_form` text NOT NULL;--> statement-breakpoint
ALTER TABLE `conjugations` ADD `en_form` text;--> statement-breakpoint
ALTER TABLE `conjugations` DROP COLUMN `conjugation`;--> statement-breakpoint
ALTER TABLE `conjugations` DROP COLUMN `translation`;