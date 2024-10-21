import { Job } from'../../entities/Job';
import { supabase }from '../../config/supabaseClient';

export function useSupabaseDb() {
  async function getJobs() {
    const { data, error } = await supabase
      .from('jobs')
      .select('*');
      // .is("deleted_at", NULL);
    
    console.log(error);

    if (error) {
      console.error('Error fetching jobs:', error);
      return [];
    }

    return data.map(job => new Job(
      job.id,
      job.title,
      job.company_name,
      job.location,
      job.seniority,
      job.saving_rate_frugal,
      job.saving_rate_comfortable,
      new Date(job.created_at),
      job.country,
      job.url,
      job.workplace_type
    ));
  }

  return { getJobs };
}