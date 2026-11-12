import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="not-found">
      <header className="not-found-header">
        <Link className="not-found-wordmark" href="/" aria-label="Aven home">
          <svg viewBox="0 0 36 38" width="31" height="34" fill="none" aria-hidden="true">
            <path d="M4 32 18 5l14 27M10 23h16M10 32l8-16 8 16" stroke="currentColor" strokeWidth="1.35" />
          </svg>
          <span>aven<span className="not-found-brand-note">residences</span></span>
        </Link>
        <span className="not-found-location">Aven / 404</span>
      </header>

      <section className="not-found-content" aria-labelledby="not-found-title">
        <div className="not-found-number" aria-hidden="true">404</div>
        <div className="not-found-copy">
          <h1 id="not-found-title">This address has moved.</h1>
          <p>
            The page you&apos;re looking for is no longer on the plan. Let&apos;s take you back to
            somewhere with a little more room to breathe.
          </p>
          <Link className="button not-found-action" href="/">
            Return to Aven <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      <footer className="not-found-footer">
        <span>Thoughtfully designed residences.</span>
        <span>Space to breathe. Room to belong.</span>
      </footer>
    </main>
  );
}
