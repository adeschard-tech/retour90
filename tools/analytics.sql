-- ============================================================
-- RETOUR90 — AUDIMAT : mesure d'audience maison, sans cookie
-- À exécuter dans : Supabase (compte contact@retour90.fr)
--   → projet Retour90 → SQL Editor → coller → Run
--
-- Aucune donnée personnelle n'est enregistrée : pas d'IP, pas de
-- cookie, pas d'identifiant, pas d'empreinte. Uniquement la page
-- consultée, le site référent et la largeur d'écran. Le site reste
-- donc exempt de bandeau de consentement (exemption CNIL
-- « mesure d'audience »).
-- ============================================================

-- 1. La table des passages
create table if not exists public.hits (
  id    bigserial primary key,
  ts    timestamptz not null default now(),
  page  text        not null,
  ref   text,
  neuf  boolean     not null default false,  -- true = 1re page de la session (= une visite)
  vw    smallint                              -- largeur de fenêtre, pour le suivi mobile/desktop
);

create index if not exists hits_ts_idx   on public.hits (ts desc);
create index if not exists hits_page_idx on public.hits (page);

alter table public.hits enable row level security;

-- 2. Écriture publique, lecture impossible sur la table brute
--    (on retire tout, puis on ne redonne l'insert que sur 4 colonnes :
--     personne ne peut donc falsifier l'horodatage ni l'id)
revoke all on public.hits from anon, authenticated;
grant insert (page, ref, neuf, vw) on public.hits to anon, authenticated;
grant usage, select on sequence public.hits_id_seq to anon, authenticated;

drop policy if exists "hits_insert_public" on public.hits;
create policy "hits_insert_public" on public.hits
  for insert to anon, authenticated
  with check (
    length(page) between 1 and 40
    and (ref is null or length(ref) <= 80)
    and (vw  is null or vw between 100 and 9999)
  );

-- 3. Les vues agrégées : c'est tout ce qui est lisible côté site
create or replace view public.stats_total as
  select
    count(*)                                                     as vues,
    count(*) filter (where neuf)                                 as visites,
    count(*) filter (where ts > now() - interval '24 hours')     as vues_24h,
    count(*) filter (where ts > now() - interval '7 days')       as vues_7j,
    count(*) filter (where neuf and ts > now() - interval '7 days') as visites_7j,
    min(ts)                                                      as depuis
  from public.hits;

create or replace view public.stats_jours as
  select (ts at time zone 'Europe/Paris')::date as jour,
         count(*)                     as vues,
         count(*) filter (where neuf) as visites
  from public.hits
  where ts > now() - interval '60 days'
  group by 1
  order by 1 desc;

create or replace view public.stats_pages as
  select page,
         count(*)                     as vues,
         count(*) filter (where neuf) as entrees
  from public.hits
  where ts > now() - interval '30 days'
  group by 1
  order by 2 desc;

create or replace view public.stats_sources as
  select coalesce(ref, '(direct)')   as source,
         count(*)                    as visites
  from public.hits
  where neuf and ts > now() - interval '30 days'
  group by 1
  order by 2 desc
  limit 25;

create or replace view public.stats_ecrans as
  select case when vw < 700 then 'mobile'
              when vw < 1100 then 'tablette'
              else 'ordinateur' end   as ecran,
         count(*)                     as vues
  from public.hits
  where vw is not null and ts > now() - interval '30 days'
  group by 1
  order by 2 desc;

grant select on public.stats_total, public.stats_jours, public.stats_pages,
                public.stats_sources, public.stats_ecrans to anon, authenticated;

-- 4. Purge automatique à 90 jours (si pg_cron est disponible)
do $purge$
begin
  create extension if not exists pg_cron;
  begin perform cron.unschedule('r90-purge-hits'); exception when others then null; end;
  perform cron.schedule('r90-purge-hits', '17 4 * * *',
    $c$delete from public.hits where ts < now() - interval '90 days'$c$);
exception when others then
  raise notice 'pg_cron indisponible : purge des hits a faire a la main de temps en temps.';
end
$purge$;
