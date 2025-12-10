import { supabase } from './supabase'

export async function emitEvent(
  tour_id: string,
  step_id: string,
  event_type: string,
  session_id?: string,
) {
  try {
    await supabase.from('analytics_events').insert({ tour_id, step_id, event_type, session_id })
  } catch (err) {
    console.debug('[embed-tour] analytics insert failed', err)
  }
}
