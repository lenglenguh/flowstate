import { useState } from 'react';
import { useSession } from '../../context/SessionContext.jsx';
import WaitingGame from '../interventions/WaitingGame.jsx';
import './GeminiView.css';

const HISTORY = [
  { id: 'h1', label: 'Spaced repetition schedule', active: true },
  { id: 'h2', label: 'Research paper outline help' },
  { id: 'h3', label: 'Summarising lecture notes' },
  { id: 'h4', label: 'Citation formatting' },
  { id: 'h5', label: 'Study plan for finals' },
];

export default function GeminiView() {
  const { messages, aiGenerating, submitPrompt } = useSession();
  const [draft, setDraft] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    if (!draft.trim() || aiGenerating) return;
    submitPrompt(draft);
    setDraft('');
  }

  return (
    <div className="gemini-view">
      <aside className="gemini-sidebar">
        <button type="button" className="gemini-sidebar-new-chat">
          <span className="gemini-sidebar-plus" aria-hidden="true">
            +
          </span>
          New chat
        </button>

        <p className="gemini-sidebar-label">Recent</p>
        <ul className="gemini-sidebar-history">
          {HISTORY.map((item) => (
            <li
              key={item.id}
              className={`gemini-sidebar-history-item${item.active ? ' gemini-sidebar-history-item-active' : ''}`}
            >
              {item.label}
            </li>
          ))}
        </ul>

        <div className="gemini-sidebar-footer">
          <span className="gemini-sidebar-avatar" aria-hidden="true" />
          <span className="gemini-sidebar-footer-label">Settings &amp; help</span>
        </div>
      </aside>

      <div className="gemini-main">
        <div className="gemini-header">
          <span className="gemini-logo" aria-hidden="true" />
          <span className="gemini-header-title">Gemini</span>
        </div>

        <div className="gemini-conversation">
          {messages.map((message) =>
            message.role === 'user' ? (
              <div className="gemini-message gemini-message-user" key={message.id}>
                <p>{message.text}</p>
              </div>
            ) : (
              <div className="gemini-message gemini-message-model" key={message.id}>
                <span className="gemini-avatar" aria-hidden="true" />
                <div className="gemini-message-body">
                  <p>{message.text}</p>
                </div>
              </div>
            )
          )}

          {aiGenerating && (
            <div className="gemini-message gemini-message-model">
              <span className="gemini-avatar" aria-hidden="true" />
              <div className="gemini-message-body gemini-typing">
                <span className="gemini-typing-dot" />
                <span className="gemini-typing-dot" />
                <span className="gemini-typing-dot" />
              </div>
            </div>
          )}
        </div>

        <form className="gemini-prompt-bar" onSubmit={handleSubmit}>
          <input
            type="text"
            className="gemini-prompt-input"
            placeholder={aiGenerating ? 'Waiting for a response…' : 'Ask Gemini'}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            disabled={aiGenerating}
            maxLength={2000}
          />
        </form>
      </div>

      <WaitingGame />
    </div>
  );
}
