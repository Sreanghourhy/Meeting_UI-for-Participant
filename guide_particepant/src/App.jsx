import { useMemo, useState } from 'react'

const photo = (name) => `/assets/${name}`

const guidePictures = [
  {
    src: photo('photo_1_2026-07-06_15-00-07.jpg'),
    title: 'ជំហានទី ១៖ ចាប់ផ្តើមពីច្រកចូល',
    text: 'ចាប់ផ្តើមពីតំបន់ច្រកចូល។ ប្រើរូបភាពនេះជាចំណុចសម្គាល់ដំបូង មុនពេលដើរទៅកាន់បន្ទប់ប្រជុំ។',
  },
  {
    src: photo('photo_2_2026-07-06_15-00-07.jpg'),
    title: 'ជំហានទី ២៖ ដើរតាមច្រកផ្លូវ',
    text: 'បន្តដើរតាមច្រកផ្លូវដែលបង្ហាញក្នុងរូបភាពនេះ។ ដើរត្រង់ទៅមុខ ហើយរកមើលចំណុចសម្គាល់បន្ទាប់។',
  },
  {
    src: photo('photo_3_2026-07-06_15-00-07.jpg'),
    title: 'ជំហានទី ៣៖ បន្តដើរត្រង់',
    text: 'នៅចំណុចនេះ សូមបន្តដើរត្រង់។ រូបភាពនេះជួយបញ្ជាក់ថាអ្នកកំពុងដើរតាមផ្លូវត្រឹមត្រូវ។',
  },
  {
    src: photo('photo_4_2026-07-06_15-00-07.jpg'),
    title: 'ជំហានទី ៤៖ ពិនិត្យតំបន់បន្ទប់',
    text: 'ពេលទៅដល់តំបន់នេះ សូមដើរយឺតៗ ហើយពិនិត្យស្លាកបន្ទប់ប្រជុំនៅជិតទ្វារ។',
  },
  {
    src: photo('photo_5_2026-07-06_15-00-07.jpg'),
    title: 'ជំហានទី ៥៖ ទៅជិតបន្ទប់ប្រជុំ',
    text: 'ដើរទៅជិតផ្នែកបន្ទប់ប្រជុំ។ ប្រើរូបភាពនេះដើម្បីផ្ទៀងផ្ទាត់ច្រកផ្លូវ ឬតំបន់រង់ចាំចុងក្រោយ។',
  },
  {
    src: photo('photo_6_2026-07-06_15-00-07.jpg'),
    title: 'ជំហានទី ៦៖ ទៅដល់បន្ទប់របស់អ្នក',
    text: 'អ្នកបានទៅដល់តំបន់បន្ទប់ប្រជុំហើយ។ សូមពិនិត្យឈ្មោះបន្ទប់ដែលអ្នកបានជ្រើសរើស មុនពេលចូល។',
  },
]

const rooms = [
  {
    id: 'room-a',
    name: 'បន្ទប់ 708',
    floor: 'ជាន់ទី ១',
    color: '#167c80',
    map: {
      title: 'ផែនទីទៅបន្ទប់ 708',
      route: 'M90 265 L250 265 L250 160 L500 160',
      pin: { x: 500, y: 160 },
    },
  },
  {
    id: 'room-b',
    name: 'បន្ទប់ 607A',
    floor: 'ជាន់ទី ១',
    color: '#4f78c7',
    map: {
      title: 'ផែនទីទៅបន្ទប់ 607A',
      route: 'M90 265 L250 265 L250 245 L500 245',
      pin: { x: 500, y: 245 },
    },
  },
  {
    id: 'room-c',
    name: 'បន្ទប់ 607B',
    floor: 'ជាន់ទី ២',
    color: '#6a6bbf',
    map: {
      title: 'ផែនទីទៅបន្ទប់ 607B',
      route: 'M90 265 L160 265 L160 105 L500 105',
      pin: { x: 500, y: 105 },
    },
  },
]

