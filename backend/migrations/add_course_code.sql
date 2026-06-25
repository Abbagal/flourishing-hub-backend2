-- Add a course code field to Course
-- Run this on Supabase SQL editor

ALTER TABLE "Course"
  ADD COLUMN IF NOT EXISTS "code" TEXT;
