ALTER TABLE "users" ADD COLUMN "reset_otp_code" varchar(6);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "reset_otp_expires_at" timestamp with time zone;