-- Each session owns its temporary snapshot and its short-lived participant rows.
alter table public.realtime_sessions
  drop constraint if exists realtime_sessions_board_id_fkey;

alter table public.realtime_sessions
  add column if not exists board_data jsonb not null
  default '{"elements":[],"backgroundColor":"bg-background","backgroundGrid":"none"}'::jsonb;

alter table public.realtime_sessions
  alter column max_participants set default 5;

update public.realtime_sessions
set max_participants = 5
where max_participants <> 5;

create table if not exists public.realtime_session_participants (
  session_id uuid not null references public.realtime_sessions(id) on delete cascade,
  participant_id uuid not null,
  display_name text not null check (char_length(display_name) between 1 and 80),
  color text not null check (color in ('#EF4444', '#3B82F6', '#22C55E', '#A855F7', '#F97316')),
  joined_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  primary key (session_id, participant_id),
  unique (session_id, color)
);

alter table public.realtime_session_participants enable row level security;
revoke all on public.realtime_session_participants from anon, authenticated;

create or replace function public.create_or_refresh_realtime_session(
  p_board_id uuid,
  p_board_data jsonb
)
returns public.realtime_sessions
language plpgsql
security definer
set search_path to 'public', 'extensions'
as $$
declare
  v_session public.realtime_sessions;
begin
  select * into v_session
  from public.realtime_sessions
  where board_id = p_board_id
  limit 1;

  if v_session.id is not null and v_session.active and v_session.expires_at > now() then
    update public.realtime_sessions set board_data = p_board_data
    where id = v_session.id returning * into v_session;
    return v_session;
  end if;

  delete from public.realtime_sessions where board_id = p_board_id;

  insert into public.realtime_sessions (board_id, board_data, join_token, expires_at, max_participants, active)
  values (p_board_id, p_board_data, encode(gen_random_bytes(24), 'hex'), now() + interval '30 minutes', 5, true)
  returning * into v_session;

  return v_session;
end;
$$;

create or replace function public.join_realtime_session(
  p_join_token text,
  p_participant_id uuid,
  p_display_name text
)
returns table (
  id uuid,
  board_id uuid,
  expires_at timestamptz,
  max_participants integer,
  board_data jsonb,
  participant_color text
)
language plpgsql
security definer
set search_path to 'public', 'extensions'
as $$
declare
  v_session public.realtime_sessions;
  v_color text;
  v_colors text[] := array['#EF4444', '#3B82F6', '#22C55E', '#A855F7', '#F97316'];
begin
  -- Row lock serializes concurrent joins to this session.
  select * into v_session from public.realtime_sessions
  where join_token = p_join_token for update;

  if v_session.id is null then raise exception 'SESSION_NOT_FOUND'; end if;
  if not v_session.active then raise exception 'SESSION_ENDED'; end if;
  if v_session.expires_at <= now() then raise exception 'SESSION_EXPIRED'; end if;

  select color into v_color from public.realtime_session_participants
  where session_id = v_session.id and participant_id = p_participant_id;

  if v_color is null then
    if (select count(*) from public.realtime_session_participants where session_id = v_session.id) >= 5 then
      raise exception 'SESSION_FULL';
    end if;

    select candidate into v_color
    from unnest(v_colors) as candidate
    where not exists (
      select 1 from public.realtime_session_participants
      where session_id = v_session.id and color = candidate
    )
    limit 1;

    if v_color is null then raise exception 'SESSION_FULL'; end if;

    insert into public.realtime_session_participants (session_id, participant_id, display_name, color)
    values (v_session.id, p_participant_id, p_display_name, v_color);
  else
    update public.realtime_session_participants
    set display_name = p_display_name, last_seen_at = now()
    where session_id = v_session.id and participant_id = p_participant_id;
  end if;

  return query select v_session.id, v_session.board_id, v_session.expires_at,
    v_session.max_participants, v_session.board_data, v_color;
end;
$$;

revoke execute on function public.create_or_refresh_realtime_session(uuid, jsonb) from public;
revoke execute on function public.join_realtime_session(text, uuid, text) from public;
