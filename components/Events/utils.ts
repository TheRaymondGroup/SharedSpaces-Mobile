// utils.ts
export interface Event {
  id: string;          // For unique key
  name: string;        // Main text/title of the event
  completed: boolean;
  Location: string;
  timeDeadline: string;
  Host: string;
  dateDeadline: string; // Could store as string or Date object
}

export interface EventList {
  title: string;
  events: Event[];
}

// Utility function for formatting date input as MM/DD/YYYY
export const formatDateInput = (input: string) => {
  const cleaned = input.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{0,2})(\d{0,2})(\d{0,4})$/);
  if (!match) return '';
  const mm = match[1];
  const dd = match[2] ? `/${match[2]}` : '';
  const yyyy = match[3] ? `/${match[3]}` : '';
  return `${mm}${dd}${yyyy}`.substring(0, 10);
};

// Utility function for formatting time input as HH:MM-XX:XX
export const formatTimeInput = (input: string) => {
  const cleaned = input.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{0,2})(\d{0,2})(\d{0,2})(\d{0,2})$/);
  if (!match) return '';
  const h0 = match[1];
  const m0 = match[2] ? `:${match[2]}` : '';
  const h1 = match[3] ? `-${match[3]}` : '';
  const m1 = match[4] ? `:${match[4]}` : '';
  return `${h0}${m0}${h1}${m1}`.substring(0, 11);
};

// Validate event date and time
export const validateEventDateTime = (event: Event): string | null => {
  // Check required fields
  if (
    !event.name.trim() ||
    !event.Location.trim() ||
    !event.Host.trim() ||
    !event.timeDeadline.trim() ||
    !event.dateDeadline.trim()
  ) {
    return 'Please fill in all required details.';
  }

  // Validate the date part (MM/DD/YYYY)
  const dateParts = event.dateDeadline.split('/');
  if (dateParts.length !== 3) {
    return 'Please enter a valid date in MM/DD/YYYY format.';
  }

  const month = Number(dateParts[0]);
  const day = Number(dateParts[1]);
  const year = Number(dateParts[2]);

  if (isNaN(month) || isNaN(day) || isNaN(year)) {
    return 'Invalid date.';
  }

  if (day < 1 || day > 31 || month < 1 || month > 12) {
    return 'Invalid date.';
  }

  const inputDate = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (inputDate < today) {
    return 'The date cannot be in the past.';
  }

  // Validate the time part
  const timeStartStr = event.timeDeadline.split('-')[0];
  const timeParts = timeStartStr.split(':');

  if (timeParts.length !== 2) {
    return 'Please enter a valid time in HH:MM format.';
  }

  const hours = Number(timeParts[0]);
  const minutes = Number(timeParts[1]);

  if (isNaN(hours) || isNaN(minutes)) {
    return 'Invalid time.';
  }

  // Combine date and time to create a Date object for the event start time
  const eventDateTime = new Date(year, month - 1, day, hours, minutes);

  if (eventDateTime < new Date()) {
    return 'The event date/time cannot be in the past.';
  }

  return null; // No errors
};