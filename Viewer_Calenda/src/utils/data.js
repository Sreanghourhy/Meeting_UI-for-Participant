import users from '../data/users.json'
import meetings from '../data/meetings.json'
import activityLogs from '../data/activity-logs.json'

export function getUsers() {
  return users
}

export function getUserById(id) {
  return users.find((user) => user.id === id)
}

export function getUserName(user) {
  if (!user) return 'Unknown'
  return `${user.courtesy} ${user.firstName} ${user.lastName}`
}

export function getMeetings() {
  return meetings
}

export function getMeetingById(id) {
  return meetings.find((meeting) => meeting.id === id)
}

export function getActivityLogs(meetingId) {
  return activityLogs[meetingId] || []
}

export function formatDate(dateStr) {
  const date = new Date(`${dateStr}T00:00:00`)
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatTimeRange(start, end) {
  return `${start} - ${end}`
}

export function getStatusBadge(status) {
  const map = {
    scheduled: 'badge-info',
    completed: 'badge-success',
    pending: 'badge-warning',
    processing: 'badge-warning',
    archived: 'badge-neutral',
    cancelled: 'badge-danger',
  }
  return map[status] || 'badge-neutral'
}

export function getFileTypeIcon(type) {
  const map = {
    document: 'DOC',
    video: 'VID',
    spreadsheet: 'XLS',
    other: 'FILE',
  }
  return map[type] || 'FILE'
}
