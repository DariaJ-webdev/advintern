'use client';

import styles from '../app/ForYou.module.css';
import React, { useEffect, useState } from 'react';
import {
  getSelectedBook,
  getRecommendedBooks,
  getSuggestedBooks,
} from '../lib/api';
import { mapBookToUI, BookUI } from '../lib/mappers';
import Link from 'next/link';
import Image from 'next/image';
import AudioPlayer from './AudioPlayer';
import { useSearchParams } from 'next/navigation';
import { AiOutlineClockCircle, AiOutlineStar } from 'react-icons/ai';
import BookDuration from './BookDuration';


const ForYouPage = () => {
  const [selectedBook, setSelectedBook] = useState<BookUI | null>(null);
  const [recommendedBooks, setRecommendedBooks] = useState<BookUI[]>([]);
  const [suggestedBooks, setSuggestedBooks] = useState<BookUI[]>([]);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';

  useEffect(() => {
    const loadAllData = async () => {
      try {
        const [apiSelected, apiRecommended, apiSuggested] =
          await Promise.all([
            getSelectedBook(),
            getRecommendedBooks(),
            getSuggestedBooks(),
          ]);

        if (apiSelected) setSelectedBook(mapBookToUI(apiSelected));
        if (apiRecommended)
          setRecommendedBooks(apiRecommended.map(mapBookToUI));
        if (apiSuggested)
          setSuggestedBooks(apiSuggested.map(mapBookToUI));
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  return (
    <div className={styles.wrapper}>
      {query && (
        <div className={styles['search-results-label']}>
          Showing results for: {query}
        </div>
      )}

      <div className={styles.row}>
        <div className={styles.container}>
          <div className={styles['for-you__wrapper']}>

            {/* Section 1: Selected */}
            <div className={styles['for-you__title']}>
              Selected just for you
            </div>

            {loading ? (
              <div className={styles['selected__book--skeleton']} />
            ) : (
              selectedBook && (
                <Link
                  href={`/book/${selectedBook.id}`}
                  className={styles.selected__book}
                >
                  <div className={styles['selected__book--subtitleWrapper']}>
                    <div className={styles['selected__book--sub-title']}>
                      {selectedBook.subTitle}
                    </div>
                  </div>

                  <div className={styles['selected__book--verticalLine']} />

                  <div className={styles['selected__book--text']}>
                    <div className={styles['selected__book--image']}>
                      <Image
                        src={selectedBook.imageLink}
                        alt={selectedBook.title}
                        width={120}
                        height={180}
                        style={{
                          objectFit: 'cover',
                          borderRadius: '4px',
                        }}
                      />
                    </div>

                    <div className={styles['selected__book--details']}>
                      <div className={styles['selected__book--title']}>
                        {selectedBook.title}
                      </div>
                      <div className={styles['selected__book--author']}>
                        {selectedBook.author}
                      </div>

                      <div className={styles['selected__book--duration-wrapper']}>
                        <div className={styles['selected__book--audio']}>
                          <AudioPlayer
                            src={selectedBook.audioLink}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            )}

            {/* Section 2: Recommended */}
            <div className={styles['for-you__section']}>
              <div className={styles['for-you__title']}>
                Recommended For You
              </div>
              <div className={styles['for-you__sub--title']}>
                We think you&apos;ll like these
              </div>

              <div className={styles['recommended__books--skeleton-wrapper']}>
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <div key={`rec-skel-${i}`} className={styles['recommended__books--skeleton']}>
                      <div className={styles.skeleton} style={{ width: '100%', height: '240px', marginBottom: '8px' }} />
                      <div className={styles.skeleton} style={{ width: '100%', height: '20px', marginBottom: '8px' }} />
                      <div className={styles.skeleton} style={{ width: '90%', height: '16px', marginBottom: '8px' }} />
                      <div className={styles.skeleton} style={{ width: '80%', height: '32px', marginBottom: '8px' }} />
                      <div className={styles.skeleton} style={{ width: '90%', height: '16px' }} />
                    </div>
                  ))
                ) : (
                  recommendedBooks.slice(0, 5).map((book) => (
                    <Link href={`/book/${book.id}`} key={book.id} className={styles.recommended__book}>
                      {book.subscriptionRequired && (
                        <div className={styles.book__pill}>Premium</div>
                      )}

                      <div className={styles['recommended__book--image']}>
                        <Image
                          src={book.imageLink}
                          alt={book.title}
                          width={172}
                          height={172}
                          style={{ objectFit: 'cover' }}
                        />
                      </div>

                      <div className={styles['recommended__book--title']}>{book.title}</div>
                      <div className={styles['recommended__book--author']}>{book.author}</div>
                      <div className={styles['recommended__book--sub-title']}>{book.subTitle}</div>

                      <div className={styles['recommended__book--details-wrapper']}>
                        <div className={styles['recommended__book--details']}>
                          <AiOutlineClockCircle />
                          <BookDuration audioLink={book.audioLink} />
                        </div>
                        <div className={styles['recommended__book--details']}>
                          <AiOutlineStar />
                          <span>{book.averageRating}</span>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>

            {/* Section 3: Suggested */}
            <div className={styles['for-you__section']}>
              <div className={styles['for-you__title']}>
                Suggested Books
              </div>
              <div className={styles['for-you__sub--title']}>
                Browse those books
              </div>

              <div className={styles['recommended__books--skeleton-wrapper']}>
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <div key={`sug-skel-${i}`} className={styles['recommended__books--skeleton']}>
                      <div className={styles.skeleton} style={{ width: '100%', height: '240px', marginBottom: '8px' }} />
                      <div className={styles.skeleton} style={{ width: '100%', height: '20px', marginBottom: '8px' }} />
                      <div className={styles.skeleton} style={{ width: '90%', height: '16px', marginBottom: '8px' }} />
                      <div className={styles.skeleton} style={{ width: '80%', height: '32px', marginBottom: '8px' }} />
                      <div className={styles.skeleton} style={{ width: '90%', height: '16px' }} />
                    </div>
                  ))
                ) : (
                  suggestedBooks.slice(0, 5).map((book) => (
                    <Link href={`/book/${book.id}`} key={book.id} className={styles.recommended__book}>
                      {book.subscriptionRequired && (
                        <div className={styles.book__pill}>Premium</div>
                      )}

                      <div className={styles['recommended__book--image']}>
                        <Image
                          src={book.imageLink}
                          alt={book.title}
                          width={172}
                          height={172}
                          style={{ objectFit: 'cover' }}
                        />
                      </div>

                      <div className={styles['recommended__book--title']}>{book.title}</div>
                      <div className={styles['recommended__book--author']}>{book.author}</div>
                      <div className={styles['recommended__book--sub-title']}>{book.subTitle}</div>

                      <div className={styles['recommended__book--details-wrapper']}>
                        <div className={styles['recommended__book--details']}>
                          <AiOutlineClockCircle />
                          <BookDuration audioLink={book.audioLink} />
                        </div>
                        <div className={styles['recommended__book--details']}>
                          <AiOutlineStar />
                          <span>{book.averageRating}</span>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ForYouPage;