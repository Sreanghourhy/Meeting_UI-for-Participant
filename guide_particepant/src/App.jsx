import { useMemo, useState } from 'react'

const photo = (name) => `/assets/${name}`
const heroImage = 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80'

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
    name: 'ច្រកចុូលខាងត្បូង',
    hint: 'ច្រកចូលខាងមុខ',
    image: '/assets/Door/West.png',
  },
  {
    id: 'door-2',
    name: 'ច្រកចុូលខាងជើង',
    hint: 'ច្រកកណ្តាល',
    image: '/assets/Door/South.png',
  },
  {
    id: 'door-3',
    name: 'ច្រកចុូលខាងកើត',
    hint: 'ច្រកជិតជណ្តើរយន្ត',
    image: '/assets/Door/East.png',
  },
]

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
                <img className="door-image" src={door.image} alt={`រូបភាព ${door.name}`} />
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
          <img className="header-image" src={heroImage} alt="រូបភាពច្រកផ្លូវការិយាល័យ" />
          <div className="selected-pill">ជំហានទី ១</div>
        </header>

        <section className="room-selection-section room-section" aria-label="ជ្រើសរើសបន្ទប់ប្រជុំ">
          {rooms.map((room) => (
            <button
              className="room-card"
              key={room.id}
              type="button"
              onClick={() => selectRoom(room.id)}
                style={{ '--room-color': room.color }}
              >
                <span className="room-thumb" aria-hidden="true">
                  <span>{room.name.replace('បន្ទប់ ', '')}</span>
                </span>
                <span className="room-card-heading">
                  <strong>{room.name}</strong>
                  <small>{room.floor}</small>
              </span>
            </button>
          ))}
        </section>
      </section>
    </main>
  )
}

export default App
