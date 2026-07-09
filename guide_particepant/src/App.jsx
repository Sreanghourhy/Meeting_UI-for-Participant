import { useMemo, useState, useEffect } from 'react'
import { rooms, doors, roomGuides } from './data/meetingGuideData'

function App({ onStepChange }) {
  const [pendingRoomId, setPendingRoomId] = useState(null)
  const [selectedRoomId, setSelectedRoomId] = useState(null)
  const [selectedDoorId, setSelectedDoorId] = useState(null)
  const [selectedPictureIndex, setSelectedPictureIndex] = useState(0)

  useEffect(() => {
    if (onStepChange) {
      if (selectedRoomId) {
        onStepChange('details', () => {
          setPendingRoomId(selectedRoomId)
          setSelectedRoomId(null)
          setSelectedDoorId(null)
        })
      } else if (pendingRoomId) {
        onStepChange('doors', () => {
          setPendingRoomId(null)
        })
      } else {
        onStepChange('rooms', null)
      }
    }
  }, [pendingRoomId, selectedRoomId, onStepChange])

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
  const selectedGuidePictures = useMemo(() => {
    if (!selectedRoom || !selectedDoorId) return []
    const roomKey = selectedRoom.room
    const guides = roomGuides[roomKey]
    if (!guides) return []
    return guides[selectedDoorId] || []
  }, [selectedRoom, selectedDoorId])
  const selectedPicture = selectedGuidePictures[selectedPictureIndex] || {}

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
      const total = selectedGuidePictures.length
      if (total === 0) return 0
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
                <span>រូបភាពទី {selectedPictureIndex + 1} / {selectedGuidePictures.length}</span>
              </div>
              <button className="round-button" type="button" aria-label="រូបភាពបន្ទាប់" onClick={() => swapPicture(1)}>
                &#8594;
              </button>
            </div>

            <div className="photo-frame">
              {selectedPicture.src && <img src={selectedPicture.src} alt={`រូបភាព ${selectedPicture.title || ''}`} />}
            </div>

            <div className="guide-copy">
              <p className="instruction-kicker">{selectedRoom.floor}</p>
              <h2>{selectedPicture.title || ''}</h2>
              <p>{selectedPicture.text || ''}</p>
              <div className="step-dots" aria-label="ទីតាំងរូបភាពណែនាំ">
                {selectedGuidePictures.map((picture, index) => (
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
            <p className="header-copy">ជ្រើសរើសបន្ទប់ មើលផ្លូវលើផែនទី បន្ទាប់មកជ្រើសទ្វារដើម្បីបើកការណែនាំ。</p>
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
            </button>
          ))}
        </section>
      </section>
    </main>
  )
}

export default App
