create table "public"."fandomSubscribers" (
    "subscription_id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "user_id" uuid,
    "fandom_id" uuid
);


alter table "public"."fandomSubscribers" enable row level security;

create table "public"."fandomsDatabase" (
    "fandom_id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "fandom_name" text,
    "artist_id" uuid,
    "description" text,
    "fandom_banner" text,
    "primary_color" character varying,
    "secondary_color" character varying,
    "hashtag" jsonb,
    "motto" text,
    "member_count" numeric default '0'::numeric,
    "engagement_score" numeric,
    "social_links" jsonb,
    "fan_levels" jsonb,
    "custom_emojis" jsonb
);


alter table "public"."fandomsDatabase" enable row level security;

alter table "public"."userDatabase" drop column "artistsFollowed";

alter table "public"."userDatabase" drop column "followers";

alter table "public"."userDatabase" drop column "following";

alter table "public"."userDatabase" drop column "friendsList";

CREATE UNIQUE INDEX "fandomSubscribers_pkey" ON public."fandomSubscribers" USING btree (subscription_id);

CREATE UNIQUE INDEX "fandomsDatabase_pkey" ON public."fandomsDatabase" USING btree (fandom_id);

alter table "public"."fandomSubscribers" add constraint "fandomSubscribers_pkey" PRIMARY KEY using index "fandomSubscribers_pkey";

alter table "public"."fandomsDatabase" add constraint "fandomsDatabase_pkey" PRIMARY KEY using index "fandomsDatabase_pkey";

alter table "public"."fandomSubscribers" add constraint "fandomSubscribers_fandom_id_fkey" FOREIGN KEY (fandom_id) REFERENCES "fandomsDatabase"(fandom_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."fandomSubscribers" validate constraint "fandomSubscribers_fandom_id_fkey";

alter table "public"."fandomSubscribers" add constraint "fandomSubscribers_user_id_fkey" FOREIGN KEY (user_id) REFERENCES "userDatabase"("userId") ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."fandomSubscribers" validate constraint "fandomSubscribers_user_id_fkey";

alter table "public"."fandomsDatabase" add constraint "fandomsDatabase_artist_id_fkey" FOREIGN KEY (artist_id) REFERENCES "userDatabase"("userId") ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."fandomsDatabase" validate constraint "fandomsDatabase_artist_id_fkey";

grant delete on table "public"."fandomSubscribers" to "anon";

grant insert on table "public"."fandomSubscribers" to "anon";

grant references on table "public"."fandomSubscribers" to "anon";

grant select on table "public"."fandomSubscribers" to "anon";

grant trigger on table "public"."fandomSubscribers" to "anon";

grant truncate on table "public"."fandomSubscribers" to "anon";

grant update on table "public"."fandomSubscribers" to "anon";

grant delete on table "public"."fandomSubscribers" to "authenticated";

grant insert on table "public"."fandomSubscribers" to "authenticated";

grant references on table "public"."fandomSubscribers" to "authenticated";

grant select on table "public"."fandomSubscribers" to "authenticated";

grant trigger on table "public"."fandomSubscribers" to "authenticated";

grant truncate on table "public"."fandomSubscribers" to "authenticated";

grant update on table "public"."fandomSubscribers" to "authenticated";

grant delete on table "public"."fandomSubscribers" to "service_role";

grant insert on table "public"."fandomSubscribers" to "service_role";

grant references on table "public"."fandomSubscribers" to "service_role";

grant select on table "public"."fandomSubscribers" to "service_role";

grant trigger on table "public"."fandomSubscribers" to "service_role";

grant truncate on table "public"."fandomSubscribers" to "service_role";

grant update on table "public"."fandomSubscribers" to "service_role";

grant delete on table "public"."fandomsDatabase" to "anon";

grant insert on table "public"."fandomsDatabase" to "anon";

grant references on table "public"."fandomsDatabase" to "anon";

grant select on table "public"."fandomsDatabase" to "anon";

grant trigger on table "public"."fandomsDatabase" to "anon";

grant truncate on table "public"."fandomsDatabase" to "anon";

grant update on table "public"."fandomsDatabase" to "anon";

grant delete on table "public"."fandomsDatabase" to "authenticated";

grant insert on table "public"."fandomsDatabase" to "authenticated";

grant references on table "public"."fandomsDatabase" to "authenticated";

grant select on table "public"."fandomsDatabase" to "authenticated";

grant trigger on table "public"."fandomsDatabase" to "authenticated";

grant truncate on table "public"."fandomsDatabase" to "authenticated";

grant update on table "public"."fandomsDatabase" to "authenticated";

grant delete on table "public"."fandomsDatabase" to "service_role";

grant insert on table "public"."fandomsDatabase" to "service_role";

grant references on table "public"."fandomsDatabase" to "service_role";

grant select on table "public"."fandomsDatabase" to "service_role";

grant trigger on table "public"."fandomsDatabase" to "service_role";

grant truncate on table "public"."fandomsDatabase" to "service_role";

grant update on table "public"."fandomsDatabase" to "service_role";

create policy "Allow Users To Add A Row"
on "public"."fandomSubscribers"
as permissive
for insert
to authenticated
with check (true);


create policy "Allow Users To Read Their Fandom Rows"
on "public"."fandomSubscribers"
as permissive
for select
to authenticated
using (true);


create policy "Allow Users To Update A Row"
on "public"."fandomSubscribers"
as permissive
for update
to authenticated
using (true);


create policy "Allow Users To Read Data"
on "public"."fandomsDatabase"
as permissive
for select
to authenticated
using (true);


create policy "Allow Users To Update A Row"
on "public"."fandomsDatabase"
as permissive
for update
to authenticated
using (true);


create policy "Allow All Users To Read All Data"
on "public"."followingList"
as permissive
for select
to public
using (true);


create policy "Allow Users To Add A Row"
on "public"."followingList"
as permissive
for insert
to authenticated
with check (true);


create policy "Allow Users To Delete A Row"
on "public"."followingList"
as permissive
for delete
to authenticated
using (true);


create policy "Enable Users to Read Data"
on "public"."followingList"
as permissive
for select
to authenticated
using (true);



