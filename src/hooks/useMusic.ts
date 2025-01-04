import { useState, useRef } from "react";

interface Track {
  id: string;
  name: string;
  url: string;
}

// Example playlist - in production, you'd fetch this from Jamendo API
const SAMPLE_PLAYLIST = [
  {
    id: "1",
    name: "Chill Lofi Background Music",
    url: "https://mp3l.jamendo.com/?trackid=1890762&format=mp31",
  },
  {
    id: "2",
    name: "Lo-Fi Chillhop",
    url: "https://mp3l.jamendo.com/?trackid=1890763&format=mp31",
  },
  {
    id: "3",
    name: "Lo-Fi Chill",
    url: "https://mp3l.jamendo.com/?trackid=1890764&format=mp31",
  },
  {
    id: "4",
    name: "Lofi on",
    url: "https://mp3l.jamendo.com/?trackid=1890765&format=mp31",
  },
  {
    id: "5",
    name: "Lofi Chillout Hip Hop Beat",
    url: "https://mp3l.jamendo.com/?trackid=1890766&format=mp31",
  },
  {
    id: "6",
    name: "Lofi Study Beats",
    url: "https://mp3l.jamendo.com/?trackid=1890767&format=mp31",
  },
  {
    id: "7",
    name: "Coding Lofi Vibes",
    url: "https://mp3l.jamendo.com/?trackid=1890768&format=mp31",
  },
  {
    id: "8",
    name: "Instrumental Lofi Groove",
    url: "https://mp3l.jamendo.com/?trackid=1890769&format=mp31",
  },
  {
    id: "9",
    name: "Relaxing Lofi Beats",
    url: "https://mp3l.jamendo.com/?trackid=1890770&format=mp31",
  },
  {
    id: "10",
    name: "Focus Lofi Instrumentals",
    url: "https://mp3l.jamendo.com/?trackid=1890771&format=mp31",
  },
];

export const useMusic = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) {
      // If no track is playing, start a random one
      const randomTrack =
        SAMPLE_PLAYLIST[Math.floor(Math.random() * SAMPLE_PLAYLIST.length)];
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
