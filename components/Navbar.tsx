'use client';

import { usePathname } from 'next/navigation';
import SearchBar from './SearchBar';
import Link from 'next/link';

export default function Navbar() {
  const pathname = usePathname();
  
  // Only show the search bar if we are NOT on the root (home) page
  const showSearch = pathname !== '/';

  return (
    <nav className="flex items-center gap-4 p-4 border-b">
      <Link href="/"></Link>
      <div className="w-64">
      {showSearch && <SearchBar />}
      </div>
    </nav>
  );
}