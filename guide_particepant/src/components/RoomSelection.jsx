function RoomSelection({ rooms, onSelectRoom }) {
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
              onClick={() => onSelectRoom(room.id)}
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

export default RoomSelection
