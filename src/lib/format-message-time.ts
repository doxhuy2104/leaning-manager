export function formatMessageTime(timestamp: string) {
  const messageDate = new Date(timestamp);
  const now = new Date();
  const diffInMinutes = Math.floor(
    (now.getTime() - messageDate.getTime()) / (60 * 1000),
  );
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays === 0) {
    if (diffInMinutes < 60) {
      return diffInMinutes === 0 ? "just now" : `${diffInMinutes}m`;
    }
    return messageDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  if (diffInDays < 7) {
    return messageDate.toLocaleDateString("en-US", { weekday: "long" });
  }

  if (messageDate.getFullYear() === now.getFullYear()) {
    return messageDate.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    });
  }

  return messageDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
