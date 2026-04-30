import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const GRID_SIZE = 20;
const TILE_COUNT = 20;
const INITIAL_SPEED = 150;

type Point = { x: number; y: number };

export default function SnakeGame({ onScoreUpdate }: { onScoreUpdate: (score: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(true);
  
  const snakeRef = useRef<Point[]>([{ x: 10, y: 10 }]);
  const foodRef = useRef<Point>({ x: 5, y: 5 });
  const dirRef = useRef<Point>({ x: 0, y: 0 });
  const lastDirRef = useRef<Point>({ x: 0, y: 0 });
  const [isHurt, setIsHurt] = useState(false);

  const generateFood = useCallback(() => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * TILE_COUNT),
        y: Math.floor(Math.random() * TILE_COUNT),
      };
      if (!snakeRef.current.some(s => s.x === newFood.x && s.y === newFood.y)) break;
    }
    foodRef.current = newFood;
  }, []);

  const resetGame = () => {
    snakeRef.current = [{ x: 10, y: 10 }];
    dirRef.current = { x: 0, y: 0 };
    lastDirRef.current = { x: 0, y: 0 };
    setScore(0);
    onScoreUpdate(0);
    setGameOver(false);
    setPaused(false);
    generateFood();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (lastDirRef.current.y !== 1) dirRef.current = { x: 0, y: -1 };
          if (paused) setPaused(false);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (lastDirRef.current.y !== -1) dirRef.current = { x: 0, y: 1 };
          if (paused) setPaused(false);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (lastDirRef.current.x !== 1) dirRef.current = { x: -1, y: 0 };
          if (paused) setPaused(false);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (lastDirRef.current.x !== -1) dirRef.current = { x: 1, y: 0 };
          if (paused) setPaused(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, paused]);

  useEffect(() => {
    if (gameOver || paused) return;

    const move = () => {
      const head = { ...snakeRef.current[0] };
      head.x += dirRef.current.x;
      head.y += dirRef.current.y;

      lastDirRef.current = dirRef.current;

      // Check collision with walls or self
      if (
        head.x < 0 || head.x >= TILE_COUNT ||
        head.y < 0 || head.y >= TILE_COUNT ||
        snakeRef.current.some(s => s.x === head.x && s.y === head.y)
      ) {
        setGameOver(true);
        setIsHurt(true);
        setTimeout(() => setIsHurt(false), 500);
        return;
      }

      const newSnake = [head, ...snakeRef.current];
      
      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        setScore(prev => {
          const next = prev + 10;
          onScoreUpdate(next);
          return next;
        });
        generateFood();
      } else {
        newSnake.pop();
      }
      
      snakeRef.current = newSnake;
    };

    const interval = setInterval(move, INITIAL_SPEED);
    return () => clearInterval(interval);
  }, [gameOver, paused, generateFood, onScoreUpdate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      // Background and Pixel Grid
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw pixel grid (1px gap simulation)
      ctx.strokeStyle = '#111111';
      ctx.lineWidth = 1;
      for (let i = 0; i <= TILE_COUNT; i++) {
        ctx.beginPath();
        ctx.moveTo(i * GRID_SIZE, 0);
        ctx.lineTo(i * GRID_SIZE, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * GRID_SIZE);
        ctx.lineTo(canvas.width, i * GRID_SIZE);
        ctx.stroke();
      }

      // Draw food
      ctx.fillStyle = '#ff00ff';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ff00ff';
      ctx.fillRect(
        foodRef.current.x * GRID_SIZE + 1, 
        foodRef.current.y * GRID_SIZE + 1, 
        GRID_SIZE - 2, 
        GRID_SIZE - 2
      );

      // Draw snake
      ctx.fillStyle = '#00ffff';
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#00ffff';
      snakeRef.current.forEach((segment, i) => {
        ctx.fillRect(
          segment.x * GRID_SIZE + 1, 
          segment.y * GRID_SIZE + 1, 
          GRID_SIZE - 2, 
          GRID_SIZE - 2
        );
      });
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className={`relative bg-black shadow-[0_0_20px_rgba(0,255,255,0.1)] ${isHurt ? 'animate-jitter border-magenta border-2' : ''}`}>
      <canvas 
        ref={canvasRef} 
        width={TILE_COUNT * GRID_SIZE} 
        height={TILE_COUNT * GRID_SIZE}
        className="block"
      />
      
      <AnimatePresence>
        {paused && !gameOver && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-void/80 backdrop-blur-sm"
          >
            <div className="text-center">
              <p className="font-pixel text-magenta text-sm animate-pulse mb-4 tracking-tighter">PRESS ANY DIRECTION KEY</p>
              <p className="text-cyan text-xs opacity-50 uppercase tracking-[0.2em]">INITIALIZING_LINK... [WASD]</p>
            </div>
          </motion.div>
        )}

        {gameOver && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-magenta/20 backdrop-blur-md"
          >
            <div className="text-center p-6 border-2 border-magenta bg-void/90 animate-jitter">
              <h2 className="font-pixel text-magenta text-xl mb-4 glitch-text">SEGMENTATION_FAULT</h2>
              <p className="text-cyan mb-6 text-sm tracking-widest">FINAL_SCORE: {score}</p>
              <button 
                onClick={resetGame}
                className="px-6 py-2 border border-cyan text-cyan hover:bg-cyan hover:text-void transition-colors font-pixel text-[10px] tracking-tighter"
              >
                REBOOT_SYSTEM
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* HUD Info */}
      <div className="absolute top-2 right-2 font-pixel text-[10px] text-cyan opacity-40">
        GRID_20x20_V1.0.4
      </div>
    </div>
  );
}
