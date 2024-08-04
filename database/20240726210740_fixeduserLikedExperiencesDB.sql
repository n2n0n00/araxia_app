alter table "public"."userDatabase" drop constraint "userDatabase_email_key";

alter table "public"."userPosts" drop constraint "userPosts_user_avatar_key";

drop index if exists "public"."userDatabase_email_key";

drop index if exists "public"."userPosts_user_avatar_key";

alter table "public"."experiencesDatabase" add column "experience_currency" text;

alter table "public"."experiencesDatabase" add column "experience_price" numeric;

alter table "public"."experiencesDatabase" add column "favorite_count" numeric;

alter table "public"."userDatabase" alter column "avatar" set default ''::text;

create policy "Allow User to Add or Remove a Like From An Experience"
on "public"."userLikedExperiences"
as permissive
for all
to authenticated
using (true);



