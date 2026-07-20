import './YouTubeView.css';

const SUGGESTIONS = [
  { id: 1, title: 'Neural Networks Explained Simply', channel: 'CodeAndClarity', views: '842K views', gradient: 'linear-gradient(135deg, #fddb92, #d1fdff)' },
  { id: 2, title: 'Linear Algebra for Machine Learning', channel: 'MathsForBuilders', views: '210K views', gradient: 'linear-gradient(135deg, #a18cd1, #fbc2eb)' },
  { id: 3, title: 'Gradient Descent, Step by Step', channel: 'CodeAndClarity', views: '556K views', gradient: 'linear-gradient(135deg, #ffecd2, #fcb69f)' },
  { id: 4, title: 'How Decision Trees Work', channel: 'DataDistilled', views: '128K views', gradient: 'linear-gradient(135deg, #d4fc79, #96e6a1)' },
  { id: 5, title: 'Overfitting vs Underfitting', channel: 'DataDistilled', views: '95K views', gradient: 'linear-gradient(135deg, #89f7fe, #66a6ff)' },
];

export default function YouTubeView() {
  return (
    <div className="youtube-view">
      <div className="youtube-header">
        <span className="youtube-logo">YouTube</span>
      </div>

      <div className="youtube-layout">
        <div className="youtube-main">
          <div className="youtube-player" aria-hidden="true">
            <span className="youtube-play-icon">&#9654;</span>
          </div>

          <h1 className="youtube-title">Machine Learning Basics</h1>

          <div className="youtube-meta">
            <div className="youtube-channel">
              <span className="youtube-channel-avatar" aria-hidden="true" />
              <div>
                <p className="youtube-channel-name">CodeAndClarity</p>
                <p className="youtube-channel-subs">312K subscribers</p>
              </div>
            </div>
            <p className="youtube-stats">1.4M views</p>
          </div>

          <p className="youtube-description">
            An introduction to the core ideas behind machine learning,
            covering supervised learning, model training and evaluation,
            with placeholder examples for illustration purposes only.
          </p>
        </div>

        <aside className="youtube-suggestions">
          {SUGGESTIONS.map((video) => (
            <div className="youtube-suggestion-card" key={video.id}>
              <div
                className="youtube-suggestion-thumb"
                style={{ background: video.gradient }}
                aria-hidden="true"
              />
              <div className="youtube-suggestion-info">
                <p className="youtube-suggestion-title">{video.title}</p>
                <p className="youtube-suggestion-channel">{video.channel}</p>
                <p className="youtube-suggestion-views">{video.views}</p>
              </div>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}
