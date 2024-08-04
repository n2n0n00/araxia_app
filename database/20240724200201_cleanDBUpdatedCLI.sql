create table "public"."experiencesDatabase" (
    "experience_id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "experience_name" text not null,
    "experience_banner" text,
    "artist_name" text not null,
    "experience_city" text,
    "artist_id" uuid not null,
    "artist_avatar" text,
    "completed" boolean not null default false,
    "experience_country" text,
    "experience_description" text,
    "experience_ends_at" timestamp with time zone,
    "experience_nfts" numeric,
    "experience_points" numeric,
    "experience_starts_at" timestamp with time zone,
    "experience_type" text,
    "running_time" text,
    "tour_date" date,
    "tour_name" text not null,
    "tour_time" time with time zone
);


alter table "public"."experiencesDatabase" enable row level security;

create table "public"."globalNFTs" (
    "id" uuid not null default gen_random_uuid(),
    "name" character varying not null,
    "description" text,
    "image_url" text,
    "metadata" jsonb,
    "minted_at" timestamp with time zone default (now() AT TIME ZONE 'utc'::text),
    "creator_id" uuid default gen_random_uuid(),
    "platform" character varying not null default 'ARAXIA'::character varying,
    "owner_id" uuid default gen_random_uuid(),
    "price" numeric,
    "currency" text default 'USD'::text,
    "favorite_count" numeric default '0'::numeric,
    "experience_id" uuid
);


alter table "public"."globalNFTs" enable row level security;

create table "public"."globalTickets" (
    "ticket_id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text),
    "user_id" uuid not null,
    "ticket_crypto_address" text not null,
    "seat_number" text,
    "venue" text,
    "smart_contract_address" text,
    "ticket_qr" text,
    "bought_by" text,
    "experience_id" uuid not null
);


alter table "public"."globalTickets" enable row level security;

create table "public"."globalTransactions" (
    "id" uuid not null default gen_random_uuid(),
    "buyer_id" uuid not null default gen_random_uuid(),
    "seller_id" uuid not null,
    "nft_id" uuid not null,
    "transaction_date" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text),
    "price" numeric not null default '0'::numeric,
    "currency" character varying not null default 'USD'::character varying,
    "status" character varying not null default '''completed'''::character varying,
    "metadata" jsonb,
    "created_at_record" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text),
    "updated_at_record" timestamp with time zone default (now() AT TIME ZONE 'utc'::text)
);


alter table "public"."globalTransactions" enable row level security;

create table "public"."userDatabase" (
    "username" text,
    "email" character varying not null,
    "cryptoAddress" text,
    "seedPhrase" text[],
    "posts" text[],
    "notifications" text[],
    "tickets" text[],
    "levelXP" text default '0'::text,
    "nfts" text default '0'::text,
    "friendsList" text[],
    "artistsFollowed" text[],
    "fandomList" text[],
    "leaderboardRanks" text,
    "boughtExperiences" text[],
    "upcomingExperiences" text[],
    "publishedExperiences" text[],
    "storedExperiences" text[],
    "pastExperiences" text[],
    "recommendedExperiences" text[],
    "tradedNFTs" text[],
    "groupChats" text[],
    "universalLocationData" text,
    "pastLocationData" text[],
    "inGameLocation" text[],
    "inventoryInGame" text[],
    "questsListsInGame" text[],
    "userId" uuid not null default auth.uid(),
    "avatar" text default 'http://192.168.0.26:54321/storage/v1/object/public/userAvatar/ARA_LOGO.jpg'::text,
    "currentFandom" text default 'None'::text,
    "bio" text default 'I am a fan of...'::text,
    "followers" text[],
    "following" text[],
    "createdAt" timestamp with time zone default (now() AT TIME ZONE 'utc'::text),
    "isUserArtist" boolean default false,
    "artistName" text
);


alter table "public"."userDatabase" enable row level security;

create table "public"."userLikedArtists" (
    "user_id" uuid not null,
    "artist_id" uuid not null,
    "created_at" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text)
);


alter table "public"."userLikedArtists" enable row level security;

