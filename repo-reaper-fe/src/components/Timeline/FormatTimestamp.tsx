export function formatTimestamp(timestamp: string) {
    const date = new Date(timestamp);
  
    // Options for formatting the date and time
    const options: Intl.DateTimeFormatOptions = {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true, // Use AM/PM
    };
  
    // Format the date and time
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }