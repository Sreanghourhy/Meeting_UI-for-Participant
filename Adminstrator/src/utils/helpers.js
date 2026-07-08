export function formatDateTime(value) {
  return new Intl.DateTimeFormat('km-KH', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function formatTimeOnly(value) {
  return new Intl.DateTimeFormat('km-KH', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export function getStatusLabel(status) {
  const labels = {
    Sent: 'បានផ្ញើ',
  };

  return labels[status] || status;
}

export function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('');
}

export function sortMeetingsByTime(meetingList) {
  return [...meetingList].sort((first, second) => new Date(first.time) - new Date(second.time));
}
