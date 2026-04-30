import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Activity, Cpu, Database, Radar, Shield } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen w-full relative flex flex-col p-8 gap-6">
      {/* Global Glitch Overlays */}
      <div className="fixed inset-0 crt-overlay opacity-50" />
      
      {/* Header System */}
      <header className="w-full flex justify-between items-end border-b-2 border-cyan pb-4 z-20">
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold italic tracking-tighter text-magenta glitch-text">
            NEURAL_SNAKE.v04
          </h1>
          <p className="scramble-text">CONNECTION: ENCRYPTED // SYSTEM: STABLE</p>
        </div>
        
        <div className="text-right flex flex-col gap-1">
          <div className="text-xs text-cyan opacity-60 tracking-widest font-mono">SESSION_ID: 0x882A_FF</div>
          <div className="text-2xl font-bold font-mono">
            SCORE: <span className="text-magenta">{score.toLocaleString('en-US', { minimumIntegerDigits: 6, useGrouping: true })}</span>
          </div>
        </div>
      </header>

      {/* Main Grid Conatiner */}
      <main className="flex-1 grid grid-cols-12 gap-6 relative z-20 min-h-0">
        
        {/* Tactical Center (8 columns) */}
        <section className="col-span-12 lg:col-span-8 flex justify-center items-center bg-black/40 glitch-border p-2 min-h-[400px]">
          <div className="w-full h-full flex items-center justify-center">
            <SnakeGame onScoreUpdate={setScore} />
          </div>
        </section>

        {/* Sidebar Info (4 columns) */}
        <aside className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <section className="sidebar-panel p-4 flex-1 flex flex-col gap-6 justify-between min-h-0 overflow-hidden">
            <MusicPlayer />
            
            <div className="space-y-2">
              <h2 className="text-xs text-magenta font-bold tracking-widest">// PLAYLIST_MANIFEST</h2>
              <div className="text-[11px] font-mono space-y-1">
                <div className="flex justify-between bg-cyan/10 p-2 border-l-2 border-cyan">
                  <span className="text-cyan">[ACTIVE] VOID_SEQUENCE_01</span>
                  <span>04:00</span>
                </div>
                <div className="flex justify-between p-2 opacity-40">
                  <span>02 CORRUPT_ECHOES</span>
                  <span>03:12</span>
                </div>
                <div className="flex justify-between p-2 opacity-40">
                  <span>03 NULL_POINTER_BEAT</span>
                  <span>05:44</span>
                </div>
              </div>
            </div>
          </section>

          {/* Machine Status Panel */}
          <section className="sidebar-panel h-32 p-4">
            <h2 className="text-xs text-magenta mb-3 font-bold tracking-widest">// MACHINE_STATUS</h2>
            <div className="grid grid-cols-2 gap-4 text-[10px] font-mono">
              <div className="space-y-1">
                <p>CPU: 42.1%</p>
                <div className="h-1 bg-cyan/10">
                  <div className="h-full bg-cyan w-[42%] shadow-[0_0_5px_#00ffff]" />
                </div>
              </div>
              <div className="space-y-1">
                <p>MEMORY: 8.9GB</p>
                <div className="h-1 bg-cyan/10">
                  <div className="h-full bg-cyan w-[60%] shadow-[0_0_5px_#00ffff]" />
                </div>
              </div>
              <div className="col-span-2 text-magenta opacity-70 tracking-tighter">
                ERROR_LOG: NO FATAL LEAKS DETECTED IN CURRENT FRAME.
              </div>
            </div>
          </section>
        </aside>
      </main>

      {/* Footer System Status */}
      <footer className="flex justify-between text-[10px] text-cyan/40 border-t border-cyan/20 pt-4 z-20 font-mono tracking-widest">
        <div>&copy; 20XX NEURAL_LINK_CONSTRUCT. ALL RIGHTS RESERVED.</div>
        <div className="flex gap-4">
          <span>LOC: SECTOR_7_HUB</span>
          <span className="text-magenta">// STATUS: PLAYING</span>
        </div>
      </footer>
    </div>
  );
}

