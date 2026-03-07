-- Fix recursive profiles RLS policies that can trigger:
-- "infinite recursion detected in policy for relation \"profiles\""
-- during authenticated profile reads used by admin auth checks.

DROP POLICY IF EXISTS "Active admins can view all profiles." ON profiles;
DROP POLICY IF EXISTS "Active admins can update any profile." ON profiles;

CREATE OR REPLACE FUNCTION public.is_active_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = user_id
      AND role = 'admin'
      AND is_active = true
  );
$$;

REVOKE ALL ON FUNCTION public.is_active_admin(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_active_admin(uuid) TO authenticated;

CREATE POLICY "Active admins can view all profiles." ON profiles
  FOR SELECT USING (public.is_active_admin(auth.uid()));

CREATE POLICY "Active admins can update any profile." ON profiles
  FOR UPDATE USING (public.is_active_admin(auth.uid()))
  WITH CHECK (public.is_active_admin(auth.uid()));
