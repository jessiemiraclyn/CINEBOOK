import { useState, type FormEvent } from 'react';
import { BadgePercent, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { COUPON_CODE, COUPON_DISCOUNT_PERCENT, isValidCoupon, normalizeCoupon } from '@/lib/pricing';

interface CouponFormProps {
  appliedCode: string | null;
  onApply: (code: string) => void;
  onRemove: () => void;
}

export default function CouponForm({ appliedCode, onApply, onRemove }: CouponFormProps) {
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValidCoupon(input)) {
      setError(`"${normalizeCoupon(input) || input.trim()}" is not a valid coupon code.`);
      return;
    }
    setError(null);
    onApply(COUPON_CODE);
    setInput('');
  };

  if (appliedCode) {
    return (
      <div className="animate-scale-in flex items-center justify-between gap-3 rounded-xl border border-success-500/40 bg-success-500/10 px-4 py-3">
        <p className="flex items-center gap-2 text-sm text-success-400">
          <BadgePercent className="h-4 w-4" aria-hidden="true" />
          <span>
            <span className="font-semibold">{appliedCode}</span> applied: {COUPON_DISCOUNT_PERCENT}% off
          </span>
        </p>
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove coupon"
          className="rounded-full p-1.5 text-zinc-300 transition hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-2">
      <label htmlFor="coupon-code" className="field-label">Coupon code</label>
      <div className="flex gap-2">
        <input
          id="coupon-code"
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
            if (error) setError(null);
          }}
          placeholder="Enter code"
          autoComplete="off"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'coupon-error' : undefined}
          className="field-input h-11 flex-1 uppercase"
        />
        <Button type="submit" variant="secondary" disabled={!input.trim()} className="h-11">
          Apply
        </Button>
      </div>
      {error && (
        <p id="coupon-error" role="alert" className="text-sm text-red-300">
          {error}
        </p>
      )}
    </form>
  );
}
