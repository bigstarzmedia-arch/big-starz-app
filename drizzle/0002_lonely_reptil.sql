CREATE TABLE `conversations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId1` int NOT NULL,
	`userId2` int NOT NULL,
	`lastMessageId` int,
	`lastMessageAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `conversations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `faceClones` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`faceImageUrl` varchar(512) NOT NULL,
	`faceImageKey` varchar(512) NOT NULL,
	`isDefault` boolean NOT NULL DEFAULT false,
	`processingStatus` enum('pending','processing','completed','failed') DEFAULT 'pending',
	`processingError` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `faceClones_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`senderId` int NOT NULL,
	`recipientId` int NOT NULL,
	`content` text NOT NULL,
	`isRead` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `videoGenerations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`prompt` text NOT NULL,
	`soraJobId` varchar(255),
	`outputVideoUrl` varchar(512),
	`outputVideoKey` varchar(512),
	`processingStatus` enum('pending','processing','completed','failed') DEFAULT 'pending',
	`processingError` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `videoGenerations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `music` MODIFY COLUMN `lyricModel` enum('openai','anthropic','gemini-flash-free','llama-3.8b-free','sora') NOT NULL;--> statement-breakpoint
ALTER TABLE `videos` MODIFY COLUMN `aiModel` enum('kling','heygen','pollinations','stable-diffusion','text-to-video','sora') NOT NULL;