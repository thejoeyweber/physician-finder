DO $$ BEGIN
 CREATE TYPE "public"."finder_domain_status" AS ENUM('pending', 'verified', 'failed', 'inactive');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."gender" AS ENUM('M', 'F', 'X');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."status" AS ENUM('A', 'I', 'D', 'R');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."user_role" AS ENUM('admin', 'member');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "physicians" (
	"npi" text PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"middle_name" text,
	"suffix" text,
	"credential" text,
	"gender" "gender",
	"status" "status" DEFAULT 'A' NOT NULL,
	"enumeration_date" date NOT NULL,
	"last_updated_nppes" date,
	"deactivation_date" date,
	"deactivation_reason" text,
	"reactivation_date" date,
	"primary_specialty" jsonb,
	"secondary_specialties" jsonb DEFAULT '[]'::jsonb,
	"addresses" jsonb DEFAULT '[]'::jsonb,
	"phone_numbers" jsonb DEFAULT '[]'::jsonb,
	"address_state" text,
	"address_zip5" text,
	"location" text NOT NULL,
	"languages" text[],
	"accepts_telehealth" boolean DEFAULT false,
	"ai_bio" text,
	"ai_bio_source" text,
	"ai_bio_version" text,
	"ai_bio_enriched_at" timestamp with time zone,
	"geo_enriched_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"full_name_tsv" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"logo_url" text,
	"primary_color" text,
	"secondary_color" text,
	"default_copy" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organization_memberships" (
	"user_id" text NOT NULL,
	"organization_id" uuid NOT NULL,
	"role" "user_role" DEFAULT 'member' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "organization_memberships_user_id_organization_id_pk" PRIMARY KEY("user_id","organization_id")
);
--> statement-breakpoint
ALTER TABLE "profiles" RENAME TO "users";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "platform_role" "user_role" DEFAULT 'member' NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_memberships" ADD CONSTRAINT "organization_memberships_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_memberships" ADD CONSTRAINT "organization_memberships_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "location_idx" ON "physicians" USING btree ("location");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "last_name_trgm_idx" ON "physicians" USING btree ("last_name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "first_name_trgm_idx" ON "physicians" USING btree ("first_name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "full_name_tsv_idx" ON "physicians" USING btree ("full_name_tsv");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "state_zip_idx" ON "physicians" USING btree ("address_state","address_zip5");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "npi_idx" ON "physicians" USING btree ("npi");--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "membership";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "stripe_customer_id";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "stripe_subscription_id";