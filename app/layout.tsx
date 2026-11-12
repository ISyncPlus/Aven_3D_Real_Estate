import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Aven Residences — A considered address in Lagos',
  description: 'Discover Aven, a private collection of 32 one, two and three bedroom residences in Lagos. Explore the architecture, find your home, and arrange a private viewing.',
  icons: { icon: '/icon.svg' },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
