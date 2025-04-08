import './globals.css';
import type { Metadata } from 'next'
import { Inter } from 'next/font/google';
import { AuthProvider } from '../context/AuthContext';
import { NotificationProvider } from '../context/NotificationContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata :Metadata  = {
  title: 'HR Portal | Employee Management System',
  description: 'HR Portal - A complete solution for employee management, leave requests, performance reviews, and more.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}