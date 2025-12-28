'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import styles from '../app/Player.module.css';
import { MdReplay10, MdForward10, MdPlayArrow, MdPause } from 'react-icons/md';
import Image from 'next/image';
import { getBookById } from '../lib/api';
import { mapBookToUI, BookUI } from '../lib/mappers';
import {useAuth} from '../lib/authContext';

const PlayerPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState<BookUI | null>(null);
  const [loading, setLoading] = useState(true);
  const { finishBook } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

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

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const skipTime = (amount: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime += amount;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (!book) return <div className={styles.error}>Book not found</div>;

  return (
    <div className={styles.summary}>
      {/* a. Display the book title and summary */}
      <div className={styles.summary__title}>{book.title}</div>
      <div className={styles.summary__content}>{book.summary}</div>

      {/* b. Build the audio player */}
      <div className={styles.audio__wrapper}>
        <audio 
          ref={audioRef}
          src={book.audioLink}
          onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
          onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
          onEnded={() => finishBook(book.id)}
        />
        
        {/* Track Details Section */}
        <div className={styles['audio__track--wrapper']}>
          <figure className={styles['audio__track--image-mask']}>
             <Image src={book.imageLink} alt={book.title} width={48} height={48} />
          </figure>
          <div className={styles['audio__track--info']}>
            <div className={styles['audio__track--title']}>{book.title}</div>
            <div className={styles['audio__track--author']}>{book.author}</div>
          </div>
        </div>

        {/* Controls Section */}
        <div className={styles['audio__controls--wrapper']}>
          <div className={styles.audio__controls}>
            <button className={styles['audio__controls--btn']} onClick={() => skipTime(-10)}>
              <MdReplay10 size={32} />
            </button>
            <button 
              className={`${styles['audio__controls--btn']} ${styles['audio__controls--btn-play']}`} 
              onClick={togglePlayPause}
            >
              {isPlaying ? <MdPause size={32} /> : <MdPlayArrow size={40} />}
            </button>
            <button className={styles['audio__controls--btn']} onClick={() => skipTime(10)}>
              <MdForward10 size={32} />
            </button>
          </div>
        </div>

        {/* Progress Bar Section */}
        <div className={styles['audio__progress--wrapper']}>
          <div className={styles.audio__time}>{formatTime(currentTime)}</div>
          <input 
            type="range" 
            className={styles['audio__progress--bar']}
            value={currentTime} 
            max={duration} 
            onChange={(e) => {
                const val = Number(e.target.value);
                if (audioRef.current) audioRef.current.currentTime = val;
            }} 
          />
          <div className={styles.audio__time}>{formatTime(duration)}</div>
        </div>
      </div>
    </div>
  );
};

export default PlayerPage;