import { useMemo, useState } from 'react';
import { CalendarDays, Clock } from 'lucide-react';
import { addDaysIst, formatShowDate, formatShowTime, isShowStarted, todayIst } from '@/lib/format';
import type { Show } from '@/types/cinema';

interface ShowPickerProps {
  shows: Show[];
  selectedShowId: string | null;
  onSelect: (show: Show) => void;
}

function formatDayChip(date: string): { weekday: string; dayMonth: string } {
  const today = todayIst();
  const weekday = date === today ? 'Today' : date === addDaysIst(today, 1) ? 'Tomorrow' : formatShowDate(date).split(',')[0];
  const dayMonth = new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short' })
    .format(new Date(`${date}T00:00:00+05:30`));
  return { weekday, dayMonth };
}

export default function ShowPicker({ shows, selectedShowId, onSelect }: ShowPickerProps) {
  const playableShows = useMemo(
    () => shows.filter((show) => !isShowStarted(show.show_date, show.show_time)),
    [shows],
  );

  const dates = useMemo(() => Array.from(new Set(playableShows.map((show) => show.show_date))).sort(), [playableShows]);

  const [pickedDate, setPickedDate] = useState<string | null>(null);
  const activeDate = pickedDate && dates.includes(pickedDate) ? pickedDate : dates[0];

  if (!activeDate) {
    return (
      <p className="rounded-xl border border-dashed border-white/10 px-4 py-6 text-center text-sm text-zinc-400">
        No showtimes are scheduled for this movie yet.
      </p>
    );
  }

  const timesForDate = playableShows
    .filter((show) => show.show_date === activeDate)
    .sort((a, b) => a.show_time.localeCompare(b.show_time));

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
          <CalendarDays className="h-4 w-4" aria-hidden="true" />
          Choose a date
        </p>
        <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1" role="tablist" aria-label="Show dates">
          {dates.map((date) => {
            const active = date === activeDate;
            const chip = formatDayChip(date);
            return (
              <button
                key={date}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setPickedDate(date)}
                className={`flex min-w-[5.5rem] flex-col items-center rounded-xl border px-4 py-3 transition duration-300 ${
                  active
                    ? 'border-brand-500 bg-brand-600 text-white shadow-lg shadow-brand-900/40'
                    : 'border-white/10 bg-white/5 text-zinc-300 hover:border-white/25 hover:text-white'
                }`}
              >
                <span className="text-xs uppercase tracking-wider opacity-80">{chip.weekday}</span>
                <span className="mt-1 text-base font-semibold">{chip.dayMonth}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
          <Clock className="h-4 w-4" aria-hidden="true" />
          Choose a showtime
        </p>
        <div className="flex flex-wrap gap-3">
          {timesForDate.map((show) => {
            const active = show.id === selectedShowId;
            return (
              <button
                key={show.id}
                type="button"
                onClick={() => onSelect(show)}
                aria-pressed={active}
                className={`rounded-lg border px-5 py-2.5 text-sm font-medium transition duration-300 active:scale-95 ${
                  active
                    ? 'border-brand-500 bg-brand-600/20 text-white ring-2 ring-brand-500/40'
                    : 'border-white/10 bg-white/5 text-zinc-200 hover:border-brand-500/60 hover:text-white'
                }`}
              >
                {formatShowTime(show.show_time)}
                <span className="ml-2 text-xs text-zinc-400">{show.screen}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
