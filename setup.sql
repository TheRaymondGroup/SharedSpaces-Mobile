CREATE OR REPLACE FUNCTION join_space_by_code(join_code CHAR(5))
RETURNS JSON AS $$
DECLARE
  space_record RECORD;
  current_user_id UUID;
BEGIN
  -- Get the current authenticated user
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- Find the space by code (case-insensitive)
  SELECT id, name, code INTO space_record
  FROM spaces
  WHERE UPPER(code) = UPPER(join_code);
  
  IF space_record.id IS NULL THEN
    RAISE EXCEPTION 'Invalid space code';
  END IF;
  
  -- Remove user from all current spaces
  PERFORM leave_all_spaces();
  
  -- Add user to the new space
  INSERT INTO space_members (space_id, user_id)
  VALUES (space_record.id, current_user_id);
  
  -- Return the space info
  RETURN json_build_object(
    'id', space_record.id,
    'name', space_record.name,
    'code', space_record.code
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION leave_all_spaces()
RETURNS VOID AS $$
DECLARE
  current_user_id UUID;
BEGIN
  -- Get the current authenticated user
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- Remove user from all spaces
  DELETE FROM space_members
  WHERE user_id = current_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION create_space(space_name TEXT)
RETURNS JSON AS $$
DECLARE
  new_space_id UUID;
  new_space_code CHAR(5);
  current_user_id UUID;
BEGIN
  -- Get the current authenticated user
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- Remove user from all current spaces
  PERFORM leave_all_spaces();
  
  -- Generate a unique code
  new_space_code := generate_random_code();
  
  -- Insert the new space
  INSERT INTO spaces (name, code, created_by)
  VALUES (space_name, new_space_code, current_user_id)
  RETURNING id INTO new_space_id;
  
  -- Join the creator to the space
  INSERT INTO space_members (space_id, user_id)
  VALUES (new_space_id, current_user_id);
  
  -- Return the space info
  RETURN json_build_object(
    'id', new_space_id,
    'name', space_name,
    'code', new_space_code
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_id UUID NOT NULL REFERENCES auth.users(id),
  sender_id UUID NOT NULL REFERENCES auth.users(id),
  space_id UUID NOT NULL REFERENCES spaces(id),
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);









-- Create events table
CREATE TABLE public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  location TEXT,
  time_deadline TEXT,
  host TEXT,
  date_deadline TEXT,
  space_id UUID NOT NULL REFERENCES public.spaces(id) ON DELETE CASCADE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Set up RLS (Row Level Security)
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Policy to allow read access for users in the same space
CREATE POLICY "Users can view events in their spaces" ON public.events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM space_members
      WHERE space_members.user_id = auth.uid()
      AND space_members.space_id = events.space_id
    )
  );

-- Policy to allow insert for authenticated users in the space
CREATE POLICY "Users can create events in their spaces" ON public.events
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM space_members
      WHERE space_members.user_id = auth.uid()
      AND space_members.space_id = events.space_id
    )
  );

-- Policy to allow users to update events in their space
CREATE POLICY "Users can update events in their spaces" ON public.events
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM space_members
      WHERE space_members.user_id = auth.uid()
      AND space_members.space_id = events.space_id
    )
  );

-- Policy to allow deletion for users in the same space
CREATE POLICY "Users can delete events in their spaces" ON public.events
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM space_members
      WHERE space_members.user_id = auth.uid()
      AND space_members.space_id = events.space_id
    )
  );