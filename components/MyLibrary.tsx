'use client'

import React, { useEffect, useState } from 'react';
import styles from '../app/Settings.module.css'; 
import { useAuth } from '../lib/authContext';
import { getBookById } from '../lib/api';
import { mapBookToUI, BookUI } from '../lib/mappers';
import BookCard from '../components/BookCard';
import Image from 'next/image';
import loginImage from '../public/assets/login.png';

const MyLibrary = () => {
  const { user, openModal, savedBooks, finishedBooks } = useAuth();
  const [savedBooksData, setSavedBooksData] = useState<BookUI[]>([]);
  const [finishedBooksData, setFinishedBooksData] = useState<BookUI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLibraryData() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const savedBooksToFetch = savedBooks.filter(id => !finishedBooks.includes(id));

        // Fetch data for all saved IDs
        const savedPromises = savedBooksToFetch.map(id => getBookById(id));
        const savedResults = await Promise.all(savedPromises);
        setSavedBooksData(savedResults.filter(Boolean).map(data => mapBookToUI(data!)));

        // Fetch data for all finished IDs
        const finishedPromises = finishedBooks.map(id => getBookById(id));
        const finishedResults = await Promise.all(finishedPromises);
        setFinishedBooksData(finishedResults.filter(Boolean).map(data => mapBookToUI(data!)));
      } catch (error) {
        console.error("Error fetching library books:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLibraryData();
  }, [user, savedBooks, finishedBooks]);

  if (!user) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles['settings__login--wrapper']}>
            <Image src={loginImage} alt="Login" width={460} height={317} priority />
            <div className={styles['settings__login--text']}>
              Log in to your account to see your library.
            </div>
            <button 
              className={`${styles.btn} ${styles['settings__login--btn']}`}
              onClick={() => openModal('/library')}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) return <div className={styles.loading}>Loading your library...</div>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.page__title}>My Library</h1>
        
        {/* Section 1: Saved Books - 1 Row of 5 */}
        <section className={styles.section}>
          <h2 className={styles.inner__bookSectionTitle}>Saved Books</h2>
          <div className={styles.book__row}>
            {savedBooksData.length > 0 ? (
              savedBooksData.slice(0, 5).map(book => (
                <BookCard key={book.id} book={book} />
              ))
            ) : (
              <p>You have&apos;t saved any books yet.</p>
            )}
          </div>
        </section>

        {/* Section 2: Finished Books - 2 Rows (Grid) */}
        <section className={styles.section}>
          <h2 className={styles.inner__bookSectionTitle}>Finished Books</h2>
          <div className={styles.book__grid}>
            {finishedBooksData.length > 0 ? (
              finishedBooksData.slice(0, 10).map(book => (
                <BookCard key={book.id} book={book} />
              ))
            ) : (
              <p>You have&apos;t finished any books yet.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default MyLibrary;