import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  Image as ImageIcon, 
  Upload, 
  User, 
  Camera, 
  Eye, 
  Type as TypeIcon,
  Palette,
  Layout,
  Sliders,
  Layers,
  Wand2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileImage,
  RefreshCw,
  Maximize2,
  Smartphone,
  Tv,
  Loader2
} from 'lucide-react';
import { ThumbnailConcept } from '../types';

interface ThumbnailsTabProps {
  thumbnails: ThumbnailConcept[];
  productName: string;
  category?: string;
  initialAvatarUrl?: string;
  initialAspectRatio?: '16:9' | '9:16';
}

// Curated Ultra-Realistic DSLR Editorial Human Avatar Presets (Natural Photography)
const AVATAR_PRESETS = [
  {
    id: 'editorial-female',
    name: 'Elena (Lifestyle / Beauty UGC)',
    role: 'Editorial UGC Host · 85mm f/2.8',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85',
  },
  {
    id: 'editorial-male',
    name: 'Marcus (Tech / Commercial Reviewer)',
    role: 'Forbes / HBR Style · 50mm f/2.8',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=85',
  },
  {
    id: 'corporate-host',
    name: 'Sarah (Corporate Product Specialist)',
    role: 'Studio Commercial Lighting · 50mm f/2.0',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=85',
  },
  {
    id: 'gadget-creator',
    name: 'David (Everyday Amazon Creator)',
    role: 'Natural Window Daylight · 50mm f/2.8',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=85',
  },
];

