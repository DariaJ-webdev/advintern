"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import styles from '../app/BookDetails.module.css';
import { FaRegBookmark, FaBookmark, FaRegStar, FaRegClock, FaRegLightbulb } from 'react-icons/fa';
import { TbMicrophone } from "react-icons/tb";
import { LuBookOpenText } from "react-icons/lu";
import { getBookById } from '../lib/api';
import { mapBookToUI, BookUI } from '../lib/mappers';
import Image from 'next/image';
import { useAuth } from '../lib/authContext';
import { useRouter } from 'next/navigation';

const BookDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { user, openModal, savedBooks, toggleSaveBook } = useAuth(); // Consolidated hook

  
  const [book, setBook] = useState<BookUI | null>(null);
  const [loading, setLoading] = useState(true);
  const [displayDuration, setDisplayDuration] = useState<string>("00:00");

  const isSaved = savedBooks.includes(id as string);

  const formatColonTime = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleMetadata = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    const durationInSeconds = e.currentTarget.duration;
    setDisplayDuration(formatColonTime(durationInSeconds));
  };

  // Auth Guard Logic for Buttons
  const handleAction = (path: string) => {
  if (!user) {
       openModal(path); 
  } else {
    router.push(path); 
  }
};

  useEffect(() => {
    async function fetchBook() {
      if (id) {
        const data = await getBookById(id as string);
        if (data) {
          setBook(mapBookToUI(data));
        }
        setLoading(false);
      }
    }
    fetchBook();
  }, [id]);

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (!book) return <div className={styles.error}>Book not found</div>;

  return (
    <div className={styles.wrapper}>
      <audio 
        src={book.audioLink} 
        onLoadedMetadata={handleMetadata} 
        style={{ display: 'none' }} 
      />
      <div className={styles.row}>
        <div className={styles.container}>
          <div className={styles.inner__book}>
            <div className={styles.inner__bookContent}>
              <div className={styles.inner__bookTitle}>{book.title}</div>
              <div className={styles.inner__bookAuthor}>{book.author}</div>
              <div className={styles.inner__bookSubtitle}>{book.subTitle}</div>
              
              <div className={styles.inner__bookStatsWrapper}>
                <div className={styles.inner__bookStats}>
                  <FaRegStar className={styles.inner__bookIcon} />
                  <span>{book.averageRating} ({book.totalRating} ratings)</span>
                </div>
                <div className={styles.inner__bookStats}>
                  <FaRegClock className={styles.inner__bookIcon} />
                  <span>{displayDuration}</span>
                </div>
                <div className={styles.inner__bookStats}>
                  <FaRegLightbulb className={styles.inner__bookIcon} />
                  <span>{book.keyIdeas} Key Ideas</span>
                </div>
                <div className={styles.inner__bookStats}>
                  <TbMicrophone className={styles.inner__bookIcon} />
                  <span>{book.type}</span>
                </div>
              </div>

              {/* Action Buttons with Auth Check */}
              <div className={styles.inner__bookButtons}>
                <button 
                  className={styles.btnRead} 
                  onClick={() => handleAction(`/player/${book.id}`)}
                >
                  <LuBookOpenText /> Read
                </button>
                <button 
                  className={styles.btnListen} 
                  onClick={() => handleAction(`/player/${book.id}`)}
                >
                  <TbMicrophone /> Listen
                </button>
              </div>

              <div 
                className={styles.innerbook__bookmark} 
                onClick={() => toggleSaveBook(book.id)} 
              >
                {isSaved ? (
                <FaBookmark style={{ color: '#0365f2' }} /> 
              ) : (
                <FaRegBookmark /> 
              )}
              <span>
                {isSaved ? "Saved in my library" : "Add title to my library"}
              </span>
            </div>

              <div className={styles.inner__bookSection}>
                <div className={styles.inner__bookSectionTitle}>What&apos;s it about?</div>
                <div className={styles.inner__tagwrapper}>
                  {book.tags?.map((tag, index) => (
                    <div key={index} className={styles.innerbook__tag}>
                      {tag}
                    </div>
                  ))}
                </div>
                <div className={styles.inner__bookDescription}>
                  {book.bookDescription}
                </div>
              </div>

              <div className={styles.inner__bookSection}>
                <div className={styles.inner__bookSectionTitle}>About the author</div>
                <div className={styles.inner__bookDescription}>
                  {book.authorDescription}
                </div>
              </div>
            </div>

            <div className={styles.inner__bookImageWrapper}>
              <Image src={book.imageLink} 
                     alt={book.title} 
                     className={styles.inner__bookImage}
                     width={300}
                     height={300}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;