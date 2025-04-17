CREATE TABLE IF NOT EXISTS "finder_instances" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"canonical_host" text,
	"configuration" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"custom_domain" text,
	"vercel_domain_id" text,
	"domain_status" "finder_domain_status",
	"embed_script_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "physicians" ALTER COLUMN "first_name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "physicians" ALTER COLUMN "last_name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "physicians" ALTER COLUMN "location" DROP NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "finder_instances" ADD CONSTRAINT "finder_instances_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "slug_idx" ON "finder_instances" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "canonical_host_idx" ON "finder_instances" USING btree ("canonical_host");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "custom_domain_idx" ON "finder_instances" USING btree ("custom_domain");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "embed_script_id_idx" ON "finder_instances" USING btree ("embed_script_id");