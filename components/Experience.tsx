'use client';
import dynamic from 'next/dynamic';
import { Component, type ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { availableOnFloor, unitsOnFloor, money, type Residence } from '@/lib/residences';
import { lagosToday } from '@/lib/enquiries';
import { Icon } from './Icons';
import type { ViewMode } from './Scene';
const Scene = dynamic(() => import('./Scene'), { ssr: false });
const viewNames = ['South-west', 'South elevation', 'South-east'];
const bedroomOptions: [number, string][] = [[0, 'All bedrooms'], [1, '1 bedroom'], [2, '2 bedrooms'], [3, '3 bedrooms']];
class SceneBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? <div className="webgl-fallback">The 3D view couldn’t start on this device. Every residence is still available to explore.</div> : this.props.children; }
}
function useMotionPreference() {
  const [reduced, setReduced] = useState(true);
  useEffect(() => { const media = window.matchMedia('(prefers-reduced-motion: reduce)'); const update = () => setReduced(media.matches); update(); media.addEventListener('change', update); return () => media.removeEventListener('change', update); }, []);
  return reduced;
}
export default function Experience() {
  const [mode, setMode] = useState<ViewMode>('home');
  const [dusk, setDusk] = useState(true);
  const [view, setView] = useState(0);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [floor, setFloor] = useState(4);
  const [bedrooms, setBedrooms] = useState(0);
  const [selected, setSelected] = useState<Residence | null>(null);
  const [hovered, setHovered] = useState<Residence | null>(null);
  const [menu, setMenu] = useState(false);
  const [bedroomMenu, setBedroomMenu] = useState(false);
  const [notice, setNotice] = useState('');
  const dialog = useRef<HTMLDialogElement>(null);
  const root = useRef<HTMLElement>(null);
  const bedroomFilter = useRef<HTMLDivElement>(null);
  const reduced = useMotionPreference();
  const apartment = mode === 'apartment';
  const onReady = useCallback(() => setReady(true), []);
  const onFailure = useCallback(() => { setFailed(true); setReady(true); }, []);
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(''), 4500);
    return () => window.clearTimeout(timer);
  }, [notice]);
  useEffect(() => {
    if (!bedroomMenu) return;
    bedroomFilter.current?.querySelector<HTMLElement>('[role="option"][aria-selected="true"]')?.focus();
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (bedroomFilter.current && !bedroomFilter.current.contains(event.target as Node)) setBedroomMenu(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') { setBedroomMenu(false); bedroomFilter.current?.querySelector<HTMLButtonElement>('.bedroom-trigger')?.focus(); } };
    document.addEventListener('mousedown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [bedroomMenu]);
  useLayoutEffect(() => {
    if (reduced) return;
    const context = gsap.context(() => {
      gsap.fromTo('.reveal', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .9, stagger: .09, delay: .2, ease: 'power2.out', clearProps: 'all' });
    }, root);
    return () => context.revert();
  }, [mode, reduced]);
  const navigate = (next: ViewMode) => { setMode(next); setMenu(false); setHovered(null); if (next === 'home') setSelected(null); };
  const selectUnit = useCallback((unit: Residence) => { setSelected(unit); setFloor(unit.floor); if (bedrooms && unit.bedrooms !== bedrooms) setBedrooms(0); setMode('residences'); setHovered(null); }, [bedrooms]);
  const openVisit = () => { setMenu(false); dialog.current?.showModal(); };
  const fullScreen = async () => {
    try { if (document.fullscreenElement) await document.exitFullscreen(); else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen(); else setNotice('Full screen is not supported by this browser.'); }
    catch { setNotice('Full screen is not available in this browser.'); }
  };
  const filtered = unitsOnFloor(floor).filter(unit => !bedrooms || unit.bedrooms === bedrooms);
  return <main ref={root} className={`experience ${apartment ? 'is-apartment' : ''} ${dusk ? 'is-dusk' : 'is-day'}`}>
    <a className="skip-link" href="#main-content">Skip to residence controls</a>
    <div className="scene" role="img" aria-label={apartment ? 'Furnished architectural cutaway of the selected Aven apartment' : 'Interactive eight-storey Aven residential building with balconies, trees, and a landscaped street'}>
      <SceneBoundary onFailure={onFailure}><Scene mode={mode} dusk={dusk} view={view} reduced={reduced} selected={selected} activeFloor={mode === 'residences' ? floor : null} hovered={hovered} onHover={setHovered} onSelect={selectUnit} onReady={onReady} onFailure={onFailure}/></SceneBoundary>
    </div>
    {!apartment && <div className="scene-shade"/>}
    <header className="header">
      <button className="wordmark" onClick={() => navigate('home')} aria-label="Aven home"><svg viewBox="0 0 36 38" width="31" height="34" fill="none" aria-hidden="true"><path d="M4 32 18 5l14 27M10 23h16M10 32l8-16 8 16" stroke="currentColor" strokeWidth="1.35"/></svg><span>aven<span className="brand-note">residences</span></span></button>
      <nav id="mobile-menu" aria-label="Main navigation" className={`navigation ${menu ? 'is-open' : ''}`}>
        <button className={mode === 'architecture' ? 'active' : ''} onClick={() => navigate('architecture')}>The architecture</button>
        <button className={mode === 'residences' || apartment ? 'active' : ''} onClick={() => navigate('residences')}>Residences</button>
        <button className={mode === 'setting' ? 'active' : ''} onClick={() => navigate('setting')}>Life at Aven</button>
        <button className="mobile-visit" onClick={openVisit}>Arrange a visit</button>
      </nav>
      <button className="button header-cta" onClick={openVisit}>Arrange a visit <span className="button-arrow"><Icon name="arrow" size={16}/></span></button>
      <button className="menu-toggle" aria-expanded={menu} aria-controls="mobile-menu" aria-label={menu ? 'Close menu' : 'Open menu'} onClick={() => setMenu(!menu)}><span/ ><span/></button>
    </header>
    <div id="main-content" className={`content content-${mode}`} tabIndex={-1}>
      {mode === 'home' && <section className="hero-copy" aria-label="Welcome to Aven">
        <h1 aria-label="Find your home at Aven"><span className="reveal">Find your</span><span className="reveal">home</span><span className="reveal">at Aven.</span></h1>
        <p className="hero-description reveal">1–3 bedroom residences in Lagos.<br/>A private collection. From ₦185 million.</p>
        <button className="button hero-cta reveal" onClick={() => navigate('residences')}>Explore residences <span className="button-arrow"><Icon name="arrow" size={18}/></span></button>
        <p className="hero-detail reveal">32 residences. One considered address.</p>
      </section>}
      {mode === 'architecture' && <section className="editorial-panel">
        <button className="back-link reveal" onClick={() => navigate('home')}><Icon name="left" size={17}/> Back to Aven</button>
        <h1 className="reveal">Considered.<br/>Every angle.</h1>
        <p className="reveal">Warm stone tones, full-height glazing and deep private terraces. Architecture that gives Lagos living room to breathe.</p>
        <dl className="architecture-details reveal"><div><dt>Eight</dt><dd>residential levels</dd></div><div><dt>32</dt><dd>individual homes</dd></div></dl>
        <p className="material-note reveal">Just four homes per floor. A welcoming entrance, lift access to every level, and a planted rooftop for a quieter moment above the city.</p>
        <button className="text-action reveal" onClick={() => navigate('residences')}>Find your perspective <Icon name="arrow" size={18}/></button>
      </section>}
      {mode === 'setting' && <section className="editorial-panel setting-panel">
        <button className="back-link reveal" onClick={() => navigate('home')}><Icon name="left" size={17}/> Back to Aven</button>
        <h1 className="reveal">Lagos.<br/>At your pace.</h1>
        <p className="reveal">Aven brings a more considered rhythm to city life. Private outdoor spaces, a landscaped arrival and the reassurance of a managed residence.</p>
        <ul className="setting-list reveal"><li><Icon name="leaf"/> Landscaped arrival & resident parking</li><li><Icon name="sun"/> Private terraces for every home</li><li><Icon name="building"/> Rooftop garden & residents’ lounge</li></ul>
        <p className="material-note reveal">A dedicated concierge, controlled access and provision for backup power support the everyday, so you can simply come home.</p>
        <button className="text-action reveal" onClick={() => { navigate('home'); setView(0); }}>Return to the building <Icon name="arrow" size={18}/></button>
      </section>}
      {mode === 'residences' && <section className="residence-explorer" aria-labelledby="residence-heading" data-ui>
        <button className="back-link reveal" onClick={() => navigate('home')}><Icon name="left" size={17}/> Back to Aven</button>
        <h1 id="residence-heading" className="reveal">Your next<br/>perspective.</h1>
        <p className="explorer-intro reveal">One, two and three bedroom homes, each with a private terrace. Choose your floor and find your fit.</p>
        <div className="floor-selector reveal"><div className="control-label"><span>Floor</span><span>{availableOnFloor(floor).length} available</span></div><div className="floor-buttons" role="group" aria-label="Select a floor">{Array.from({ length: 8 }, (_, i) => i + 1).map(n => <button key={n} onClick={() => { setFloor(n); setSelected(null); }} aria-pressed={floor === n} aria-label={`Floor ${n}`}>{n}</button>)}</div></div>
        <div className="filter-row reveal"><span id="bedroom-filter-label">Residences</span><div className={`bedroom-filter ${bedroomMenu ? 'is-open' : ''}`} ref={bedroomFilter}><button className="bedroom-trigger" type="button" aria-haspopup="listbox" aria-expanded={bedroomMenu} aria-labelledby="bedroom-filter-label bedroom-filter-value" onClick={() => setBedroomMenu(open => !open)}><span id="bedroom-filter-value">{bedrooms ? `${bedrooms} bedroom${bedrooms === 1 ? '' : 's'}` : 'All bedrooms'}</span><span className="bedroom-chevron" aria-hidden="true"/></button>{bedroomMenu && <div className="bedroom-menu" role="listbox" aria-label="Filter by bedrooms" onKeyDown={event => {
          if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
          event.preventDefault();
          const options = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="option"]'));
          const index = options.indexOf(document.activeElement as HTMLButtonElement);
          options[(index + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length]?.focus();
        }}>{bedroomOptions.map(([value, label]) => <button key={value} type="button" role="option" aria-selected={bedrooms === value} className={bedrooms === value ? 'is-selected' : ''} onClick={() => { setBedrooms(value); setSelected(null); setBedroomMenu(false); bedroomFilter.current?.querySelector<HTMLButtonElement>('.bedroom-trigger')?.focus(); }}>{label}{bedrooms === value && <Icon name="check" size={14}/>}</button>)}</div>}</div></div>
        <div className="unit-list reveal" aria-live="polite">{filtered.length ? filtered.map(unit => <button className={`unit-row ${selected?.id === unit.id ? 'selected' : ''}`} key={unit.id} disabled={!unit.available} onClick={() => selectUnit(unit)} onFocus={() => setHovered(unit)} onBlur={() => setHovered(null)} onMouseEnter={() => setHovered(unit)} onMouseLeave={() => setHovered(null)} aria-label={`Apartment ${unit.id}, ${unit.bedrooms} ${unit.bedrooms === 1 ? 'bedroom' : 'bedrooms'}, ${unit.area} square metres, ${unit.available ? 'available' : 'reserved'}`}><span className="unit-id">{unit.id}</span><span>{unit.bedrooms} bed<span className="unit-area">{unit.area} m²</span></span><span className="unit-state">{unit.available ? <Icon name="right" size={18}/> : 'Reserved'}</span></button>) : <p className="empty-state">No homes of this size on floor {floor}. Try another floor or bedroom count.</p>}</div>
        <p className="residence-starting-price reveal">Residences from ₦185 million</p>
      </section>}
      {apartment && selected && <>
        <button className="apartment-back back-link reveal" onClick={() => navigate('residences')}><Icon name="left" size={18}/> Back to the building</button>
        <section className="apartment-details" data-ui>
          <p className="availability reveal"><span/> Available residence</p>
          <h1 className="reveal">Residence {selected.id}</h1><p className="apartment-name reveal">{selected.name} · Lagos, Nigeria</p><div className="residence-price reveal"><span>Purchase price</span><strong>{money(selected.price)}</strong></div>
          <dl className="unit-facts reveal"><div><dt>Floor</dt><dd>{selected.floor} of 8</dd></div><div><dt>Interior</dt><dd>{selected.area} m²</dd></div><div><dt>Bedrooms</dt><dd>{selected.bedrooms}</dd></div><div><dt>Terrace</dt><dd>{selected.terrace} m²</dd></div></dl>
          <p className="apartment-description reveal">An open living space, a private terrace, and natural light from morning to evening.</p>
          <ul className="apartment-features reveal"><li><Icon name="check" size={16}/> Open-plan living and dining</li><li><Icon name="check" size={16}/> Full-height glazing</li><li><Icon name="check" size={16}/> Private outdoor terrace</li></ul>
          <button className="button reveal" onClick={openVisit}>Arrange a visit <span className="button-arrow"><Icon name="arrow" size={18}/></span></button>
          <p className="sample-note reveal">Areas are approximate. Final specifications subject to contract.</p>
        </section>
        <div className="apartment-caption reveal"><span className="caption-swatch"/> Residence layout · {selected.bedrooms} bedroom residence</div>
      </>}
    </div>

    {!apartment && mode === 'residences' && selected && <aside className="selection-card" aria-label={`Selected apartment ${selected.id}`} data-ui><button className="selection-close icon-button" onClick={() => setSelected(null)} aria-label="Close apartment preview"><Icon name="close" size={17}/></button><p className="availability"><span/> Available residence</p><h2>Apartment {selected.id}</h2><p className="selection-price">{money(selected.price)}</p><p className="selection-description">Floor {selected.floor} <span>·</span> {selected.bedrooms} {selected.bedrooms === 1 ? 'bedroom' : 'bedrooms'} <span>·</span> {selected.area} m²</p><button className="text-action" onClick={() => { setHovered(null); setMode('apartment'); }}>Step inside <Icon name="arrow" size={18}/></button></aside>}
    {!apartment && mode === 'home' && <div className="scene-description"><span className="scene-description-mark"/><div>Architecture with intention.<span>A home with your name on it.</span></div></div>}
    <footer className="footer" data-ui>
      <div className="footer-brand"><span>Aven residences</span><span className="footer-tag">Lagos, Nigeria</span></div>
      <div className="view-controls"><button className="icon-button" aria-label="Previous building view" disabled={apartment} onClick={() => { setView((view + 2) % 3); if (mode === 'architecture' || mode === 'setting') navigate('home'); }}><Icon name="left" size={17}/></button><span className="view-label">{apartment ? 'Interior perspective' : viewNames[view] + ' view'}</span><button className="icon-button" aria-label="Next building view" disabled={apartment} onClick={() => { setView((view + 1) % 3); if (mode === 'architecture' || mode === 'setting') navigate('home'); }}><Icon name="right" size={17}/></button></div>
      <div className="scene-controls">{!apartment && <div className="time-toggle" role="group" aria-label="Lighting"><button aria-pressed={!dusk} onClick={() => setDusk(false)}><Icon name="sun" size={15}/> Day</button><button aria-pressed={dusk} onClick={() => setDusk(true)}><Icon name="moon" size={15}/> Dusk</button></div>}<button className="icon-button fullscreen" aria-label="Toggle full screen" onClick={fullScreen}><Icon name="expand" size={19}/></button></div>
    </footer>
    {!ready && <div className="loading-indicator" role="status"><span/> Preparing your perspective</div>}
    {failed && mode === 'home' && <button className="fallback-explore button" onClick={() => navigate('residences')}>Browse residences <Icon name="arrow"/></button>}
    {notice && <div className="toast" role="status">{notice}</div>}
    <VisitDialog dialogRef={dialog} selected={selected}/>
    <noscript><div className="noscript"><h1>Aven residences</h1><p>Eight floors. Thirty-two residences. Enable JavaScript to explore the building and apartment layouts.</p></div></noscript>
  </main>;
}
function VisitDialog({ dialogRef, selected }: { dialogRef: React.RefObject<HTMLDialogElement | null>; selected: Residence | null }) {
  const [reference, setReference] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const minimumDate = lagosToday();
  return <dialog ref={dialogRef} className="visit-dialog" aria-labelledby="visit-title" onCancel={event => { if (sending) event.preventDefault(); }} onClose={() => { if (reference) { setName(''); setEmail(''); setDate(''); } setReference(''); setError(''); }} onClick={event => { if (event.target === event.currentTarget && !sending) dialogRef.current?.close(); }}>
    <div className="visit-inner"><button className="dialog-close icon-button" aria-label="Close viewing form" disabled={sending} onClick={() => dialogRef.current?.close()}><Icon name="close"/></button>
      {reference ? <div className="confirmation"><div className="confirmation-mark"><Icon name="check" size={28}/></div><h2 id="visit-title">We look forward<br/>to welcoming you.</h2><p>Thank you, {name}. We’ve received your request to visit {selected ? `Residence ${selected.id}` : 'Aven'} on {new Intl.DateTimeFormat('en-NG', { dateStyle: 'long', timeZone: 'Africa/Lagos' }).format(new Date(date + 'T12:00:00Z'))}.</p><p>Our sales team will contact you at {email} to confirm your private viewing.</p><p className="enquiry-reference">Your reference: {reference}</p><button className="button" onClick={() => dialogRef.current?.close()}>Explore Aven <Icon name="arrow" size={18}/></button></div> : <><h2 id="visit-title">See yourself here.</h2><p>Request a private viewing of {selected ? `Residence ${selected.id}` : 'Aven Residences'} with our Lagos sales team.</p><form onSubmit={async event => {
        event.preventDefault();
        if (sending) return;
        if (!name.trim() || !email.trim() || !date || date < minimumDate) { setError('Please enter your name, email, and a viewing date from today onwards.'); return; }
        setError(''); setSending(true);
        try {
          const response = await fetch('/api/enquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, date, residence: selected?.id || null }) });
          const result = await response.json();
          if (!response.ok) throw new Error(result.error || 'We couldn’t receive your request. Please try again.');
          setReference(result.reference);
        } catch (error) { setError(error instanceof Error ? error.message : 'Please check your connection and try again.'); }
        finally { setSending(false); }
      }}>
        <label htmlFor="visit-name">Full name<input disabled={sending} id="visit-name" name="name" autoComplete="name" required maxLength={100} value={name} onChange={event => setName(event.target.value)}/></label>
        <label htmlFor="visit-email">Email address<input disabled={sending} id="visit-email" name="email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={event => setEmail(event.target.value)}/></label>
        <label htmlFor="visit-date">Preferred viewing date<input disabled={sending} id="visit-date" name="date" type="date" min={minimumDate} required value={date} onChange={event => setDate(event.target.value)}/></label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="button" type="submit" disabled={sending}>{sending ? 'Sending your request…' : 'Request a private viewing'}<span className="button-arrow"><Icon name="arrow" size={18}/></span></button>
        <p className="form-notice">Viewings are by appointment. We’ll contact you to confirm availability. Your details are used only to respond to your enquiry.</p>
      </form></>}
    </div>
  </dialog>;
}
