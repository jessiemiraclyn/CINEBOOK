export const COUPON_CODE = 'CINE10';
export const COUPON_DISCOUNT_PERCENT = 10;
export const REFUND_PERCENT = 80;

export function normalizeCoupon(code: string): string {
  return code.trim().toUpperCase();
}

export function isValidCoupon(code: string): boolean {
  return normalizeCoupon(code) === COUPON_CODE;
}

export function calculateCharges(subtotal: number, couponCode: string | null) {
  const discount = couponCode && isValidCoupon(couponCode)
    ? Math.floor((subtotal * COUPON_DISCOUNT_PERCENT) / 100)
    : 0;
  return { subtotal, discount, total: subtotal - discount };
}

export function calculateRefund(amountPaid: number): number {
  return Math.round((amountPaid * REFUND_PERCENT) / 100);
}
