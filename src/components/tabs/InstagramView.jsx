import { useSession } from '../../context/SessionContext.jsx';
import useLaggyScroll from '../../hooks/useLaggyScroll.js';
import './InstagramView.css';

const POSTS = [
  { id: 1, user: 'wildaperture', gradient: 'linear-gradient(135deg, #f6d365, #fda085)' },
  { id: 2, user: 'northcoast.ali', gradient: 'linear-gradient(135deg, #a1c4fd, #c2e9fb)' },
  { id: 3, user: 'studio.moss', gradient: 'linear-gradient(135deg, #84fab0, #8fd3f4)' },
  { id: 4, user: 'harlow.bakes', gradient: 'linear-gradient(135deg, #f093fb, #f5576c)' },
  { id: 5, user: 'quiet.trails', gradient: 'linear-gradient(135deg, #667eea, #764ba2)' },
];

export default function InstagramView() {
  const { distractionLevel } = useSession();
  const feedRef = useLaggyScroll(distractionLevel);

  return (
    <div className="instagram-view" ref={feedRef}>
      <div className="instagram-header">
        <span className="instagram-logo">Instagram</span>
      </div>

      <div className="instagram-feed">
        {POSTS.map((post) => (
          <article className="instagram-card" key={post.id}>
            <div className="instagram-card-header">
              <span className="instagram-avatar" aria-hidden="true" />
              <span className="instagram-username">{post.user}</span>
            </div>

            <div
              className="instagram-image"
              style={{ background: post.gradient }}
              aria-hidden="true"
            />

            <div className="instagram-card-actions">
              <span>&#9825;</span>
              <span>&#128172;</span>
              <span>&#10148;</span>
            </div>

            <p className="instagram-likes">1,204 likes</p>
            <p className="instagram-caption">
              <strong>{post.user}</strong> placeholder caption text for study purposes.
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
