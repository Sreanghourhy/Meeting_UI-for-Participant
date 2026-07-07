import { useMemo, useState } from 'react'
import DoorSelection from './components/DoorSelection'
import GuideViewer from './components/GuideViewer'
import RoomSelection from './components/RoomSelection'
import { doors, fallbackGuidePictures, roomGuides, rooms } from './data/meetingGuideData'

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
  const activeGuidePictures = useMemo(() => {
    if (selectedRoom?.room && selectedDoorId) {
      return roomGuides[selectedRoom.room]?.[selectedDoorId] || fallbackGuidePictures
    }

    return fallbackGuidePictures
  }, [selectedDoorId, selectedRoom])

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

  if (pendingRoom) {
    return (
      <DoorSelection
        doors={doors}
        room={pendingRoom}
        onBack={() => setPendingRoomId(null)}
        onSelectDoor={selectDoor}
      />
    )
  }

  if (selectedRoom) {
    return (
      <GuideViewer
        door={selectedDoor}
        guidePictures={activeGuidePictures}
        pictureIndex={selectedPictureIndex}
        room={selectedRoom}
        onBack={() => {
          setSelectedRoomId(null)
          setSelectedDoorId(null)
        }}
        onSelectPicture={setSelectedPictureIndex}
        onSwapPicture={swapPicture}
      />
    )
  }

  return <RoomSelection rooms={rooms} onSelectRoom={selectRoom} />
}

export default App
