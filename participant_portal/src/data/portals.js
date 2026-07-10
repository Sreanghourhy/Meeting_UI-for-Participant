export const portalSections = [
  {
    id: 'meetings',
    title: 'កិច្ចប្រជុំ',
    icon: 'calendar',
  },
  {
    id: 'management',
    title: 'ការគ្រប់គ្រង',
    icon: 'settings',
  },
]

export const portals = [
  {
    id: 'meeting-viewer',
    title: 'មើលតាមលេខកូដ',
    description: 'មើលព័ត៌មានកិច្ចប្រជុំតាមលេខកូដ ឬ QR Code',
    label: 'Viewer with Code',
    icon: 'qrCode',
    section: 'meetings',
  },
  {
    id: 'viewer-calendar',
    title: 'មើលប្រតិទិនកិច្ចប្រជុំ',
    description: 'មើលកាលវិភាគកិច្ចប្រជុំ និងព័ត៌មានពាក់ព័ន្ធ',
    label: 'Viewer Calendar',
    icon: 'calendar',
    section: 'meetings',
  },
  {
    id: 'attendance',
    title: 'ផ្ទៀងផ្ទាត់អ្នកចូលរួម',
    description: 'ផ្ទៀងផ្ទាត់ការចូលរួម និងព័ត៌មានអ្នកចូលរួម',
    label: 'Participant Verify',
    icon: 'shieldCheck',
    section: 'meetings',
  },
  {
    id: 'writer',
    title: 'អ្នកសរសេរ',
    description: 'គ្រប់គ្រងកំណត់ត្រា ការប្រជុំ និងឯកសារ',
    label: 'Writer',
    icon: 'penSquare',
    section: 'management',
  },
  {
    id: 'administrator',
    title: 'អ្នកគ្រប់គ្រងប្រព័ន្ធ',
    description: 'គ្រប់គ្រងអ្នកប្រើប្រាស់ សិទ្ធិ និងការកំណត់ផ្សេងៗ',
    label: 'Administrator',
    icon: 'userCog',
    section: 'management',
  },
  {
    id: 'guide',
    title: 'មគ្គុទេសក៍អ្នកចូលរួម',
    description: 'មើលរបៀបប្រើប្រាស់ និងជំនួយសម្រាប់អ្នកចូលរួម',
    label: 'Guide Participant',
    icon: 'bookOpen',
    section: 'management',
  },
]
