const draftProgressSteps = [
  {
    id: 1,
    title: 'ពិនិត្យឯកសារ',
    description: 'មើលឯកសារ មតិយោបល់ និងកំណត់ចំណាំ',
    status: 'completed',
  },
  {
    id: 2,
    title: 'ប្រមូលមតិ',
    description: 'បូកសរុបមតិយោបល់ពីអ្នកចូលរួម',
    status: 'completed',
  },
  {
    id: 3,
    title: 'កែសម្រួល',
    description: 'កែសម្រួលខ្លឹមសារតាមសំណើ',
    status: 'pending',
  },
  {
    id: 4,
    title: 'ពិនិត្យចុងក្រោយ',
    description: 'ផ្ទៀងផ្ទាត់មុនដាក់ជូនថ្នាក់ដឹកនាំ',
    status: 'pending',
  },
  {
    id: 5,
    title: 'អនុម័ត',
    description: 'បញ្ចប់សេចក្តីព្រាងសម្រាប់ប្រើប្រាស់',
    status: 'final',
  },
]

function toKhmerNumeral(value) {
  const digits = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩']
  return String(value).replace(/\d/g, (digit) => digits[Number(digit)])
}

export default function DraftProgressTimeline({ selectedStep, onSelectStep }) {
  return (
    <div className="draft-progress">
      <div className="draft-progress-track" aria-hidden="true" />
      {draftProgressSteps.map((step) => (
        <button
          key={step.id}
          className={`draft-step status-${step.status} ${selectedStep === step.id ? 'active' : ''}`}
          type="button"
          onClick={() => onSelectStep(step.id)}
        >
          <span className="draft-step-number">
            {step.status === 'completed' ? '✓' : step.status === 'final' ? '•' : toKhmerNumeral(step.id)}
          </span>
          <span className="draft-step-copy">
            <span className="draft-step-status">
              {step.status === 'completed' ? 'បានបញ្ចប់' : step.status === 'final' ? 'ចុងក្រោយ' : step.id === 3 ? 'កំពុងដំណើរការ' : 'រង់ចាំ'}
            </span>
            <span className="draft-step-title">{step.title}</span>
            <span className="draft-step-desc">{step.description}</span>
          </span>
        </button>
      ))}
    </div>
  )
}
