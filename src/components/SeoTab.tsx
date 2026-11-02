import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  FileText, 
  Hash, 
  Tag, 
  Video, 
  Image as ImageIcon, 
  ExternalLink,
  ShieldAlert,
  Edit3
} from 'lucide-react';
import { SeoPackage } from '../types';

interface SeoTabProps {
  seo: SeoPackage;
  productName: string;
  productUrl?: string;
}

export const SeoTab: React.FC<SeoTabProps> = ({ seo, productName, productUrl }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [affiliateTag, setAffiliateTag] = useState('');
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [customDescription, setCustomDescription] = useState(seo.description);

  // Sync when seo prop changes
  React.useEffect(() => {
    setCustomDescription(seo.description);
  }, [seo.description]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Process description to include affiliate tag if provided
  const processedDescription = React.useMemo(() => {
    let desc = customDescription;
    if (affiliateTag.trim()) {
      const cleanTag = affiliateTag.trim().replace(/^@/, '');
      desc = desc.replace(
        /https:\/\/www\.amazon\.com\/dp\/([A-Za-z0-9_-]+)(\?[^\s]+)?/g,
        `https://www.amazon.com/dp/$1?tag=${cleanTag}`
      );
    }
    return desc;
  }, [customDescription, affiliateTag]);

  return (
    <div className="space-y-6">
      
      {/* Overview & Quick Copy All */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 backdrop-blur-sm">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="size-5 text-amber-400" />
            SEO Package for YouTube Upload
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Title, alternative A/B hooks, FTC compliant description, and exact semicolon tags for YouTube Studio.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Custom Affiliate Tag Injector */}
          <div className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1 text-xs">
            <span className="text-zinc-500 font-mono text-[11px]">Associate Tag:</span>
            <input
              type="text"
              placeholder="e.g. mytag-20"
              value={affiliateTag}
              onChange={(e) => setAffiliateTag(e.target.value)}
              className="bg-transparent font-mono text-amber-400 placeholder-zinc-600 focus:outline-none w-24 text-xs"
            />
          </div>

          <button
            onClick={() => copyToClipboard(
              `Title: ${seo.title}\n\nDescription:\n${processedDescription}\n\nTags:\n${seo.semicolonTags}`,
              'all-seo'
            )}
            className="flex items-center gap-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 text-xs font-semibold text-white transition active:scale-95"
          >
            {copiedKey === 'all-seo' ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
            <span>Copy All SEO</span>
          </button>
        </div>
      </div>

      {/* Main Title Section */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="rounded bg-amber-500/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-amber-400 border border-amber-500/20">
              Primary Video Title
            </span>
            <span className="text-xs text-zinc-400">
              {seo.title.length} characters <span className="text-zinc-600">(Optimal: 60-80)</span>
            </span>
          </div>
          <button
            onClick={() => copyToClipboard(seo.title, 'title')}
            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition"
          >
            {copiedKey === 'title' ? (
              <span className="text-emerald-400 flex items-center gap-1"><Check className="size-3.5" /> Copied</span>
            ) : (
              <span className="flex items-center gap-1"><Copy className="size-3.5" /> Copy Title</span>
            )}
          </button>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3.5 text-base font-bold text-white tracking-tight">
          {seo.title}
        </div>

        {/* Alternative Titles (A/B testing) */}
        <div className="pt-2">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span>Alternative Titles & Hooks for A/B Testing</span>
          </div>
          <div className="space-y-2">
            {seo.alternativeTitles.map((altTitle, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between gap-3 rounded-lg border border-zinc-800/80 bg-zinc-900/80 px-3.5 py-2.5 text-xs text-zinc-200 hover:border-zinc-700 transition"
              >
                <div className="flex items-start gap-2.5">
                  <span className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400 shrink-0">
                    #{idx + 1}
                  </span>
                  <span className="font-medium">{altTitle}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(altTitle, `alt-${idx}`)}
                  className="text-zinc-400 hover:text-white shrink-0 p-1"
                  title="Copy alternative title"
                >
                  {copiedKey === `alt-${idx}` ? (
                    <Check className="size-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="rounded bg-emerald-500/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
              YouTube Description
            </span>
            <span className="text-xs text-zinc-400">
              Includes FTC affiliate disclosure & link placeholder
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditingDescription(!isEditingDescription)}
              className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition"
            >
              <Edit3 className="size-3.5" />
              <span>{isEditingDescription ? 'Done Editing' : 'Customize'}</span>
            </button>
            <button
              onClick={() => copyToClipboard(processedDescription, 'description')}
              className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition"
            >
              {copiedKey === 'description' ? (
                <span className="text-emerald-400 flex items-center gap-1"><Check className="size-3.5" /> Copied</span>
              ) : (
                <span className="flex items-center gap-1"><Copy className="size-3.5" /> Copy Description</span>
              )}
            </button>
          </div>
        </div>

        {/* FTC Notice Banner */}
        <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-2 text-xs text-amber-300">
          <ShieldAlert className="size-4 shrink-0 text-amber-400" />
          <span>
            FTC Compliance Active: "As an Amazon Associate I earn from qualifying purchases." is automatically included.
          </span>
        </div>

        {/* Description Text Container */}
        {isEditingDescription ? (
          <textarea
            value={customDescription}
            onChange={(e) => setCustomDescription(e.target.value)}
            rows={12}
            className="w-full rounded-lg border border-amber-500/40 bg-zinc-950 p-4 font-sans text-xs leading-relaxed text-zinc-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        ) : (
          <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-xs font-normal leading-relaxed text-zinc-300 whitespace-pre-wrap font-sans max-h-96 overflow-y-auto selection:bg-amber-500/30">
            {processedDescription}
          </div>
        )}
      </div>

      {/* Semicolon Tags & Keywords Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Semicolon Tags for YouTube Studio */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tag className="size-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Semicolon Tags (YouTube Studio)</h3>
            </div>
            <button
              onClick={() => copyToClipboard(seo.semicolonTags, 'semicolonTags')}
              className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition"
            >
              {copiedKey === 'semicolonTags' ? (
                <span className="text-emerald-400 flex items-center gap-1"><Check className="size-3.5" /> Copied</span>
              ) : (
                <span className="flex items-center gap-1"><Copy className="size-3.5" /> Copy Tags</span>
              )}
            </button>
          </div>
          <p className="text-xs text-zinc-400">
            Directly formatted with semicolons for pasting into the YouTube Studio video details tag input box.
          </p>
          <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-zinc-300 leading-relaxed max-h-36 overflow-y-auto break-words">
            {seo.semicolonTags}
          </div>
        </div>

        {/* Hashtags & Keywords Pills */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Hash className="size-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white">Hashtags & Search Terms</h3>
            </div>
            <button
              onClick={() => copyToClipboard(seo.hashtags.join(' '), 'hashtags')}
              className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition"
            >
              {copiedKey === 'hashtags' ? (
                <span className="text-emerald-400 flex items-center gap-1"><Check className="size-3.5" /> Copied</span>
              ) : (
                <span className="flex items-center gap-1"><Copy className="size-3.5" /> Copy Hashtags</span>
              )}
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {seo.hashtags.map((tag, idx) => (
              <span
                key={idx}
                className="rounded-full bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 text-xs font-medium text-purple-300"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="pt-2 border-t border-zinc-800">
            <span className="text-[11px] font-semibold uppercase text-zinc-500 tracking-wider">Main Keywords</span>
            <div className="mt-1.5 rounded-lg border border-zinc-800/80 bg-zinc-950/60 p-2 text-xs text-zinc-300 font-mono">
              {seo.mainKeywords}
            </div>
          </div>
        </div>
      </div>

      {/* File Naming Recommendations */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <span>Recommended File Names (SEO Optimized)</span>
        </h3>
        <p className="text-xs text-zinc-400">
          Pre-naming your video and thumbnail files before uploading signals relevant search ranking factors to the YouTube ingestion algorithm.
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Video file name */}
          <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950 p-3">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <Video className="size-4 text-blue-400 shrink-0" />
              <div className="truncate">
                <div className="text-[11px] text-zinc-500 font-mono">Video File</div>
                <div className="text-xs font-mono font-medium text-zinc-200 truncate">{seo.videoFileName}</div>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(seo.videoFileName, 'videoFileName')}
              className="text-zinc-400 hover:text-white shrink-0 p-1.5"
            >
              {copiedKey === 'videoFileName' ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
            </button>
          </div>

          {/* Thumbnail file name */}
          <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950 p-3">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <ImageIcon className="size-4 text-rose-400 shrink-0" />
              <div className="truncate">
                <div className="text-[11px] text-zinc-500 font-mono">Thumbnail File</div>
                <div className="text-xs font-mono font-medium text-zinc-200 truncate">{seo.thumbnailFileName}</div>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(seo.thumbnailFileName, 'thumbnailFileName')}
              className="text-zinc-400 hover:text-white shrink-0 p-1.5"
            >
              {copiedKey === 'thumbnailFileName' ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
