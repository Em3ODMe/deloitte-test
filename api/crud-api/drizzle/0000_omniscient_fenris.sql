CREATE TABLE `cities` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`state` text NOT NULL,
	`country` text NOT NULL,
	`tourist_rating` integer,
	`date_established` text,
	`estimated_population` integer NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cities_id_unique` ON `cities` (`id`);