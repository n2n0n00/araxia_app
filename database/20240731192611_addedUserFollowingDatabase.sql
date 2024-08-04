drop trigger if exists "enforce_favorite_count_update_trigger" on "public"."globalNFTs";

drop function if exists "public"."enforce_favorite_count_update"();

create table "public"."followingList" (
    "user_who_was_followed_id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "user_who_followed_id" uuid not null,
    "relationship_id" uuid not null default gen_random_uuid()
);


alter table "public"."followingList" enable row level security;

create table "public"."leaderboardRanks" (
    "created_at" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text),
    "user_id" uuid not null,
    "experience_id" uuid not null,
    "user_xp" numeric,
    "user_friends" numeric
);


alter table "public"."leaderboardRanks" enable row level security;

alter table "public"."userDatabase" drop column "posts";

alter table "public"."userDatabase" drop column "tickets";

CREATE UNIQUE INDEX "followingList_pkey" ON public."followingList" USING btree (relationship_id);

CREATE UNIQUE INDEX "followingList_relationship_id_key" ON public."followingList" USING btree (relationship_id);

CREATE UNIQUE INDEX "leaderboardRanks_pkey" ON public."leaderboardRanks" USING btree (user_id, experience_id);

alter table "public"."followingList" add constraint "followingList_pkey" PRIMARY KEY using index "followingList_pkey";

alter table "public"."leaderboardRanks" add constraint "leaderboardRanks_pkey" PRIMARY KEY using index "leaderboardRanks_pkey";

alter table "public"."followingList" add constraint "followingList_relationship_id_key" UNIQUE using index "followingList_relationship_id_key";

alter table "public"."followingList" add constraint "followingList_user_who_followed_id_fkey" FOREIGN KEY (user_who_followed_id) REFERENCES "userDatabase"("userId") ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."followingList" validate constraint "followingList_user_who_followed_id_fkey";

alter table "public"."followingList" add constraint "followingList_user_who_was_followed_id_fkey" FOREIGN KEY (user_who_was_followed_id) REFERENCES "userDatabase"("userId") ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."followingList" validate constraint "followingList_user_who_was_followed_id_fkey";

alter table "public"."leaderboardRanks" add constraint "leaderboardRanks_experience_id_fkey" FOREIGN KEY (experience_id) REFERENCES "experiencesDatabase"(experience_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."leaderboardRanks" validate constraint "leaderboardRanks_experience_id_fkey";

alter table "public"."leaderboardRanks" add constraint "leaderboardRanks_user_id_fkey" FOREIGN KEY (user_id) REFERENCES "userDatabase"("userId") ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."leaderboardRanks" validate constraint "leaderboardRanks_user_id_fkey";

grant delete on table "public"."followingList" to "anon";

grant insert on table "public"."followingList" to "anon";

grant references on table "public"."followingList" to "anon";

grant select on table "public"."followingList" to "anon";

grant trigger on table "public"."followingList" to "anon";

grant truncate on table "public"."followingList" to "anon";

grant update on table "public"."followingList" to "anon";

grant delete on table "public"."followingList" to "authenticated";

grant insert on table "public"."followingList" to "authenticated";

grant references on table "public"."followingList" to "authenticated";

grant select on table "public"."followingList" to "authenticated";

grant trigger on table "public"."followingList" to "authenticated";

grant truncate on table "public"."followingList" to "authenticated";

grant update on table "public"."followingList" to "authenticated";

grant delete on table "public"."followingList" to "service_role";

grant insert on table "public"."followingList" to "service_role";

grant references on table "public"."followingList" to "service_role";

grant select on table "public"."followingList" to "service_role";

grant trigger on table "public"."followingList" to "service_role";

grant truncate on table "public"."followingList" to "service_role";

grant update on table "public"."followingList" to "service_role";

grant delete on table "public"."leaderboardRanks" to "anon";

grant insert on table "public"."leaderboardRanks" to "anon";

grant references on table "public"."leaderboardRanks" to "anon";

grant select on table "public"."leaderboardRanks" to "anon";

grant trigger on table "public"."leaderboardRanks" to "anon";

grant truncate on table "public"."leaderboardRanks" to "anon";

grant update on table "public"."leaderboardRanks" to "anon";

grant delete on table "public"."leaderboardRanks" to "authenticated";

grant insert on table "public"."leaderboardRanks" to "authenticated";

grant references on table "public"."leaderboardRanks" to "authenticated";

grant select on table "public"."leaderboardRanks" to "authenticated";

grant trigger on table "public"."leaderboardRanks" to "authenticated";

grant truncate on table "public"."leaderboardRanks" to "authenticated";

grant update on table "public"."leaderboardRanks" to "authenticated";

grant delete on table "public"."leaderboardRanks" to "service_role";

grant insert on table "public"."leaderboardRanks" to "service_role";

grant references on table "public"."leaderboardRanks" to "service_role";

grant select on table "public"."leaderboardRanks" to "service_role";

grant trigger on table "public"."leaderboardRanks" to "service_role";

grant truncate on table "public"."leaderboardRanks" to "service_role";

grant update on table "public"."leaderboardRanks" to "service_role";


