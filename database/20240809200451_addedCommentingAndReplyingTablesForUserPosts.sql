create table "public"."userCommentsOnPosts" (
    "comment_id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text),
    "user_id" uuid default gen_random_uuid(),
    "post_id" uuid,
    "comment_content" text,
    "favorite_count" numeric default '0'::numeric
);


alter table "public"."userCommentsOnPosts" enable row level security;

create table "public"."userLikedComments" (
    "commnet_like_id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "comment_id" uuid,
    "user_id" uuid
);


alter table "public"."userLikedComments" enable row level security;

create table "public"."userLikedPosts" (
    "like_id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "created_at" timestamp with time zone not null default now(),
    "post_id" uuid
);


alter table "public"."userLikedPosts" enable row level security;

create table "public"."userLikedReplies" (
    "reply_like_id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text),
    "user_id" uuid,
    "reply_id" uuid
);


alter table "public"."userLikedReplies" enable row level security;

create table "public"."userRepliesToPostComments" (
    "reply_id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "comment_id" uuid,
    "post_id" uuid,
    "reply_content" text,
    "created_at" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text),
    "favorite_count" numeric default '0'::numeric
);


alter table "public"."userRepliesToPostComments" enable row level security;

alter table "public"."userPosts" add column "favorite_count" numeric default '0'::numeric;

CREATE UNIQUE INDEX "userCommentsOnPosts_pkey" ON public."userCommentsOnPosts" USING btree (comment_id);

CREATE UNIQUE INDEX "userLikedComments_pkey" ON public."userLikedComments" USING btree (commnet_like_id);

CREATE UNIQUE INDEX "userLikedPosts_pkey" ON public."userLikedPosts" USING btree (like_id);

CREATE UNIQUE INDEX "userLikedReplies_pkey" ON public."userLikedReplies" USING btree (reply_like_id);

CREATE UNIQUE INDEX "userRepliesToPostComments_pkey" ON public."userRepliesToPostComments" USING btree (reply_id);

alter table "public"."userCommentsOnPosts" add constraint "userCommentsOnPosts_pkey" PRIMARY KEY using index "userCommentsOnPosts_pkey";

alter table "public"."userLikedComments" add constraint "userLikedComments_pkey" PRIMARY KEY using index "userLikedComments_pkey";

alter table "public"."userLikedPosts" add constraint "userLikedPosts_pkey" PRIMARY KEY using index "userLikedPosts_pkey";

alter table "public"."userLikedReplies" add constraint "userLikedReplies_pkey" PRIMARY KEY using index "userLikedReplies_pkey";

alter table "public"."userRepliesToPostComments" add constraint "userRepliesToPostComments_pkey" PRIMARY KEY using index "userRepliesToPostComments_pkey";