const doors = [
  {
    id: 'door-1',
    name: 'ទ្វារ ១',
    hint: 'ច្រកចូលខាងមុខ',
  },
  {
    id: 'door-2',
    name: 'ទ្វារ ២',
    hint: 'ច្រកកណ្តាល',
  },
  {
    id: 'door-3',
    name: 'ទ្វារ ៣',
    hint: 'ច្រកជិតជណ្តើរយន្ត',
  },
]

function CombinedRoomMap() {
  return (
    <svg
      className="room-map"
      viewBox="0 0 720 520"
      role="img"
      aria-label="ផែនទីសម្រាប់បន្ទប់ 708 បន្ទប់ 607A និងបន្ទប់ 607B"
    >
      <defs>
        <linearGradient id="combined-map-bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#f8fbff" />
          <stop offset="100%" stopColor="#edf4f8" />
        </linearGradient>
        <filter id="map-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#1f3140" floodOpacity="0.12" />
        </filter>
      </defs>
      <rect width="720" height="520" rx="28" fill="url(#combined-map-bg)" />
      <text x="36" y="66" fontSize="12" fill="#607080">ដើរតាមពណ៌ផ្លូវរបស់បន្ទប់ដែលអ្នកជ្រើសរើស។</text>

      <g transform="translate(36 92)" filter="url(#map-shadow)">
        <rect x="0" y="0" width="648" height="348" rx="24" fill="#fff" stroke="#d6e1e8" strokeWidth="3" />
        <rect x="28" y="32" width="120" height="86" rx="16" fill="#fef0ee" stroke="#e8aaa1" strokeWidth="3" />
        <text x="88" y="70" textAnchor="middle" fontSize="15" fontWeight="900" fill="#9b3f34">ទទួលភ្ញៀវ</text>
        <text x="88" y="94" textAnchor="middle" fontSize="11" fill="#9b3f34">ចាប់ផ្តើម</text>

        <rect x="28" y="220" width="120" height="88" rx="16" fill="#ecfafa" stroke="#a9ced0" strokeWidth="3" />
        <text x="88" y="257" textAnchor="middle" fontSize="15" fontWeight="900" fill="#0c5e66">ឡប់ប៊ី</text>
        <text x="88" y="281" textAnchor="middle" fontSize="11" fill="#0c5e66">ច្រកចូល</text>

        <rect x="32" y="136" width="108" height="62" rx="15" fill="#fff7e6" stroke="#e6c370" strokeWidth="3" />
        <text x="86" y="174" textAnchor="middle" fontSize="13" fontWeight="900" fill="#7d5a0b">ជណ្តើរយន្ត</text>

        <rect x="190" y="50" width="86" height="250" rx="18" fill="#f8fafc" stroke="#dce4ea" strokeWidth="3" />
        <text x="233" y="181" textAnchor="middle" fontSize="12" fontWeight="800" fill="#607080" transform="rotate(-90 233 181)">ច្រកផ្លូវសំខាន់</text>

        <rect x="330" y="32" width="120" height="88" rx="18" fill="#ecfafa" stroke="#167c80" strokeWidth="4" />
        <text x="390" y="72" textAnchor="middle" fontSize="17" fontWeight="900" fill="#0c5e66">708</text>
        <text x="390" y="97" textAnchor="middle" fontSize="11" fill="#0c5e66">ជាន់ទី ១</text>

        <rect x="486" y="132" width="120" height="88" rx="18" fill="#eef4ff" stroke="#4f78c7" strokeWidth="4" />
        <text x="546" y="172" textAnchor="middle" fontSize="17" fontWeight="900" fill="#2a559c">607A</text>
        <text x="546" y="197" textAnchor="middle" fontSize="11" fill="#2a559c">ជាន់ទី ១</text>

        <rect x="330" y="232" width="120" height="88" rx="18" fill="#f3f1ff" stroke="#6a6bbf" strokeWidth="4" />
        <text x="390" y="272" textAnchor="middle" fontSize="17" fontWeight="900" fill="#4e4fa0">607B</text>
        <text x="390" y="297" textAnchor="middle" fontSize="11" fill="#4e4fa0">ជាន់ទី ២</text>

        <path className="route-line route-a" d="M88 264 L233 264 L233 76 L330 76" fill="none" stroke="#167c80" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" opacity="0.92" />
        <path className="route-dash" d="M88 264 L233 264 L233 76 L330 76" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 18" />

        <path className="route-line route-b" d="M88 264 L233 264 L233 176 L486 176" fill="none" stroke="#4f78c7" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" opacity="0.88" />
        <path className="route-dash" d="M88 264 L233 264 L233 176 L486 176" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 18" />

        <path className="route-line route-c" d="M88 264 L233 264 L330 276" fill="none" stroke="#6a6bbf" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" opacity="0.88" />
        <path className="route-dash" d="M88 264 L233 264 L330 276" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 18" />

        <circle cx="88" cy="264" r="16" fill="#18222d" />
        <text x="88" y="270" textAnchor="middle" fontSize="15" fontWeight="900" fill="#fff">ច</text>
      </g>

      <g transform="translate(36 466)">
        <circle cx="8" cy="0" r="6" fill="#167c80" />
        <text x="21" y="5" fontSize="12" fontWeight="800" fill="#18222d">708</text>
        <circle cx="100" cy="0" r="6" fill="#4f78c7" />
        <text x="113" y="5" fontSize="12" fontWeight="800" fill="#18222d">607A</text>
        <circle cx="192" cy="0" r="6" fill="#6a6bbf" />
        <text x="205" y="5" fontSize="12" fontWeight="800" fill="#18222d">607B</text>
      </g>
    </svg>
  )
}

