import { Loader2, ShieldAlert } from 'lucide-react';
import Button from '@/components/ui/Button';
import ErrorMessage from '@/components/ui/ErrorMessage';
import Modal from '@/components/ui/Modal';
import { formatCurrency } from '@/lib/format';

interface DemoPaymentModalProps {
  open: boolean;
  amount: number;
  seatCount: number;
  submitting: boolean;
  error: string | null;
  onConfirm: () => void;
  onClose: () => void;
}

export default function DemoPaymentModal({ open, amount, seatCount, submitting, error, onConfirm, onClose }: DemoPaymentModalProps) {
  return (
    <Modal open={open} title="Demo payment" onClose={submitting ? () => undefined : onClose}>
      <div className="space-y-6">
        <div className="flex items-start gap-3 rounded-xl border border-warning-400/40 bg-warning-400/10 px-4 py-3 text-sm text-warning-400">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>
            <span className="font-semibold">This is a demo.</span> No real payment is processed and no money will be charged.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-700 via-ink-800 to-ink-950 p-6 shadow-xl">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-600/30 blur-2xl" />
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">Demo card</p>
          <p className="mt-6 font-mono text-lg tracking-[0.25em] text-white">•••• •••• •••• 4242</p>
          <div className="mt-6 flex items-end justify-between">
            <p className="text-xs text-zinc-400">Test card for demonstrations</p>
            <p className="font-display text-2xl tracking-wide text-white">CINEBOOK</p>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-4">
          <div>
            <p className="text-sm text-zinc-400">Amount to pay</p>
            <p className="text-xs text-zinc-500">{seatCount} {seatCount === 1 ? 'seat' : 'seats'}</p>
          </div>
          <p className="font-display text-4xl tracking-wide text-white">{formatCurrency(amount)}</p>
        </div>

        {error && <ErrorMessage message={error} />}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={submitting}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
            {submitting ? 'Confirming seats...' : 'Confirm demo payment'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
