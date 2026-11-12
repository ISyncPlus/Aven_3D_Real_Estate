export function Icon({ name, size = 20 }: { name: 'arrow' | 'left' | 'right' | 'sun' | 'moon' | 'expand' | 'close' | 'building' | 'rotate' | 'leaf' | 'pin' | 'check'; size?: number }) {
  const paths = {
    arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    left: <path d="m14 6-6 6 6 6"/>, right: <path d="m10 6 6 6-6 6"/>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></>,
    moon: <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z"/>,
    expand: <path d="M9 4H4v5m11-5h5v5M4 15v5h5m11-5v5h-5"/>,
    close: <path d="m6 6 12 12M6 18 18 6"/>,
    building: <><path d="M5 21V3h14v18M3 21h18M9 7h1m4 0h1M9 11h1m4 0h1M9 15h1m4 0h1M10 21v-3h4v3"/></>,
    rotate: <><path d="M20 8a9 9 0 1 0 .5 7M20 3v5h-5"/></>,
    leaf: <><path d="M20 3C8 2 2 10 7 17c7 5 15-1 13-14ZM5 20l10-10"/></>,
    pin: <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z"/><circle cx="12" cy="10" r="2"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
