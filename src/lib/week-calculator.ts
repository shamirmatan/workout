/**
 * Calculate the current week number based on program start date.
 * Weeks advance every Sunday.
 */
export function calculateCurrentWeek(programStartDate: string | null): number {
  if (!programStartDate) {
    return 1; // Default to week 1 if no start date set
  }

  const start = new Date(programStartDate);
  const today = new Date();

  // Reset time to midnight for accurate day calculation
  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  // Calculate days since program start
  const diffTime = today.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Calculate week number (week 1 starts on day 0)
  const weekNumber = Math.floor(diffDays / 7) + 1;

  // Clamp to valid range (1-16)
  return Math.max(1, Math.min(16, weekNumber));
}

/**
 * Get the start date for a given week number, assuming weeks start on Sunday.
 * This is useful to set the program start date based on current week.
 */
export function getProgramStartDateForWeek(targetWeek: number): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Find the most recent Sunday (or today if it's Sunday)
  const dayOfWeek = today.getDay(); // 0 = Sunday
  const mostRecentSunday = new Date(today);
  mostRecentSunday.setDate(today.getDate() - dayOfWeek);

  // Calculate the start date: go back (targetWeek - 1) weeks from the most recent Sunday
  const startDate = new Date(mostRecentSunday);
  startDate.setDate(startDate.getDate() - (targetWeek - 1) * 7);

  return startDate.toISOString().split('T')[0]; // Return as YYYY-MM-DD
}

/**
 * Format a date for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
