import { supabase } from '@/supabase/supabaseClient';

export const fetchExamsByCourseCode = async (courseCode: string) => {
  const { data, error } = await supabase
    .from('tentor')
    .select('*')
    .eq('kurskod', courseCode);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
