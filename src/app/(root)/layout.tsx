import '@/app/globals.css';
import Bottombar from '@/components/Bottombar/Bottombar';
import Sidebar from '@/components/Sidebar/Sidebar';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import styles from './layout.module.scss';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Templates.io',
  description:
    'Herramienta para creación de documentos basados en templates custom',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className={styles.layout}>
          <Sidebar />
          <section className={styles.container}>{children}</section>
          <Bottombar />
        </div>
      </body>
    </html>
  );
}
