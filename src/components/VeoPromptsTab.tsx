import React, { useState, useEffect } from 'react';
import { 
  Video, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  Clock, 
  Camera, 
  MessageSquare, 
  Filter, 
  FileJson, 
  Tv, 
  Play, 
  Pause,
  Layers,
  Sparkles,
  Smartphone,
  Wand2,
  ChevronLeft,
  ChevronRight,
  X,
  Flame,
  Radio,
  Type as TypeIcon
} from 'lucide-react';
import { VeoPackage, VeoClip } from '../types';

interface VeoPromptsTabProps {
  veoPackage: VeoPackage;
  productName: string;
  onOpenTeleprompter: () => void;
}

// 6 Proven Viral Beauty Hook Archetypes inspired by top-performing YouTube Shorts
const VIRAL_BEAUTY_HOOKS = [
  {
    id: 'split-eye',
    name: '⚡ Split-Eye Lash Contrast',
    formula: 'Split-Eye Contrast Test',
    onScreenText: 'LEFT EYE ONLY 😱',
    audioCue: '[AUDIO: Satisfying wand pop + fast trending pop hook]',
    bRollAction: 'Extreme 100mm f/2.8 macro zoom into left bare eye vs right coated eye showing dramatic contrast',
    dialogue: 'Never buy fake lashes again until you see this five dollar mascara test!',
    prompt: `Ultra-sharp vertical 9:16 camera push into presenter's face. Her left eye is bare with short natural lashes; her right eye has sky-high, dramatically lifted, pitch-black volume. She points with disbelief at the difference, speaking with genuine excitement.`,
  },
  {
    id: 'wear-test',
    name: '⏱️ 8-Hour Smudge & Rub Test',
    formula: '8-Hour Wear Test',
    onScreenText: '8-HR WEAR TEST ⏱️',
    audioCue: '[AUDIO: Finger friction squeak test on lower eyelid]',
    bRollAction: 'Presenter firmly rubs index finger across lower eyelid on camera, pulls finger away spotless',
    dialogue: 'I am putting this five dollar mascara through an unfiltered 8-hour sweat and smudge test!',
    prompt: `Beauty presenter looking directly into camera with determination at vanity mirror, holding the mascara tube vertically, establishing an unfiltered real-skin wear test check-in with natural daylight.`,
  },
  {
    id: 'skeptic',
    name: '🔍 TikTok Hype vs Reality',
    formula: 'De-influencing Skeptic',
    onScreenText: 'OVERHYPED?! 🔍',
    audioCue: '[AUDIO: Whispered confession + stop music silence]',
    bRollAction: 'Close-up inspects tube with raised eyebrow skepticism in clean ring-light studio',
    dialogue: 'Everyone on TikTok says this mascara is a holy grail... is it actually good or are they lying?',
    prompt: `Presenter inspecting the mascara tube at eye level with an analytical, raised-eyebrow curious expression, bright ring-light reflection in irises, questioning the viral hype with authentic UGC skepticism.`,
  },
  {
    id: 'dupe',
    name: '💄 $5 Dupe vs $38 Luxury',
    formula: 'Luxury Dupe Battle',
    onScreenText: '$5 VS $38 DUPE 💸',
    audioCue: '[AUDIO: Upbeat game-show chime]',
    bRollAction: 'Two tubes held up side by side: gold high-end luxury tube vs $5 essence mint tube',
    dialogue: 'One eye has a thirty-eight dollar luxury mascara, the other has this five dollar tube. Guess which!',
    prompt: `Presenter holds a luxury gold mascara tube near her left eye and the black-and-mint essence tube near her right eye, smiling playfully at the camera, challenging viewers to spot the difference.`,
  },
  {
    id: 'asmr',
    name: '🎧 Macro ASMR Wand Pull',
    formula: 'Macro ASMR Texture',
    onScreenText: 'LOOK AT THAT WAND 🤤',
    audioCue: '[AUDIO: Clean ASMR stopper pop + bristle pull]',
    bRollAction: 'Extreme 100mm f/2.8 macro of conic fiber brush pulling smoothly past the inner stopper',
    dialogue: 'Listen to that stopper pop... look at how cleanly this conic brush separates every single lash.',
    prompt: `Extreme macro 100mm lens shot of the conic fiber brush pulling smoothly past the inner stopper with an audible click, showing micro bristles holding the exact right dose of clump-free black pigment.`,
  },
  {
    id: 'hack',
    name: '💡 3-Step Volume Hack',
    formula: 'Application Hack',
    onScreenText: '3-STEP LASH HACK 💡',
    audioCue: '[AUDIO: Fast-paced energetic beat]',
    bRollAction: 'Presenter demonstrates root-wiggle and tip-flick motion with wand close to mirror',
    dialogue: 'Stop applying your mascara like this! Do this 3-step root-wiggle trick instead for 3x volume.',
    prompt: `Presenter gestures 'stop' with one hand while holding the mascara wand in the other, smiling knowingly at the camera before tilting her chin up to demonstrate the root-wiggle application technique.`,
  },
];

