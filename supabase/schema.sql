-- ============================================================
-- Are You In? Database Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. EVENTS (날짜/시간대는 event_dates 테이블에 분리)
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  creator_nickname TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  min_participants INT NOT NULL DEFAULT 2,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'confirmed', 'closed')),
  confirmed_option_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. EVENT_DATES (날짜별 시간대 - 복수 날짜 지원)
CREATE TABLE event_dates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  range_start TIME NOT NULL,
  range_end TIME NOT NULL,
  UNIQUE(event_id, date)
);

-- 3. PARTICIPANTS
CREATE TABLE participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL,
  is_creator BOOLEAN DEFAULT false,
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(event_id, nickname)
);

-- 4. TIME_OPTIONS
CREATE TABLE time_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  priority INT NOT NULL CHECK (priority BETWEEN 1 AND 3)
);

-- 5. Add circular FK (events → time_options) as deferrable
ALTER TABLE events
  ADD CONSTRAINT fk_confirmed_option
  FOREIGN KEY (confirmed_option_id)
  REFERENCES time_options(id)
  DEFERRABLE INITIALLY DEFERRED;

-- 6. VOTES
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  option_id UUID REFERENCES time_options(id) ON DELETE CASCADE,
  participant_id UUID REFERENCES participants(id) ON DELETE CASCADE,
  response TEXT NOT NULL CHECK (response IN ('accept', 'decline')),
  voted_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(option_id, participant_id)
);

-- 7. TIMETABLE_SLOTS
CREATE TABLE timetable_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  participant_id UUID REFERENCES participants(id) ON DELETE CASCADE,
  slot_start TIMESTAMPTZ NOT NULL,
  slot_end TIMESTAMPTZ NOT NULL
);

-- 8. ALT_SUGGESTIONS
CREATE TABLE alt_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  participant_id UUID REFERENCES participants(id) ON DELETE CASCADE,
  suggested_start TIMESTAMPTZ NOT NULL,
  suggested_end TIMESTAMPTZ NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- REPLICA IDENTITY FULL (required for Supabase Realtime)
-- ============================================================
ALTER TABLE votes REPLICA IDENTITY FULL;
ALTER TABLE timetable_slots REPLICA IDENTITY FULL;
ALTER TABLE participants REPLICA IDENTITY FULL;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE alt_suggestions ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Events are publicly readable"
  ON events FOR SELECT USING (true);

CREATE POLICY "Event dates are publicly readable"
  ON event_dates FOR SELECT USING (true);

CREATE POLICY "Participants are publicly readable"
  ON participants FOR SELECT USING (true);

CREATE POLICY "Time options are publicly readable"
  ON time_options FOR SELECT USING (true);

CREATE POLICY "Votes are publicly readable"
  ON votes FOR SELECT USING (true);

CREATE POLICY "Timetable slots are publicly readable"
  ON timetable_slots FOR SELECT USING (true);

CREATE POLICY "Alt suggestions are publicly readable"
  ON alt_suggestions FOR SELECT USING (true);
