-- ============================================================
-- RETOUR90 — envoi d'emails automatiques via Resend
-- À exécuter dans : Supabase (compte contact@retour90.fr)
--   → projet Retour90 → SQL Editor → coller → Run
-- ============================================================

-- 1. Extension pg_net (requêtes HTTP sortantes depuis la base)
create extension if not exists pg_net;

-- 2. Email de bienvenue à chaque inscription au Club
create or replace function public.send_welcome_email()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $fn$
declare
  k text;
begin
  select decrypted_secret into k from vault.decrypted_secrets where name = 'resend_api_key' limit 1;
  if k is null then return new; end if;  -- pas de clé = pas d'envoi, sans erreur
  perform net.http_post(
    url := 'https://api.resend.com/emails',
    headers := jsonb_build_object('Authorization', 'Bearer ' || k, 'Content-Type', 'application/json'),
    body := jsonb_build_object(
      'from', 'Le Club RETOUR90 <club@retour90.fr>',
      'to', jsonb_build_array(new.email),
      'reply_to', 'contact@retour90.fr',
      'subject', 'Bienvenue au Club RETOUR90, ' || new.pseudo || ' !',
      'html',
        '<div style="background:#0D0918;padding:32px 16px;font-family:Verdana,Geneva,sans-serif">'
        || '<div style="max-width:520px;margin:0 auto;background:#161028;border:1px solid #3a2f5c;border-radius:14px;overflow:hidden">'
        || '<div style="background:#FF2E87;padding:18px 24px;color:#ffffff;font-size:22px;font-weight:bold;letter-spacing:1px">RETOUR90.FR</div>'
        || '<div style="padding:26px 24px;color:#F5F1FF;font-size:15px;line-height:1.6">'
        || '<p style="margin:0 0 14px">Salut ' || new.pseudo || ' !</p>'
        || '<p style="margin:0 0 14px">Ta carte de membre du Club RETOUR90 est enregistrée. Tu seras prévenu en premier : nouveaux canaux, nouvelles archives d’époque, et l’ouverture de la boutique.</p>'
        || '<p style="margin:0 0 20px">En attendant, la télé reste allumée : 187 vidéos d’époque, 7 jeux d’arcade et le forum des souvenirs t’attendent.</p>'
        || '<p style="margin:0 0 24px;text-align:center"><a href="https://retour90.fr" style="background:#23E5DE;color:#062320;text-decoration:none;font-weight:bold;padding:12px 22px;border-radius:8px;display:inline-block">RETOURNER SUR RETOUR90.FR</a></p>'
        || '<p style="margin:0;color:#9E90C8;font-size:12px">Merci de rembobiner avant de rapporter la cassette. 📼</p>'
        || '</div></div></div>'
    )
  );
  return new;
end
$fn$;

drop trigger if exists trg_member_welcome on public.members;
create trigger trg_member_welcome
  after insert on public.members
  for each row execute function public.send_welcome_email();

-- 3. Notification dans ta boîte à chaque courrier des téléspectateurs
create or replace function public.notify_contact()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $fn$
declare
  k text;
begin
  select decrypted_secret into k from vault.decrypted_secrets where name = 'resend_api_key' limit 1;
  if k is null then return new; end if;
  perform net.http_post(
    url := 'https://api.resend.com/emails',
    headers := jsonb_build_object('Authorization', 'Bearer ' || k, 'Content-Type', 'application/json'),
    body := jsonb_build_object(
      'from', 'RETOUR90 Courrier <courrier@retour90.fr>',
      'to', jsonb_build_array('contact@retour90.fr'),
      'reply_to', coalesce(nullif(new.email, ''), 'contact@retour90.fr'),
      'subject', 'Courrier des téléspectateurs — ' || coalesce(nullif(new.name, ''), 'anonyme'),
      'text', 'De : ' || coalesce(nullif(new.name, ''), 'anonyme') || ' <' || coalesce(nullif(new.email, ''), 'pas d’email') || '>'
              || chr(10) || chr(10) || new.body
    )
  );
  return new;
end
$fn$;

drop trigger if exists trg_contact_notify on public.contact_messages;
create trigger trg_contact_notify
  after insert on public.contact_messages
  for each row execute function public.notify_contact();

-- 4. Ménage : lignes de test invisibles créées pendant la mise en place
delete from public.comments where slug = '_test';
delete from public.members where email like '%example.com';
delete from public.contact_messages where body like 'Test du courrier%';

-- 5. Vérification : tes membres et courriers réels
select 'membre' as type, pseudo as qui, email as detail, created_at from public.members
union all
select 'courrier', coalesce(name, 'anonyme'), left(body, 60), created_at from public.contact_messages
order by created_at desc;

-- ============================================================
-- DERNIÈRE ÉTAPE (la seule que Claude ne peut pas faire) :
-- pose ta clé API Resend dans le coffre-fort Supabase.
--   a. Connecte-toi sur resend.com avec contact@retour90.fr
--      → vérifie que le domaine retour90.fr est « Verified »
--        (sinon clique « Verify DNS Records » — les DNS sont posés)
--   b. resend.com/api-keys → Create API key
--      (nom : supabase · permission : Sending access) → copie la clé
--   c. Exécute cette ligne dans le SQL Editor en remplaçant re_XXXX :
--
--      select vault.create_secret('re_XXXX', 'resend_api_key');
--
-- Dès que c'est fait, chaque inscription reçoit son email de
-- bienvenue et chaque courrier atterrit dans ta boîte.
-- ============================================================
