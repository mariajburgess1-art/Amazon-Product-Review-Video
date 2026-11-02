import React, { useState } from 'react';
import { 
  X, 
  Download, 
  FileText, 
  FileJson, 
  Copy, 
  Check, 
  Video, 
  CheckCircle2
} from 'lucide-react';
import { AffiliatePackage } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  pkg: AffiliatePackage;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  pkg,
}) => {
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  if (!isOpen) return null;

  const getMarkdownContent = () => {
    return `# ${pkg.seo.title}

**Product:** ${pkg.productName}  
**Price:** ${pkg.price || 'N/A'}  
**Amazon URL:** ${pkg.productUrl || 'https://www.amazon.com/dp/' + (pkg.asin || '')}  
**Target Category:** ${pkg.category || 'General'}  
**Creator Persona:** ${pkg.creatorPersona || 'UGC Reviewer'}  

---

## 1. SEO Package

### Primary Title
\`${pkg.seo.title}\`

### Alternative Titles (A/B Testing)
${pkg.seo.alternativeTitles.map((t, i) => `${i + 1}. ${t}`).join('\n')}

### Video Description
\`\`\`text
${pkg.seo.description}
\`\`\`

### Semicolon Tags (YouTube Studio)
\`\`\`text
${pkg.seo.semicolonTags}
\`\`\`

### Hashtags
${pkg.seo.hashtags.join(' ')}

### Recommended File Names
- Video File: \`${pkg.seo.videoFileName}\`
- Thumbnail File: \`${pkg.seo.thumbnailFileName}\`

---

## 2. Thumbnail Concepts (5 Angles)

${pkg.thumbnails.map(t => `### Concept ${t.id}: ${t.title}
- **Overlay Text:** \`${t.overlayText}\`
- **Position:** ${t.textPosition}
- **Buying Angle:** ${t.angleDescription}

**Base Image Prompt:**
> ${t.prompt}
`).join('\n---\n')}

---

## 3. Veo Video Generator Prompts (20 Clips · 160s)

### Initial Frame / Opening Anchor Prompt
> ${pkg.veoPackage.initialFramePrompt}

### 20 Shot Sequence (8s Each)

${pkg.veoPackage.clips.map(c => `#### CLIP ${String(c.clipNumber).padStart(2, '0')} · 8 SECONDS · ${c.section}
- **Framing:** ${c.cameraFraming}
- **Dialogue:** "${c.dialogue}"
- **Prompt:** ${c.prompt}
`).join('\n')}
`;
  };

  const getVeoPromptsText = () => {
    return `INITIAL IMAGE / OPENING FRAME PROMPT:
${pkg.veoPackage.initialFramePrompt}

────────────────────────────────────
${pkg.veoPackage.clips.map(c => `CLIP ${String(c.clipNumber).padStart(2, '0')} · ${c.durationSeconds} SECONDS (${c.section})
Framing: ${c.cameraFraming}
Dialogue: "${c.dialogue}"

Prompt:
${c.prompt}
────────────────────────────────────`).join('\n')}`;
  };

  const triggerDownload = (filename: string, content: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyFormat = (content: string, key: string) => {
    navigator.clipboard.writeText(content);
    setCopiedFormat(key);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const slug = pkg.productName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-xl rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Download className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Export Video Production Assets</h2>
              <p className="text-xs text-zinc-400">{pkg.productName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Export Options */}
        <div className="mt-5 space-y-3">
          
          {/* Complete Markdown Document */}
          <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 hover:border-zinc-700 transition">
            <div className="flex items-center gap-3">
              <FileText className="size-5 text-amber-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-white">Complete Package Markdown (.md)</div>
                <div className="text-[11px] text-zinc-400">All SEO, 5 thumbnails, and 20 Veo prompts in clean markdown</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => copyFormat(getMarkdownContent(), 'md')}
                className="rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-300 hover:text-white"
              >
                {copiedFormat === 'md' ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
              </button>
              <button
                onClick={() => triggerDownload(`${slug}-full-package.md`, getMarkdownContent(), 'text/markdown')}
                className="rounded-lg bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 text-xs font-semibold text-white transition"
              >
                Download
              </button>
            </div>
          </div>

          {/* Veo Sequence Text File */}
          <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 hover:border-zinc-700 transition">
            <div className="flex items-center gap-3">
              <Video className="size-5 text-purple-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-white">Veo / Sora Prompts Sequence (.txt)</div>
                <div className="text-[11px] text-zinc-400">Formatted shot-by-shot text file for AI video pipelines</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => copyFormat(getVeoPromptsText(), 'txt')}
                className="rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-300 hover:text-white"
              >
                {copiedFormat === 'txt' ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
              </button>
              <button
                onClick={() => triggerDownload(`${slug}-veo-shots.txt`, getVeoPromptsText(), 'text/plain')}
                className="rounded-lg bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 text-xs font-semibold text-white transition"
              >
                Download
              </button>
            </div>
          </div>

          {/* Veo Batch JSON */}
          <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 hover:border-zinc-700 transition">
            <div className="flex items-center gap-3">
              <FileJson className="size-5 text-emerald-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-white">Veo Batch Automation JSON (.json)</div>
                <div className="text-[11px] text-zinc-400">JSON schema for programmatic API ingestion & video renderers</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => copyFormat(JSON.stringify(pkg.veoPackage, null, 2), 'json')}
                className="rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-300 hover:text-white"
              >
                {copiedFormat === 'json' ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
              </button>
              <button
                onClick={() => triggerDownload(`${slug}-veo-batch.json`, JSON.stringify(pkg.veoPackage, null, 2), 'application/json')}
                className="rounded-lg bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 text-xs font-semibold text-white transition"
              >
                Download
              </button>
            </div>
          </div>

        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-zinc-800 hover:bg-zinc-700 px-4 py-2 text-xs font-medium text-white transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
