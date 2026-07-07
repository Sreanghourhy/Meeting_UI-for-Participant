import { useRef } from 'react'

function GuideViewer({
  guidePictures,
  pictureIndex,
  room,
  door,
  onBack,
  onSelectPicture,
  onSwapPicture,
}) {
  const swipeStartX = useRef(null)
  const selectedPicture = guidePictures[pictureIndex]

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

    onSwapPicture(distance < 0 ? 1 : -1)
  }

  return (
    <main className="guide-page guide-detail-page">
      <section className="guide-detail-shell" aria-label={`ការណែនាំរូបភាពសម្រាប់ ${room.name}`}>
        <section className="picture-guide picture-guide-detail" aria-label={`ការណែនាំរូបភាពសម្រាប់ ${room.name}`}>
          <div className="picture-toolbar">
            <button className="round-button" type="button" aria-label="រូបភាពមុន" onClick={() => onSwapPicture(-1)}>
              &#8592;
            </button>
            <div className="picture-title">
              <p>{room.name}</p>
              {door && <small>{door.name}</small>}
              <span>រូបភាពទី {pictureIndex + 1} / {guidePictures.length}</span>
            </div>
            <button className="round-button" type="button" aria-label="រូបភាពបន្ទាប់" onClick={() => onSwapPicture(1)}>
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
            <p className="instruction-kicker">{room.floor}</p>
            <h2>{selectedPicture.title}</h2>
            <p>{selectedPicture.text}</p>
            <div className="step-dots" aria-label="ទីតាំងរូបភាពណែនាំ">
              {guidePictures.map((picture, index) => (
                <button
                  className={index === pictureIndex ? 'is-active' : ''}
                  key={picture.src}
                  type="button"
                  aria-label={`បង្ហាញរូបភាពទី ${index + 1}`}
                  onClick={() => onSelectPicture(index)}
                />
              ))}
            </div>
          </div>

          <button className="back-link" type="button" onClick={onBack}>
            ជ្រើសរើសបន្ទប់ផ្សេង
          </button>
        </section>
      </section>
    </main>
  )
}

export default GuideViewer