create table "public"."userLikedExperiences" (
    "experience_id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "user_id" uuid not null
);


alter table "public"."userLikedExperiences" enable row level security;

create table "public"."userLikedNFTs" (
    "user_id" uuid not null,
    "created_at" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text),
    "nft_id" uuid not null
);


alter table "public"."userLikedNFTs" enable row level security;

create table "public"."userPosts" (
    "id" uuid not null default gen_random_uuid(),
    "timestamp" timestamp without time zone default CURRENT_TIMESTAMP,
    "content" text not null,
    "media" text,
    "likes" integer default 0,
    "comments" numeric default '0'::numeric,
    "username" text,
    "created_at" timestamp without time zone default CURRENT_TIMESTAMP,
    "crypto_address" text,
    "updated_at" timestamp without time zone default CURRENT_TIMESTAMP,
    "user_id" uuid,
    "avatar" text
);


alter table "public"."userPosts" enable row level security;

CREATE UNIQUE INDEX "GlobalNFTs_pkey" ON public."globalNFTs" USING btree (id);

CREATE UNIQUE INDEX "experiencesDatabase_experience_banner_key" ON public."experiencesDatabase" USING btree (experience_banner);

CREATE UNIQUE INDEX "experiencesDatabase_experience_id_experience_name_artist_na_key" ON public."experiencesDatabase" USING btree (experience_id, experience_name, artist_name, completed);

CREATE UNIQUE INDEX "experiencesDatabase_experience_id_key" ON public."experiencesDatabase" USING btree (experience_id);

CREATE UNIQUE INDEX "experiencesDatabase_pkey" ON public."experiencesDatabase" USING btree (experience_id);

CREATE UNIQUE INDEX "globalTickets_id_key" ON public."globalTickets" USING btree (ticket_id);

CREATE UNIQUE INDEX "globalTickets_pkey" ON public."globalTickets" USING btree (ticket_id, user_id, experience_id);

CREATE UNIQUE INDEX "globalTransactions_pkey" ON public."globalTransactions" USING btree (id);

CREATE INDEX idx_createdat ON public."userPosts" USING btree (created_at);

CREATE INDEX idx_userid ON public."userPosts" USING btree (user_id);

CREATE UNIQUE INDEX "userDatabase_artistName_key" ON public."userDatabase" USING btree ("artistName");

CREATE UNIQUE INDEX "userDatabase_avatar_key" ON public."userDatabase" USING btree (avatar);

CREATE UNIQUE INDEX "userDatabase_cryptoAddress_key" ON public."userDatabase" USING btree ("cryptoAddress");

CREATE UNIQUE INDEX "userDatabase_email_key" ON public."userDatabase" USING btree (email);

CREATE UNIQUE INDEX "userDatabase_pkey" ON public."userDatabase" USING btree ("userId");

CREATE UNIQUE INDEX "userDatabase_username_key" ON public."userDatabase" USING btree (username);

CREATE UNIQUE INDEX "userLikedArtists_pkey" ON public."userLikedArtists" USING btree (user_id, artist_id);

CREATE UNIQUE INDEX "userLikedExperiences_pkey" ON public."userLikedExperiences" USING btree (experience_id, user_id);

CREATE UNIQUE INDEX "userLikedNFTs_pkey" ON public."userLikedNFTs" USING btree (user_id, nft_id);

CREATE UNIQUE INDEX "userPosts_user_avatar_key" ON public."userPosts" USING btree (avatar);

CREATE UNIQUE INDEX userposts_pkey ON public."userPosts" USING btree (id);

alter table "public"."experiencesDatabase" add constraint "experiencesDatabase_pkey" PRIMARY KEY using index "experiencesDatabase_pkey";

alter table "public"."globalNFTs" add constraint "GlobalNFTs_pkey" PRIMARY KEY using index "GlobalNFTs_pkey";

alter table "public"."globalTickets" add constraint "globalTickets_pkey" PRIMARY KEY using index "globalTickets_pkey";

