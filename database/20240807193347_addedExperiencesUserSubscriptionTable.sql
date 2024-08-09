alter table "public"."userLikedArtists" drop constraint "userLikedArtists_pkey";

drop index if exists "public"."userLikedArtists_pkey";

create table "public"."userExperiences" (
    "relationship_id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "user_id" uuid,
    "experience_id" uuid,
    "user_metadata" jsonb,
    "user_description" text
);


alter table "public"."userExperiences" enable row level security;

alter table "public"."globalTickets" add column "venue_location_link" text;

CREATE UNIQUE INDEX "fandomsDatabase_fandom_name_key" ON public."fandomsDatabase" USING btree (fandom_name);

CREATE UNIQUE INDEX "userExperiences_pkey" ON public."userExperiences" USING btree (relationship_id);

CREATE UNIQUE INDEX "userLikedArtists_pkey" ON public."userLikedArtists" USING btree (created_at);

alter table "public"."userExperiences" add constraint "userExperiences_pkey" PRIMARY KEY using index "userExperiences_pkey";

alter table "public"."userLikedArtists" add constraint "userLikedArtists_pkey" PRIMARY KEY using index "userLikedArtists_pkey";

alter table "public"."fandomsDatabase" add constraint "fandomsDatabase_fandom_name_key" UNIQUE using index "fandomsDatabase_fandom_name_key";

alter table "public"."userExperiences" add constraint "userExperiences_experience_id_fkey" FOREIGN KEY (experience_id) REFERENCES "experiencesDatabase"(experience_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."userExperiences" validate constraint "userExperiences_experience_id_fkey";

alter table "public"."userExperiences" add constraint "userExperiences_user_id_fkey" FOREIGN KEY (user_id) REFERENCES "userDatabase"("userId") ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."userExperiences" validate constraint "userExperiences_user_id_fkey";

grant delete on table "public"."userExperiences" to "anon";

grant insert on table "public"."userExperiences" to "anon";

grant references on table "public"."userExperiences" to "anon";

grant select on table "public"."userExperiences" to "anon";

grant trigger on table "public"."userExperiences" to "anon";

grant truncate on table "public"."userExperiences" to "anon";

grant update on table "public"."userExperiences" to "anon";

grant delete on table "public"."userExperiences" to "authenticated";

grant insert on table "public"."userExperiences" to "authenticated";

grant references on table "public"."userExperiences" to "authenticated";

grant select on table "public"."userExperiences" to "authenticated";

grant trigger on table "public"."userExperiences" to "authenticated";

grant truncate on table "public"."userExperiences" to "authenticated";

grant update on table "public"."userExperiences" to "authenticated";

grant delete on table "public"."userExperiences" to "service_role";

grant insert on table "public"."userExperiences" to "service_role";

grant references on table "public"."userExperiences" to "service_role";

grant select on table "public"."userExperiences" to "service_role";

grant trigger on table "public"."userExperiences" to "service_role";

grant truncate on table "public"."userExperiences" to "service_role";

grant update on table "public"."userExperiences" to "service_role";

create policy "Allow Users All Access"
on "public"."userExperiences"
as permissive
for all
to authenticated
using (true);



