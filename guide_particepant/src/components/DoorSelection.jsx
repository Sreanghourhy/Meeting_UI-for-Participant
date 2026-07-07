function DoorSelection({ doors, room, onBack, onSelectDoor }) {
  return (
    <main className="guide-page">
      <section className="guide-shell door-shell" aria-label="ជ្រើសរើសទ្វារ">
        <header className="guide-header compact-header">
          <div>
            <p className="eyebrow">ជំហានទី ២</p>
            <h1>ជ្រើសរើសទ្វារ</h1>
            <p className="header-copy">អ្នកបានជ្រើស {room.name}។ សូមជ្រើសទ្វារដែលអ្នកចូលមក។</p>
          </div>
          <button className="back-link back-link-inline" type="button" onClick={onBack}>
            ត្រឡប់ក្រោយ
          </button>
        </header>

        <section className="door-section" aria-label="ជ្រើសរើសទ្វារ">
          {doors.map((door) => (
            <button
              className="door-card"
              key={door.id}
              type="button"
              onClick={() => onSelectDoor(door.id)}
              style={{ '--room-color': room.color }}
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

export default DoorSelection
