'use client'

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../lib/authContext'; 
import { AiOutlineHome, AiOutlineSearch } from 'react-icons/ai'; // Removed AiOutlineSearch
import { BsBookmark, BsPen } from 'react-icons/bs';
import { RiSettings3Line } from 'react-icons/ri';
import { TfiHelpAlt } from 'react-icons/tfi';
import { HiOutlineLogin, HiOutlineLogout } from 'react-icons/hi';
import logo from '../public/assets/logo.png';
import styles from '../app/Sidebar.module.css';
import { usePathname } from 'next/navigation';
import Image from 'next/image';


const Sidebar = () => {
  const { user, openModal, logout } = useAuth();
  const pathname = usePathname(); 
  const { setFontSize } = useAuth();
  const isPlayerPage = pathname.includes('/player/');
  const noSidebarPaths = ['/', '/styleguide', '/choose-plan']; 

  if (noSidebarPaths.includes(pathname)) {
    return null;
  }

  return (
    <div className={styles.sidebar}>
      {/* 1. Logo Section */}
      <div className={styles.sidebar__logo}>
        <Image src={logo} alt="Summarist Logo" width={495} height={114} priority />
      </div>
      
      {/* 2. Top Wrapper (Navigation) */}
      <div className={styles.sidebar__top}>
        <Link href="/for-you" className={`${styles.sidebar__link} ${pathname === '/for-you' ? styles.active : ''}`}>
          <AiOutlineHome className={styles.sidebar__icon} />
          <span>For you</span>
        </Link>
        
        <Link href="/library" className={`${styles.sidebar__link} ${pathname === '/library' ? styles.active : ''}`}>
          <BsBookmark className={styles.sidebar__icon} /> 
          <span>My Library</span>
        </Link>

        <div className={`${styles.sidebar__link} ${styles.disabled}`}>
          <BsPen className={styles.sidebar__icon} /> 
          <span>Highlights</span>
        </div>

        <div className={`${styles.sidebar__link} ${styles.disabled}`}>
        <AiOutlineSearch className={styles.sidebar__icon} /> 
        <span>Search</span>
      </div>
    </div>

      {/* 3. Conditional Font Size Section */}
      {isPlayerPage && (
        <div className={styles.sidebar__font}>
          
        <div className={styles.sidebar__font_options}>
          <div className={styles.font_size_btn} onClick={() => setFontSize("14px")}>Aa</div>
          <div className={styles.font_size_btn} onClick={() => setFontSize("18px")}>Aa</div>
          <div className={styles.font_size_btn} onClick={() => setFontSize("22px")}>Aa</div>
          <div className={styles.font_size_btn} onClick={() => setFontSize("26px")}>Aa</div>
        </div>
        </div>
      )}

      {/* 4. Bottom Wrapper (Settings & Auth) */}
      <div className={styles.sidebar__bottom}>
        <Link href="/settings" className={`${styles.sidebar__link} ${pathname === '/settings' ? styles.active : ''}`}>
          <RiSettings3Line className={styles.sidebar__icon} /> 
          <span>Settings</span>
        </Link>

        <div className={`${styles.sidebar__link} ${styles.disabled}`}>
          <TfiHelpAlt className={styles.sidebar__icon} /> 
          <span>Help & Support</span>
        </div>

        {user ? (
          <div className={styles.sidebar__link} onClick={logout}>
            <HiOutlineLogout className={styles.sidebar__icon} />
            <span>Logout</span>
          </div>
        ) : (
          <div className={styles.sidebar__link} onClick={() => openModal()}>
            <HiOutlineLogin className={styles.sidebar__icon} />
            <span>Login</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;