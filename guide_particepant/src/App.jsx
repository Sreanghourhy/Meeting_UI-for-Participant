import { useMemo, useRef, useState } from 'react'

const photo = (name) => `/assets/${name}`
const room708Photo = (name) => `/assets/708/${name}`
const room607APhoto = (name) => `/assets/607A/${name}`
const room607BPhoto = (name) => `/assets/607B/${name}`

const sharedRoom708Steps = [
  {
    src: room708Photo('elevator.jpg'),
    title: 'ជំហានទី ២៖ ទៅដល់ជណ្តើរយន្ត',
    text: 'បន្តដើរទៅកាន់ជណ្តើរយន្ត។ ប្រើរូបភាពនេះដើម្បីផ្ទៀងផ្ទាត់ថាអ្នកបានមកដល់ចំណុចត្រឹមត្រូវ។',
  },
  {
    src: room708Photo('choice_nunber.png'),
    title: 'ជំហានទី ៣៖ ជ្រើសរើសជាន់ទី ៧',
    text: 'នៅក្នុងជណ្តើរយន្ត សូមជ្រើសរើសជាន់ទី ៧ ដើម្បីទៅកាន់បន្ទប់ 708។',
  },
  {
    src: room708Photo('out_turn_left.png'),
    title: 'ជំហានទី ៤៖ ចេញពីជណ្តើរយន្ត ហើយបត់ឆ្វេង',
    text: 'ពេលចេញពីជណ្តើរយន្ត សូមបត់ទៅខាងឆ្វេងតាមទិសដៅដែលបង្ហាញក្នុងរូបភាព។',
  },
  {
    src: room708Photo('turn_right_for_room708.png'),
    title: 'ជំហានទី ៥៖ បត់ស្តាំទៅបន្ទប់ 708',
    text: 'បន្តដើរតាមផ្លូវ ហើយបត់ស្តាំនៅចំណុចនេះ ដើម្បីទៅកាន់បន្ទប់ 708។',
  },
  {
    src: room708Photo('done.jpg'),
    title: 'ជំហានទី ៦៖ ទៅដល់បន្ទប់ 708',
    text: 'អ្នកបានទៅដល់បន្ទប់ 708 ហើយ។ សូមពិនិត្យស្លាកបន្ទប់មុនពេលចូល។',
  },
]

const room708Guides = {
  'door-1': [
    {
      src: room708Photo('South.png'),
      title: 'ជំហានទី ១៖ ចាប់ផ្តើមពីច្រកចូលខាងត្បូង',
      text: 'ចាប់ផ្តើមពីច្រកចូលខាងត្បូង ហើយដើរទៅកាន់តំបន់ជណ្តើរយន្ត។',
    },
    ...sharedRoom708Steps,
  ],
  'door-2': [
    {
      src: room708Photo('West.png'),
      title: 'ជំហានទី ១៖ ចាប់ផ្តើមពីច្រកចូលខាងលិច',
      text: 'ចាប់ផ្តើមពីច្រកចូលខាងលិច ហើយដើរតាមផ្លូវខាងមុខ។',
    },
    {
      src: room708Photo('west_1.png'),
      title: 'ជំហានទី ២៖ បន្តពីច្រកចូលខាងលិច',
      text: 'បន្តដើរតាមច្រកផ្លូវនេះ រហូតដល់ចំណុចបន្ទាប់។',
    },
    {
      src: room708Photo('go_thought.png'),
      title: 'ជំហានទី ៣៖ ដើរឆ្លងកាត់ច្រកផ្លូវ',
      text: 'ដើរឆ្លងកាត់តំបន់នេះ ហើយបន្តទៅរកជណ្តើរយន្ត។',
    },
    ...sharedRoom708Steps.map((step, index) => ({
      ...step,
      title: step.title.replace(`ជំហានទី ${index + 2}`, `ជំហានទី ${index + 4}`),
    })),
  ],
  'door-3': [
    {
      src: room708Photo('East.png'),
      title: 'ជំហានទី ១៖ ចាប់ផ្តើមពីច្រកចូលខាងកើត',
      text: 'ចាប់ផ្តើមពីច្រកចូលខាងកើត ហើយដើរតាមផ្លូវដែលបង្ហាញ។',
    },
    {
      src: room708Photo('east_1.png'),
      title: 'ជំហានទី ២៖ បន្តពីច្រកចូលខាងកើត',
      text: 'បន្តដើរតាមច្រកផ្លូវនេះ រហូតដល់ចំណុចបន្ទាប់។',
    },
    {
      src: room708Photo('go_thought.png'),
      title: 'ជំហានទី ៣៖ ដើរឆ្លងកាត់ច្រកផ្លូវ',
      text: 'ដើរឆ្លងកាត់តំបន់នេះ ហើយបន្តទៅរកជណ្តើរយន្ត។',
    },
    ...sharedRoom708Steps.map((step, index) => ({
      ...step,
      title: step.title.replace(`ជំហានទី ${index + 2}`, `ជំហានទី ${index + 4}`),
    })),
  ],
}

