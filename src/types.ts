export interface SeoPackage {
  title: string;
  alternativeTitles: string[];
  description: string;
  keywords: string;
  hashtags: string[];
  mainKeywords: string;
  semicolonTags: string;
  videoFileName: string;
  thumbnailFileName: string;
}

export interface ThumbnailConcept {
  id: number;
  title: string;
  angleDescription: string;
  overlayText: string;
  textPosition: 'top-left' | 'top-right' | 'bottom-left' | 'center' | string;
  colorTheme: string;
  prompt: string;
  generatedImageUrl?: string;
}

export interface VeoClip {
  clipNumber: number;
  durationSeconds: number;
  section: string;
  cameraFraming: string;
  dialogue: string;
  prompt: string;
  // Viral beauty & retention directives
  onScreenText?: string;
  audioCue?: string;
  bRollAction?: string;
  hookFormula?: string;
}

export interface VeoPackage {
  initialFramePrompt: string;
  totalDurationSeconds: number;
  clipsCount: number;
  clipDurationSeconds?: number;
  aspectRatio?: '16:9' | '9:16';
  videoFormat?: 'long-form' | 'shorts';
  videoArchetype?: string;
  clips: VeoClip[];
}

export interface AffiliatePackage {
  id: string;
  productName: string;
  brand?: string;
  price?: string;
  productUrl?: string;
  asin?: string;
  category?: string;
  creatorPersona?: string;
  avatarImageUrl?: string;
  productImageUrl?: string;
  videoFormat?: 'long-form' | 'shorts';
  aspectRatio?: '16:9' | '9:16';
  clipDurationSeconds?: number;
  scenesCount?: number;
  videoArchetype?: string;
  seo: SeoPackage;
  thumbnails: ThumbnailConcept[];
  veoPackage: VeoPackage;
  generatedThumbnails?: Record<number, string>;
}

export interface GeneratePackageForm {
  productName: string;
  brand: string;
  price: string;
  productUrl: string;
  asin: string;
  category: string;
  keyFeatures: string;
  pros: string;
  cons: string;
  targetAudience: string;
  creatorPersona: string;
  affiliateTag: string;
  videoFormat: 'long-form' | 'shorts';
  aspectRatio: '16:9' | '9:16';
  clipDurationSeconds: number;
  scenesCount: number;
  videoArchetype?: string;
}

