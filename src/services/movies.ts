import { supabase } from '@/lib/supabase';
import { todayIst } from '@/lib/format';
import type { Movie, MovieInput, Show, ShowWithMovie } from '@/types/cinema';

export async function fetchMovies(): Promise<Movie[]> {
  const { data, error } = await supabase.from('movies').select('*').order('title');
  if (error) throw error;
  return (data ?? []) as Movie[];
}

export async function fetchMovie(movieId: string): Promise<Movie | null> {
  const { data, error } = await supabase.from('movies').select('*').eq('id', movieId).maybeSingle();
  if (error) throw error;
  return (data as Movie | null) ?? null;
}

export async function fetchUpcomingShowsForMovie(movieId: string): Promise<Show[]> {
  const { data, error } = await supabase
    .from('shows')
    .select('*')
    .eq('movie_id', movieId)
    .gte('show_date', todayIst())
    .order('show_date')
    .order('show_time');
  if (error) throw error;
  return (data ?? []) as Show[];
}

export async function fetchShowWithMovie(showId: string): Promise<ShowWithMovie | null> {
  const { data, error } = await supabase
    .from('shows')
    .select('*, movies(*)')
    .eq('id', showId)
    .maybeSingle();
  if (error) throw error;
  return (data as ShowWithMovie | null) ?? null;
}

export async function fetchAllShowsWithMovie(): Promise<ShowWithMovie[]> {
  const { data, error } = await supabase
    .from('shows')
    .select('*, movies(*)')
    .gte('show_date', todayIst())
    .order('show_date')
    .order('show_time');
  if (error) throw error;
  return (data ?? []) as ShowWithMovie[];
}

export async function ensureUpcomingShows(): Promise<void> {
  const { error } = await supabase.rpc('ensure_upcoming_shows');
  if (error) throw error;
}

export async function saveMovie(input: MovieInput, movieId?: string): Promise<void> {
  const payload = {
    ...input,
    backdrop_url: input.backdrop_url || null,
    release_date: input.release_date || null,
  };
  const request = movieId
    ? supabase.from('movies').update(payload).eq('id', movieId)
    : supabase.from('movies').insert(payload);
  const { error } = await request;
  if (error) throw error;
}

export async function deleteMovie(movieId: string): Promise<void> {
  const { error } = await supabase.from('movies').delete().eq('id', movieId);
  if (error) throw error;
}

export async function createShow(movieId: string, showDate: string, showTime: string): Promise<void> {
  const { error } = await supabase
    .from('shows')
    .insert({ movie_id: movieId, show_date: showDate, show_time: showTime });
  if (error) {
    if (error.code === '23505') throw new Error('A show already exists for this movie at that date and time.');
    throw error;
  }
}

export async function deleteShow(showId: string): Promise<void> {
  const { error } = await supabase.from('shows').delete().eq('id', showId);
  if (error) {
    if (error.code === '23503') throw new Error('This showtime has bookings and cannot be deleted.');
    throw error;
  }
}
