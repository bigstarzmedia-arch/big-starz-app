CREATE TABLE `freeTierQuota` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`dailyGenerationsRemaining` int NOT NULL DEFAULT 3,
	`totalGenerationsThisMonth` int NOT NULL DEFAULT 0,
	`lastResetDate` timestamp NOT NULL DEFAULT (now()),
	`subscriptionTier` enum('free','pro','elite') NOT NULL DEFAULT 'free',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `freeTierQuota_id` PRIMARY KEY(`id`),
	CONSTRAINT `freeTierQuota_userId_unique` UNIQUE(`userId`)
);
