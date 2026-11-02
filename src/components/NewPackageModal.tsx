import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Loader2, 
  ShoppingBag, 
  Link as LinkIcon, 
  DollarSign, 
  Tag, 
  User, 
  CheckCircle2, 
  AlertCircle,
  Wand2,
  Search,
  ArrowRight,
  ExternalLink,
  Zap,
  Smartphone,
  Tv,
  Clock,
  Layers,
  Film
} from 'lucide-react';
import { AffiliatePackage } from '../types';

interface NewPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPackageGenerated: (pkg: AffiliatePackage) => void;
}

export const NewPackageModal: React.FC<NewPackageModalProps> = ({
  isOpen,
  onClose,
  onPackageGenerated,
}) => {
  const [amazonUrlInput, setAmazonUrlInput] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractSuccess, setExtractSuccess] = useState(false);

  // Video format, scene count & clip length controls
  const [videoFormat, setVideoFormat] = useState<'long-form' | 'shorts'>('shorts');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('9:16');
  const [scenesCount, setScenesCount] = useState<number>(5);
  const [clipDuration, setClipDuration] = useState<number>(6);
  const [videoArchetype, setVideoArchetype] = useState<string>('split-face-test');

  const [formData, setFormData] = useState({
    productName: '',
    brand: '',
    price: '',
    productUrl: '',
    asin: '',
    category: 'Beauty & Personal Care',
    keyFeatures: '',
    pros: '',
    cons: '',
    targetAudience: 'Budget-conscious Amazon shoppers',
    creatorPersona: 'Relatable Beauty UGC Creator',
    affiliateTag: '',
  });

  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle Format Toggle
  const handleFormatChange = (format: 'long-form' | 'shorts') => {
    setVideoFormat(format);
    if (format === 'shorts') {
      setAspectRatio('9:16');
      setScenesCount(5); // 5 x 6s = 30s
      setClipDuration(6);
    } else {
      setAspectRatio('16:9');
      setScenesCount(15); // 15 x 8s = 120s (2m)
      setClipDuration(8);
    }
  };

  const totalRuntimeSeconds = scenesCount * clipDuration;
  const runtimeFormatted = `${Math.floor(totalRuntimeSeconds / 60)}m ${totalRuntimeSeconds % 60}s`;

  // Extract Amazon product information from link
  const handleExtractFromUrl = async (autoGenerate = false) => {
    if (!amazonUrlInput.trim()) {
      setError('Please paste an Amazon link or ASIN first');
      return;
    }

    setIsExtracting(true);
    setError(null);
    setExtractSuccess(false);

    try {
      const res = await fetch('/api/extract-amazon-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: amazonUrlInput.trim() }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to extract product details from this Amazon link');
      }

      const extracted = await res.json();
      
      const updatedForm = {
        ...formData,
        productName: extracted.productName || formData.productName,
        brand: extracted.brand || formData.brand,
        price: extracted.price || formData.price,
        productUrl: extracted.productUrl || amazonUrlInput.trim(),
        asin: extracted.asin || formData.asin,
        category: extracted.category || formData.category,
        keyFeatures: extracted.keyFeatures || formData.keyFeatures,
        pros: extracted.pros || formData.pros,
        cons: extracted.cons || formData.cons,
        targetAudience: extracted.targetAudience || formData.targetAudience,
        creatorPersona: extracted.creatorPersona || formData.creatorPersona,
      };

      setFormData(updatedForm);
      setExtractSuccess(true);
      setIsExtracting(false);

      if (autoGenerate) {
        triggerPackageGeneration(updatedForm);
      }
    } catch (err: any) {
      setIsExtracting(false);
      setError(err?.message || 'Could not fetch Amazon information. You can still fill details manually.');
    }
  };

  const triggerPackageGeneration = async (dataToSubmit: typeof formData) => {
    setLoading(true);
    setError(null);
    setCurrentStep(1);

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 2500);

    try {
      const payload = {
        ...dataToSubmit,
        videoFormat,
        aspectRatio,
        scenesCount,
        clipDuration,
        videoArchetype,
      };

      const res = await fetch('/api/generate-package', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      clearInterval(interval);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to generate package');
      }

      const generatedPackage: AffiliatePackage = await res.json();
      onPackageGenerated(generatedPackage);
      onClose();
    } catch (err: any) {
      clearInterval(interval);
      setError(err?.message || 'Error occurred while contacting Gemini API');
    } finally {
      setLoading(false);
      setCurrentStep(0);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productName.trim()) {
      setError('Please provide a product name');
      return;
    }
    triggerPackageGeneration(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative my-6 w-full max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Wand2 className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Create Video Review Package</h2>
              <p className="text-xs text-zinc-400">Amazon product info extraction + custom scenes & YouTube Shorts 9:16 support</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading || isExtracting}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white disabled:opacity-50"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Loading Overlay */}
        {loading ? (
          <div className="py-12 text-center space-y-6">
            <div className="relative mx-auto size-16 flex items-center justify-center">
              <Loader2 className="size-12 animate-spin text-amber-400" />
              <Sparkles className="absolute size-5 text-amber-300" />
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-white">
                {currentStep === 1 && `Drafting ${videoFormat === 'shorts' ? 'Viral Shorts #Hashtags' : 'High-CTR SEO Hooks'} & Titles...`}
                {currentStep === 2 && `Designing 5 ${aspectRatio} Psychological Thumbnails & Overlay Badges...`}
                {currentStep === 3 && `Chunking ${scenesCount} Scenes (${clipDuration}s each) with Natural Dialogue...`}
                {currentStep === 0 && 'Synthesizing Amazon Product Intelligence...'}
              </h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                {videoFormat === 'shorts'
                  ? 'Optimizing for high-retention vertical hook pace (in the style of @justicebuys1 & @GeniusGifts).'
                  : 'Structuring in-depth objection handling and feature breakdowns.'}
              </p>
            </div>

            {/* Progress indicators */}
            <div className="flex justify-center items-center gap-2 pt-2">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`h-1.5 w-12 rounded-full transition-all duration-500 ${
                    currentStep >= step ? 'bg-amber-400' : 'bg-zinc-800'
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-5 space-y-5 max-h-[75vh] overflow-y-auto pr-1">
            
            {/* 1. Primary Amazon Link Input Box */}
            <div className="rounded-xl border border-amber-500/30 bg-gradient-to-b from-amber-500/10 to-amber-500/5 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <LinkIcon className="size-4 text-amber-400" />
                  <span>Paste Amazon Product Link or ASIN</span>
                </label>
                <span className="text-[11px] font-mono text-zinc-400">
                  Instant Auto-Pickup
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="https://www.amazon.com/dp/B00T0C9XRK or B00T0C9XRK"
                  value={amazonUrlInput}
                  onChange={(e) => {
                    setAmazonUrlInput(e.target.value);
                    setExtractSuccess(false);
                  }}
                  className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none"
                />

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleExtractFromUrl(false)}
                    disabled={isExtracting || !amazonUrlInput.trim()}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-amber-500/40 bg-zinc-900 px-3.5 py-2.5 text-xs font-semibold text-amber-300 hover:bg-zinc-800 transition disabled:opacity-50"
                  >
                    {isExtracting ? (
                      <>
                        <Loader2 className="size-3.5 animate-spin" />
                        <span>Fetching...</span>
                      </>
                    ) : (
                      <>
                        <Search className="size-3.5" />
                        <span>Fetch Info</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleExtractFromUrl(true)}
                    disabled={isExtracting || !amazonUrlInput.trim()}
                    className="flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2.5 text-xs font-bold text-zinc-950 shadow-md shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition disabled:opacity-50 whitespace-nowrap active:scale-95"
                  >
                    <Zap className="size-3.5 fill-current" />
                    <span>Instant Generate</span>
                  </button>
                </div>
              </div>

              {extractSuccess && (
                <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-xs text-emerald-300">
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />
                  <span>Product details picked up successfully! Configured for {scenesCount} scenes × {clipDuration}s ({runtimeFormatted}).</span>
                </div>
              )}

              {/* Sample link chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] font-mono text-zinc-400 uppercase">Try quick links:</span>
                {[
                  { name: 'Stanley Tumbler', url: 'https://www.amazon.com/dp/B0BN2C5Q6L' },
                  { name: 'Ninja Air Fryer', url: 'https://www.amazon.com/dp/B0CK2B11N8' },
                  { name: 'Sony XM5', url: 'https://www.amazon.com/dp/B09XS7JWHH' },
                  { name: 'essence Mascara', url: 'https://www.amazon.com/dp/B00T0C9XRK' },
                  { name: 'COSRX Snail Mucin', url: 'https://www.amazon.com/dp/B00PBX3L7K' },
                ].map((sample) => (
                  <button
                    key={sample.name}
                    type="button"
                    onClick={() => {
                      setAmazonUrlInput(sample.url);
                      setExtractSuccess(false);
                    }}
                    className="rounded bg-zinc-900 border border-zinc-800 px-2 py-0.5 text-[10px] text-zinc-300 hover:text-amber-300 hover:border-amber-500/30 transition"
                  >
                    {sample.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. VIDEO FORMAT & SCENE CONFIGURATION (New Feature!) */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Film className="size-4 text-purple-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Video Format & Scene Timing Configuration
                  </h3>
                </div>
                <div className="rounded bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 font-mono text-[11px] font-bold text-purple-300">
                  Total: {scenesCount} Scenes · {runtimeFormatted} ({totalRuntimeSeconds}s)
                </div>
              </div>

              {/* Format Cards: Shorts vs Long Form */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Option 1: YouTube Shorts / TikTok (9:16) */}
                <div
                  onClick={() => handleFormatChange('shorts')}
                  className={`cursor-pointer rounded-xl border p-3.5 transition flex items-start gap-3 ${
                    videoFormat === 'shorts'
                      ? 'border-purple-500 bg-purple-950/20 shadow-md shadow-purple-500/10'
                      : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
                  }`}
                >
                  <div className={`p-2 rounded-lg shrink-0 ${videoFormat === 'shorts' ? 'bg-purple-500 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                    <Smartphone className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">YouTube Shorts / TikTok / Reels</span>
                      <span className="rounded bg-purple-500/20 px-1.5 py-0.2 font-mono text-[10px] text-purple-300 font-bold">9:16</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                      High-retention viral pacing under 60 seconds. In the style of <strong className="text-zinc-300">@justicebuys1</strong> and <strong className="text-zinc-300">@GeniusGifts</strong>.
                    </p>
                  </div>
                </div>

                {/* Option 2: Standard YouTube (16:9) */}
                <div
                  onClick={() => handleFormatChange('long-form')}
                  className={`cursor-pointer rounded-xl border p-3.5 transition flex items-start gap-3 ${
                    videoFormat === 'long-form'
                      ? 'border-amber-500 bg-amber-950/20 shadow-md shadow-amber-500/10'
                      : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
                  }`}
                >
                  <div className={`p-2 rounded-lg shrink-0 ${videoFormat === 'long-form' ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400'}`}>
                    <Tv className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">Standard YouTube Video</span>
                      <span className="rounded bg-amber-500/20 px-1.5 py-0.2 font-mono text-[10px] text-amber-300 font-bold">16:9</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                      In-depth comparison, detailed brush/mechanism demonstration, and balanced pros & cons review.
                    </p>
                  </div>
                </div>

              </div>

              {/* Clip Duration & Scene Count Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                
                {/* Clip Duration Selector (4s, 6s, 8s, 10s) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3.5 text-amber-400" />
                      <span>Length of Each Video Clip</span>
                    </span>
                    <span className="font-mono text-amber-400 text-[11px] font-bold">{clipDuration} Seconds</span>
                  </label>
                  
                  <div className="grid grid-cols-4 gap-1.5">
                    {[4, 6, 8, 10].map((dur) => (
                      <button
                        key={dur}
                        type="button"
                        onClick={() => setClipDuration(dur)}
                        className={`rounded-lg py-2 text-xs font-bold transition ${
                          clipDuration === dur
                            ? 'bg-amber-500 text-zinc-950 shadow'
                            : 'bg-zinc-950 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white'
                        }`}
                      >
                        {dur}s
                      </button>
                    ))}
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono">
                    {clipDuration === 4 && 'Fast punchy cut (~6-8 words/clip)'}
                    {clipDuration === 6 && 'Ideal viral Shorts speed (~10-12 words/clip)'}
                    {clipDuration === 8 && 'Natural conversational pacing (~12-15 words/clip)'}
                    {clipDuration === 10 && 'Extended explanation & detail (~16-20 words/clip)'}
                  </div>
                </div>

                {/* Number of Scenes / Shots Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Layers className="size-3.5 text-cyan-400" />
                      <span>Number of Scenes / Shots</span>
                    </span>
                    <span className="font-mono text-cyan-400 text-[11px] font-bold">{scenesCount} Scenes</span>
                  </label>

                  <div className="grid grid-cols-6 gap-1">
                    {[3, 5, 8, 10, 15, 20].map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setScenesCount(count)}
                        className={`rounded-lg py-2 text-xs font-bold transition ${
                          scenesCount === count
                            ? 'bg-cyan-500 text-zinc-950 shadow'
                            : 'bg-zinc-950 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white'
                        }`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                    <span>
                      {scenesCount <= 5 ? '⚡ 15-30s Quick Hook' : scenesCount <= 10 ? '🔥 45-60s Full Short' : '🎬 2m+ Full Video'}
                    </span>
                    <span className="text-amber-400">
                      Total: {totalRuntimeSeconds}s
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* 3. VIRAL HOOK & BEAUTY ARCHETYPE SELECTOR (Derived from Top Beauty Shorts) */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-pink-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Viral Hook & Beauty Video Archetype
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-pink-400/90 bg-pink-500/10 border border-pink-500/20 px-2 py-0.5 rounded">
                  Proven YouTube Shorts Formula
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {[
                  {
                    id: 'split-face-test',
                    name: 'Split-Face / 1-Eye Test',
                    badge: '⚡ Max Retention',
                    desc: 'Left eye bare vs Right eye 1 coat. Instant visual shock proof in 0-2 seconds.',
                    border: 'hover:border-pink-500/50',
                    active: 'border-pink-500 bg-pink-950/20 text-pink-300'
                  },
                  {
                    id: 'wear-test',
                    name: '8-Hour Smudge & Wear Test',
                    badge: '⏱️ High Trust',
                    desc: 'Morning application -> Midday humidity -> Evening finger-swipe rub check on camera.',
                    border: 'hover:border-cyan-500/50',
                    active: 'border-cyan-500 bg-cyan-950/20 text-cyan-300'
                  },
                  {
                    id: 'hype-vs-reality',
                    name: 'Hype vs Reality (Skeptic)',
                    badge: '🔍 De-influencing',
                    desc: '"Everyone on TikTok is lying to you." Unfiltered close-up testing with real skin pores.',
                    border: 'hover:border-amber-500/50',
                    active: 'border-amber-500 bg-amber-950/20 text-amber-300'
                  },
                  {
                    id: 'luxury-dupe',
                    name: '$5 Dupe vs $38 Luxury',
                    badge: '💄 Viral Comments',
                    desc: 'One eye high-end department brand, one eye $5 Amazon. "Can you tell which eye?"',
                    border: 'hover:border-purple-500/50',
                    active: 'border-purple-500 bg-purple-950/20 text-purple-300'
                  },
                  {
                    id: 'asmr-texture',
                    name: 'Macro ASMR & Texture Reveal',
                    badge: '🎧 Sensory Pop',
                    desc: 'Stopper pop audio, 100mm macro shot of bristles separating lashes without clumps.',
                    border: 'hover:border-emerald-500/50',
                    active: 'border-emerald-500 bg-emerald-950/20 text-emerald-300'
                  },
                  {
                    id: 'hack-tutorial',
                    name: '3-Step Application Hack',
                    badge: '💡 High Saves',
                    desc: '"Stop applying mascara like this!" Root-wiggle and tip-flick technique for 3x volume.',
                    border: 'hover:border-blue-500/50',
                    active: 'border-blue-500 bg-blue-950/20 text-blue-300'
                  }
                ].map((arch) => (
                  <div
                    key={arch.id}
                    onClick={() => setVideoArchetype(arch.id)}
                    className={`cursor-pointer rounded-lg border p-2.5 transition text-left flex flex-col justify-between ${
                      videoArchetype === arch.id
                        ? `${arch.active} shadow-sm`
                        : 'border-zinc-800 bg-zinc-950/80 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-xs font-bold text-white leading-tight">{arch.name}</span>
                        <span className="text-[9px] font-mono font-semibold px-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                          {arch.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-snug line-clamp-2">
                        {arch.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-400">
                <AlertCircle className="size-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* 3. Product Details Form */}
            <form onSubmit={handleManualSubmit} className="space-y-4 pt-1 border-t border-zinc-800">
              
              <div className="flex items-center justify-between text-xs font-semibold text-zinc-400">
                <span>Product Intelligence Fields:</span>
                {extractSuccess && <span className="text-emerald-400 font-mono text-[11px]">● Auto-filled by AI</span>}
              </div>

              {/* Product Title */}
              <div>
                <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                  <ShoppingBag className="size-3.5 text-amber-400" />
                  <span>Amazon Product Name *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stanley Quencher H2.0 FlowState Tumbler 40 oz"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Brand, Price & Category Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-300">Brand</label>
                  <input
                    type="text"
                    placeholder="e.g. Stanley"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1">
                    <DollarSign className="size-3 text-emerald-400" />
                    <span>Price</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. $45.00"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1">
                    <Tag className="size-3 text-purple-400" />
                    <span>Category</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Kitchen & Dining"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* ASIN and Affiliate Tag */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-300">ASIN Identifier</label>
                  <input
                    type="text"
                    placeholder="e.g. B0BN2C5Q6L"
                    value={formData.asin}
                    onChange={(e) => setFormData({ ...formData, asin: e.target.value })}
                    className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1">
                    <User className="size-3 text-amber-400" />
                    <span>Amazon Associate Tag (optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. creator-20"
                    value={formData.affiliateTag}
                    onChange={(e) => setFormData({ ...formData, affiliateTag: e.target.value })}
                    className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Key Features */}
              <div>
                <label className="text-xs font-semibold text-zinc-300">Key Features & Secret Mechanism</label>
                <textarea
                  rows={2}
                  placeholder="What makes this product special? (e.g. FlowState 3-position lid, double-wall vacuum insulation)"
                  value={formData.keyFeatures}
                  onChange={(e) => setFormData({ ...formData, keyFeatures: e.target.value })}
                  className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Pros and Cons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-emerald-400">Honest Pros</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Keeps water cold 48 hours, fits in car cup holders"
                    value={formData.pros}
                    onChange={(e) => setFormData({ ...formData, pros: e.target.value })}
                    className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-rose-400">Honest Cons</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Can leak if flipped upside down in a bag"
                    value={formData.cons}
                    onChange={(e) => setFormData({ ...formData, cons: e.target.value })}
                    className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Persona and Target Audience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-300">Creator Persona</label>
                  <input
                    type="text"
                    placeholder="e.g. Relatable Everyday UGC Creator"
                    value={formData.creatorPersona}
                    onChange={(e) => setFormData({ ...formData, creatorPersona: e.target.value })}
                    className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300">Target Audience</label>
                  <input
                    type="text"
                    placeholder="e.g. Commuters, gym-goers, busy workers"
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                    className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-2.5 text-xs font-bold text-zinc-950 shadow-md shadow-amber-500/20 transition hover:from-amber-400 hover:to-amber-500 active:scale-95"
                >
                  <Sparkles className="size-4" />
                  <span>Generate {videoFormat === 'shorts' ? 'Shorts (9:16)' : 'Video (16:9)'} Package</span>
                </button>
              </div>

            </form>

          </div>
        )}

      </div>
    </div>
  );
};