function makeRoom607Guides({ roomNumber, photoFor, turnLabel, turnText }) {
  const sharedSteps = [
    {
      src: photoFor('elevator.jpg'),
      title: 'ទៅដល់ជណ្តើរយន្ត',
      text: 'បន្តដើរទៅកាន់ជណ្តើរយន្ត។ ប្រើរូបភាពនេះដើម្បីផ្ទៀងផ្ទាត់ថាអ្នកបានមកដល់ចំណុចត្រឹមត្រូវ។',
    },
    {
      src: photoFor('choice_nunber.png'),
      title: 'ជ្រើសរើសលេខ ៦',
      text: `នៅក្នុងជណ្តើរយន្ត សូមជ្រើសរើសលេខ ៦ ដើម្បីទៅកាន់ ${roomNumber}។`,
    },
    {
      src: photoFor('out_turn_left.png'),
      title: 'ចេញពីជណ្តើរយន្ត ហើយបត់ឆ្វេង',
      text: 'ពេលចេញពីជណ្តើរយន្ត សូមបត់ទៅខាងឆ្វេងតាមទិសដៅដែលបង្ហាញក្នុងរូបភាព។',
    },
    {
      src: photoFor('choice_left_right.png'),
      title: turnLabel,
      text: turnText,
    },
    {
      src: photoFor('done.jpg'),
      title: `ទៅដល់ ${roomNumber}`,
      text: `អ្នកបានទៅដល់ ${roomNumber} ហើយ។ សូមពិនិត្យស្លាកបន្ទប់មុនពេលចូល។`,
    },
  ]

  const withStepNumbers = (steps) =>
    steps.map((step, index) => ({
      ...step,
      title: `ជំហានទី ${index + 1}៖ ${step.title}`,
    }))

  return {
    'door-1': withStepNumbers([
      {
        src: photoFor('South.png'),
        title: 'ចាប់ផ្តើមពីច្រកចូលខាងត្បូង',
        text: `ចាប់ផ្តើមពីច្រកចូលខាងត្បូង ហើយដើរទៅកាន់តំបន់ជណ្តើរយន្តសម្រាប់ ${roomNumber}។`,
      },
      ...sharedSteps,
    ]),
    'door-2': withStepNumbers([
      {
        src: photoFor('West.png'),
        title: 'ចាប់ផ្តើមពីច្រកចូលខាងលិច',
        text: 'ចាប់ផ្តើមពីច្រកចូលខាងលិច ហើយដើរតាមផ្លូវខាងមុខ។',
      },
      {
        src: photoFor('west_1.png'),
        title: 'បន្តពីច្រកចូលខាងលិច',
        text: 'បន្តដើរតាមច្រកផ្លូវនេះ រហូតដល់ចំណុចបន្ទាប់។',
      },
      {
        src: photoFor('go_thought.png'),
        title: 'ដើរឆ្លងកាត់ច្រកផ្លូវ',
        text: 'ដើរឆ្លងកាត់តំបន់នេះ ហើយបន្តទៅរកជណ្តើរយន្ត។',
      },
      ...sharedSteps,
    ]),
    'door-3': withStepNumbers([
      {
        src: photoFor('East.png'),
        title: 'ចាប់ផ្តើមពីច្រកចូលខាងកើត',
        text: 'ចាប់ផ្តើមពីច្រកចូលខាងកើត ហើយដើរតាមផ្លូវដែលបង្ហាញ។',
      },
      {
        src: photoFor('east_1.png'),
        title: 'បន្តពីច្រកចូលខាងកើត',
        text: 'បន្តដើរតាមច្រកផ្លូវនេះ រហូតដល់ចំណុចបន្ទាប់។',
      },
      {
        src: photoFor('go_thought.png'),
        title: 'ដើរឆ្លងកាត់ច្រកផ្លូវ',
        text: 'ដើរឆ្លងកាត់តំបន់នេះ ហើយបន្តទៅរកជណ្តើរយន្ត។',
      },
      ...sharedSteps,
    ]),
  }
}

const room607AGuides = makeRoom607Guides({
  roomNumber: 'បន្ទប់ 607A',
  photoFor: room607APhoto,
  turnLabel: 'ជ្រើសរើសបត់ឆ្វេងទៅបន្ទប់ 607A',
  turnText: 'នៅចំណុចជ្រើសរើសផ្លូវ សូមបត់ទៅខាងឆ្វេង ដើម្បីទៅកាន់បន្ទប់ 607A។',
})

