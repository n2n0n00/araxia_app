alter table "public"."userPosts" add column "post_fandom_name" text;

alter table "public"."userPosts" add column "post_location" text;

alter table "public"."userPosts" add column "post_song" text;

alter table "public"."userPosts" alter column "likes" set default '0'::numeric;

alter table "public"."userPosts" add constraint "userPosts_post_fandom_name_fkey" FOREIGN KEY (post_fandom_name) REFERENCES "fandomsDatabase"(fandom_name) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."userPosts" validate constraint "userPosts_post_fandom_name_fkey";


