"use client";

import React, { useRef, useState } from 'react';
import { FaPlayCircle, FaPauseCircle } from 'react-icons/fa';

interface AudioPlayerProps {
  src: string;
}

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins} mins ${secs.toString().padStart(2, "0")} secs`;
};

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);



  const togglePlay = (e: React.MouseEvent) => {
    e.preventDefault();  
    e.stopPropagation(); 

    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration);
          }
        }}
        onEnded={() => setIsPlaying(false)}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          cursor: "pointer",
        }}
        onClick={togglePlay}
      >
        {isPlaying ? <FaPauseCircle size="40px"/> : <FaPlayCircle size="40px" />}

        {duration && (
          <span style={{ fontSize: "14px", color: "#394547" }}>
            {formatDuration(duration)}
          </span>
        )}
      </div>
    </>
  );
};

export default AudioPlayer;


