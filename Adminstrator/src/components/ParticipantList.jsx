import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import InvitationFormModal from './InvitationFormModal.jsx';
import { useMeetings } from '../hooks/useMeetings.js';
import { formatDateTime } from '../utils/helpers.js';

function ParticipantList() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { meetings, addLog } = useMeetings();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sendState, setSendState] = useState('idle');
  const [sendChannel, setSendChannel] = useState(null);
  const [sentChannels, setSentChannels] = useState({
    telegram: false,
    email: false,
  });
  const [sendMessage, setSendMessage] = useState(null);

  const meeting = meetings.find((item) => item.id === id);

  if (!meeting) {
    return (
      <section className="page-section">
        <div className="empty-state">
          <h2>រកមិនឃើញកិច្ចប្រជុំ</h2>
          <p>មិនអាចរកកិច្ចប្រជុំដែលបានជ្រើសបានទេ។</p>
          <Link to="/" className="button button-primary">
            ត្រឡប់ទៅកិច្ចប្រជុំ
          </Link>
        </div>
      </section>
    );
  }

  const emailRecipients = meeting.participants.filter((participant) => participant.email);
  const telegramRecipients = meeting.participants.filter((participant) => !participant.email && participant.phone);
  const needsTelegram = telegramRecipients.length > 0;
  const needsEmail = emailRecipients.length > 0;
  const allRequiredChannelsSent =
    (!needsTelegram || sentChannels.telegram) && (!needsEmail || sentChannels.email);

  function handleSendAll(channel) {
    const recipients = channel === 'email' ? emailRecipients : telegramRecipients;
    const channelLabel = channel === 'email' ? 'អ៊ីមែល' : 'Telegram';
    const nextSentChannels = {
      ...sentChannels,
      [channel]: true,
    };
    const willBeDone =
      (!needsTelegram || nextSentChannels.telegram) && (!needsEmail || nextSentChannels.email);

    if (recipients.length === 0) {
      setSendMessage({
        title: 'មិនមានអ្នកទទួល',
        description: `មិនមានអ្នកចូលរួមដែលត្រូវផ្ញើតាម ${channelLabel} ទេ។`,
        isDone: false,
      });
      return;
    }

    setSendState('sending');
    setSendChannel(channel);

    window.setTimeout(() => {
      addLog({
        meetingId: meeting.id,
        meetingName: meeting.name,
        recipientsCount: recipients.length,
        recipientIds: recipients.map((participant) => participant.id),
        channel: channelLabel,
      });
      setSentChannels(nextSentChannels);
      setSendState('sent');
      setSendChannel(null);
      setSendMessage({
        title: willBeDone ? 'បានផ្ញើជោគជ័យ' : 'បានផ្ញើរួច',
        description: willBeDone
          ? 'បានផ្ញើលិខិតអញ្ជើញទៅអ្នកចូលរួមគ្រប់រូបរួចរាល់។'
          : `បានផ្ញើតាម ${channelLabel} រួចរាល់។ សូមផ្ញើតាមមធ្យោបាយដែលនៅសល់ ដើម្បីបញ្ចប់ការផ្ញើ។`,
        isDone: willBeDone,
      });
    }, 900);
  }

  return (
    <section className="page-section">
      <div className="page-header participant-header">
        <div>
          <Link to="/" className="back-link">
            ត្រឡប់ទៅកិច្ចប្រជុំ
          </Link>
          <p className="eyebrow">{formatDateTime(meeting.time)}</p>
          <h2>{meeting.name}</h2>
          <p className="subtle-text">{meeting.location}</p>
        </div>
        <div className="actions">
          <button className="button button-secondary" type="button" onClick={() => setIsModalOpen(true)}>
            បង្កើតលិខិតអញ្ជើញ
          </button>
          <button
            className="button button-primary button-telegram"
            type="button"
            onClick={() => handleSendAll('telegram')}
            disabled={sendState === 'sending' || !needsTelegram || sentChannels.telegram}
            title={!needsTelegram ? 'មិនមានអ្នកចូលរួមដែលត្រូវផ្ញើតាម Telegram' : undefined}
          >
            {sendState === 'sending' && sendChannel === 'telegram'
              ? 'កំពុងផ្ញើ...'
              : sentChannels.telegram
                ? 'បានផ្ញើ Telegram'
                : `ផ្ញើតាម Telegram (${telegramRecipients.length})`}
          </button>
          <button
            className="button button-primary"
            type="button"
            onClick={() => handleSendAll('email')}
            disabled={sendState === 'sending' || !needsEmail || sentChannels.email}
            title={emailRecipients.length === 0 ? 'មិនមានអ្នកចូលរួមដែលមានអ៊ីមែល' : undefined}
          >
            {sendState === 'sending' && sendChannel === 'email'
              ? 'កំពុងផ្ញើ...'
              : sentChannels.email
                ? 'បានផ្ញើអ៊ីមែល'
                : `ផ្ញើតាមអ៊ីមែល (${emailRecipients.length})`}
          </button>
        </div>
      </div>

      {sendState === 'sending' && (
        <div className="notice" role="status">
          កំពុងផ្ញើលិខិតអញ្ជើញតាម {sendChannel === 'email' ? 'អ៊ីមែល' : 'Telegram'}...
        </div>
      )}

      {emailRecipients.length < meeting.participants.length && (
        <div className="notice notice-muted" role="note">
          អ្នកចូលរួម {telegramRecipients.length} នាក់មិនមានអ៊ីមែលទេ។ សូមផ្ញើតាម Telegram សម្រាប់អ្នកទាំងនោះ ហើយផ្ញើអ៊ីមែលសម្រាប់អ្នកដែលមានអ៊ីមែល។
        </div>
      )}

      {!allRequiredChannelsSent && (sentChannels.telegram || sentChannels.email) && (
        <div className="notice notice-muted" role="note">
          នៅសល់មួយជំហានទៀត។ សូមចុចប៊ូតុងផ្ញើដែលនៅសល់ ដើម្បីបញ្ចប់ការផ្ញើគ្រប់អ្នកចូលរួម។
        </div>
      )}

      <div className="participant-table-panel">
        <div className="participant-table-header participant-table-header-wide">
          <span>ឈ្មោះ</span>
          <span>តួនាទី</span>
          <span>អង្គភាព</span>
          <span>ទំនាក់ទំនង</span>
          <span>មធ្យោបាយផ្ញើ</span>
        </div>

        {meeting.participants.map((participant) => (
          <div className="participant-table-row participant-table-row-wide" key={participant.id}>
            <div>
              <strong>{participant.khmerName}</strong>
              <small>{participant.code}</small>
            </div>
            <span>{participant.position}</span>
            <span>{participant.department}</span>
            <div>
              <span>{participant.phone}</span>
              <small>{participant.email || 'មិនមានអ៊ីមែល'}</small>
            </div>
            <span>{participant.email ? 'អ៊ីមែល' : 'Telegram'}</span>
          </div>
        ))}
      </div>

      {isModalOpen && <InvitationFormModal meeting={meeting} onClose={() => setIsModalOpen(false)} />}

      {sendMessage && (
        <div className="modal-backdrop" role="presentation">
          <section className="send-result-modal" role="dialog" aria-modal="true" aria-labelledby="send-result-title">
            <div className="send-result-icon" aria-hidden="true">
              ✓
            </div>
            <p className="eyebrow">ស្ថានភាពការផ្ញើ</p>
            <h2 id="send-result-title">{sendMessage.title}</h2>
            <p>{sendMessage.description}</p>
            <div className="send-result-actions">
              <button
                className="button button-primary"
                type="button"
                onClick={() => {
                  setSendMessage(null);
                  if (sendMessage.isDone) {
                    navigate('/logs');
                  }
                }}
              >
                {sendMessage.isDone ? 'ទៅកំណត់ត្រាផ្ញើ' : 'យល់ព្រម'}
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}

export default ParticipantList;