alter table "public"."globalTransactions" add constraint "globalTransactions_pkey" PRIMARY KEY using index "globalTransactions_pkey";

alter table "public"."userDatabase" add constraint "userDatabase_pkey" PRIMARY KEY using index "userDatabase_pkey";

alter table "public"."userLikedArtists" add constraint "userLikedArtists_pkey" PRIMARY KEY using index "userLikedArtists_pkey";

alter table "public"."userLikedExperiences" add constraint "userLikedExperiences_pkey" PRIMARY KEY using index "userLikedExperiences_pkey";

alter table "public"."userLikedNFTs" add constraint "userLikedNFTs_pkey" PRIMARY KEY using index "userLikedNFTs_pkey";

alter table "public"."userPosts" add constraint "userposts_pkey" PRIMARY KEY using index "userposts_pkey";

alter table "public"."experiencesDatabase" add constraint "experiencesDatabase_artist_avatar_fkey" FOREIGN KEY (artist_avatar) REFERENCES "userDatabase"(avatar) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."experiencesDatabase" validate constraint "experiencesDatabase_artist_avatar_fkey";

alter table "public"."experiencesDatabase" add constraint "experiencesDatabase_artist_id_fkey" FOREIGN KEY (artist_id) REFERENCES "userDatabase"("userId") ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."experiencesDatabase" validate constraint "experiencesDatabase_artist_id_fkey";

alter table "public"."experiencesDatabase" add constraint "experiencesDatabase_artist_name_fkey" FOREIGN KEY (artist_name) REFERENCES "userDatabase"("artistName") ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."experiencesDatabase" validate constraint "experiencesDatabase_artist_name_fkey";

alter table "public"."experiencesDatabase" add constraint "experiencesDatabase_experience_banner_key" UNIQUE using index "experiencesDatabase_experience_banner_key";

alter table "public"."experiencesDatabase" add constraint "experiencesDatabase_experience_id_experience_name_artist_na_key" UNIQUE using index "experiencesDatabase_experience_id_experience_name_artist_na_key";

alter table "public"."experiencesDatabase" add constraint "experiencesDatabase_experience_id_key" UNIQUE using index "experiencesDatabase_experience_id_key";

alter table "public"."globalNFTs" add constraint "globalNFTs_creator_id_fkey" FOREIGN KEY (creator_id) REFERENCES "userDatabase"("userId") ON UPDATE CASCADE not valid;

alter table "public"."globalNFTs" validate constraint "globalNFTs_creator_id_fkey";

