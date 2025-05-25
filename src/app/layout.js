import './globals.css';
import { Playfair_Display, Space_Grotesk } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '600', '700']
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  weight: ['400', '500', '700']
});

export const metadata = {
  title: 'Lena Moreau Portfolio',
  description: 'Photography portfolio site built with Next.js and Tailwind CSS',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-white text-black">{children}</body>
    </html>
  );
}
