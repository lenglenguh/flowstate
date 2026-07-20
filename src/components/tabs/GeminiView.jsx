import './GeminiView.css';

export default function GeminiView() {
  return (
    <div className="gemini-view">
      <div className="gemini-header">
        <span className="gemini-logo" aria-hidden="true" />
        <span className="gemini-header-title">Gemini</span>
      </div>

      <div className="gemini-conversation">
        <div className="gemini-message gemini-message-user">
          <p>Can you summarise the key ideas behind spaced repetition?</p>
        </div>

        <div className="gemini-message gemini-message-model">
          <span className="gemini-avatar" aria-hidden="true" />
          <div className="gemini-message-body">
            <p>
              Spaced repetition is a learning technique that schedules
              reviews of material at increasing intervals over time,
              rather than cramming it all at once. A few key ideas:
            </p>
            <ul>
              <li>Reviewing just before you would otherwise forget strengthens memory the most.</li>
              <li>Intervals grow longer each time you recall something successfully.</li>
              <li>Struggling a little to recall something is more effective than easy, immediate review.</li>
            </ul>
          </div>
        </div>

        <div className="gemini-message gemini-message-user">
          <p>Could you give me a simple weekly schedule for revising this?</p>
        </div>

        <div className="gemini-message gemini-message-model">
          <span className="gemini-avatar" aria-hidden="true" />
          <div className="gemini-message-body">
            <p>
              Sure. A simple starting point: review new material the next
              day, then after three days, then after a week, then after two
              weeks. Adjust the gaps based on how well you recall each item.
            </p>
          </div>
        </div>
      </div>

      <div className="gemini-prompt-bar">
        <div className="gemini-prompt-box">
          <span className="gemini-prompt-placeholder">Ask Gemini</span>
        </div>
      </div>
    </div>
  );
}