alter table "public"."globalNFTs" add constraint "globalNFTs_experience_id_fkey" FOREIGN KEY (experience_id) REFERENCES "experiencesDatabase"(experience_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."globalNFTs" validate constraint "globalNFTs_experience_id_fkey";

alter table "public"."globalNFTs" add constraint "globalNFTs_owner_id_fkey" FOREIGN KEY (owner_id) REFERENCES "userDatabase"("userId") ON UPDATE CASCADE not valid;

alter table "public"."globalNFTs" validate constraint "globalNFTs_owner_id_fkey";

alter table "public"."globalTickets" add constraint "globalTickets_experience_id_fkey" FOREIGN KEY (experience_id) REFERENCES "experiencesDatabase"(experience_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."globalTickets" validate constraint "globalTickets_experience_id_fkey";

alter table "public"."globalTickets" add constraint "globalTickets_id_key" UNIQUE using index "globalTickets_id_key";

alter table "public"."globalTickets" add constraint "globalTickets_user_id_fkey" FOREIGN KEY (user_id) REFERENCES "userDatabase"("userId") ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."globalTickets" validate constraint "globalTickets_user_id_fkey";

alter table "public"."globalTransactions" add constraint "globalTransactions_buyer_id_fkey" FOREIGN KEY (buyer_id) REFERENCES "userDatabase"("userId") ON UPDATE CASCADE not valid;

alter table "public"."globalTransactions" validate constraint "globalTransactions_buyer_id_fkey";

alter table "public"."globalTransactions" add constraint "globalTransactions_nft_id_fkey" FOREIGN KEY (nft_id) REFERENCES "globalNFTs"(id) ON UPDATE CASCADE not valid;

alter table "public"."globalTransactions" validate constraint "globalTransactions_nft_id_fkey";

alter table "public"."globalTransactions" add constraint "globalTransactions_seller_id_fkey" FOREIGN KEY (seller_id) REFERENCES "userDatabase"("userId") ON UPDATE CASCADE not valid;

alter table "public"."globalTransactions" validate constraint "globalTransactions_seller_id_fkey";

alter table "public"."userDatabase" add constraint "public_userDatabase_userId_fkey" FOREIGN KEY ("userId") REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."userDatabase" validate constraint "public_userDatabase_userId_fkey";

alter table "public"."userDatabase" add constraint "userDatabase_artistName_key" UNIQUE using index "userDatabase_artistName_key";

alter table "public"."userDatabase" add constraint "userDatabase_avatar_key" UNIQUE using index "userDatabase_avatar_key";

alter table "public"."userDatabase" add constraint "userDatabase_cryptoAddress_key" UNIQUE using index "userDatabase_cryptoAddress_key";

alter table "public"."userDatabase" add constraint "userDatabase_email_key" UNIQUE using index "userDatabase_email_key";

alter table "public"."userDatabase" add constraint "userDatabase_username_key" UNIQUE using index "userDatabase_username_key";

alter table "public"."userLikedArtists" add constraint "userLikedArtists_artist_id_fkey" FOREIGN KEY (artist_id) REFERENCES "userDatabase"("userId") ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."userLikedArtists" validate constraint "userLikedArtists_artist_id_fkey";

alter table "public"."userLikedArtists" add constraint "userLikedArtists_user_id_fkey" FOREIGN KEY (user_id) REFERENCES "userDatabase"("userId") ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."userLikedArtists" validate constraint "userLikedArtists_user_id_fkey";

alter table "public"."userLikedExperiences" add constraint "userLikedExperiences_experience_id_fkey" FOREIGN KEY (experience_id) REFERENCES "experiencesDatabase"(experience_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."userLikedExperiences" validate constraint "userLikedExperiences_experience_id_fkey";

alter table "public"."userLikedExperiences" add constraint "userLikedExperiences_user_id_fkey" FOREIGN KEY (user_id) REFERENCES "userDatabase"("userId") ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."userLikedExperiences" validate constraint "userLikedExperiences_user_id_fkey";

alter table "public"."userLikedNFTs" add constraint "userLikedNFTs_nft_id_fkey" FOREIGN KEY (nft_id) REFERENCES "globalNFTs"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."userLikedNFTs" validate constraint "userLikedNFTs_nft_id_fkey";

alter table "public"."userLikedNFTs" add constraint "userLikedNFTs_user_id_fkey" FOREIGN KEY (user_id) REFERENCES "userDatabase"("userId") ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."userLikedNFTs" validate constraint "userLikedNFTs_user_id_fkey";

alter table "public"."userPosts" add constraint "public_userPosts_username_fkey" FOREIGN KEY (username) REFERENCES "userDatabase"(username) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."userPosts" validate constraint "public_userPosts_username_fkey";

alter table "public"."userPosts" add constraint "userPosts_avatar_fkey" FOREIGN KEY (avatar) REFERENCES "userDatabase"(avatar) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."userPosts" validate constraint "userPosts_avatar_fkey";

alter table "public"."userPosts" add constraint "userPosts_crypto_address_fkey" FOREIGN KEY (crypto_address) REFERENCES "userDatabase"("cryptoAddress") ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."userPosts" validate constraint "userPosts_crypto_address_fkey";

alter table "public"."userPosts" add constraint "userPosts_user_avatar_key" UNIQUE using index "userPosts_user_avatar_key";

alter table "public"."userPosts" add constraint "userPosts_user_id_fkey" FOREIGN KEY (user_id) REFERENCES "userDatabase"("userId") ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."userPosts" validate constraint "userPosts_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.enforce_favorite_count_update()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
  -- Check if any columns other than favorite_count are being updated
  IF TG_OP = 'UPDATE' AND (OLD.favorite_count IS DISTINCT FROM NEW.favorite_count) THEN
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    RAISE EXCEPTION 'Only favorite_count column can be updated';
  END IF;
  RETURN NEW;
END;$function$
;

grant delete on table "public"."experiencesDatabase" to "anon";

grant insert on table "public"."experiencesDatabase" to "anon";

grant references on table "public"."experiencesDatabase" to "anon";

grant select on table "public"."experiencesDatabase" to "anon";

grant trigger on table "public"."experiencesDatabase" to "anon";

grant truncate on table "public"."experiencesDatabase" to "anon";

grant update on table "public"."experiencesDatabase" to "anon";

grant delete on table "public"."experiencesDatabase" to "authenticated";

grant insert on table "public"."experiencesDatabase" to "authenticated";

grant references on table "public"."experiencesDatabase" to "authenticated";

grant select on table "public"."experiencesDatabase" to "authenticated";

grant trigger on table "public"."experiencesDatabase" to "authenticated";

grant truncate on table "public"."experiencesDatabase" to "authenticated";

grant update on table "public"."experiencesDatabase" to "authenticated";

grant delete on table "public"."experiencesDatabase" to "service_role";

grant insert on table "public"."experiencesDatabase" to "service_role";

grant references on table "public"."experiencesDatabase" to "service_role";

grant select on table "public"."experiencesDatabase" to "service_role";

grant trigger on table "public"."experiencesDatabase" to "service_role";

grant truncate on table "public"."experiencesDatabase" to "service_role";

grant update on table "public"."experiencesDatabase" to "service_role";

grant delete on table "public"."globalNFTs" to "anon";

grant insert on table "public"."globalNFTs" to "anon";

grant references on table "public"."globalNFTs" to "anon";

grant select on table "public"."globalNFTs" to "anon";

grant trigger on table "public"."globalNFTs" to "anon";

grant truncate on table "public"."globalNFTs" to "anon";

grant update on table "public"."globalNFTs" to "anon";

grant delete on table "public"."globalNFTs" to "authenticated";

grant insert on table "public"."globalNFTs" to "authenticated";

grant references on table "public"."globalNFTs" to "authenticated";

grant select on table "public"."globalNFTs" to "authenticated";

grant trigger on table "public"."globalNFTs" to "authenticated";

grant truncate on table "public"."globalNFTs" to "authenticated";

grant update on table "public"."globalNFTs" to "authenticated";

grant delete on table "public"."globalNFTs" to "service_role";

grant insert on table "public"."globalNFTs" to "service_role";

grant references on table "public"."globalNFTs" to "service_role";

grant select on table "public"."globalNFTs" to "service_role";

grant trigger on table "public"."globalNFTs" to "service_role";

grant truncate on table "public"."globalNFTs" to "service_role";

grant update on table "public"."globalNFTs" to "service_role";

grant delete on table "public"."globalTickets" to "anon";

grant insert on table "public"."globalTickets" to "anon";

grant references on table "public"."globalTickets" to "anon";

grant select on table "public"."globalTickets" to "anon";

grant trigger on table "public"."globalTickets" to "anon";

grant truncate on table "public"."globalTickets" to "anon";

grant update on table "public"."globalTickets" to "anon";

grant delete on table "public"."globalTickets" to "authenticated";

grant insert on table "public"."globalTickets" to "authenticated";

grant references on table "public"."globalTickets" to "authenticated";

grant select on table "public"."globalTickets" to "authenticated";

grant trigger on table "public"."globalTickets" to "authenticated";

grant truncate on table "public"."globalTickets" to "authenticated";

grant update on table "public"."globalTickets" to "authenticated";

grant delete on table "public"."globalTickets" to "service_role";

grant insert on table "public"."globalTickets" to "service_role";

grant references on table "public"."globalTickets" to "service_role";

grant select on table "public"."globalTickets" to "service_role";

grant trigger on table "public"."globalTickets" to "service_role";

grant truncate on table "public"."globalTickets" to "service_role";

grant update on table "public"."globalTickets" to "service_role";

grant delete on table "public"."globalTransactions" to "anon";

grant insert on table "public"."globalTransactions" to "anon";

grant references on table "public"."globalTransactions" to "anon";

grant select on table "public"."globalTransactions" to "anon";

grant trigger on table "public"."globalTransactions" to "anon";

grant truncate on table "public"."globalTransactions" to "anon";

grant update on table "public"."globalTransactions" to "anon";

grant delete on table "public"."globalTransactions" to "authenticated";

grant insert on table "public"."globalTransactions" to "authenticated";

grant references on table "public"."globalTransactions" to "authenticated";

grant select on table "public"."globalTransactions" to "authenticated";

grant trigger on table "public"."globalTransactions" to "authenticated";

grant truncate on table "public"."globalTransactions" to "authenticated";

grant update on table "public"."globalTransactions" to "authenticated";

grant delete on table "public"."globalTransactions" to "service_role";

grant insert on table "public"."globalTransactions" to "service_role";

grant references on table "public"."globalTransactions" to "service_role";

grant select on table "public"."globalTransactions" to "service_role";

grant trigger on table "public"."globalTransactions" to "service_role";

grant truncate on table "public"."globalTransactions" to "service_role";

grant update on table "public"."globalTransactions" to "service_role";

grant delete on table "public"."userDatabase" to "anon";

grant insert on table "public"."userDatabase" to "anon";

grant references on table "public"."userDatabase" to "anon";

grant select on table "public"."userDatabase" to "anon";

grant trigger on table "public"."userDatabase" to "anon";

grant truncate on table "public"."userDatabase" to "anon";

grant update on table "public"."userDatabase" to "anon";

grant delete on table "public"."userDatabase" to "authenticated";

grant insert on table "public"."userDatabase" to "authenticated";

grant references on table "public"."userDatabase" to "authenticated";

grant select on table "public"."userDatabase" to "authenticated";

grant trigger on table "public"."userDatabase" to "authenticated";

grant truncate on table "public"."userDatabase" to "authenticated";

grant update on table "public"."userDatabase" to "authenticated";

grant delete on table "public"."userDatabase" to "service_role";

grant insert on table "public"."userDatabase" to "service_role";

grant references on table "public"."userDatabase" to "service_role";

grant select on table "public"."userDatabase" to "service_role";

grant trigger on table "public"."userDatabase" to "service_role";

grant truncate on table "public"."userDatabase" to "service_role";

grant update on table "public"."userDatabase" to "service_role";

grant delete on table "public"."userLikedArtists" to "anon";

grant insert on table "public"."userLikedArtists" to "anon";

grant references on table "public"."userLikedArtists" to "anon";

grant select on table "public"."userLikedArtists" to "anon";

grant trigger on table "public"."userLikedArtists" to "anon";

grant truncate on table "public"."userLikedArtists" to "anon";

grant update on table "public"."userLikedArtists" to "anon";

grant delete on table "public"."userLikedArtists" to "authenticated";

grant insert on table "public"."userLikedArtists" to "authenticated";

grant references on table "public"."userLikedArtists" to "authenticated";

grant select on table "public"."userLikedArtists" to "authenticated";

grant trigger on table "public"."userLikedArtists" to "authenticated";

grant truncate on table "public"."userLikedArtists" to "authenticated";

grant update on table "public"."userLikedArtists" to "authenticated";

grant delete on table "public"."userLikedArtists" to "service_role";

grant insert on table "public"."userLikedArtists" to "service_role";

grant references on table "public"."userLikedArtists" to "service_role";

grant select on table "public"."userLikedArtists" to "service_role";

grant trigger on table "public"."userLikedArtists" to "service_role";

grant truncate on table "public"."userLikedArtists" to "service_role";

grant update on table "public"."userLikedArtists" to "service_role";

grant delete on table "public"."userLikedExperiences" to "anon";

grant insert on table "public"."userLikedExperiences" to "anon";

grant references on table "public"."userLikedExperiences" to "anon";

grant select on table "public"."userLikedExperiences" to "anon";

grant trigger on table "public"."userLikedExperiences" to "anon";

grant truncate on table "public"."userLikedExperiences" to "anon";

grant update on table "public"."userLikedExperiences" to "anon";

grant delete on table "public"."userLikedExperiences" to "authenticated";

grant insert on table "public"."userLikedExperiences" to "authenticated";

grant references on table "public"."userLikedExperiences" to "authenticated";

grant select on table "public"."userLikedExperiences" to "authenticated";

grant trigger on table "public"."userLikedExperiences" to "authenticated";

grant truncate on table "public"."userLikedExperiences" to "authenticated";

grant update on table "public"."userLikedExperiences" to "authenticated";

grant delete on table "public"."userLikedExperiences" to "service_role";

grant insert on table "public"."userLikedExperiences" to "service_role";

grant references on table "public"."userLikedExperiences" to "service_role";

grant select on table "public"."userLikedExperiences" to "service_role";

grant trigger on table "public"."userLikedExperiences" to "service_role";

grant truncate on table "public"."userLikedExperiences" to "service_role";

grant update on table "public"."userLikedExperiences" to "service_role";

grant delete on table "public"."userLikedNFTs" to "anon";

grant insert on table "public"."userLikedNFTs" to "anon";

grant references on table "public"."userLikedNFTs" to "anon";

grant select on table "public"."userLikedNFTs" to "anon";

grant trigger on table "public"."userLikedNFTs" to "anon";

grant truncate on table "public"."userLikedNFTs" to "anon";

grant update on table "public"."userLikedNFTs" to "anon";

grant delete on table "public"."userLikedNFTs" to "authenticated";

grant insert on table "public"."userLikedNFTs" to "authenticated";

grant references on table "public"."userLikedNFTs" to "authenticated";

grant select on table "public"."userLikedNFTs" to "authenticated";

grant trigger on table "public"."userLikedNFTs" to "authenticated";

grant truncate on table "public"."userLikedNFTs" to "authenticated";

grant update on table "public"."userLikedNFTs" to "authenticated";

grant delete on table "public"."userLikedNFTs" to "service_role";

grant insert on table "public"."userLikedNFTs" to "service_role";

grant references on table "public"."userLikedNFTs" to "service_role";

grant select on table "public"."userLikedNFTs" to "service_role";

grant trigger on table "public"."userLikedNFTs" to "service_role";

grant truncate on table "public"."userLikedNFTs" to "service_role";

grant update on table "public"."userLikedNFTs" to "service_role";

grant delete on table "public"."userPosts" to "anon";

grant insert on table "public"."userPosts" to "anon";

grant references on table "public"."userPosts" to "anon";

grant select on table "public"."userPosts" to "anon";

grant trigger on table "public"."userPosts" to "anon";

grant truncate on table "public"."userPosts" to "anon";

grant update on table "public"."userPosts" to "anon";

grant delete on table "public"."userPosts" to "authenticated";

grant insert on table "public"."userPosts" to "authenticated";

grant references on table "public"."userPosts" to "authenticated";

grant select on table "public"."userPosts" to "authenticated";

grant trigger on table "public"."userPosts" to "authenticated";

grant truncate on table "public"."userPosts" to "authenticated";

grant update on table "public"."userPosts" to "authenticated";

grant delete on table "public"."userPosts" to "service_role";

grant insert on table "public"."userPosts" to "service_role";

grant references on table "public"."userPosts" to "service_role";

grant select on table "public"."userPosts" to "service_role";

grant trigger on table "public"."userPosts" to "service_role";

grant truncate on table "public"."userPosts" to "service_role";

grant update on table "public"."userPosts" to "service_role";

create policy "Allow All Users To View Rows"
on "public"."experiencesDatabase"
as permissive
for select
to authenticated
using (true);


create policy "ADMIN HAS FULL ACCESS"
on "public"."globalNFTs"
as permissive
for all
to supabase_admin
using ((auth.role() = 'admin'::text));


create policy "Allow Users To Insert Their Own NFTs"
on "public"."globalNFTs"
as permissive
for insert
to authenticated
with check ((auth.uid() = creator_id));


create policy "Allow Users To Read All NFTs"
on "public"."globalNFTs"
as permissive
for select
to authenticated
using (true);


create policy "Allow Users To Update Their Own NFTs"
on "public"."globalNFTs"
as permissive
for update
to authenticated
using ((auth.uid() = creator_id));


create policy "Anon can read public NFTs"
on "public"."globalNFTs"
as permissive
for select
to anon
using (((metadata ->> 'public'::text) = 'true'::text));


create policy "Auth User Can Only Update the favorite_counter Column"
on "public"."globalNFTs"
as permissive
for update
to public
using ((auth.role() = 'authenticated'::text));


create policy "Allow All Users to Read Their Data"
on "public"."globalTickets"
as permissive
for select
to authenticated
using (true);


create policy "Allow User To Insert A Row"
on "public"."globalTickets"
as permissive
for insert
to authenticated
with check (true);


create policy "Allow Users To Update A Row"
on "public"."globalTickets"
as permissive
for update
to authenticated
using (true);


create policy "ADMIN HAS FULL ACCESS"
on "public"."globalTransactions"
as permissive
for all
to supabase_admin
using ((auth.role() = 'admin'::text));


create policy "Allow Users To Update Their Transactions"
on "public"."globalTransactions"
as permissive
for update
to authenticated
using (((auth.uid() = buyer_id) OR (auth.uid() = seller_id)));


create policy "Allow Users to Insert Transactions"
on "public"."globalTransactions"
as permissive
for insert
to authenticated
with check ((auth.uid() IS NOT NULL));


create policy "Allow Users to Read Their Own Transactions Data"
on "public"."globalTransactions"
as permissive
for select
to authenticated
using (((auth.uid() = buyer_id) OR (auth.uid() = seller_id)));


create policy "Allow Signed Up User To Insert Profile In userDatabase"
on "public"."userDatabase"
as permissive
for insert
to public
with check ((auth.uid() = "userId"));


create policy "Allow Signed Up User to Read Their Data In userDatabase"
on "public"."userDatabase"
as permissive
for select
to public
using ((auth.uid() = "userId"));


create policy "Allow User To Edit Their Own Data"
on "public"."userDatabase"
as permissive
for all
to public
using ((auth.uid() = "userId"));


create policy "Enable read access for all users"
on "public"."userDatabase"
as permissive
for select
to public
using (true);


create policy "Allow User To Delete A Liked Artist Row"
on "public"."userLikedArtists"
as permissive
for delete
to authenticated
using (true);


create policy "Allow Users To Insert A Liked Artist Row"
on "public"."userLikedArtists"
as permissive
for insert
to authenticated
with check (true);


create policy "Allow Users To View Their Likes"
on "public"."userLikedArtists"
as permissive
for select
to authenticated
using (true);


create policy "Allow User To Add Rows"
on "public"."userLikedNFTs"
as permissive
for insert
to authenticated
with check (true);


create policy "Allow Users To Delete  A Row"
on "public"."userLikedNFTs"
as permissive
for delete
to authenticated
using (true);


create policy "Allow Users To View Likes"
on "public"."userLikedNFTs"
as permissive
for select
to authenticated
using (true);


create policy "Allows User/Fan To Delete A Post"
on "public"."userPosts"
as permissive
for delete
to public
using ((user_id = auth.uid()));


create policy "Allows User/Fan To Publish A Post"
on "public"."userPosts"
as permissive
for insert
to public
with check ((user_id = auth.uid()));


create policy "Allows User/Fan To Read/Access A Post"
on "public"."userPosts"
as permissive
for select
to public
using (true);


create policy "Allows User/Fan To Update A Post"
on "public"."userPosts"
as permissive
for update
to public
using ((user_id = auth.uid()));


CREATE TRIGGER enforce_favorite_count_update_trigger BEFORE UPDATE ON public."globalNFTs" FOR EACH ROW EXECUTE FUNCTION enforce_favorite_count_update();


