import { useEffect, useState } from 'react'
import Modal from './Modal.jsx'
import { getUsers, getUserName } from '../utils/data.js'

const emptyForm = {
  title: '',
  date: '',
  startTime: '',
  endTime: '',
  category: '',
  roomId: '',
  coordinatorId: '',
  meetingLink: '',
}

export default function MeetingFormModal({ show, isEdit, initial = {}, onClose, onSave }) {
  const [form, setForm] = useState(emptyForm)
  const users = getUsers()

  useEffect(() => {
    setForm({ ...emptyForm, ...initial })
  }, [initial, show])

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  function submit(event) {
    event.preventDefault()
    onSave(form)
  }

  return (
    <Modal
      show={show}
      title={isEdit ? 'Edit Meeting' : 'Add Meeting'}
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-secondary" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" type="submit" form="meeting-form">
            {isEdit ? 'Save Changes' : 'Create Meeting'}
          </button>
        </>
      }
    >
      <form id="meeting-form" onSubmit={submit}>
        <div className="form-group">
          <label className="form-label" htmlFor="title">Title</label>
          <input id="title" name="title" className="form-input" value={form.title} onChange={updateField} />
        </div>
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label" htmlFor="date">Date</label>
            <input id="date" name="date" type="date" className="form-input" value={form.date} onChange={updateField} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="category">Category</label>
            <input id="category" name="category" className="form-input" value={form.category} onChange={updateField} />
          </div>
        </div>
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label" htmlFor="startTime">Start Time</label>
            <input id="startTime" name="startTime" type="time" className="form-input" value={form.startTime} onChange={updateField} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="endTime">End Time</label>
            <input id="endTime" name="endTime" type="time" className="form-input" value={form.endTime} onChange={updateField} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="coordinatorId">Coordinator</label>
          <select id="coordinatorId" name="coordinatorId" className="form-select" value={form.coordinatorId} onChange={updateField}>
            <option value="">Select coordinator</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>{getUserName(user)}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="meetingLink">Meeting Link</label>
          <input id="meetingLink" name="meetingLink" className="form-input" value={form.meetingLink} onChange={updateField} />
        </div>
      </form>
    </Modal>
  )
}
