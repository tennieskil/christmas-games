create table if not exists public.forehead_words (
  id uuid not null default gen_random_uuid(),
  word text not null,
  last_seen_at timestamp with time zone null,
  created_at timestamp with time zone not null default now(),
  constraint forehead_words_pkey primary key (id),
  constraint forehead_words_word_key unique (word)
);

alter table public.forehead_words enable row level security;

create policy "Enable read access for all users"
on public.forehead_words
as permissive
for select
to public
using (true);

create policy "Enable update for all users"
on public.forehead_words
as permissive
for update
to public
using (true)
with check (true);

create policy "Enable insert for all users"
on public.forehead_words
as permissive
for insert
to public
with check (true);
