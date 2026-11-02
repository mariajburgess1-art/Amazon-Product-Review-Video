import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Tv, 
  BarChart3, 
  Sparkles, 
  Check, 
  Copy, 
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Target
} from 'lucide-react';
import { AffiliatePackage } from './types';
import { ESSENCE_MASCARA_PACKAGE } from './data/presets';
import { Header } from './components/Header';
import { SeoTab } from './components/SeoTab';
import { ThumbnailsTab } from './components/ThumbnailsTab';
import { VeoPromptsTab } from './components/VeoPromptsTab';
import { TeleprompterModal } from './components/TeleprompterModal';
import { NewPackageModal } from './components/NewPackageModal';
import { ExportModal } from './components/ExportModal';

export default function App() {
  const [currentPackage, setCurrentPackage] = useState<AffiliatePackage>(ESSENCE_MASCARA_PACKAGE);
  const [activeTab, setActiveTab] = useState<'seo' | 'thumbnails' | 'veo' | 'strategy'>('seo');
  
  // Modals
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isTeleprompterOpen, setIsTeleprompterOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Load sample or fetch from server on start
  useEffect(() => {
    fetch('/api/sample')
      .then(res => res.json())
      .then(data => {
        if (data && data.seo) {
          setCurrentPackage(data);
        }
      })
      .catch(() => {
        // Fallback to local ESSENCE_MASCARA_PACKAGE
      });
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-300">
      
      {/* Top Header */}
      <Header
        currentPackage={currentPackage}
        onSelectPreset={(pkg) => setCurrentPackage(pkg)}
        onOpenNewModal={() => setIsNewModalOpen(true)}
        onOpenTeleprompter={() => setIsTeleprompterOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
      />

      {/* Main Studio Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6">
        
        {/* Navigation Tabs Bar */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-px mb-6 overflow-x-auto">
          <div className="flex items-center gap-1 sm:gap-2">
            
            {/* Tab 1: SEO Package */}
            <button
              onClick={() => setActiveTab('seo')}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition -mb-px whitespace-nowrap ${
                activeTab === 'seo'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              <FileText className="size-4" />
              <span>SEO Package</span>
              <span className="rounded-full bg-zinc-800 px-1.5 py-0.2 font-mono text-[10px] text-zinc-300">
                Studio Ready
              </span>
            </button>

            {/* Tab 2: Thumbnail Concepts */}
            <button
              onClick={() => setActiveTab('thumbnails')}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition -mb-px whitespace-nowrap ${
                activeTab === 'thumbnails'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              <ImageIcon className="size-4" />
              <span>Thumbnail Concepts</span>
              <span className="rounded-full bg-amber-500/20 px-1.5 py-0.2 font-mono text-[10px] text-amber-300 font-bold">
                5
              </span>
            </button>

            {/* Tab 3: Veo Prompts & Timeline */}
            <button
              onClick={() => setActiveTab('veo')}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition -mb-px whitespace-nowrap ${
                activeTab === 'veo'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              <Video className="size-4" />
              <span>Veo AI Prompts</span>
              <span className="rounded-full bg-purple-500/20 px-1.5 py-0.2 font-mono text-[10px] text-purple-300 font-bold">
                {currentPackage.veoPackage?.clips?.length || 5} Clips · {(currentPackage.veoPackage?.totalDurationSeconds || (currentPackage.veoPackage?.clips?.length || 5) * (currentPackage.veoPackage?.clips?.[0]?.durationSeconds || 6))}s
              </span>
            </button>

            {/* Tab 4: Strategy & Economics */}
            <button
              onClick={() => setActiveTab('strategy')}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition -mb-px whitespace-nowrap ${
                activeTab === 'strategy'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              <BarChart3 className="size-4" />
              <span>Conversion Strategy</span>
            </button>

          </div>

          {/* Quick Teleprompter Trigger Button */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setIsTeleprompterOpen(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-purple-300 bg-purple-950/60 hover:bg-purple-900 border border-purple-800/40 px-3 py-1.5 rounded-lg transition"
            >
              <Tv className="size-3.5" />
              <span>Launch Teleprompter Reader</span>
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        {activeTab === 'seo' && (
          <SeoTab
            seo={currentPackage.seo}
            productName={currentPackage.productName}
            productUrl={currentPackage.productUrl}
          />
        )}

        {activeTab === 'thumbnails' && (
          <ThumbnailsTab
            thumbnails={currentPackage.thumbnails}
            productName={currentPackage.productName}
            category={currentPackage.category}
            initialAvatarUrl={currentPackage.avatarImageUrl}
            initialAspectRatio={currentPackage.aspectRatio || currentPackage.veoPackage?.aspectRatio || '16:9'}
          />
        )}

        {activeTab === 'veo' && (
          <VeoPromptsTab
            veoPackage={currentPackage.veoPackage}
            productName={currentPackage.productName}
            onOpenTeleprompter={() => setIsTeleprompterOpen(true)}
          />
        )}

        {activeTab === 'strategy' && (
          <div className="space-y-6">
            
            {/* Strategy Executive Header */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-sm space-y-3">
              <div className="flex items-center gap-2">
                <span className="rounded bg-amber-500/10 px-2 py-0.5 font-mono text-[11px] font-bold text-amber-400 border border-amber-500/20">
                  Affiliate Intelligence Brief
                </span>
                <h2 className="text-lg font-bold text-white">Video Conversion & Retention Architecture</h2>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed max-w-3xl">
                This review package is engineered specifically for YouTube search intent and high Amazon affiliate conversion rates. 
                It leverages psychological hook testing, natural lip-synced pacing, and honest objection handling to maximize viewer trust.
              </p>
            </div>

            {/* 3 Pillar Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Pillar 1 */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-3">
                <div className="size-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="size-4" />
                </div>
                <h3 className="text-sm font-bold text-white">FTC Compliance & Trust</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Includes explicit verbal disclosure (Clip 19) and description text ("As an Amazon Associate I earn from qualifying purchases") satisfying FTC guidelines while increasing viewer transparency.
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-3">
                <div className="size-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Target className="size-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Objection & Balance Guard</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Rather than blind praise, Clip 13 explicitly calls out limitations (e.g. non-waterproof humidity smudges) and Clip 16 states who should SKIP. This converts skeptical buyers who research before purchasing.
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-3">
                <div className="size-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <TrendingUp className="size-4" />
                </div>
                <h3 className="text-sm font-bold text-white">8-Second Veo Lip Syncing</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Chunked into twenty 8-second clips (~12 words each) aligning with AI video generation hardware thresholds. Eliminates lip-drift, facial distortion, and audio out-of-sync bugs.
                </p>
              </div>

            </div>

            {/* Checklist */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-4">
              <h3 className="text-sm font-bold text-white">Production Readiness Checklist</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2 text-zinc-300">
                  <Check className="size-4 text-emerald-400" />
                  <span>SEO Title: High-CTR curiosity hook under 80 characters</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <Check className="size-4 text-emerald-400" />
                  <span>Semicolon Tags: Formatted for 1-click YouTube Studio paste</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <Check className="size-4 text-emerald-400" />
                  <span>5 Thumbnail Angles: 16:9 prompts with safe zones for text</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <Check className="size-4 text-emerald-400" />
                  <span>20 Shots: 160 seconds continuous sequence with opening anchor frame</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950 py-6 px-4 sm:px-6 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-zinc-300">YouTuber</span>
            <span>•</span>
            <span>Affiliate Intelligence Studio</span>
          </div>
          <div className="font-mono text-[11px] text-zinc-600">
            Powered by Gemini 3.8 Flash · Veo AI Video Engine · YouTube SEO Optimizer
          </div>
        </div>
      </footer>

      {/* Teleprompter Modal */}
      <TeleprompterModal
        isOpen={isTeleprompterOpen}
        onClose={() => setIsTeleprompterOpen(false)}
        veoPackage={currentPackage.veoPackage}
        productName={currentPackage.productName}
      />

      {/* New Package Generator Modal */}
      <NewPackageModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onPackageGenerated={(pkg) => {
          setCurrentPackage(pkg);
          setActiveTab('seo');
        }}
      />

      {/* Export Assets Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        pkg={currentPackage}
      />

    </div>
  );
}
