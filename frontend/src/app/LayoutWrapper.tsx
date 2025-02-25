'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/navbar';
import { Footer } from '@/components/footer';
import React from 'react';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <>
      {!isAdmin && <Navbar />}
      {children}
      {!isAdmin && <Footer />}
    </>
  );
}
