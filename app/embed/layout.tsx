import { Public_Sans } from 'next/font/google';
import localFont from 'next/font/local';
import { Providers } from '@/components/providers';
import '../globals.css';

const publicSans = Public_Sans({
  variable: '--font-public-sans',
  subsets: ['latin'],
});

const commitMono = localFont({
  src: [
    {
      path: '../fonts/CommitMono-400-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/CommitMono-700-Regular.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../fonts/CommitMono-400-Italic.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../fonts/CommitMono-700-Italic.otf',
      weight: '700',
      style: 'italic',
    },
  ],
  variable: '--font-commit-mono',
});

interface EmbedLayoutProps {
  children: React.ReactNode;
}

export default function EmbedLayout({ children }: EmbedLayoutProps) {
  return (
    <div className={`${publicSans.variable} ${commitMono.variable} antialiased h-full`}>
      <Providers>
        {children}
      </Providers>
    </div>
  );
}