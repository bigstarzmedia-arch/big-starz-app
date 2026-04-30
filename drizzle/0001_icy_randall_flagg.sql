CREATE TABLE `castingApplications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`castingId` int NOT NULL,
	`portfolioVideoIds` json,
	`answers` json,
	`availabilityConfirmed` boolean DEFAULT false,
	`status` enum('pending','accepted','rejected') DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `castingApplications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `castings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`brandName` varchar(255) NOT NULL,
	`productCategory` varchar(255) NOT NULL,
	`briefDescription` text,
	`fullBrief` text,
	`brandGuidelines` text,
	`requiredAttributes` json,
	`compensation` varchar(50) NOT NULL,
	`compensationType` enum('flat_fee','percentage') DEFAULT 'flat_fee',
	`applicationDeadline` timestamp NOT NULL,
	`shootDate` timestamp,
	`status` enum('open','in_review','closed') DEFAULT 'open',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `castings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `earningsLedger` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`transactionType` enum('casting_fee','affiliate_commission','refund') NOT NULL,
	`amount` varchar(50) NOT NULL,
	`castingApplicationId` int,
	`castingId` int,
	`stripePaymentIntentId` varchar(255),
	`stripeTransferId` varchar(255),
	`status` enum('pending','completed','failed') DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `earningsLedger_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `music` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`instrumentalUrl` varchar(512) NOT NULL,
	`instrumentalKey` varchar(512) NOT NULL,
	`generatedMusicUrl` varchar(512),
	`generatedMusicKey` varchar(512),
	`title` varchar(255),
	`artist` varchar(255),
	`genre` varchar(100),
	`mood` varchar(100),
	`lyrics` text,
	`lyricPrompt` text,
	`lyricModel` enum('openai','anthropic','gemini-flash-free','llama-3.8b-free') NOT NULL,
	`voiceModel` varchar(100) NOT NULL,
	`processingStatus` enum('pending','processing','completed','failed') DEFAULT 'pending',
	`processingProgress` int DEFAULT 0,
	`processingError` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `music_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `revenueCatEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`eventType` varchar(100) NOT NULL,
	`productId` varchar(255) NOT NULL,
	`revenueCatEventId` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `revenueCatEvents_id` PRIMARY KEY(`id`),
	CONSTRAINT `revenueCatEvents_revenueCatEventId_unique` UNIQUE(`revenueCatEventId`)
);
--> statement-breakpoint
CREATE TABLE `subscriberTracking` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`currentSubscriberCount` int NOT NULL DEFAULT 0,
	`totalSubscribersAllTime` int NOT NULL DEFAULT 0,
	`hasReachedThousand` boolean DEFAULT false,
	`reachedThousandAt` timestamp,
	`castingFeesEnabled` boolean DEFAULT false,
	`castingFeeAmount` varchar(50),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscriberTracking_id` PRIMARY KEY(`id`),
	CONSTRAINT `subscriberTracking_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `videos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`originalVideoUrl` varchar(512) NOT NULL,
	`originalVideoKey` varchar(512) NOT NULL,
	`beautifiedVideoUrl` varchar(512),
	`beautifiedVideoKey` varchar(512),
	`title` varchar(255),
	`description` text,
	`tags` json,
	`visibility` enum('private','public') DEFAULT 'private',
	`aiModel` enum('kling','heygen','pollinations','stable-diffusion','text-to-video') NOT NULL,
	`stylePreset` varchar(100),
	`resolution` varchar(50) DEFAULT '1080p',
	`processingStatus` enum('pending','processing','completed','failed') DEFAULT 'pending',
	`processingProgress` int DEFAULT 0,
	`processingError` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `videos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `userRole` enum('creator','model','artist','producer');--> statement-breakpoint
ALTER TABLE `users` ADD `profilePicture` varchar(512);--> statement-breakpoint
ALTER TABLE `users` ADD `bio` text;--> statement-breakpoint
ALTER TABLE `users` ADD `subscriberCount` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `totalEarnings` varchar(50) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `revenueCatCustomerId` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `subscriptionStatus` enum('active','inactive','cancelled') DEFAULT 'inactive';--> statement-breakpoint
ALTER TABLE `users` ADD `subscriptionExpiresAt` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD `stripeAccountId` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `stripeConnectOnboarded` boolean DEFAULT false;