export const VeoPromptsTab: React.FC<VeoPromptsTabProps> = ({
  veoPackage,
  productName,
  onOpenTeleprompter,
}) => {
  const [clips, setClips] = useState<VeoClip[]>(veoPackage.clips);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'hook' | 'product' | 'results' | 'objections' | 'verdict'>('all');
  const [currentlyPlayingClip, setCurrentlyPlayingClip] = useState<number | null>(null);
  const [appliedHookSuccess, setAppliedHookSuccess] = useState<string | null>(null);

  // 9:16 Shorts Simulator state
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [simIndex, setSimIndex] = useState(0);
  const [simPlaying, setSimPlaying] = useState(false);

  // Sync state if prop changes
  useEffect(() => {
    setClips(veoPackage.clips);
    setSimIndex(0);
  }, [veoPackage]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Browser speech synthesis for audio preview of dialogue
  const playDialogueAudio = (dialogue: string, clipNum: number, onEnd?: () => void) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    if (currentlyPlayingClip === clipNum && !onEnd) {
      setCurrentlyPlayingClip(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(dialogue);
    utterance.rate = 1.05;
    utterance.pitch = 1.05;
    utterance.onend = () => {
      setCurrentlyPlayingClip(null);
      if (onEnd) onEnd();
    };
    utterance.onerror = () => {
      setCurrentlyPlayingClip(null);
      if (onEnd) onEnd();
    };

    setCurrentlyPlayingClip(clipNum);
    window.speechSynthesis.speak(utterance);
  };

  const stopAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setCurrentlyPlayingClip(null);
    setSimPlaying(false);
  };

  // Swap Hook for Clip 1
  const handleApplyHook = (hookItem: typeof VIRAL_BEAUTY_HOOKS[0]) => {
    setClips((prevClips) => {
      const updated = [...prevClips];
      if (updated.length > 0) {
        updated[0] = {
          ...updated[0],
          dialogue: hookItem.dialogue,
          prompt: hookItem.prompt,
          onScreenText: hookItem.onScreenText,
          audioCue: hookItem.audioCue,
          bRollAction: hookItem.bRollAction,
          hookFormula: hookItem.formula,
          section: 'Hook: ' + hookItem.formula,
        };
      }
      return updated;
    });

    setAppliedHookSuccess(hookItem.name);
    setTimeout(() => setAppliedHookSuccess(null), 3500);
  };

  // Filter clips
  const filteredClips = React.useMemo(() => {
    const total = clips.length;
    if (selectedFilter === 'hook') return clips.slice(0, Math.min(3, total));
    if (selectedFilter === 'product') return clips.slice(Math.min(3, total), Math.min(7, total));
    if (selectedFilter === 'results') return clips.slice(Math.min(7, total), Math.min(11, total));
    if (selectedFilter === 'objections') return clips.slice(Math.min(11, total), Math.min(15, total));
    if (selectedFilter === 'verdict') return clips.slice(Math.min(15, total), total);
    return clips;
  }, [selectedFilter, clips]);

  const copyAllPrompts = () => {
    const text = `INITIAL IMAGE / OPENING FRAME PROMPT:
${veoPackage.initialFramePrompt}

────────────────────────────────────
${clips.map(c => `CLIP ${String(c.clipNumber).padStart(2, '0')} · ${c.durationSeconds} SECONDS
Section: ${c.section}
On-Screen Text: ${c.onScreenText || 'N/A'}
Audio/SFX: ${c.audioCue || 'N/A'}
B-Roll Action: ${c.bRollAction || 'N/A'}
Dialogue: "${c.dialogue}"

Prompt:
${c.prompt}
────────────────────────────────────`).join('\n')}`;

    copyToClipboard(text, 'all-veo-prompts');
  };

  const exportAsJson = () => {
    const exportData = {
      ...veoPackage,
      clips,
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `veo-prompts-${productName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.json`;
    a.click();
  };

  // Step through simulator
  const handlePlaySimulator = () => {
    if (simPlaying) {
      stopAudio();
      return;
    }

    setSimPlaying(true);
    const playCurrent = (index: number) => {
      if (index >= clips.length) {
        setSimPlaying(false);
        setSimIndex(0);
        return;
      }
      setSimIndex(index);
      playDialogueAudio(clips[index].dialogue, clips[index].clipNumber, () => {
        if (index + 1 < clips.length) {
          playCurrent(index + 1);
        } else {
          setSimPlaying(false);
        }
      });
    };

    playCurrent(simIndex);
  };

  const currentSimClip = clips[simIndex] || clips[0];

  return (
    <div className="space-y-6">

      {/* Header Info & Batch Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 backdrop-blur-sm">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Video className="size-5 text-amber-400" />
            <span>Veo AI Video Generator Prompts</span>
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-mono font-bold ${
              veoPackage.aspectRatio === '9:16' || veoPackage.videoFormat === 'shorts'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}>
              {veoPackage.aspectRatio === '9:16' || veoPackage.videoFormat === 'shorts' ? '9:16 Shorts' : '16:9 Long-Form'}
            </span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Calibrated with viral beauty archetypes: split-face tests, macro texture reveals, on-screen text overlays, and audio cues.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* 9:16 Phone Simulator Toggle */}
          <button
            onClick={() => setIsSimulatorOpen(!isSimulatorOpen)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition active:scale-95 ${
              isSimulatorOpen
                ? 'bg-pink-500 text-white border-pink-400 shadow-md shadow-pink-500/20'
                : 'bg-pink-500/10 text-pink-300 border-pink-500/30 hover:bg-pink-500/20'
            }`}
          >
            <Smartphone className="size-3.5" />
            <span>{isSimulatorOpen ? 'Hide Phone Simulator' : 'Preview 9:16 Phone'}</span>
          </button>

          <button
            onClick={onOpenTeleprompter}
            className="flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-xs font-semibold text-purple-300 hover:bg-purple-500/20 transition active:scale-95"
          >
            <Tv className="size-3.5" />
            <span>Teleprompter</span>
          </button>

          <button
            onClick={copyAllPrompts}
            className="flex items-center gap-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 text-xs font-semibold text-white transition active:scale-95"
          >
            {copiedKey === 'all-veo-prompts' ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
            <span>Copy All Prompts</span>
          </button>

          <button
            onClick={exportAsJson}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-300 transition"
            title="Download JSON for Batch API execution"
          >
            <FileJson className="size-3.5 text-amber-400" />
            <span>Batch JSON</span>
          </button>
        </div>
      </div>

      {/* VIRAL BEAUTY HOOK LAB / SWAPPER (Directly addresses user's 11 beauty shorts examples) */}
      <div className="rounded-xl border border-pink-500/30 bg-gradient-to-b from-pink-500/10 to-pink-500/5 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="size-6 rounded-md bg-pink-500/20 text-pink-400 flex items-center justify-center">
              <Sparkles className="size-3.5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <span>Viral Beauty Hook Lab</span>
                <span className="text-[10px] font-mono font-normal text-pink-300 bg-pink-500/20 px-1.5 py-0.2 rounded">
                  Instant Scene 1 Hook Swapper
                </span>
              </h3>
              <p className="text-[11px] text-zinc-400">
                Click any proven beauty hook formula below to swap Clip 1's opening dialogue, on-screen text, and Veo video prompt.
              </p>
            </div>
          </div>

          {appliedHookSuccess && (
            <div className="flex items-center gap-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-1 text-xs font-semibold text-emerald-300 animate-fadeIn">
              <Check className="size-3.5 text-emerald-400" />
              <span>Applied "{appliedHookSuccess}" to Scene 1!</span>
            </div>
          )}
        </div>

        {/* 6 Hook Formula Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1">
          {VIRAL_BEAUTY_HOOKS.map((hook) => (
            <button
              key={hook.id}
              onClick={() => handleApplyHook(hook)}
              className="group flex flex-col justify-between rounded-lg border border-zinc-800 bg-zinc-950/80 p-2.5 text-left transition hover:border-pink-500/60 hover:bg-pink-950/20 active:scale-95"
            >
              <div>
                <span className="text-xs font-bold text-white group-hover:text-pink-300 transition leading-tight block">
                  {hook.name}
                </span>
                <span className="text-[9px] font-mono text-zinc-500 block mt-0.5">
                  {hook.formula}
                </span>
              </div>
              <div className="mt-2 text-[10px] font-mono text-pink-400/80 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800 truncate">
                {hook.onScreenText}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* INTERACTIVE 9:16 PHONE SIMULATOR (Collapsible preview drawer) */}
      {isSimulatorOpen && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <Smartphone className="size-5 text-pink-400" />
              <h3 className="text-sm font-bold text-white">Interactive 9:16 Mobile Shorts Simulator</h3>
              <span className="text-[11px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">
                Scene {simIndex + 1} of {clips.length}
              </span>
            </div>
            <button
              onClick={() => {
                stopAudio();
                setIsSimulatorOpen(false);
              }}
              className="text-zinc-400 hover:text-white transition p-1"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Phone Bezel */}
            <div className="md:col-span-5 flex justify-center">
              <div className="relative w-[260px] h-[480px] rounded-[36px] border-4 border-zinc-700 bg-zinc-900 shadow-2xl overflow-hidden flex flex-col justify-between p-3 select-none">
                
                {/* Phone Speaker Notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-zinc-950 rounded-full z-30 flex items-center justify-center">
                  <div className="w-8 h-1 bg-zinc-800 rounded-full" />
                </div>

                {/* Simulated Video Frame Background */}
                <div className="absolute inset-0 bg-gradient-to-b from-zinc-800 via-zinc-900 to-black z-0 flex items-center justify-center">
                  <div className="text-center p-4 space-y-2 opacity-80">
                    <div className="size-16 rounded-full bg-pink-500/20 border-2 border-pink-500/40 mx-auto flex items-center justify-center text-pink-300">
                      <Camera className="size-8" />
                    </div>
                    <div className="text-[11px] font-mono text-zinc-400 font-semibold">
                      UGC Beauty Creator
                    </div>
                    <div className="text-[10px] text-zinc-500 line-clamp-2 px-2">
                      {currentSimClip?.bRollAction || currentSimClip?.cameraFraming}
                    </div>
                  </div>
                </div>

                {/* Viral On-Screen Text Overlay (Top-Center Safe Zone) */}
                <div className="relative z-20 pt-8 flex justify-center">
                  <div className="rounded-lg bg-pink-600/90 backdrop-blur-sm border border-pink-400 px-3 py-1.5 text-center shadow-lg transform -rotate-1 hover:rotate-0 transition">
                    <span className="text-xs font-black text-white tracking-wide uppercase">
                      {currentSimClip?.onScreenText || 'REPLACES FALSIES?! 😱'}
                    </span>
                  </div>
                </div>

                {/* Viral TikTok/Shorts Right Rail Icons */}
                <div className="absolute right-3 bottom-20 z-20 flex flex-col items-center gap-3 text-white">
                  <div className="size-8 rounded-full bg-zinc-900/60 backdrop-blur-sm flex items-center justify-center text-xs">
                    ❤️
                  </div>
                  <div className="size-8 rounded-full bg-zinc-900/60 backdrop-blur-sm flex items-center justify-center text-xs">
                    💬
                  </div>
                  <div className="size-8 rounded-full bg-zinc-900/60 backdrop-blur-sm flex items-center justify-center text-xs">
                    🔗
                  </div>
                </div>

                {/* Subtitles & Audio Indicator (Bottom Safe Zone) */}
                <div className="relative z-20 space-y-2 pb-2">
                  {/* Audio cue badge */}
                  {currentSimClip?.audioCue && (
                    <div className="rounded bg-black/70 backdrop-blur-sm border border-zinc-700/60 px-2 py-0.5 text-[9px] font-mono text-amber-300 truncate">
                      {currentSimClip.audioCue}
                    </div>
                  )}

                  {/* Captions */}
                  <div className="rounded-lg bg-black/80 backdrop-blur-md p-2.5 text-center border border-zinc-800">
                    <p className="text-xs font-bold text-white leading-snug font-sans">
                      "{currentSimClip?.dialogue}"
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Simulator Controls & Breakdown */}
            <div className="md:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="rounded bg-gradient-to-r from-pink-500 to-amber-500 px-2 py-0.5 text-xs font-bold text-zinc-950">
                    Scene {currentSimClip?.clipNumber} of {clips.length}
                  </span>
                  <span className="text-xs text-zinc-400 ml-2 font-mono">
                    {currentSimClip?.durationSeconds}s duration
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      stopAudio();
                      setSimIndex((prev) => (prev > 0 ? prev - 1 : clips.length - 1));
                    }}
                    className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <button
                    onClick={handlePlaySimulator}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                      simPlaying
                        ? 'bg-rose-500 text-white'
                        : 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950'
                    }`}
                  >
                    {simPlaying ? <Pause className="size-3.5 fill-current" /> : <Play className="size-3.5 fill-current" />}
                    <span>{simPlaying ? 'Pause Audio' : 'Play With Audio'}</span>
                  </button>
                  <button
                    onClick={() => {
                      stopAudio();
                      setSimIndex((prev) => (prev < clips.length - 1 ? prev + 1 : 0));
                    }}
                    className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>

              {/* Clip Director Breakdown */}
              <div className="space-y-2 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-xs">
                <div>
                  <span className="font-semibold text-zinc-400">Section: </span>
                  <span className="font-bold text-white">{currentSimClip?.section}</span>
                </div>
                <div>
                  <span className="font-semibold text-pink-400">On-Screen Text Overlay: </span>
                  <span className="font-mono text-white bg-pink-950/40 border border-pink-500/30 px-2 py-0.5 rounded">
                    {currentSimClip?.onScreenText || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-amber-400">Sound / Audio Cue: </span>
                  <span className="text-zinc-200">{currentSimClip?.audioCue || 'N/A'}</span>
                </div>
                <div>
                  <span className="font-semibold text-cyan-400">B-Roll & Macro Framing: </span>
                  <span className="text-zinc-300">{currentSimClip?.bRollAction || currentSimClip?.cameraFraming}</span>
                </div>
                <div className="pt-2 border-t border-zinc-800">
                  <span className="font-semibold text-zinc-400">Veo / AI Video Prompt:</span>
                  <p className="mt-1 text-zinc-300 font-mono text-[11px] bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 leading-relaxed">
                    {currentSimClip?.prompt}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Key Video Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3.5">
          <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Total Video Length</div>
          <div className="text-lg font-extrabold text-white mt-1">
            {veoPackage.totalDurationSeconds || (clips.reduce((acc, c) => acc + c.durationSeconds, 0))} Seconds
          </div>
          <div className="text-[11px] text-zinc-400">
            {Math.floor((veoPackage.totalDurationSeconds || (clips.reduce((acc, c) => acc + c.durationSeconds, 0))) / 60)}m {((veoPackage.totalDurationSeconds || (clips.reduce((acc, c) => acc + c.durationSeconds, 0))) % 60)}s
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3.5">
          <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Sequential Shots</div>
          <div className="text-lg font-extrabold text-amber-400 mt-1">
            {clips.length} Scenes
          </div>
          <div className="text-[11px] text-zinc-400">
            {clips[0]?.durationSeconds || 6}s per clip
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3.5">
          <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Video Ratio</div>
          <div className="text-lg font-extrabold text-emerald-400 mt-1">
            {veoPackage.aspectRatio || '9:16'}
          </div>
          <div className="text-[11px] text-zinc-400">
            {veoPackage.aspectRatio === '9:16' || veoPackage.videoFormat === 'shorts' ? 'Mobile Vertical' : 'Widescreen'}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3.5">
          <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Pacing Style</div>
          <div className="text-lg font-extrabold text-purple-400 mt-1">
            {veoPackage.videoFormat === 'shorts' ? 'Viral Shorts' : 'Editorial UGC'}
          </div>
          <div className="text-[11px] text-zinc-400">Lip-sync calibrated</div>
        </div>
      </div>

      {/* Initial Image / Opening Frame Prompt Card */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="rounded bg-amber-500/20 px-2 py-0.5 font-mono text-[11px] font-bold text-amber-400 border border-amber-500/30">
              ANCHOR FRAME 00
            </span>
            <h3 className="text-sm font-bold text-white">Initial Image / Opening Frame Prompt</h3>
          </div>
          <button
            onClick={() => copyToClipboard(veoPackage.initialFramePrompt, 'initial-frame')}
            className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-medium transition"
          >
            {copiedKey === 'initial-frame' ? (
              <span className="text-emerald-400 flex items-center gap-1"><Check className="size-3.5" /> Copied</span>
            ) : (
              <span className="flex items-center gap-1"><Copy className="size-3.5" /> Copy Anchor Prompt</span>
            )}
          </button>
        </div>

        <p className="text-xs text-zinc-400">
          Feed this first into your image generator (Midjourney, Imagen 3, Flux) to lock in the presenter's face, vanity lighting, and product packaging before generating video clips.
        </p>

        <div className="rounded-lg border border-amber-500/20 bg-zinc-950 p-4 text-xs font-mono text-zinc-200 leading-relaxed whitespace-pre-wrap select-all selection:bg-amber-500/30">
          {veoPackage.initialFramePrompt}
        </div>
      </div>

      {/* Stage Filter Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium pr-1">
          <Filter className="size-3.5" />
          <span>Stage:</span>
        </div>
        {[
          { key: 'all', label: `All ${clips.length} Clips` },
          { key: 'hook', label: '1. Hook & Problem' },
          { key: 'product', label: '2. Product & Wand' },
          { key: 'results', label: '3. Results & Lashes' },
          { key: 'objections', label: '4. Wear & Smudge Test' },
          { key: 'verdict', label: '5. Verdict & FTC CTA' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedFilter(tab.key as any)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition ${
              selectedFilter === tab.key
                ? 'bg-zinc-200 text-zinc-950 font-semibold shadow'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Shot Cards */}
      <div className="space-y-4">
        {filteredClips.map((clip) => {
          const isAudioPlaying = currentlyPlayingClip === clip.clipNumber;
          const wordCount = clip.dialogue.split(/\s+/).filter(Boolean).length;

          return (
            <div
              key={clip.clipNumber}
              className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-4 transition hover:border-zinc-700 hover:bg-zinc-900/60"
            >
              
              {/* Card Header: Clip #, Timing, Camera Framing & Stage */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="rounded bg-gradient-to-r from-amber-500 to-amber-600 px-2.5 py-1 font-mono text-xs font-black text-zinc-950 shadow-sm">
                    CLIP {String(clip.clipNumber).padStart(2, '0')}
                  </span>
                  <span className="flex items-center gap-1 rounded bg-zinc-800 px-2 py-0.5 font-mono text-[11px] text-zinc-300">
                    <Clock className="size-3 text-amber-400" />
                    <span>{clip.durationSeconds || 6} SECONDS</span>
                  </span>
                  <span className="rounded bg-zinc-800/60 px-2 py-0.5 text-xs font-medium text-amber-300/90">
                    {clip.section}
                  </span>
                  {clip.hookFormula && (
                    <span className="rounded bg-pink-500/20 border border-pink-500/30 px-2 py-0.5 text-[11px] font-mono font-bold text-pink-300">
                      {clip.hookFormula}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="hidden sm:flex items-center gap-1 rounded bg-zinc-950 px-2.5 py-1 text-[11px] font-mono text-zinc-400 border border-zinc-800">
                    <Camera className="size-3 text-cyan-400" />
                    <span className="truncate max-w-[220px]">{clip.cameraFraming}</span>
                  </span>

                  <button
                    onClick={() => copyToClipboard(clip.prompt, `clip-${clip.clipNumber}`)}
                    className="flex items-center gap-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 px-2.5 py-1 text-xs font-medium text-zinc-200 transition"
                    title="Copy full prompt"
                  >
                    {copiedKey === `clip-${clip.clipNumber}` ? (
                      <span className="text-emerald-400 flex items-center gap-1"><Check className="size-3.5" /> Copied</span>
                    ) : (
                      <span className="flex items-center gap-1"><Copy className="size-3.5" /> Copy Prompt</span>
                    )}
                  </button>
                </div>
              </div>

              {/* Beauty & Viral Directives Bar (On-Screen Text + Audio Cue + B-Roll) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                
                {/* On-Screen Text Overlay */}
                <div className="rounded-lg border border-pink-500/30 bg-pink-950/20 p-2.5 flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-pink-400 uppercase">
                      <TypeIcon className="size-3" />
                      <span>On-Screen Text Overlay</span>
                    </div>
                    <div className="text-xs font-black text-white font-mono">
                      {clip.onScreenText || 'REPLACES FALSIES?! 😱'}
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(clip.onScreenText || 'REPLACES FALSIES?! 😱', `text-${clip.clipNumber}`)}
                    className="p-1 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition"
                    title="Copy overlay text for CapCut"
                  >
                    {copiedKey === `text-${clip.clipNumber}` ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
                  </button>
                </div>

                {/* Audio & Sound Effect Cue */}
                <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-2.5 space-y-1">
                  <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-amber-400 uppercase">
                    <Radio className="size-3" />
                    <span>Sound / Audio Cue</span>
                  </div>
                  <div className="text-xs text-zinc-200 font-mono truncate" title={clip.audioCue || '[AUDIO: Clear vocal focus]'}>
                    {clip.audioCue || '[AUDIO: Clear vocal focus]'}
                  </div>
                </div>

                {/* B-Roll & Macro Direction */}
                <div className="rounded-lg border border-cyan-500/30 bg-cyan-950/20 p-2.5 space-y-1">
                  <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-cyan-400 uppercase">
                    <Camera className="size-3" />
                    <span>Macro / B-Roll Direction</span>
                  </div>
                  <div className="text-xs text-zinc-200 truncate" title={clip.bRollAction || clip.cameraFraming}>
                    {clip.bRollAction || clip.cameraFraming}
                  </div>
                </div>

              </div>

              {/* Spoken Dialogue with Audio Pace Player */}
              <div className="rounded-lg border border-purple-500/20 bg-purple-950/20 p-3.5">
                <div className="flex items-center justify-between text-xs text-purple-300 font-semibold mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <MessageSquare className="size-3.5 text-purple-400" />
                    <span>Spoken Dialogue (Lip Sync Chunk):</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-purple-400/80">
                      {wordCount} words (~{(wordCount / 2.3).toFixed(1)}s)
                    </span>
                    <button
                      onClick={() => playDialogueAudio(clip.dialogue, clip.clipNumber)}
                      className={`flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-medium transition ${
                        isAudioPlaying
                          ? 'bg-rose-500 text-white'
                          : 'bg-purple-900/60 text-purple-200 hover:bg-purple-800'
                      }`}
                      title="Preview spoken pace via speech synthesis"
                    >
                      {isAudioPlaying ? (
                        <>
                          <VolumeX className="size-3" />
                          <span>Stop</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="size-3 text-purple-300" />
                          <span>Audio Pace</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="text-sm font-semibold text-white tracking-wide leading-relaxed font-sans">
                  "{clip.dialogue}"
                </div>
              </div>

              {/* Video Generator Prompt */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                  <Layers className="size-3 text-zinc-400" />
                  <span>Veo / Sora / Video Prompt:</span>
                </div>
                <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-300 leading-relaxed font-sans select-all selection:bg-amber-500/30">
                  {clip.prompt}
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
