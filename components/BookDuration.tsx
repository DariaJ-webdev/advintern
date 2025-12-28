// components/BookDuration.tsx
import React, { useState } from 'react';

const BookDuration = ({ audioLink }: { audioLink: string }) => {
  const [displayDuration, setDisplayDuration] = useState<string>("--:--");

  const formatColonTime = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleMetadata = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    setDisplayDuration(formatColonTime(e.currentTarget.duration));
  };

  return (
    <>
      <audio 
        src={audioLink} 
        onLoadedMetadata={handleMetadata} 
        style={{ display: 'none' }} 
        preload="metadata"
      />
      <span>{displayDuration}</span>
    </>
  );
};

export default BookDuration;