const room607BGuides = makeRoom607Guides({
  roomNumber: 'បន្ទប់ 607B',
  photoFor: room607BPhoto,
  turnLabel: 'ជ្រើសរើសបត់ស្តាំទៅបន្ទប់ 607B',
  turnText: 'នៅចំណុចជ្រើសរើសផ្លូវ សូមបត់ទៅខាងស្តាំ ដើម្បីទៅកាន់បន្ទប់ 607B។',
})

const roomGuides = {
  '708': room708Guides,
  '607A': room607AGuides,
  '607B': room607BGuides,
}

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
    room: '708',
    building: 'អគារភាតរភាព',
    floor: 'ជាន់ទី ៧',
    status: 'ទំនេរ',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80',
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
    room: '607A',
    building: 'អគារភាតរភាព',
    floor: 'ជាន់ទី ៦',
    status: 'ទំនេរ',
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80',
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
    room: '607B',
    building: 'អគារភាតរភាព',
    floor: 'ជាន់ទី ៦',
    status: 'ទំនេរ',
    image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=900&q=80',
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
    name: 'ច្រកចូលខាងត្បូង',
    hint: 'ច្រកចូលមុខ',
    image: '/assets/Door/south.jpg',
  },
  {
    id: 'door-2',
    name: 'ច្រកចូលខាងលិច',
    hint: 'ច្រកចូលលិច',
    image: '/assets/Door/wast.jpg',
  },
  {
    id: 'door-3',
    name: 'ច្រកចូលខាងកើត',
    hint: 'ច្រកចូលកើត',
    image: '/assets/Door/east.jpg',
  },
]

function App() {
  const [pendingRoomId, setPendingRoomId] = useState(null)
  const [selectedRoomId, setSelectedRoomId] = useState(null)
  const [selectedDoorId, setSelectedDoorId] = useState(null)
  const [selectedPictureIndex, setSelectedPictureIndex] = useState(0)
  const swipeStartX = useRef(null)

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
  const activeGuidePictures = useMemo(() => {
    if (selectedRoom?.room && selectedDoorId) {
      return roomGuides[selectedRoom.room]?.[selectedDoorId] || guidePictures
    }

    return guidePictures
  }, [selectedDoorId, selectedRoom])
  const selectedPicture = activeGuidePictures[selectedPictureIndex]

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
      const total = activeGuidePictures.length
      return (current + direction + total) % total
    })
  }

  function startSwipe(event) {
    swipeStartX.current = event.clientX
  }

  function finishSwipe(event) {
    if (swipeStartX.current === null) {
      return
    }

    const distance = event.clientX - swipeStartX.current
    swipeStartX.current = null

    if (Math.abs(distance) < 45) {
      return
    }

    swapPicture(distance < 0 ? 1 : -1)
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
                <span>រូបភាពទី {selectedPictureIndex + 1} / {activeGuidePictures.length}</span>
              </div>
              <button className="round-button" type="button" aria-label="រូបភាពបន្ទាប់" onClick={() => swapPicture(1)}>
                &#8594;
              </button>
            </div>

            <div
              className="photo-frame"
              onPointerDown={startSwipe}
              onPointerLeave={() => {
                swipeStartX.current = null
              }}
              onPointerUp={finishSwipe}
            >
              <img src={selectedPicture.src} alt={`រូបភាព ${selectedPicture.title}`} />
            </div>

            <div className="guide-copy">
              <p className="instruction-kicker">{selectedRoom.floor}</p>
              <h2>{selectedPicture.title}</h2>
              <p>{selectedPicture.text}</p>
              <div className="step-dots" aria-label="ទីតាំងរូបភាពណែនាំ">
                {activeGuidePictures.map((picture, index) => (
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

        <section className="room-selection-section room-section" aria-label="ជ្រើសរើសបន្ទប់ប្រជុំ">
          {rooms.map((room) => (
            <button
              className="room-card"
              key={room.id}
              type="button"
              onClick={() => selectRoom(room.id)}
              style={{ '--room-color': room.color }}
            >
              <img className="room-preview" src={room.image} alt={`រូបភាព ${room.name}`} />
              <span className="room-card-heading">
                <span>
                  <strong>{room.name}</strong>
                  <small>{room.building}</small>
                </span>
                <em>{room.floor}</em>
              </span>
              <span className="room-status">{room.status}</span>
            </button>
          ))}
        </section>
      </section>
    </main>
  )
}

export default App
