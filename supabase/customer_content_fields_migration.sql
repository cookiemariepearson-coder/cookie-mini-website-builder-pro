-- Cookie Mini Website Builder Pro
-- Customer-editable service boxes and page wording fields.
-- Run this once in Supabase SQL Editor before testing the new customer editor update.

alter table public.websites
  add column if not exists offer_title text default 'Services & Offers',
  add column if not exists service_cards jsonb,
  add column if not exists page_content jsonb;
