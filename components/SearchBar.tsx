'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IoSearchOutline, IoCloseOutline, IoTimeOutline } from "react-icons/io5";
import { usePathname } from 'next/navigation';

import { getBooksBySearch } from '../lib/api';
import { mapBookToUI, BookUI } from '../lib/mappers';
import styles from '../app/SearchBar.module.css';

const noSearchBarPaths = ['/', '/styleguide', '/choose-plan'];

/* ---------- Search Result Card ---------- */
const SearchCard = ({ book }: { book: BookUI }) => {
  const [duration, setDuration] = useState<string>("");

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Link href={`/book/${book.id}`} className={styles['search__book--link']}>
      <audio
        src={book.audioLink}
        onLoadedMetadata={(e) =>
          setDuration(formatDuration(e.currentTarget.duration))
        }
        style={{ display: 'none' }}
      />

      <figure className={styles['book__image--wrapper']}>
        <Image
          src={book.imageLink}
          alt={book.title}
          width={120} // Fixed blurry images
          height={120}
          style={{ objectFit: 'cover' }}
        />
      </figure>

      <div className={styles['search__book--info']}>
        <div className={styles['search__book--title']}>{book.title}</div>
        <div className={styles['search__book--author']}>{book.author}</div>
        <div className={styles['search__book--duration']}>
          <IoTimeOutline />
          <span>{duration || "--:--"}</span>
        </div>
      </div>
    </Link>
  );
};

/*---------- Skeleton Search Card Results ----------*/
const SearchSkeleton = () => (
  <div className={styles.skeleton__item}>
    <div className={`${styles.skeleton__image} ${styles.skeleton__base}`} />
    <div className={styles.skeleton__info}>
      <div className={`${styles.skeleton__text} ${styles.skeleton__title} ${styles.skeleton__base}`} />
      <div className={`${styles.skeleton__text} ${styles.skeleton__author} ${styles.skeleton__base}`} />
      <div className={`${styles.skeleton__text} ${styles.skeleton__meta} ${styles.skeleton__base}`} />
    </div>
  </div>
);

/* ---------- Search Bar ---------- */
export default function SearchBar() {
  const pathname = usePathname();
  const hideSearchBar = noSearchBarPaths.includes(pathname);

  const [input, setInput] = useState("");
  const [results, setResults] = useState<BookUI[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (input.length < 3) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const data = await getBooksBySearch(input);
        setResults(data.map(mapBookToUI));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchResults, 400);
    return () => clearTimeout(debounce);
  }, [input]);

  if (hideSearchBar) return null;

  return (
    <div className={styles.search__background}>
      <div className={styles.search__wrapper}>
        <div className={styles.search__content}>
          <div className={styles.search}>
            <div className={styles['search__input--wrapper']}>
              <input
                className={styles.search__input}
                placeholder="Search for books..."
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <div
                className={styles['search__icon--wrapper']}
                onClick={() => input && setInput("")}
              >
                {input ? <IoCloseOutline /> : <IoSearchOutline />}
              </div>
            </div>
          </div>

          {input.length >= 3 && (
            <div className={styles['search__books--wrapper']}>
              {loading ? (
                <>
                  <SearchSkeleton />
                  <SearchSkeleton />
                  <SearchSkeleton />
                </>
              ) : results.length > 0 ? (
                results.map((book) => (
                  <SearchCard key={book.id} book={book} />
                ))
              ) : (
                <div className={styles.search__no_results}>
                  No books found
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}