import './DocsView.css';

export default function DocsView() {
  return (
    <div className="docs-view">
      <div className="docs-toolbar">
        <div className="docs-toolbar-title">
          <span className="docs-icon" aria-hidden="true" />
          <span>Research Paper</span>
        </div>
        <div className="docs-toolbar-menu">
          <span>File</span>
          <span>Edit</span>
          <span>View</span>
          <span>Insert</span>
          <span>Format</span>
        </div>
      </div>

      <div className="docs-page-wrapper">
        <div className="docs-page">
          <h1 className="docs-title">Research Paper</h1>
          <p className="docs-byline">Draft, last edited a moment ago</p>

          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
            enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat.
          </p>

          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt
            mollit anim id est laborum.
          </p>

          <p>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
            quae ab illo inventore veritatis et quasi architecto beatae
            vitae dicta sunt explicabo.
          </p>

          <h2 className="docs-subhead">Methodology</h2>
          <textarea
            className="docs-editable"
            defaultValue={
              'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit ' +
              'aut fugit, sed quia consequuntur magni dolores eos qui ratione ' +
              'voluptatem sequi nesciunt. Click here to continue drafting...'
            }
          />
        </div>
      </div>
    </div>
  );
}
