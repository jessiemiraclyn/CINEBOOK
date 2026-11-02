const BOOKING_ERROR_MESSAGES: Record<string, string> = {
  AUTH_REQUIRED: 'Please sign in to complete your booking.',
  NO_SEATS: 'Select at least one seat to continue.',
  TOO_MANY_SEATS: 'You can book up to 10 seats in a single booking.',
  SHOW_NOT_FOUND: 'This showtime no longer exists. Please pick another show.',
  SHOW_STARTED: 'This showtime has already started.',
  INVALID_SEAT: 'One or more selected seats are invalid. Please reselect your seats.',
  SEAT_TAKEN: 'Sorry, one or more seats were just booked by someone else. Please choose different seats.',
  INVALID_COUPON: 'That coupon code is not valid.',
  BOOKING_NOT_FOUND: 'We could not find this booking.',
  ALREADY_CANCELLED: 'This booking has already been cancelled and refunded.',
};

export function getErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = String((error as { message: unknown }).message);
    return BOOKING_ERROR_MESSAGES[message] ?? (message || fallback);
  }
  return fallback;
}

const NETWORK_ERROR_MESSAGE = 'Network error. Check your connection and try again.';

const AUTH_ERROR_PATTERNS: Array<[RegExp, string]> = [
  [/invalid login credentials/i, 'The email or password is incorrect.'],
  [/already (registered|been registered|exists)/i, 'An account with this email already exists. Try signing in instead.'],
  [/rate limit|too many/i, 'Too many attempts. Please wait a moment and try again.'],
  [/password should be at least/i, 'That password is too short.'],
  [/email not confirmed/i, 'Please confirm your email address before signing in.'],
  [/failed to fetch|network/i, NETWORK_ERROR_MESSAGE],
];

export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof TypeError) return NETWORK_ERROR_MESSAGE;
  const message = error instanceof Error ? error.message : '';
  const match = AUTH_ERROR_PATTERNS.find(([pattern]) => pattern.test(message));
  return match ? match[1] : 'Something went wrong. Please try again.';
}
