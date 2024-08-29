alter table "public"."userCommentsOnPosts" add constraint "userCommentsOnPosts_favorite_count_check" CHECK ((favorite_count > ('-1'::integer)::numeric)) not valid;

alter table "public"."userCommentsOnPosts" validate constraint "userCommentsOnPosts_favorite_count_check";

alter table "public"."userRepliesToPostComments" add constraint "userRepliesToPostComments_favorite_count_check" CHECK ((favorite_count > ('-1'::integer)::numeric)) not valid;

alter table "public"."userRepliesToPostComments" validate constraint "userRepliesToPostComments_favorite_count_check";