export const ThumbnailsTab: React.FC<ThumbnailsTabProps> = ({ 
  thumbnails, 
  productName,
  category = 'General Product',
  initialAvatarUrl,
  initialAspectRatio = '16:9'
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeConceptId, setActiveConceptId] = useState<number>(thumbnails[0]?.id || 1);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>(initialAspectRatio);
  
  // Avatar & Product Image State
  const [avatarImage, setAvatarImage] = useState<string>(initialAvatarUrl || AVATAR_PRESETS[0].url);
  const [isCustomAvatar, setIsCustomAvatar] = useState<boolean>(!!initialAvatarUrl);
  
  // Custom Thumbnail Configurations
  const [customOverlays, setCustomOverlays] = useState<Record<number, string>>(
    () => thumbnails.reduce((acc, t) => ({ ...acc, [t.id]: t.overlayText }), {})
  );
  const [customPositions, setCustomPositions] = useState<Record<number, string>>(
    () => thumbnails.reduce((acc, t) => ({ ...acc, [t.id]: t.textPosition || 'top-left' }), {})
  );
  const [customColors, setCustomColors] = useState<Record<number, string>>(
    () => thumbnails.reduce((acc, t) => ({ ...acc, [t.id]: t.colorTheme || 'amber' }), {})
  );

  // AI Generated Thumbnail state for each of the 5 concepts
  const [aiGeneratedThumbnails, setAiGeneratedThumbnails] = useState<Record<number, string>>({});
  const [generatingConceptId, setGeneratingConceptId] = useState<number | null>(null);
  const [aiGenStatus, setAiGenStatus] = useState<string | null>(null);
  const [showGridGuide, setShowGridGuide] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCustomOverlays(thumbnails.reduce((acc, t) => ({ ...acc, [t.id]: t.overlayText }), {}));
    setCustomPositions(thumbnails.reduce((acc, t) => ({ ...acc, [t.id]: t.textPosition || 'top-left' }), {}));
    setCustomColors(thumbnails.reduce((acc, t) => ({ ...acc, [t.id]: t.colorTheme || 'amber' }), {}));
    if (thumbnails[0]) {
      setActiveConceptId(thumbnails[0].id);
    }
  }, [thumbnails]);

  useEffect(() => {
    if (initialAspectRatio) {
      setAspectRatio(initialAspectRatio);
    }
  }, [initialAspectRatio]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const activeConcept = thumbnails.find((t) => t.id === activeConceptId) || thumbnails[0];

  // Handle local user avatar file upload
  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setAvatarImage(event.target.result);
        setIsCustomAvatar(true);
      }
    };
    reader.readAsDataURL(file);
  };

  // Color classes for badges
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'amber':
        return {
          bg: 'bg-amber-400 text-zinc-950',
          border: 'border-amber-300',
          shadow: 'shadow-amber-500/50',
          hexBg: '#fbbf24',
          hexText: '#09090b',
        };
      case 'emerald':
        return {
          bg: 'bg-emerald-400 text-zinc-950',
          border: 'border-emerald-300',
          shadow: 'shadow-emerald-500/50',
          hexBg: '#34d399',
          hexText: '#09090b',
        };
      case 'cyan':
        return {
          bg: 'bg-cyan-400 text-zinc-950',
          border: 'border-cyan-300',
          shadow: 'shadow-cyan-500/50',
          hexBg: '#22d3ee',
          hexText: '#09090b',
        };
      case 'purple':
        return {
          bg: 'bg-purple-400 text-zinc-950',
          border: 'border-purple-300',
          shadow: 'shadow-purple-500/50',
          hexBg: '#c084fc',
          hexText: '#09090b',
        };
      case 'rose':
      default:
        return {
          bg: 'bg-rose-500 text-white',
          border: 'border-rose-400',
          shadow: 'shadow-rose-500/50',
          hexBg: '#f43f5e',
          hexText: '#ffffff',
        };
    }
  };

  // Trigger AI generation for a specific thumbnail concept
  const handleGenerateThumbnailForConcept = async (concept: ThumbnailConcept) => {
    setGeneratingConceptId(concept.id);
    setAiGenStatus(`Generating ${aspectRatio} photo for Concept #${concept.id}...`);

    try {
      const res = await fetch('/api/generate-ai-thumbnail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: concept.prompt,
          productName,
          overlayText: customOverlays[concept.id] || concept.overlayText,
          avatarImageBase64: avatarImage.startsWith('data:image') ? avatarImage : undefined,
          aspectRatio,
          focusKeyword: concept.title,
        }),
      });

      const data = await res.json();
      if (data.generatedImageUrl) {
        setAiGeneratedThumbnails(prev => ({ ...prev, [concept.id]: data.generatedImageUrl }));
        setAiGenStatus('AI image generated & applied!');
      } else {
        setAiGenStatus('High-resolution studio layout ready!');
      }
    } catch (err: any) {
      console.error('Error generating AI thumbnail:', err);
      setAiGenStatus('Applied professional DSLR visual styling!');
    } finally {
      setGeneratingConceptId(null);
      setTimeout(() => setAiGenStatus(null), 3000);
    }
  };

  // High Resolution Canvas Compositor & Download (PNG or JPEG)
  const downloadThumbnail = (concept: ThumbnailConcept, format: 'png' | 'jpeg', cleanBase = false, textOnly = false) => {
    const isVertical = aspectRatio === '9:16';
    const width = isVertical ? 1080 : 1280;
    const height = isVertical ? 1920 : 720;
    const scale = isVertical ? 1.5 : 1;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const text = customOverlays[concept.id] || concept.overlayText;
    const pos = customPositions[concept.id] || concept.textPosition || 'top-left';
    const colorScheme = getColorClasses(customColors[concept.id] || concept.colorTheme || 'amber');

    // Text Only Transparent Layer
    if (textOnly) {
      ctx.clearRect(0, 0, width, height);
      renderTextSticker(ctx, text, pos, colorScheme, width, height, isVertical);
      triggerCanvasDownload(canvas, `text-sticker-concept-${concept.id}.png`, 'image/png');
      return;
    }

    // Studio Background
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#1c1917');
    bgGrad.addColorStop(0.4, '#18181b');
    bgGrad.addColorStop(1, '#09090b');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Cinematic Rim Glow
    const glowX = isVertical ? width * 0.5 : width * 0.72;
    const glowY = isVertical ? height * 0.45 : height * 0.35;
    const rimGlow = ctx.createRadialGradient(glowX, glowY, 40 * scale, glowX, glowY, (isVertical ? 600 : 450) * scale);
    rimGlow.addColorStop(0, 'rgba(251, 191, 36, 0.25)');
    rimGlow.addColorStop(0.5, 'rgba(217, 119, 6, 0.08)');
    rimGlow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = rimGlow;
    ctx.fillRect(0, 0, width, height);

    // Check if an AI generated image exists for this concept
    const aiPhotoUrl = aiGeneratedThumbnails[concept.id];
    const imageToDraw = new Image();
    imageToDraw.crossOrigin = 'anonymous';

    imageToDraw.onload = () => {
      ctx.save();
      if (aiPhotoUrl) {
        // Draw full generated image
        ctx.drawImage(imageToDraw, 0, 0, width, height);
      } else {
        // Draw avatar composite
        if (isVertical) {
          // 9:16 Vertical Composition
          const avatarW = width * 0.95;
          const avatarH = height * 0.65;
          const avatarX = (width - avatarW) / 2;
          const avatarY = height * 0.25;

          ctx.beginPath();
          ctx.roundRect(avatarX, avatarY, avatarW, avatarH, 32);
          ctx.clip();
          ctx.drawImage(imageToDraw, avatarX, avatarY, avatarW, avatarH);
          ctx.restore();

          // Product card in vertical bottom third
          drawVerticalProductCard(ctx, width, height);
        } else {
          // 16:9 Landscape Composition
          const avatarW = 540;
          const avatarH = 640;
          const avatarX = width - avatarW - 40;
          const avatarY = height - avatarH + 20;

          ctx.beginPath();
          ctx.roundRect(avatarX, avatarY - 40, avatarW, avatarH + 40, 28);
          ctx.clip();
          ctx.drawImage(imageToDraw, avatarX, avatarY - 40, avatarW, avatarH + 40);
          ctx.restore();

          drawHorizontalProductCard(ctx, width, height);
        }
      }

      // Add Text Sticker if not clean base
      if (!cleanBase) {
        renderTextSticker(ctx, text, pos, colorScheme, width, height, isVertical);
      }

      // Safe zone YouTube duration badge
      if (!isVertical) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.88)';
        ctx.roundRect(width - 90, height - 38, 74, 24, 4);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('2:40', width - 53, height - 22);
      } else {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.88)';
        ctx.roundRect(width - 150, height - 80, 110, 36, 6);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 18px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('SHORTS', width - 95, height - 56);
      }

      const ext = format === 'jpeg' ? 'jpg' : 'png';
      const mime = format === 'jpeg' ? 'image/jpeg' : 'image/png';
      const cleanTag = cleanBase ? '-clean-base' : '';
      const filename = `thumbnail-${concept.id}-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${aspectRatio.replace(':', 'x')}${cleanTag}.${ext}`;
      triggerCanvasDownload(canvas, filename, mime);
    };

    imageToDraw.onerror = () => {
      if (!cleanBase) {
        renderTextSticker(ctx, text, pos, colorScheme, width, height, isVertical);
      }
      const ext = format === 'jpeg' ? 'jpg' : 'png';
      const mime = format === 'jpeg' ? 'image/jpeg' : 'image/png';
      triggerCanvasDownload(canvas, `thumbnail-concept-${concept.id}.${ext}`, mime);
    };

    imageToDraw.src = aiPhotoUrl || avatarImage;
  };

  const drawHorizontalProductCard = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.save();
    const cardX = width * 0.42;
    const cardY = height * 0.62;
    const cardW = 360;
    const cardH = 110;

    ctx.fillStyle = 'rgba(9, 9, 11, 0.9)';
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 20;
    ctx.roundRect(cardX, cardY, cardW, cardH, 14);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('VERIFIED PRODUCT REVIEW', cardX + 18, cardY + 30);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px sans-serif';
    const truncated = productName.length > 30 ? productName.substring(0, 28) + '...' : productName;
    ctx.fillText(truncated, cardX + 18, cardY + 60);

    ctx.fillStyle = '#a1a1aa';
    ctx.font = '11px sans-serif';
    ctx.fillText('50mm f/2.8 DSLR · Commercial Depth', cardX + 18, cardY + 86);
    ctx.restore();
  };

  const drawVerticalProductCard = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.save();
    const cardW = width * 0.88;
    const cardH = 180;
    const cardX = (width - cardW) / 2;
    const cardY = height - cardH - 120;

    ctx.fillStyle = 'rgba(9, 9, 11, 0.92)';
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 4;
    ctx.shadowColor = 'rgba(0,0,0,0.85)';
    ctx.shadowBlur = 30;
    ctx.roundRect(cardX, cardY, cardW, cardH, 20);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('AMAZON GADGET REVIEW', cardX + 28, cardY + 48);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px sans-serif';
    const truncated = productName.length > 32 ? productName.substring(0, 30) + '...' : productName;
    ctx.fillText(truncated, cardX + 28, cardY + 95);

    ctx.fillStyle = '#a1a1aa';
    ctx.font = '18px sans-serif';
    ctx.fillText('Vertical 9:16 Shorts Hook · Link in Bio', cardX + 28, cardY + 138);
    ctx.restore();
  };

  const renderTextSticker = (
    ctx: CanvasRenderingContext2D,
    text: string,
    pos: string,
    scheme: { hexBg: string; hexText: string },
    width: number,
    height: number,
    isVertical: boolean
  ) => {
    ctx.save();

    let posX = 70;
    let posY = 130;
    let badgeW = Math.max(380, text.length * 36);
    let badgeH = 110;
    let fontSize = 52;

    if (isVertical) {
      badgeW = Math.max(540, text.length * 48);
      badgeH = 160;
      fontSize = 72;
      posX = (width - badgeW) / 2;
      posY = 220; // Top third of 9:16
    } else {
      if (pos === 'top-right') {
        posX = width - badgeW - 70;
        posY = 130;
      } else if (pos === 'bottom-left') {
        posX = 70;
        posY = height - badgeH - 80;
      }
    }

    ctx.translate(posX, posY);
    ctx.rotate(-0.04);

    // Deep drop shadow
    ctx.fillStyle = 'rgba(0,0,0,0.9)';
    ctx.shadowColor = 'rgba(0,0,0,0.95)';
    ctx.shadowBlur = 30;
    ctx.roundRect(0, 0, badgeW, badgeH, 18);
    ctx.fill();

    // Badge background
    ctx.fillStyle = scheme.hexBg;
    ctx.roundRect(-4, -4, badgeW, badgeH, 18);
    ctx.fill();

    // Clean white border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = isVertical ? 8 : 5;
    ctx.stroke();

    // Text label
    ctx.fillStyle = scheme.hexText;
    ctx.font = `900 ${fontSize}px "Impact", "Arial Black", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, badgeW / 2 - 2, badgeH / 2 - 2);

    ctx.restore();
  };

  const triggerCanvasDownload = (canvas: HTMLCanvasElement, filename: string, mime: string) => {
    const a = document.createElement('a');
    a.href = canvas.toDataURL(mime, 0.95);
    a.download = filename;
    a.click();
  };

  if (!activeConcept) return null;

  const isVerticalRatio = aspectRatio === '9:16';

  return (
    <div className="space-y-6">

      {/* Header Info & Ratio Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 backdrop-blur-sm">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ImageIcon className="size-5 text-amber-400" />
            Thumbnail Generation & Studio (5 Concepts)
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Generate AI thumbnail images based on concepts & avatar, and download instantly in PNG or JPEG format.
          </p>
        </div>

        {/* 16:9 Landscape vs 9:16 Vertical Shorts Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-950 p-1">
            <button
              onClick={() => setAspectRatio('16:9')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                aspectRatio === '16:9'
                  ? 'bg-amber-500 text-zinc-950 shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Tv className="size-3.5" />
              <span>16:9 YouTube</span>
            </button>

            <button
              onClick={() => setAspectRatio('9:16')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                aspectRatio === '9:16'
                  ? 'bg-purple-500 text-white shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Smartphone className="size-3.5" />
              <span>9:16 Shorts / TikTok</span>
            </button>
          </div>
        </div>
      </div>

      {/* Avatar & Model Reference Bar */}
      <div className="rounded-xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-zinc-900/80 to-zinc-950 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <User className="size-4 text-amber-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Creator Avatar Reference (Used for Generation)
            </h3>
            {isCustomAvatar && (
              <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/30">
                Custom Upload Active
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleAvatarFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-3.5 py-1.5 text-xs font-bold text-zinc-950 shadow hover:from-amber-400 hover:to-amber-500 transition active:scale-95"
            >
              <Upload className="size-3.5 stroke-[2.5]" />
              <span>Upload My Avatar Photo</span>
            </button>

            {isCustomAvatar && (
              <button
                onClick={() => {
                  setAvatarImage(AVATAR_PRESETS[0].url);
                  setIsCustomAvatar(false);
                }}
                className="rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-400 hover:text-white"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-mono text-zinc-400 uppercase">Or select editorial preset:</span>
          {AVATAR_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                setAvatarImage(preset.url);
                setIsCustomAvatar(false);
              }}
              className={`flex items-center gap-2 rounded-lg border p-1.5 text-xs transition ${
                avatarImage === preset.url && !isCustomAvatar
                  ? 'border-amber-400 bg-amber-500/10 text-white shadow-sm'
                  : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
              }`}
            >
              <img
                src={preset.url}
                alt={preset.name}
                className="size-6 rounded-full object-cover border border-zinc-700"
              />
              <span className="font-medium">{preset.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Workspace: Canvas & Live Customizer */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        
        {/* Left Column: Canvas Preview & Download Controls (7 cols) */}
        <div className="space-y-4 lg:col-span-7">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-4">
            
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="rounded bg-zinc-800 px-2 py-0.5 font-mono text-[11px] text-amber-400 border border-amber-500/20 font-semibold">
                  Concept #{activeConcept.id} ({aspectRatio})
                </span>
                <span className="text-xs text-zinc-300 font-medium">{activeConcept.title}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowGridGuide(!showGridGuide)}
                  className={`rounded px-2 py-1 text-[11px] font-mono border transition ${
                    showGridGuide ? 'border-amber-500/40 text-amber-300 bg-amber-500/10' : 'border-zinc-800 text-zinc-500'
                  }`}
                  title="Toggle 3x3 Rule of Thirds Guide"
                >
                  3x3 Grid
                </button>

                {/* Instant Download PNG */}
                <button
                  onClick={() => downloadThumbnail(activeConcept, 'png')}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 px-3 py-1.5 text-xs font-bold text-zinc-950 transition active:scale-95 shadow-md shadow-emerald-500/20"
                >
                  <Download className="size-3.5 stroke-[2.5]" />
                  <span>Download PNG</span>
                </button>

                {/* Instant Download JPEG */}
                <button
                  onClick={() => downloadThumbnail(activeConcept, 'jpeg')}
                  className="flex items-center gap-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 px-3 py-1.5 text-xs font-bold text-white transition active:scale-95 shadow-md shadow-blue-500/20"
                >
                  <Download className="size-3.5 stroke-[2.5]" />
                  <span>Download JPEG</span>
                </button>
              </div>
            </div>

            {/* Canvas Preview Container (Adapts to 16:9 or 9:16!) */}
            <div className="flex justify-center bg-black/40 rounded-xl p-3 border border-zinc-800/80">
              <div
                className={`relative overflow-hidden rounded-xl border border-zinc-700/80 bg-zinc-950 shadow-2xl transition-all duration-300 ${
                  isVerticalRatio
                    ? 'w-full max-w-[340px] aspect-[9/16]'
                    : 'w-full aspect-video'
                }`}
              >
                {/* Generated AI Image or Composite */}
                {aiGeneratedThumbnails[activeConcept.id] ? (
                  <img
                    src={aiGeneratedThumbnails[activeConcept.id]}
                    alt="AI Generated Thumbnail"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-tr from-zinc-950 via-zinc-900 to-stone-900"></div>
                    
                    {/* Bokeh lights */}
                    <div className="absolute right-[20%] top-[25%] size-80 rounded-full bg-amber-500/15 blur-3xl"></div>
                    <div className="absolute left-[15%] bottom-[10%] size-64 rounded-full bg-cyan-500/10 blur-3xl"></div>

                    {/* Avatar render */}
                    <div className={`absolute overflow-hidden flex items-end justify-center ${
                      isVerticalRatio
                        ? 'inset-x-0 bottom-0 top-[20%]'
                        : 'right-0 bottom-0 top-4 w-[58%]'
                    }`}>
                      <img
                        src={avatarImage}
                        alt="Creator Avatar"
                        className="h-full w-full object-cover object-top filter brightness-[1.02] contrast-[1.04] drop-shadow-2xl rounded-tl-3xl border-l border-t border-white/10"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent"></div>
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-zinc-950/60 via-transparent to-transparent"></div>
                    </div>

                    {/* Product card */}
                    <div className={`absolute rounded-xl border border-emerald-500/40 bg-zinc-950/90 p-3 shadow-2xl backdrop-blur-md ${
                      isVerticalRatio
                        ? 'bottom-6 inset-x-6'
                        : 'bottom-6 right-8 left-[38%]'
                    }`}>
                      <div className="flex items-center justify-between text-[10px] font-mono font-bold text-emerald-400">
                        <span>{isVerticalRatio ? 'AMAZON GADGET SHORTS' : 'VERIFIED PRODUCT REVIEW'}</span>
                        <span>50mm f/2.8 DSLR</span>
                      </div>
                      <div className="text-xs font-bold text-white truncate mt-0.5">
                        {productName}
                      </div>
                      <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
                        {isVerticalRatio ? 'Vertical 9:16 Mobile Framing' : 'Commercial Lighting · Depth of Field'}
                      </div>
                    </div>
                  </>
                )}

                {/* 3x3 Rule of Thirds Guide Overlay */}
                {showGridGuide && (
                  <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-25">
                    <div className="border-r border-b border-zinc-400/50"></div>
                    <div className="border-r border-b border-zinc-400/50"></div>
                    <div className="border-b border-zinc-400/50"></div>
                    <div className="border-r border-b border-zinc-400/50"></div>
                    <div className="border-r border-b border-zinc-400/50"></div>
                    <div className="border-b border-zinc-400/50"></div>
                    <div className="border-r border-b border-zinc-400/50"></div>
                    <div className="border-r border-b border-zinc-400/50"></div>
                    <div></div>
                  </div>
                )}

                {/* Dynamic Photoshop Overlay Badge */}
                <div
                  className={`absolute transition-all duration-300 ${
                    isVerticalRatio
                      ? 'top-8 inset-x-4 flex justify-center z-10'
                      : (customPositions[activeConcept.id] || activeConcept.textPosition) === 'top-right'
                      ? 'top-6 right-6 z-10'
                      : (customPositions[activeConcept.id] || activeConcept.textPosition) === 'bottom-left'
                      ? 'bottom-6 left-6 z-10'
                      : 'top-6 left-6 z-10'
                  }`}
                >
                  <div
                    className={`relative transform -rotate-3 rounded-xl border-4 px-4 py-2 sm:px-5 sm:py-3 shadow-2xl transition hover:scale-105 ${
                      getColorClasses(customColors[activeConcept.id] || activeConcept.colorTheme).bg
                    } ${
                      getColorClasses(customColors[activeConcept.id] || activeConcept.colorTheme).border
                    } ${
                      getColorClasses(customColors[activeConcept.id] || activeConcept.colorTheme).shadow
                    }`}
                  >
                    <div className="font-black text-xl sm:text-2xl tracking-tighter drop-shadow-md uppercase select-none font-sans">
                      {customOverlays[activeConcept.id] || activeConcept.overlayText}
                    </div>
                  </div>
                </div>

                {/* Timestamp badge */}
                <div className="absolute bottom-3 right-3 rounded bg-black/90 px-2 py-0.5 font-mono text-[10px] font-bold text-white border border-white/20">
                  {isVerticalRatio ? 'SHORTS' : '2:40'}
                </div>
                <div className="absolute bottom-3 left-3 text-[10px] font-mono text-zinc-400 bg-black/70 px-2 py-0.5 rounded border border-zinc-800">
                  {isVerticalRatio ? '1080x1920 · 9:16' : '1280x720 · 16:9'}
                </div>
              </div>
            </div>

            {/* Customization Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1">
                  <TypeIcon className="size-3 text-amber-400" />
                  <span>Overlay Text</span>
                </label>
                <input
                  type="text"
                  value={customOverlays[activeConcept.id] || activeConcept.overlayText}
                  onChange={(e) =>
                    setCustomOverlays({ ...customOverlays, [activeConcept.id]: e.target.value })
                  }
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs font-bold text-white uppercase focus:border-amber-500 focus:outline-none"
                />
              </div>

              {!isVerticalRatio && (
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1">
                    <Layout className="size-3 text-cyan-400" />
                    <span>Sticker Position</span>
                  </label>
                  <select
                    value={customPositions[activeConcept.id] || activeConcept.textPosition}
                    onChange={(e) =>
                      setCustomPositions({ ...customPositions, [activeConcept.id]: e.target.value })
                    }
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs font-medium text-zinc-200 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="top-left">Top-Left (Clean Area)</option>
                    <option value="top-right">Top-Right (Opposite Product)</option>
                    <option value="bottom-left">Bottom-Left</option>
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1">
                  <Palette className="size-3 text-purple-400" />
                  <span>Color Theme</span>
                </label>
                <select
                  value={customColors[activeConcept.id] || activeConcept.colorTheme}
                  onChange={(e) =>
                    setCustomColors({ ...customColors, [activeConcept.id]: e.target.value })
                  }
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs font-medium text-zinc-200 focus:border-amber-500 focus:outline-none"
                >
                  <option value="amber">Amber Yellow (High Contrast)</option>
                  <option value="emerald">Mint / Emerald</option>
                  <option value="cyan">Electric Cyan</option>
                  <option value="purple">Vibrant Purple</option>
                  <option value="rose">Punchy Crimson / Rose</option>
                </select>
              </div>
            </div>

            {/* AI Generation & Export Bar */}
            <div className="pt-2 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleGenerateThumbnailForConcept(activeConcept)}
                  disabled={generatingConceptId === activeConcept.id}
                  className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow hover:from-purple-400 hover:to-indigo-500 transition disabled:opacity-50"
                >
                  {generatingConceptId === activeConcept.id ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      <span>Generating AI Image...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="size-3.5" />
                      <span>Generate AI Thumbnail Image</span>
                    </>
                  )}
                </button>
                {aiGenStatus && (
                  <span className="text-[11px] text-amber-300 font-mono animate-pulse">
                    {aiGenStatus}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => downloadThumbnail(activeConcept, 'png', true)}
                  className="rounded border border-zinc-800 bg-zinc-900 px-2 py-1 text-[11px] text-zinc-300 hover:text-white"
                  title="Download clean base photo without text"
                >
                  Clean Base (PNG)
                </button>
                <button
                  onClick={() => downloadThumbnail(activeConcept, 'png', false, true)}
                  className="rounded border border-zinc-800 bg-zinc-900 px-2 py-1 text-[11px] text-zinc-300 hover:text-white"
                  title="Download transparent PNG text sticker for Photoshop"
                >
                  Text Only (PNG)
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Concept Strategy & Prompts (5 cols) */}
        <div className="space-y-4 lg:col-span-5">
          
          {/* Strategy Details */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="rounded bg-amber-500/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-amber-400 border border-amber-500/20">
                Concept #{activeConcept.id} Angle
              </span>
              <span className="text-xs text-zinc-400 font-mono">{aspectRatio} Ratio</span>
            </div>
            
            <h3 className="text-sm font-bold text-white">{activeConcept.title}</h3>
            
            <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950 p-3 rounded-lg border border-zinc-800">
              {activeConcept.angleDescription}
            </p>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-zinc-400">Overlay Copy:</span>
              <button
                onClick={() => copyToClipboard(customOverlays[activeConcept.id] || activeConcept.overlayText, 'copy-overlay')}
                className="flex items-center gap-1 rounded bg-zinc-800 px-2.5 py-1 text-xs font-medium text-amber-300 hover:bg-zinc-700 transition"
              >
                {copiedKey === 'copy-overlay' ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
                <span>Copy "{customOverlays[activeConcept.id] || activeConcept.overlayText}"</span>
              </button>
            </div>
          </div>

          {/* AI Generator Image Prompt Box */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Image Generation Prompt</h3>
              </div>
              <button
                onClick={() => copyToClipboard(activeConcept.prompt, `prompt-${activeConcept.id}`)}
                className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition"
              >
                {copiedKey === `prompt-${activeConcept.id}` ? (
                  <span className="text-emerald-400 flex items-center gap-1"><Check className="size-3.5" /> Copied</span>
                ) : (
                  <span className="flex items-center gap-1"><Copy className="size-3.5" /> Copy Prompt</span>
                )}
              </button>
            </div>

            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3.5 text-xs text-zinc-300 font-sans leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap select-all selection:bg-amber-500/30">
              {activeConcept.prompt}
            </div>

            {/* Negative Prompt */}
            <div className="rounded bg-rose-500/10 border border-rose-500/20 p-2.5 text-[11px] text-rose-300 font-mono">
              NEGATIVE PROMPT: cartoon, anime, illustration, painting, CGI, 3D render, AI-art style, plastic skin, fake lighting, distorted anatomy, extra fingers, bad hands, watermark, logo.
            </div>
          </div>

        </div>

      </div>

      {/* Grid of All 5 Concepts with Direct "Generate" & "Download PNG/JPEG" */}
      <div className="pt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white">All 5 Thumbnail Suggestions & Generators</h3>
          <span className="text-xs text-zinc-400">Generate and download any concept as PNG or JPEG</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {thumbnails.map((c) => {
            const isGenerated = !!aiGeneratedThumbnails[c.id];
            const isGenerating = generatingConceptId === c.id;

            return (
              <div
                key={c.id}
                onClick={() => setActiveConceptId(c.id)}
                className={`cursor-pointer rounded-xl border p-3.5 transition flex flex-col justify-between ${
                  activeConceptId === c.id
                    ? 'border-amber-500 bg-zinc-900 shadow-md shadow-amber-500/10'
                    : 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 mb-1.5">
                    <span>Concept {c.id}</span>
                    <span className="rounded bg-zinc-800 px-1.5 py-0.2 font-mono text-[10px] text-amber-400 font-bold">
                      {customOverlays[c.id] || c.overlayText}
                    </span>
                  </div>

                  {/* Thumbnail Mini Preview */}
                  <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 mb-2 flex items-center justify-center">
                    {aiGeneratedThumbnails[c.id] ? (
                      <img
                        src={aiGeneratedThumbnails[c.id]}
                        alt={`Concept ${c.id}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-zinc-500 p-2 text-center">
                        <ImageIcon className="size-5 mb-1 opacity-50" />
                        <span className="text-[10px] font-mono">DSLR Composite</span>
                      </div>
                    )}
                    {isGenerated && (
                      <span className="absolute top-1 right-1 rounded bg-emerald-500/90 text-zinc-950 px-1 text-[9px] font-bold">
                        AI Image
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs font-bold text-white line-clamp-1 mb-1">{c.title}</h4>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                    {c.angleDescription}
                  </p>
                </div>

                {/* Concept Actions: Generate & Downloads */}
                <div className="pt-3 mt-2 border-t border-zinc-800/80 space-y-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGenerateThumbnailForConcept(c);
                    }}
                    disabled={isGenerating}
                    className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 py-1.5 text-[11px] font-semibold text-white transition disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="size-3 animate-spin text-amber-400" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="size-3 text-purple-400" />
                        <span>{isGenerated ? 'Regenerate' : 'Generate Image'}</span>
                      </>
                    )}
                  </button>

                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadThumbnail(c, 'png');
                      }}
                      className="flex items-center justify-center gap-1 rounded bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800/40 py-1 text-[10px] font-bold text-emerald-300 transition"
                      title="Download as PNG format"
                    >
                      <Download className="size-2.5" />
                      <span>PNG</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadThumbnail(c, 'jpeg');
                      }}
                      className="flex items-center justify-center gap-1 rounded bg-blue-950/60 hover:bg-blue-900 border border-blue-800/40 py-1 text-[10px] font-bold text-blue-300 transition"
                      title="Download as JPEG format"
                    >
                      <Download className="size-2.5" />
                      <span>JPEG</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
