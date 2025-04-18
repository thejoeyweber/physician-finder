DROP INDEX IF EXISTS "location_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "last_name_trgm_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "first_name_trgm_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "full_name_tsv_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "state_zip_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "npi_idx";--> statement-breakpoint
ALTER TABLE "physicians" ALTER COLUMN "first_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "physicians" ALTER COLUMN "last_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "physicians" ALTER COLUMN "gender" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "physicians" ALTER COLUMN "primary_specialty" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "physicians" ALTER COLUMN "location" SET DATA TYPE geography(Point, 4326) USING CASE 
    WHEN location IS NULL THEN NULL 
    ELSE location::geography(Point, 4326)
END;--> statement-breakpoint
ALTER TABLE "physicians" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "physicians" ALTER COLUMN "created_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "physicians" ALTER COLUMN "updated_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "physicians" ALTER COLUMN "updated_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "physicians" ALTER COLUMN "full_name_tsv" SET DATA TYPE tsvector USING CASE 
    WHEN full_name_tsv IS NULL THEN NULL 
    ELSE to_tsvector('english', full_name_tsv)
END;--> statement-breakpoint
ALTER TABLE "physicians" ADD COLUMN "primary_phone" text;--> statement-breakpoint
ALTER TABLE "physicians" ADD COLUMN "primary_fax" text;--> statement-breakpoint
ALTER TABLE "physicians" ADD COLUMN "primary_address_1" text;--> statement-breakpoint
ALTER TABLE "physicians" ADD COLUMN "primary_address_2" text;--> statement-breakpoint
ALTER TABLE "physicians" ADD COLUMN "primary_city" text;--> statement-breakpoint
ALTER TABLE "physicians" ADD COLUMN "primary_state" text;--> statement-breakpoint
ALTER TABLE "physicians" ADD COLUMN "primary_zip" text;--> statement-breakpoint
ALTER TABLE "physicians" ADD COLUMN "taxonomy_description" text;--> statement-breakpoint
ALTER TABLE "physicians" ADD COLUMN "is_active" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "physicians" ADD COLUMN "view_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "physicians" DROP COLUMN IF EXISTS "credential";--> statement-breakpoint
ALTER TABLE "physicians" DROP COLUMN IF EXISTS "status";--> statement-breakpoint
ALTER TABLE "physicians" DROP COLUMN IF EXISTS "enumeration_date";--> statement-breakpoint
ALTER TABLE "physicians" DROP COLUMN IF EXISTS "last_updated_nppes";--> statement-breakpoint
ALTER TABLE "physicians" DROP COLUMN IF EXISTS "deactivation_date";--> statement-breakpoint
ALTER TABLE "physicians" DROP COLUMN IF EXISTS "deactivation_reason";--> statement-breakpoint
ALTER TABLE "physicians" DROP COLUMN IF EXISTS "reactivation_date";--> statement-breakpoint
ALTER TABLE "physicians" DROP COLUMN IF EXISTS "secondary_specialties";--> statement-breakpoint
ALTER TABLE "physicians" DROP COLUMN IF EXISTS "addresses";--> statement-breakpoint
ALTER TABLE "physicians" DROP COLUMN IF EXISTS "phone_numbers";--> statement-breakpoint
ALTER TABLE "physicians" DROP COLUMN IF EXISTS "address_state";--> statement-breakpoint
ALTER TABLE "physicians" DROP COLUMN IF EXISTS "address_zip5";--> statement-breakpoint
ALTER TABLE "physicians" DROP COLUMN IF EXISTS "languages";--> statement-breakpoint
ALTER TABLE "physicians" DROP COLUMN IF EXISTS "accepts_telehealth";--> statement-breakpoint
ALTER TABLE "physicians" DROP COLUMN IF EXISTS "ai_bio";--> statement-breakpoint
ALTER TABLE "physicians" DROP COLUMN IF EXISTS "ai_bio_source";--> statement-breakpoint
ALTER TABLE "physicians" DROP COLUMN IF EXISTS "ai_bio_version";--> statement-breakpoint
ALTER TABLE "physicians" DROP COLUMN IF EXISTS "ai_bio_enriched_at";--> statement-breakpoint
ALTER TABLE "physicians" DROP COLUMN IF EXISTS "geo_enriched_at";