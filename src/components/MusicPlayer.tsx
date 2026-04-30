import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, Volume2, Music, Terminal } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "VOID_FREQUENCY_V1",
    artist: "AI_NODE_07",
    cover: "https://picsum.photos/seed/glitch1/400/400",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: 2,
    title: "CYBER_DECAY_L00P",
    artist: "AI_NODE_14",
    cover: "https://picsum.photos/seed/glitch2/400/400",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: 3,
    title: "NEON_STATIC_SYNC",
    artist: "AI_NODE_22",
    cover: "https://picsum.photos/seed/glitch3/400/400",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <div className="w-full flex flex-col gap-4">
      <div>
        <h2 className="text-xs text-magenta mb-2 font-bold tracking-widest uppercase">// AUDIO_CORE</h2>
        <div className="bg-black p-4 border border-cyan/50 relative overflow-hidden group">
          <div className="absolute top-0 left-0 h-1 bg-magenta transition-all duration-700" style={{ width: isPlaying ? '100%' : '65%' }} />
          
          <div className="flex gap-3">
            <div className="w-12 h-12 bg-void border border-magenta shrink-0 overflow-hidden">
               <img 
                src={currentTrack.cover} 
                alt="Track Cover" 
                className={`w-full h-full object-cover grayscale contrast-125 transition-all duration-500 ${isPlaying ? 'animate-jitter' : ''}`}
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="overflow-hidden">
              <p className="text-lg leading-tight mb-1 truncate text-cyan glitch-text uppercase font-pixel tracking-tighter" style={{ fontSize: '10px' }}>
                {currentTrack.title}
              </p>
              <p className="text-[10px] opacity-60 font-mono text-magenta truncate">SOURCE: {currentTrack.artist}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Progress Simulation */}
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-mono opacity-60">
            <span>02:45</span>
            <span className="text-magenta">-01:15</span>
          </div>
          <div className="h-1 bg-cyan/10 w-full relative">
            <motion.div 
              animate={{ width: isPlaying ? ['60%', '70%', '65%'] : '70%' }}
              className="absolute h-full bg-cyan shadow-[0_0_8px_#00ffff]" 
            />
            <div className="absolute h-3 w-1 bg-magenta -top-1 left-[70%]" />
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-8 items-center pt-2">
          <audio 
            ref={audioRef} 
            src={currentTrack.url} 
            onEnded={handleNext}
          />
          
          <button 
            onClick={() => setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length)}
            className="w-10 h-10 border border-cyan flex items-center justify-center cursor-pointer hover:bg-cyan/10 text-cyan transition-colors"
          >
            <SkipForward size={16} className="rotate-180" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-14 h-14 border-2 border-magenta flex items-center justify-center cursor-pointer text-2xl text-magenta hover:bg-magenta/10 hover:shadow-[0_0_15px_#ff00ff] transition-all"
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
          </button>
          
          <button 
            onClick={handleNext}
            className="w-10 h-10 border border-cyan flex items-center justify-center cursor-pointer hover:bg-cyan/10 text-cyan transition-colors"
          >
            <SkipForward size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