function App() {
  const [pendingRoomId, setPendingRoomId] = useState(null)
  const [selectedRoomId, setSelectedRoomId] = useState(null)
  const [selectedDoorId, setSelectedDoorId] = useState(null)
  const [selectedPictureIndex, setSelectedPictureIndex] = useState(0)

  const pendingRoom = useMemo(
    () => rooms.find((room) => room.id === pendingRoomId),
    [pendingRoomId],
  )
  const selectedRoom = useMemo(
    () => rooms.find((room) => room.id === selectedRoomId),
    [selectedRoomId],
  )
  const selectedDoor = useMemo(
    () => doors.find((door) => door.id === selectedDoorId),
    [selectedDoorId],
  )
  const selectedPicture = guidePictures[selectedPictureIndex]

  function selectRoom(roomId) {
    setPendingRoomId(roomId)
    setSelectedRoomId(null)
    setSelectedDoorId(null)
    setSelectedPictureIndex(0)
  }

  function selectDoor(doorId) {
    setSelectedDoorId(doorId)
    setSelectedRoomId(pendingRoomId)
    setPendingRoomId(null)
    setSelectedPictureIndex(0)
  }

  function swapPicture(direction) {
    setSelectedPictureIndex((current) => {
      const total = guidePictures.length
      return (current + direction + total) % total
    })
  }

  if (pendingRoom) {
    return (
      <main className="guide-page">
        <section className="guide-shell door-shell" aria-label="ជ្រើសរើសទ្វារ">
          <header className="guide-header compact-header">
            <div>
              <p className="eyebrow">ជំហានទី ២</p>
              <h1>ជ្រើសរើសទ្វារ</h1>
              <p className="header-copy">អ្នកបានជ្រើស {pendingRoom.name}។ សូមជ្រើសទ្វារដែលអ្នកចូលមក។</p>
            </div>
            <button className="back-link back-link-inline" type="button" onClick={() => setPendingRoomId(null)}>
              ត្រឡប់ក្រោយ
            </button>
          </header>

          <section className="door-section" aria-label="ជ្រើសរើសទ្វារ">
            {doors.map((door) => (
              <button
                className="door-card"
                key={door.id}
                type="button"
                onClick={() => selectDoor(door.id)}
                style={{ '--room-color': pendingRoom.color }}
              >
                <span className="door-icon" aria-hidden="true">
                  <span />
                </span>
                <strong>{door.name}</strong>
                <small>{door.hint}</small>
              </button>
            ))}
          </section>

        </section>
      </main>
    )
  }

  if (selectedRoom) {
    return (
      <main className="guide-page guide-detail-page">
        <section className="guide-detail-shell" aria-label={`ការណែនាំរូបភាពសម្រាប់ ${selectedRoom.name}`}>
          <section className="picture-guide picture-guide-detail" aria-label={`ការណែនាំរូបភាពសម្រាប់ ${selectedRoom.name}`}>
            <div className="picture-toolbar">
              <button className="round-button" type="button" aria-label="រូបភាពមុន" onClick={() => swapPicture(-1)}>
                &#8592;
              </button>
              <div className="picture-title">
                <p>{selectedRoom.name}</p>
                {selectedDoor && <small>{selectedDoor.name}</small>}
                <span>រូបភាពទី {selectedPictureIndex + 1} / {guidePictures.length}</span>
              </div>
              <button className="round-button" type="button" aria-label="រូបភាពបន្ទាប់" onClick={() => swapPicture(1)}>
                &#8594;
              </button>
            </div>

            <div className="photo-frame">
              <img src={selectedPicture.src} alt={`រូបភាព ${selectedPicture.title}`} />
            </div>

            <div className="guide-copy">
              <p className="instruction-kicker">{selectedRoom.floor}</p>
              <h2>{selectedPicture.title}</h2>
              <p>{selectedPicture.text}</p>
              <div className="step-dots" aria-label="ទីតាំងរូបភាពណែនាំ">
                {guidePictures.map((picture, index) => (
                  <button
                    className={index === selectedPictureIndex ? 'is-active' : ''}
                    key={picture.src}
                    type="button"
                    aria-label={`បង្ហាញរូបភាពទី ${index + 1}`}
                    onClick={() => setSelectedPictureIndex(index)}
                  />
                ))}
              </div>
            </div>

            <button
              className="back-link"
              type="button"
              onClick={() => {
                setSelectedRoomId(null)
                setSelectedDoorId(null)
              }}
            >
              ជ្រើសរើសបន្ទប់ផ្សេង
            </button>
          </section>
        </section>
      </main>
    )
  }

  return (
    <main className="guide-page">
      <section className="guide-shell" aria-label="ការណែនាំទៅបន្ទប់ប្រជុំ">
        <header className="guide-header">
          <div>
            <p className="eyebrow">ការណែនាំអ្នកចូលរួម</p>
            <h1>រកបន្ទប់ប្រជុំរបស់អ្នក</h1>
            <p className="header-copy">ជ្រើសរើសបន្ទប់ មើលផ្លូវលើផែនទី បន្ទាប់មកជ្រើសទ្វារដើម្បីបើកការណែនាំ។</p>
          </div>
          <div className="selected-pill">ជំហានទី ១</div>
        </header>

        <section className="room-section" aria-label="ជ្រើសរើសបន្ទប់ប្រជុំ">
          {rooms.map((room) => (
            <button
              className="room-card"
              key={room.id}
              type="button"
              onClick={() => selectRoom(room.id)}
              style={{ '--room-color': room.color }}
            >
              <span className="room-card-heading">
                <strong>{room.name}</strong>
                <small>{room.floor}</small>
              </span>
            </button>
          ))}
        </section>

        <section className="map-panel">
          <section className="combined-map-panel" aria-label="ផែនទីបង្ហាញផ្លូវ">
            <CombinedRoomMap />
          </section>
        </section>
      </section>
    </main>
  )
}

export default App
