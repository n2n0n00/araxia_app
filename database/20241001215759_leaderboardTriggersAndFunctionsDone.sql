alter table "public"."leaderboardRanks" drop constraint "leaderboardRanks_pkey";

drop index if exists "public"."leaderboardRanks_pkey";

alter table "public"."experiencesDatabase" add column "city_latitude" numeric;

alter table "public"."experiencesDatabase" add column "city_longitude" numeric;

alter table "public"."leaderboardRanks" add column "id" uuid not null default gen_random_uuid();

alter table "public"."leaderboardRanks" add column "updated_at" timestamp with time zone default (now() AT TIME ZONE 'utc'::text);

alter table "public"."leaderboardRanks" add column "user_rank" numeric;

CREATE UNIQUE INDEX "leaderboardRanks_id_key" ON public."leaderboardRanks" USING btree (id);

CREATE UNIQUE INDEX unique_user_experience ON public."leaderboardRanks" USING btree (user_id, experience_id);

CREATE UNIQUE INDEX "leaderboardRanks_pkey" ON public."leaderboardRanks" USING btree (id);

alter table "public"."leaderboardRanks" add constraint "leaderboardRanks_pkey" PRIMARY KEY using index "leaderboardRanks_pkey";

alter table "public"."leaderboardRanks" add constraint "leaderboardRanks_id_key" UNIQUE using index "leaderboardRanks_id_key";

alter table "public"."leaderboardRanks" add constraint "unique_user_experience" UNIQUE using index "unique_user_experience";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.trigger_update_xp_and_friends_on_friend_change()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    affected_user_id UUID;
    exp_record RECORD;
BEGIN
    -- Determine which user needs updating
    IF TG_OP = 'INSERT' THEN
        affected_user_id := NEW.user_who_followed_id;
    ELSIF TG_OP = 'DELETE' THEN
        affected_user_id := OLD.user_who_followed_id;
    END IF;

    -- For each experience the user is part of, update their rank
    FOR exp_record IN 
        SELECT DISTINCT experience_id 
        FROM "globalNFTs"
        WHERE owner_id = affected_user_id
    LOOP
        -- Update or insert into leaderboardRanks
        INSERT INTO "leaderboardRanks" (
            user_id, 
            experience_id, 
            user_xp, 
            user_friends
        )
        SELECT 
            affected_user_id,
            exp_record.experience_id,
            (SELECT COUNT(*) * 50 FROM "globalNFTs" WHERE owner_id = affected_user_id AND experience_id = exp_record.experience_id) +
            (SELECT COUNT(*) * 20 FROM "followingList" WHERE user_who_followed_id = affected_user_id),
            (SELECT COUNT(*) FROM "followingList" WHERE user_who_followed_id = affected_user_id)
        ON CONFLICT (user_id, experience_id) 
        DO UPDATE SET 
            user_xp = (SELECT COUNT(*) * 50 FROM "globalNFTs" WHERE owner_id = affected_user_id AND experience_id = exp_record.experience_id) +
                      (SELECT COUNT(*) * 20 FROM "followingList" WHERE user_who_followed_id = affected_user_id),
            user_friends = (SELECT COUNT(*) FROM "followingList" WHERE user_who_followed_id = affected_user_id),
            updated_at = (now() at time zone 'utc');
    END LOOP;

    -- Update ranks for all users in affected experiences
    UPDATE "leaderboardRanks" lr
    SET user_rank = ranked.rank
    FROM (
        SELECT 
            user_id,
            experience_id,
            RANK() OVER (PARTITION BY experience_id ORDER BY user_xp DESC) as rank
        FROM "leaderboardRanks"
        WHERE experience_id IN (
            SELECT DISTINCT experience_id 
            FROM "globalNFTs"
            WHERE owner_id = affected_user_id
        )
    ) ranked
    WHERE lr.user_id = ranked.user_id AND lr.experience_id = ranked.experience_id;

    RETURN NULL;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.trigger_update_xp_and_friends_on_nft_change()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    old_owner_id UUID;
    new_owner_id UUID;
    affected_experience_id UUID;
BEGIN
    -- Determine which users and experience need updating
    IF TG_OP = 'UPDATE' THEN
        old_owner_id := OLD.owner_id;
        new_owner_id := NEW.owner_id;
        affected_experience_id := NEW.experience_id;
    ELSIF TG_OP = 'INSERT' THEN
        new_owner_id := NEW.owner_id;
        affected_experience_id := NEW.experience_id;
    END IF;

    -- Update or create leaderboard entry for new owner
    IF new_owner_id IS NOT NULL THEN
        INSERT INTO "leaderboardRanks" (
            user_id, 
            experience_id, 
            user_xp, 
            user_friends
        )
        SELECT 
            new_owner_id,
            affected_experience_id,
            (SELECT COUNT(*) * 50 FROM "globalNFTs" WHERE owner_id = new_owner_id AND experience_id = affected_experience_id) +
            (SELECT COUNT(*) * 20 FROM "followingList" WHERE user_who_followed_id = new_owner_id),
            (SELECT COUNT(*) FROM "followingList" WHERE user_who_followed_id = new_owner_id)
        ON CONFLICT (user_id, experience_id) 
        DO UPDATE SET 
            user_xp = (SELECT COUNT(*) * 50 FROM "globalNFTs" WHERE owner_id = EXCLUDED.user_id AND experience_id = EXCLUDED.experience_id) +
                      (SELECT COUNT(*) * 20 FROM "followingList" WHERE user_who_followed_id = EXCLUDED.user_id),
            user_friends = (SELECT COUNT(*) FROM "followingList" WHERE user_who_followed_id = EXCLUDED.user_id),
            updated_at = (now() at time zone 'utc');
    END IF;

    -- Update old owner's entry if this is a transfer
    IF old_owner_id IS NOT NULL AND TG_OP = 'UPDATE' THEN
        UPDATE "leaderboardRanks"
        SET 
            user_xp = (SELECT COUNT(*) * 50 FROM "globalNFTs" WHERE owner_id = old_owner_id AND experience_id = affected_experience_id) +
                      (SELECT COUNT(*) * 20 FROM "followingList" WHERE user_who_followed_id = old_owner_id),
            user_friends = (SELECT COUNT(*) FROM "followingList" WHERE user_who_followed_id = old_owner_id),
            updated_at = (now() at time zone 'utc')
        WHERE user_id = old_owner_id AND experience_id = affected_experience_id;
    END IF;

    -- Update ranks for all users in the affected experience
    UPDATE "leaderboardRanks" lr
    SET user_rank = ranked.rank
    FROM (
        SELECT 
            user_id,
            RANK() OVER (ORDER BY user_xp DESC) as rank
        FROM "leaderboardRanks"
        WHERE experience_id = affected_experience_id
    ) ranked
    WHERE lr.user_id = ranked.user_id AND lr.experience_id = affected_experience_id;

    RETURN NULL;
END;
$function$
;

CREATE TRIGGER update_xp_and_friends_after_friend_change AFTER INSERT OR DELETE ON public."followingList" FOR EACH ROW EXECUTE FUNCTION trigger_update_xp_and_friends_on_friend_change();

CREATE TRIGGER update_xp_and_friends_after_nft_change AFTER INSERT OR UPDATE OF owner_id ON public."globalNFTs" FOR EACH ROW EXECUTE FUNCTION trigger_update_xp_and_friends_on_nft_change();


