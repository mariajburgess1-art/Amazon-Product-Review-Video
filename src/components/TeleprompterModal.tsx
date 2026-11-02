import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  Type as TypeIcon,
  FastForward,
  Clock,
  Sparkles
} from 'lucide-react';
import { VeoPackage } from '../types';

interface TeleprompterModalProps {
  isOpen: boolean;
  onClose: () => void;
  veoPackage: VeoPackage;
  productName: string;
}

export const TeleprompterModal: React.FC<TeleprompterModalProps> = ({
  isOpen,
  onClose,
  veoPackage,
  productName,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentClipIndex, setCurrentClipIndex] = useState(0);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'huge'>('large');
  const [speed, setSpeed] = useState<number>(1.0);
  const [copied, setCopied] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeClipRef = useRef<HTMLDivElement>(null);

  const fullScript = React.useMemo(() => {
    return veoPackage.clips.map(c => c.dialogue).join(' ');
  }, [veoPackage]);

  const totalWords = React.useMemo(() => {
    return fullScript.split(/\s+/).filter(Boolean).length;
  }, [fullScript]);

  // Handle TTS playback through clips
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    if (!isPlaying) {
      window.speechSynthesis.cancel();
      return;
    }

    const playCurrentClip = () => {
      if (currentClipIndex >= veoPackage.clips.length) {
        setIsPlaying(false);
        setCurrentClipIndex(0);
        return;
      }

      const clip = veoPackage.clips[currentClipIndex];
      const utterance = new SpeechSynthesisUtterance(clip.dialogue);
      utterance.rate = speed;
      utterance.pitch = 1.05;

      utterance.onend = () => {
        if (currentClipIndex < veoPackage.clips.length - 1) {
          setCurrentClipIndex(prev => prev + 1);
        } else {
          setIsPlaying(false);
        }
      };

      utterance.onerror = () => {
        setIsPlaying(false);
      };

      window.speechSynthesis.speak(utterance);
    };

    playCurrentClip();

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [isPlaying, currentClipIndex, speed, veoPackage]);

  // Scroll active clip into view
  useEffect(() => {
    if (activeClipRef.current) {
      activeClipRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentClipIndex]);

  const handleCopyScript = () => {
    navigator.clipboard.writeText(fullScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetTeleprompter = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setCurrentClipIndex(0);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!isOpen) return null;

  const fontClasses = {
    normal: 'text-lg leading-relaxed',
    large: 'text-2xl leading-relaxed sm:text-3xl sm:leading-loose',
    huge: 'text-3xl leading-loose sm:text-4xl sm:leading-[1.8]',
  }[fontSize];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-3 sm:p-6 backdrop-blur-md">
      <div className="relative flex h-[92vh] w-full max-w-5xl flex-col rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden">
        
        {/* Top Control Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 bg-zinc-900/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="rounded bg-gradient-to-r from-purple-500 to-indigo-600 px-2.5 py-1 text-xs font-bold text-white shadow">
              PROMPTER
            </span>
            <div>
              <h3 className="font-bold text-white text-sm sm:text-base">
                Teleprompter & Audio Pacer
              </h3>
              <p className="text-xs text-zinc-400">
                {productName} · {totalWords} words (~2m 40s at 140 WPM)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Font size toggles */}
            <div className="hidden sm:flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-950 p-1 text-xs">
              <button
                onClick={() => setFontSize('normal')}
                className={`px-2 py-1 rounded font-medium ${fontSize === 'normal' ? 'bg-zinc-800 text-white' : 'text-zinc-400'}`}
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2 py-1 rounded font-medium ${fontSize === 'large' ? 'bg-zinc-800 text-white' : 'text-zinc-400'}`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize('huge')}
                className={`px-2 py-1 rounded font-medium ${fontSize === 'huge' ? 'bg-zinc-800 text-white' : 'text-zinc-400'}`}
              >
                A+
              </button>
            </div>

            {/* Speed toggle */}
            <select
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-1 text-xs font-mono text-zinc-300 focus:outline-none"
            >
              <option value={0.8}>0.8x Speed</option>
              <option value={1.0}>1.0x Normal</option>
              <option value={1.15}>1.15x Fast</option>
              <option value={1.3}>1.3x Rapid</option>
            </select>

            {/* Copy Script */}
            <button
              onClick={handleCopyScript}
              className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800"
            >
              {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
              <span className="hidden sm:inline">Copy Script</span>
            </button>

            {/* Close */}
            <button
              onClick={() => {
                window.speechSynthesis.cancel();
                setIsPlaying(false);
                onClose();
              }}
              className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Scrolling Script Body */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto px-6 py-12 sm:px-16 space-y-8 scroll-smooth"
        >
          {veoPackage.clips.map((clip, index) => {
            const isActive = currentClipIndex === index && isPlaying;
            const isSelected = currentClipIndex === index;

            return (
              <div
                key={clip.clipNumber}
                ref={isSelected ? activeClipRef : null}
                onClick={() => {
                  window.speechSynthesis.cancel();
                  setCurrentClipIndex(index);
                  if (isPlaying) {
                    setIsPlaying(true);
                  }
                }}
                className={`cursor-pointer rounded-xl p-5 transition duration-200 ${
                  isActive
                    ? 'border-2 border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10'
                    : isSelected
                    ? 'border border-zinc-700 bg-zinc-900/60'
                    : 'border border-transparent hover:border-zinc-800/80 hover:bg-zinc-900/30 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                    isActive ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    CLIP {String(clip.clipNumber).padStart(2, '0')} · {clip.durationSeconds}s
                  </span>
                  <span className="text-xs text-zinc-500 font-medium">
                    {clip.section} — {clip.cameraFraming}
                  </span>
                </div>

                <div className={`font-sans font-bold tracking-normal transition-colors ${fontClasses} ${
                  isActive ? 'text-amber-200' : 'text-zinc-100'
                }`}>
                  "{clip.dialogue}"
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Playback Dock */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-zinc-800 bg-zinc-900/90 px-6 py-4">
          <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
            <Clock className="size-4 text-amber-400" />
            <span>Clip {currentClipIndex + 1} of {veoPackage.clips.length}</span>
            <span>•</span>
            <span>{((currentClipIndex + 1) * 8)}s / 160s</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={resetTeleprompter}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-medium text-zinc-400 hover:text-white"
            >
              <RotateCcw className="size-4" />
              <span>Reset</span>
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold shadow-lg transition active:scale-95 ${
                isPlaying
                  ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 shadow-amber-500/20'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="size-4 fill-current" />
                  <span>Pause Reader</span>
                </>
              ) : (
                <>
                  <Play className="size-4 fill-current" />
                  <span>Play Aloud (TTS Pacer)</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
