import { useState, useRef } from 'react';

interface Track {
  id: string;
  name: string;
  url: string;
}

// Example playlist - in production, you'd fetch this from Jamendo API
const SAMPLE_PLAYLIST = [
  {
    id: '1',
    name: 'Chill Beat',
    url: 'https://mp3l.jamendo.com/?trackid=1890762&format=mp31',
  },
  {
    id: '2',
    name: 'Lofi Study',
    url: 'https://mp3l.jamendo.com/?trackid=1890763&format=mp31',
  },
  // Add more tracks as needed
];

export const useMusic = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) {
      // If no track is playing, start a random one
      const randomTrack = SAMPLE_PLAYLIST[Math.floor(Math.random() * SAMPLE_PLAYLIST.length)];
      setCurrentTrack(randomTrack);
      audioRef.current = new Audio(randomTrack.url);
      audioRef.current.play();
      setIsPlaying(true);
    } else if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return {
    isPlaying,
    currentTrack,
    togglePlay,
  };
}; 