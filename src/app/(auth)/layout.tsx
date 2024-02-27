import '@/app/globals.css';
import ToastProvider from '@/components/ToastProvider/ToastProvider';
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
        <ToastProvider>
          <main className={styles.layout}>{children}</main>
        </ToastProvider>
      </body>
    </html>
  );
}
