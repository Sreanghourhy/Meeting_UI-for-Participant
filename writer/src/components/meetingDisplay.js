import { getUserById, getUserName } from '../utils/data.js'

export const khmerDigits = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩']

export function toKhmerNumeral(value) {
  return String(value).replace(/\d/g, (digit) => khmerDigits[Number(digit)])
}

export function getDisplayVenue(meeting) {
  const venues = {
    'Executive Boardroom': 'បន្ទប់ប្រជុំប្រតិបត្តិ',
    'Innovation Lab': 'មន្ទីរច្នៃប្រឌិត',
    'Conference Room C': 'បន្ទប់ប្រជុំ C',
    'Training Hall': 'សាលាបណ្តុះបណ្តាល',
    'Grand Conference Hall': 'សាលសន្និសីទធំ',
  }
  return venues[meeting.venue] || meeting.venue
}

export function getStatusLabel(status) {
  const labels = {
    scheduled: 'បានកំណត់ពេល',
    completed: 'បានបញ្ចប់',
    pending: 'កំពុងរង់ចាំ',
    cancelled: 'បានលុបចោល',
  }
  return labels[status] || status
}

function getKhmerParticipant(user) {
  const map = {
    u1: { name: 'លោក ជេម វីលសុន', avatar: 'ជវ', position: 'អ្នកគ្រប់គ្រងគម្រោង', department: 'ក្រុមហ៊ុន អេកមី' },
    u2: { name: 'កញ្ញា សារ៉ា ចិន', avatar: 'សច', position: 'អ្នកអភិវឌ្ឍន៍ជាន់ខ្ពស់', department: 'ក្រុមហ៊ុន អេកមី' },
    u3: { name: 'បណ្ឌិត ម៉ៃឃើល រ៉ូឌ្រីហ្គេស', avatar: 'មរ', position: 'នាយកបច្ចេកវិទ្យា', department: 'ដំណោះស្រាយបច្ចេកវិទ្យា' },
    u4: { name: 'លោកស្រី អេមីលី ថមសុន', avatar: 'អថ', position: 'នាយកធនធានមនុស្ស', department: 'ក្រុមហ៊ុន អេកមី' },
    u5: { name: 'លោក ដេវីដ គីម', avatar: 'ដគ', position: 'អ្នកវិភាគ', department: 'ហិរញ្ញវត្ថុសកល' },
    u6: { name: 'កញ្ញា លីសា ផាក', avatar: 'លផ', position: 'អ្នករចនា UX', department: 'ក្រុមហ៊ុន អេកមី' },
    u7: { name: 'លោក រ៉ូបឺត អេនឌឺសុន', avatar: 'រា', position: 'វិស្វករ', department: 'ដំណោះស្រាយបច្ចេកវិទ្យា' },
    u8: { name: 'កញ្ញា ជេនីហ្វឺ ម៉ាទីណេស', avatar: 'ជម', position: 'ប្រធានទីផ្សារ', department: 'ក្រុមហ៊ុន អេកមី' },
  }
  return map[user?.id] || {}
}

export function getMeetingParticipants(meeting) {
  return meeting.attendeeIds.map((userId, index) => {
    const user = getUserById(userId)
    const khmer = getKhmerParticipant(user)
    return {
      id: userId,
      name: khmer.name || getUserName(user),
      avatar: khmer.avatar || user?.avatar || '--',
      position: khmer.position || user?.position || '-',
      department: khmer.department || user?.organization || '-',
      email: user?.email || '-',
      joinedCount: Math.max(1, 5 - (index % 4)),
    }
  })
}

export const meetingChair = {
  id: 'chair-vong-vissoth',
  name: 'ឯកឧត្តម វង្ស វិស្សុត',
  avatar: 'វវ',
  position: 'ឧបនាយករដ្ឋមន្ត្រីប្រចាំការ',
  department: 'រាជរដ្ឋាភិបាល',
}

export const extraSeatingParticipants = [
  { id: 'seat-extra-1', name: 'ឯកឧត្តម ហ៊ីង ថូរ៉ាក់ស៊ី', avatar: 'ថស', position: 'រដ្ឋលេខាធិការប្រចាំការ' },
  { id: 'seat-extra-2', name: 'ឯកឧត្តម ឆាយ រៀន', avatar: 'ឆរ', position: 'រដ្ឋលេខាធិការ' },
  { id: 'seat-extra-3', name: 'ឯកឧត្តម អេង ទូច', avatar: 'អទ', position: 'រដ្ឋលេខាធិការ' },
  { id: 'seat-extra-4', name: 'ឯកឧត្តមបណ្ឌិត ស៊ា ម៉ៅ', avatar: 'សម', position: 'រដ្ឋលេខាធិការ' },
  { id: 'seat-extra-5', name: 'ឯកឧត្តម លី ច័ន្ទតុលា', avatar: 'លច', position: 'រដ្ឋលេខាធិការ' },
  { id: 'seat-extra-6', name: 'ឯកឧត្តម អ៊ឹង សេរីវិសុទ្ធ', avatar: 'អស', position: 'រដ្ឋលេខាធិការ' },
  { id: 'seat-extra-7', name: 'ឯកឧត្តម លីវ សុវណ្ណ', avatar: 'លស', position: 'អនុរដ្ឋលេខាធិការ' },
  { id: 'seat-extra-8', name: 'ឯកឧត្តម ឃីម រស្មីដា', avatar: 'ឃរ', position: 'អនុរដ្ឋលេខាធិការ' },
]
