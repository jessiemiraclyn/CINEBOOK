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
      <p className="rounded-2xl border border-dashed border-white/10 px-4 py-10 text-center text-sm text-muted">
        No showtimes are scheduled for this movie yet.
      </p>
    );
  }

  const timesForDate = playableShows
    .filter((show) => show.show_date === activeDate)
    .sort((a, b) => a.show_time.localeCompare(b.show_time));

  return (
    <div className="space-y-10">
      <div>
        <p className="mb-4 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-muted">
          <CalendarDays className="h-3.5 w-3.5 text-cyan-400" aria-hidden="true" />
          Select a date
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
                className={`group flex min-w-[6rem] flex-col items-start rounded-2xl border px-5 py-4 text-left transition duration-300 active:scale-[0.98] ${
                  active
                    ? 'border-cyan-400/60 bg-cyan-400/10 text-soft shadow-[0_0_30px_rgba(77,235,255,0.2)]'
                    : 'border-white/10 bg-white/[0.03] text-muted hover:border-white/25 hover:text-soft'
                }`}
              >
                <span className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${active ? 'text-cyan-300' : ''}`}>
                  {chip.weekday}
                </span>
                <span className="mt-1 font-display text-3xl uppercase tracking-wide">{chip.dayMonth}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-4 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-muted">
          <Clock className="h-3.5 w-3.5 text-cyan-400" aria-hidden="true" />
          Select a showtime
        </p>
        <ul className="divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-ink-900/60">
          {timesForDate.map((show) => {
            const active = show.id === selectedShowId;
            return (
              <li key={show.id}>
                <button
                  type="button"
                  onClick={() => onSelect(show)}
                  aria-pressed={active}
                  className={`group flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition duration-300 ${
                    active ? 'bg-gold-400 text-ink-950' : 'text-soft hover:bg-white/[0.04]'
                  }`}
                >
                  <span className="font-display text-3xl uppercase tracking-wide">{formatShowTime(show.show_time)}</span>
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${
                      active ? 'text-ink-950/70' : 'text-muted group-hover:text-cyan-300'
                    }`}
                  >
                    {show.screen}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
