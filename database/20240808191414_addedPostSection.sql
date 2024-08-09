alter table "public"."userPosts" drop constraint "public_userPosts_username_fkey";

alter table "public"."userPosts" drop constraint "userPosts_avatar_fkey";

alter table "public"."userPosts" drop constraint "userPosts_crypto_address_fkey";

alter table "public"."userPosts" drop constraint "userposts_pkey";

drop index if exists "public"."idx_createdat";

drop index if exists "public"."userposts_pkey";

alter table "public"."userPosts" drop column "avatar";

alter table "public"."userPosts" drop column "created_at";

alter table "public"."userPosts" drop column "crypto_address";

alter table "public"."userPosts" drop column "id";

alter table "public"."userPosts" drop column "username";

alter table "public"."userPosts" add column "post_id" uuid not null default gen_random_uuid();

alter table "public"."userPosts" alter column "likes" drop default;

alter table "public"."userPosts" alter column "likes" set data type numeric using "likes"::numeric;

alter table "public"."userPosts" alter column "media" set data type text[] using "media"::text[];

alter table "public"."userPosts" alter column "timestamp" set default (now() AT TIME ZONE 'utc'::text);

alter table "public"."userPosts" alter column "timestamp" set data type timestamp with time zone using "timestamp"::timestamp with time zone;

CREATE UNIQUE INDEX userposts_pkey ON public."userPosts" USING btree (post_id);

alter table "public"."userPosts" add constraint "userposts_pkey" PRIMARY KEY using index "userposts_pkey";


