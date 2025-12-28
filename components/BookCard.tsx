'use client'

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../app/BookCard.module.css';
import { FaRegClock, FaRegStar } from 'react-icons/fa';
import { BookUI } from '../lib/mappers';
import BookDuration from './BookDuration';

interface BookCardProps {
  book: BookUI;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  return (
    <Link href={`/book/${book.id}`} className={styles.card}>
      <div className={styles.image__wrapper}>
        <Image 
          src={book.imageLink} 
          alt={book.title} 
          width={172} 
          height={172} 
          className={styles.image}
        />
      </div>
      <div className={styles.content}>
        <div className={styles.title}>{book.title}</div>
        <div className={styles.author}>{book.author}</div>
        <div className={styles.subtitle}>{book.subTitle}</div>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <FaRegClock size={12} /> <BookDuration audioLink={book.audioLink ?? ''} /> 
          </div>
          <div className={styles.stat}>
            <FaRegStar size={12} /> {book.averageRating}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;