alter table "public"."userCommentsOnPosts" add constraint "userCommentsOnPosts_post_id_fkey" FOREIGN KEY (post_id) REFERENCES "userPosts"(post_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."userCommentsOnPosts" validate constraint "userCommentsOnPosts_post_id_fkey";

alter table "public"."userCommentsOnPosts" add constraint "userCommentsOnPosts_user_id_fkey" FOREIGN KEY (user_id) REFERENCES "userDatabase"("userId") ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."userCommentsOnPosts" validate constraint "userCommentsOnPosts_user_id_fkey";

alter table "public"."userLikedComments" add constraint "userLikedComments_comment_id_fkey" FOREIGN KEY (comment_id) REFERENCES "userCommentsOnPosts"(comment_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."userLikedComments" validate constraint "userLikedComments_comment_id_fkey";

alter table "public"."userLikedComments" add constraint "userLikedComments_user_id_fkey" FOREIGN KEY (user_id) REFERENCES "userDatabase"("userId") ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."userLikedComments" validate constraint "userLikedComments_user_id_fkey";

alter table "public"."userLikedPosts" add constraint "userLikedPosts_post_id_fkey" FOREIGN KEY (post_id) REFERENCES "userPosts"(post_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."userLikedPosts" validate constraint "userLikedPosts_post_id_fkey";

alter table "public"."userLikedPosts" add constraint "userLikedPosts_user_id_fkey" FOREIGN KEY (user_id) REFERENCES "userDatabase"("userId") ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."userLikedPosts" validate constraint "userLikedPosts_user_id_fkey";

alter table "public"."userLikedReplies" add constraint "userLikedReplies_reply_id_fkey" FOREIGN KEY (reply_id) REFERENCES "userRepliesToPostComments"(reply_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."userLikedReplies" validate constraint "userLikedReplies_reply_id_fkey";

alter table "public"."userLikedReplies" add constraint "userLikedReplies_user_id_fkey" FOREIGN KEY (user_id) REFERENCES "userDatabase"("userId") ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."userLikedReplies" validate constraint "userLikedReplies_user_id_fkey";

alter table "public"."userRepliesToPostComments" add constraint "userRepliesToPostComments_comment_id_fkey" FOREIGN KEY (comment_id) REFERENCES "userCommentsOnPosts"(comment_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."userRepliesToPostComments" validate constraint "userRepliesToPostComments_comment_id_fkey";

alter table "public"."userRepliesToPostComments" add constraint "userRepliesToPostComments_post_id_fkey" FOREIGN KEY (post_id) REFERENCES "userPosts"(post_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."userRepliesToPostComments" validate constraint "userRepliesToPostComments_post_id_fkey";

alter table "public"."userRepliesToPostComments" add constraint "userRepliesToPostComments_user_id_fkey" FOREIGN KEY (user_id) REFERENCES "userDatabase"("userId") ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."userRepliesToPostComments" validate constraint "userRepliesToPostComments_user_id_fkey";

grant delete on table "public"."userCommentsOnPosts" to "anon";

grant insert on table "public"."userCommentsOnPosts" to "anon";

grant references on table "public"."userCommentsOnPosts" to "anon";

grant select on table "public"."userCommentsOnPosts" to "anon";

grant trigger on table "public"."userCommentsOnPosts" to "anon";

grant truncate on table "public"."userCommentsOnPosts" to "anon";

grant update on table "public"."userCommentsOnPosts" to "anon";

grant delete on table "public"."userCommentsOnPosts" to "authenticated";

grant insert on table "public"."userCommentsOnPosts" to "authenticated";

grant references on table "public"."userCommentsOnPosts" to "authenticated";

grant select on table "public"."userCommentsOnPosts" to "authenticated";

grant trigger on table "public"."userCommentsOnPosts" to "authenticated";

grant truncate on table "public"."userCommentsOnPosts" to "authenticated";

grant update on table "public"."userCommentsOnPosts" to "authenticated";

grant delete on table "public"."userCommentsOnPosts" to "service_role";

grant insert on table "public"."userCommentsOnPosts" to "service_role";

grant references on table "public"."userCommentsOnPosts" to "service_role";

grant select on table "public"."userCommentsOnPosts" to "service_role";

grant trigger on table "public"."userCommentsOnPosts" to "service_role";

grant truncate on table "public"."userCommentsOnPosts" to "service_role";

grant update on table "public"."userCommentsOnPosts" to "service_role";

grant delete on table "public"."userLikedComments" to "anon";

grant insert on table "public"."userLikedComments" to "anon";

grant references on table "public"."userLikedComments" to "anon";

grant select on table "public"."userLikedComments" to "anon";

grant trigger on table "public"."userLikedComments" to "anon";

grant truncate on table "public"."userLikedComments" to "anon";

grant update on table "public"."userLikedComments" to "anon";

grant delete on table "public"."userLikedComments" to "authenticated";

grant insert on table "public"."userLikedComments" to "authenticated";

grant references on table "public"."userLikedComments" to "authenticated";

grant select on table "public"."userLikedComments" to "authenticated";

grant trigger on table "public"."userLikedComments" to "authenticated";

grant truncate on table "public"."userLikedComments" to "authenticated";

grant update on table "public"."userLikedComments" to "authenticated";

grant delete on table "public"."userLikedComments" to "service_role";

grant insert on table "public"."userLikedComments" to "service_role";

grant references on table "public"."userLikedComments" to "service_role";

grant select on table "public"."userLikedComments" to "service_role";

grant trigger on table "public"."userLikedComments" to "service_role";

grant truncate on table "public"."userLikedComments" to "service_role";

grant update on table "public"."userLikedComments" to "service_role";

grant delete on table "public"."userLikedPosts" to "anon";

grant insert on table "public"."userLikedPosts" to "anon";

grant references on table "public"."userLikedPosts" to "anon";

grant select on table "public"."userLikedPosts" to "anon";

grant trigger on table "public"."userLikedPosts" to "anon";

grant truncate on table "public"."userLikedPosts" to "anon";

grant update on table "public"."userLikedPosts" to "anon";

grant delete on table "public"."userLikedPosts" to "authenticated";

grant insert on table "public"."userLikedPosts" to "authenticated";

grant references on table "public"."userLikedPosts" to "authenticated";

grant select on table "public"."userLikedPosts" to "authenticated";

grant trigger on table "public"."userLikedPosts" to "authenticated";

grant truncate on table "public"."userLikedPosts" to "authenticated";

grant update on table "public"."userLikedPosts" to "authenticated";

grant delete on table "public"."userLikedPosts" to "service_role";

grant insert on table "public"."userLikedPosts" to "service_role";

grant references on table "public"."userLikedPosts" to "service_role";

grant select on table "public"."userLikedPosts" to "service_role";

grant trigger on table "public"."userLikedPosts" to "service_role";

grant truncate on table "public"."userLikedPosts" to "service_role";

grant update on table "public"."userLikedPosts" to "service_role";

grant delete on table "public"."userLikedReplies" to "anon";

grant insert on table "public"."userLikedReplies" to "anon";

grant references on table "public"."userLikedReplies" to "anon";

grant select on table "public"."userLikedReplies" to "anon";

grant trigger on table "public"."userLikedReplies" to "anon";

grant truncate on table "public"."userLikedReplies" to "anon";

grant update on table "public"."userLikedReplies" to "anon";

grant delete on table "public"."userLikedReplies" to "authenticated";

grant insert on table "public"."userLikedReplies" to "authenticated";

grant references on table "public"."userLikedReplies" to "authenticated";

grant select on table "public"."userLikedReplies" to "authenticated";

grant trigger on table "public"."userLikedReplies" to "authenticated";

grant truncate on table "public"."userLikedReplies" to "authenticated";

grant update on table "public"."userLikedReplies" to "authenticated";

grant delete on table "public"."userLikedReplies" to "service_role";

grant insert on table "public"."userLikedReplies" to "service_role";

grant references on table "public"."userLikedReplies" to "service_role";

grant select on table "public"."userLikedReplies" to "service_role";

grant trigger on table "public"."userLikedReplies" to "service_role";

grant truncate on table "public"."userLikedReplies" to "service_role";

grant update on table "public"."userLikedReplies" to "service_role";

grant delete on table "public"."userRepliesToPostComments" to "anon";

grant insert on table "public"."userRepliesToPostComments" to "anon";

grant references on table "public"."userRepliesToPostComments" to "anon";

grant select on table "public"."userRepliesToPostComments" to "anon";

grant trigger on table "public"."userRepliesToPostComments" to "anon";

grant truncate on table "public"."userRepliesToPostComments" to "anon";

grant update on table "public"."userRepliesToPostComments" to "anon";

grant delete on table "public"."userRepliesToPostComments" to "authenticated";

grant insert on table "public"."userRepliesToPostComments" to "authenticated";

grant references on table "public"."userRepliesToPostComments" to "authenticated";

grant select on table "public"."userRepliesToPostComments" to "authenticated";

grant trigger on table "public"."userRepliesToPostComments" to "authenticated";

grant truncate on table "public"."userRepliesToPostComments" to "authenticated";

grant update on table "public"."userRepliesToPostComments" to "authenticated";

grant delete on table "public"."userRepliesToPostComments" to "service_role";

grant insert on table "public"."userRepliesToPostComments" to "service_role";

grant references on table "public"."userRepliesToPostComments" to "service_role";

grant select on table "public"."userRepliesToPostComments" to "service_role";

grant trigger on table "public"."userRepliesToPostComments" to "service_role";

grant truncate on table "public"."userRepliesToPostComments" to "service_role";

grant update on table "public"."userRepliesToPostComments" to "service_role";

create policy "Allow Users To Add Comment"
on "public"."userCommentsOnPosts"
as permissive
for insert
to authenticated
with check (true);


create policy "Allow Users To Read Data"
on "public"."userCommentsOnPosts"
as permissive
for select
to authenticated
using (true);


create policy "Update Favourite Count Column"
on "public"."userCommentsOnPosts"
as permissive
for update
to authenticated
using (true);


create policy "Allow User To Delete Like On Comment"
on "public"."userLikedComments"
as permissive
for delete
to authenticated
using (true);


create policy "Allow User To Insert Like"
on "public"."userLikedComments"
as permissive
for insert
to authenticated
with check (true);


create policy "Allow User To Read Likes On Commnet"
on "public"."userLikedComments"
as permissive
for select
to authenticated
using (true);


create policy "Allow User To Delete Their Like"
on "public"."userLikedPosts"
as permissive
for delete
to authenticated
using (true);


create policy "Allow User To Like a Post"
on "public"."userLikedPosts"
as permissive
for insert
to authenticated
with check (true);


create policy "Allow User To View Likes"
on "public"."userLikedPosts"
as permissive
for select
to authenticated
using (true);


create policy "Allow User To Like  A Reply On A Comment"
on "public"."userLikedReplies"
as permissive
for insert
to authenticated
with check (true);


create policy "Allow User To Read Likes  On  A Reply On A Comment"
on "public"."userLikedReplies"
as permissive
for select
to authenticated
using (true);


create policy "Allow User To Remove A Like On A Reply On A Comment"
on "public"."userLikedReplies"
as permissive
for delete
to authenticated
using (true);


create policy "Allow Users To Post Reply On Comments"
on "public"."userRepliesToPostComments"
as permissive
for insert
to authenticated
with check (true);


create policy "Allow Users To Read Reply On Comments"
on "public"."userRepliesToPostComments"
as permissive
for select
to authenticated
using (true);


create policy "Update Favourite Count Column"
on "public"."userRepliesToPostComments"
as permissive
for update
to authenticated
using (true);



