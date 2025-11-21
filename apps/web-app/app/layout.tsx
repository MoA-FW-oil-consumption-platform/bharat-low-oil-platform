import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bharat Low Oil Platform',
  description: 'Track your oil consumption and improve your health - Government of India Initiative',
  keywords: ['oil consumption', 'health', 'government', 'India', 'ICMR'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
