export function formatTimestamp(timestamp: string) {
  const date = new Date(parseInt(timestamp) * 1000);

  return date.toUTCString();
}
