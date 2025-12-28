'use client'
import { usePathname } from 'next/navigation';

export default function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFullWidth = pathname === '/' || pathname === '/styleguide' || pathname === '/sales';

  return (
    <main className={isFullWidth ? "main-content-full" : "main-content"}>
      {children}
    </main>
  );
}