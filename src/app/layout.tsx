import type {Metadata} from 'next';
import { Inter } from 'next/font/google'; // Using Inter font
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/toaster"; // Import Toaster

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'AttendEase',
  description: 'Student Attendance Tracker',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.variable
        )}
      >
        <main>{children}</main>
        <Toaster /> {/* Add Toaster here */}
      </body>
    </html>
  );
}
