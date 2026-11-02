import React from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  Plus, 
  Tv, 
  ExternalLink,
  Layers,
  ShoppingBag
} from 'lucide-react';
import { AffiliatePackage } from '../types';
import { ALL_PRESETS } from '../data/presets';

interface HeaderProps {
  currentPackage: AffiliatePackage;
  onSelectPreset: (pkg: AffiliatePackage) => void;
  onOpenNewModal: () => void;
  onOpenTeleprompter: () => void;
  onOpenExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPackage,
  onSelectPreset,
  onOpenNewModal,
  onOpenTeleprompter,
  onOpenExport,
}) => {
  const [copiedAll, setCopiedAll] = React.useState(false);

  const handleCopyFullPackage = () => {
    const text = `# ${currentPackage.seo.title}
Product: ${currentPackage.productName} (${currentPackage.price || 'Amazon'})
URL: ${currentPackage.productUrl || 'https://www.amazon.com/dp/' + (currentPackage.asin || '')}

=== SEO PACKAGE ===
Title: ${currentPackage.seo.title}

Alternative Titles:
${currentPackage.seo.alternativeTitles.map((t, i) => `${i + 1}. ${t}`).join('\n')}

Description:
${currentPackage.seo.description}

Keywords:
${currentPackage.seo.keywords}

Semicolon Tags:
${currentPackage.seo.semicolonTags}

Video File Name: ${currentPackage.seo.videoFileName}
Thumbnail File Name: ${currentPackage.seo.thumbnailFileName}

=== THUMBNAIL CONCEPTS (5) ===
${currentPackage.thumbnails.map(t => `Concept ${t.id}: ${t.title}
Overlay Text: ${t.overlayText}
Angle: ${t.angleDescription}
Prompt: ${t.prompt}
-------------------`).join('\n\n')}

=== VEO VIDEO GENERATOR PROMPTS (20 CLIPS · 160 SECONDS) ===
INITIAL IMAGE PROMPT:
${currentPackage.veoPackage.initialFramePrompt}

${currentPackage.veoPackage.clips.map(c => `CLIP ${c.clipNumber} · ${c.durationSeconds} SECONDS (${c.section})
Dialogue: "${c.dialogue}"
Prompt: ${c.prompt}`).join('\n\n')}
`;

    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
        
        {/* Logo and Studio ID */}
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-red-600 text-zinc-950 shadow-md shadow-amber-500/20">
            <Sparkles className="size-5 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-white text-base">YouTuber</span>
              <span className="rounded bg-zinc-800/80 px-1.5 py-0.5 font-mono text-[11px] font-medium text-amber-400 border border-amber-500/20">
                Affiliate Intelligence Studio
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span className="font-mono text-[11px] text-zinc-500">ID: {currentPackage.id}</span>
              <span>•</span>
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Ready for Production
              </span>
            </div>
          </div>
        </div>

        {/* Product Switcher & Quick Actions */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Preset selector */}
          <div className="relative">
            <select
              value={currentPackage.id}
              onChange={(e) => {
                const found = ALL_PRESETS.find(p => p.id === e.target.value);
                if (found) onSelectPreset(found);
              }}
              className="appearance-none cursor-pointer rounded-lg border border-zinc-800 bg-zinc-900/90 py-1.5 pl-3 pr-8 text-xs font-medium text-zinc-200 transition hover:border-zinc-700 focus:border-amber-500 focus:outline-none"
            >
              {ALL_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.productName} ({p.price}) {p.videoFormat === 'shorts' || p.aspectRatio === '9:16' ? '⚡ 9:16 Shorts' : '🎬 16:9'}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400">
              <Layers className="size-3.5" />
            </div>
          </div>

          {/* New Package Button */}
          <button
            onClick={onOpenNewModal}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-3 py-1.5 text-xs font-semibold text-zinc-950 shadow-sm transition hover:from-amber-400 hover:to-amber-500 active:scale-95"
          >
            <Plus className="size-3.5 stroke-[2.5]" />
            <span>Generate New</span>
          </button>

          {/* Teleprompter Mode */}
          <button
            onClick={onOpenTeleprompter}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
            title="Open Teleprompter & Lip Sync Reader"
          >
            <Tv className="size-3.5 text-purple-400" />
            <span className="hidden sm:inline">Teleprompter</span>
          </button>

          {/* Copy Full Package */}
          <button
            onClick={handleCopyFullPackage}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
            title="Copy Entire Package (SEO + Thumbnails + Veo Prompts)"
          >
            {copiedAll ? (
              <>
                <Check className="size-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied All!</span>
              </>
            ) : (
              <>
                <Copy className="size-3.5 text-amber-400" />
                <span className="hidden sm:inline">Copy All</span>
              </>
            )}
          </button>

          {/* Export Button */}
          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
          >
            <Download className="size-3.5 text-blue-400" />
            <span className="hidden md:inline">Export</span>
          </button>
        </div>

      </div>

      {/* Product Summary Mini-Bar */}
      <div className="border-t border-zinc-800/60 bg-zinc-950/60 px-4 py-2 text-xs sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 text-zinc-400">
          <div className="flex items-center gap-2">
            <ShoppingBag className="size-3.5 text-amber-400" />
            <span className="font-semibold text-zinc-200">{currentPackage.productName}</span>
            {currentPackage.price && (
              <span className="rounded bg-amber-500/10 px-2 py-0.5 text-amber-300 font-mono text-[11px] border border-amber-500/20">
                {currentPackage.price}
              </span>
            )}
            <span className={`rounded px-2 py-0.5 font-mono text-[11px] border ${
              currentPackage.videoFormat === 'shorts' || currentPackage.aspectRatio === '9:16'
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                : 'bg-zinc-800/80 text-zinc-300 border-zinc-700/60'
            }`}>
              {currentPackage.videoFormat === 'shorts' || currentPackage.aspectRatio === '9:16' ? '⚡ 9:16 Shorts' : '🎬 16:9 Long-Form'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>{currentPackage.veoPackage.clips.length} Clips · {currentPackage.veoPackage.totalDurationSeconds || (currentPackage.veoPackage.clips.length * 8)}s ({currentPackage.veoPackage.clips[0]?.durationSeconds || 6}s/clip)</span>
            <span>5 Thumbnail Concepts</span>
            {currentPackage.productUrl && (
              <a
                href={currentPackage.productUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-amber-400 hover:text-amber-300 hover:underline"
              >
                <span>Amazon Listing</span>
                <ExternalLink className="size-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
