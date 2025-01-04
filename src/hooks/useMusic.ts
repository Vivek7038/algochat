import { useState, useRef } from "react";

interface Track {
  id: string;
  name: string;
  url: string;
  artist: string;
}

// Using first 10 LoFi Coding tracks
const SAMPLE_PLAYLIST = [
  {
    id: "1",
    name: "LoFi Coding I",
    artist: "Kitacus",
    url: "https://m.zenmix.io/lofi/songs/audio/kitacus-lofi-coding-1.mp3"
  },
  {
    id: "2",
    name: "LoFi Coding II",
    artist: "Kitacus",
    url: "https://m.zenmix.io/lofi/songs/audio/kitacus-lofi-coding-2.mp3"
  },
  {
    id: "3",
    name: "LoFi Coding III",
    artist: "Kitacus",
    url: "https://m.zenmix.io/lofi/songs/audio/kitacus-lofi-coding-3.mp3"
  },
  {
    id: "4",
    name: "LoFi Coding IV",
    artist: "Kitacus",
    url: "https://m.zenmix.io/lofi/songs/audio/kitacus-lofi-coding-4.mp3"
  },
  {
    id: "5",
    name: "LoFi Coding V",
    artist: "Kitacus",
    url: "https://m.zenmix.io/lofi/songs/audio/kitacus-lofi-coding-5.mp3"
  },
  {
    id: "6",
    name: "LoFi Coding VI",
    artist: "Kitacus",
    url: "https://m.zenmix.io/lofi/songs/audio/kitacus-lofi-coding-6.mp3"
  },
  {
    id: "7",
    name: "LoFi Coding VII",
    artist: "Kitacus",
    url: "https://m.zenmix.io/lofi/songs/audio/kitacus-lofi-coding-7.mp3"
  },
  {
    id: "8",
    name: "LoFi Coding VIII",
    artist: "Kitacus",
    url: "https://m.zenmix.io/lofi/songs/audio/kitacus-lofi-coding-8.mp3"
  },
  {
    id: "9",
    name: "LoFi Coding IX",
    artist: "Kitacus",
    url: "https://m.zenmix.io/lofi/songs/audio/kitacus-lofi-coding-9.mp3"
  },
  {
    id: "10",
    name: "LoFi Coding X",
    artist: "Kitacus",
    url: "https://m.zenmix.io/lofi/songs/audio/kitacus-lofi-coding-10.mp3"
  }
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
      
      // Add error handling
      audioRef.current.onerror = (e) => {
        console.error('Error playing audio:', e);
        setIsPlaying(false);
        setCurrentTrack(null);
        audioRef.current = null;
      };

      // Add ended event handler to play next track
      audioRef.current.onended = () => {
        setIsPlaying(false);
        audioRef.current = null;
        // Automatically play next track
        togglePlay();
      };

      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          console.log('Now playing:', randomTrack.name, 'by', randomTrack.artist);
        })
        .catch(err => {
          console.error('Failed to play audio:', err);
          setIsPlaying(false);
        });

    } else if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(err => {
          console.error('Failed to resume audio:', err);
          setIsPlaying(false);
        });
    }
  };

  return {
    isPlaying,
    currentTrack,
    togglePlay,
  };
};
