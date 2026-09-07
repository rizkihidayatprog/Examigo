import jsPDF from 'jspdf';
import QRCode from 'qrcode';

export interface CertificateConfig {
  institutionName: string;
  certificateTitle: string;
  subtitle: string;
  completionText: string;
  logoUrl?: string | null;
  theme: string;
  borderStyle: string;
  fontFamily: string;
  watermarkStyle: 'none' | 'center_logo' | 'security_seal' | 'guilloche_frame';
  signer1: {
    name: string;
    title: string;
    signatureUrl?: string | null;
    scale?: number;
    yOffset?: number;
    xOffset?: number;
    colorMode?: 'match_text' | 'theme_accent' | 'original';
  };
  signer2: {
    name: string;
    title: string;
    signatureUrl?: string | null;
    scale?: number;
    yOffset?: number;
    xOffset?: number;
    colorMode?: 'match_text' | 'theme_accent' | 'original';
  };
  showScore: boolean;
  showPassingScore: boolean;
  showDate: boolean;
  showCertificateId: boolean;
  showQrCode: boolean;
  enableCertificate: boolean;
  customNotes?: string | null;
}

export interface StudentCertificateData {
  studentName: string;
  examTitle: string;
  examCode: string;
  score?: number | string;
  passingScore?: number | string;
  completionDate?: string;
  certificateId?: string;
}

export interface ThemeDefinition {
  id: string;
  name: string;
  category: 'dark' | 'light' | 'academic' | 'modern';
  desc: string;
  bg: [number, number, number];
  isLightBg: boolean;
  borderOuter: [number, number, number];
  borderInner: [number, number, number];
  brandText: [number, number, number];
  titleText: [number, number, number];
  subtitleText: [number, number, number];
  nameText: [number, number, number];
  examTitleText: [number, number, number];
  metaText: [number, number, number];
  accentLine: [number, number, number];
  badgeBgHex: string;
  badgeTextHex: string;
}

export interface CertificateFontDefinition {
  id: string;
  name: string;
  category: 'serif' | 'sans' | 'mono' | 'script';
  desc: string;
  preview: string;
  cssFamily: string;
  jsPdfFont: 'times' | 'helvetica' | 'courier';
}

export interface CertificateBorderDefinition {
  id: string;
  name: string;
  category: 'classic' | 'modern' | 'ornate' | 'minimal';
  desc: string;
}

export const CERTIFICATE_FONTS: Record<string, CertificateFontDefinition> = {
  times: { id: 'times', name: 'Times Classic', category: 'serif', desc: 'Klasik & Akademik', preview: 'Aa', cssFamily: 'font-serif', jsPdfFont: 'times' },
  playfair: { id: 'playfair', name: 'Playfair Luxury', category: 'serif', desc: 'Mewah & Anggun', preview: 'Aa', cssFamily: 'font-serif tracking-wide', jsPdfFont: 'times' },
  cinzel: { id: 'cinzel', name: 'Cinzel Royal', category: 'serif', desc: 'Gaya Piagam Kerajaan', preview: 'Aa', cssFamily: 'font-serif uppercase tracking-widest', jsPdfFont: 'times' },
  helvetica: { id: 'helvetica', name: 'Helvetica Sans', category: 'sans', desc: 'Modern & Tegas', preview: 'Aa', cssFamily: 'font-sans', jsPdfFont: 'helvetica' },
  montserrat: { id: 'montserrat', name: 'Montserrat Bold', category: 'sans', desc: 'Geometrik Berwibawa', preview: 'Aa', cssFamily: 'font-sans tracking-tight', jsPdfFont: 'helvetica' },
  cormorant: { id: 'cormorant', name: 'Cormorant Garamond', category: 'serif', desc: 'Aristokrat Elegan', preview: 'Aa', cssFamily: 'font-serif font-light', jsPdfFont: 'times' },
  courier: { id: 'courier', name: 'Courier Typewriter', category: 'mono', desc: 'Vintage / No. Seri', preview: 'Aa', cssFamily: 'font-mono', jsPdfFont: 'courier' },
  merriweather: { id: 'merriweather', name: 'Merriweather Editorial', category: 'serif', desc: 'Jurnal & Legal Formal', preview: 'Aa', cssFamily: 'font-serif font-semibold', jsPdfFont: 'times' },
  greatvibes: { id: 'greatvibes', name: 'Calligraphy Script', category: 'script', desc: 'Kaligrafi Piagam Seni', preview: 'Aa', cssFamily: 'italic font-serif tracking-wider', jsPdfFont: 'times' },
  inter: { id: 'inter', name: 'Inter Clean', category: 'sans', desc: 'Modern Digital & Tech', preview: 'Aa', cssFamily: 'font-sans font-medium', jsPdfFont: 'helvetica' },
  outfit: { id: 'outfit', name: 'Outfit Tech', category: 'sans', desc: 'SaaS Kontemporer', preview: 'Aa', cssFamily: 'font-sans tracking-wide', jsPdfFont: 'helvetica' },
  lora: { id: 'lora', name: 'Lora Distinguished', category: 'serif', desc: 'Elegan & Berbudaya', preview: 'Aa', cssFamily: 'font-serif italic', jsPdfFont: 'times' },
  roboto_slab: { id: 'roboto_slab', name: 'Roboto Slab', category: 'serif', desc: 'Akademik Modern', preview: 'Aa', cssFamily: 'font-serif font-black', jsPdfFont: 'times' },
  raleway: { id: 'raleway', name: 'Raleway Luxury', category: 'sans', desc: 'Art Deco Elegan', preview: 'Aa', cssFamily: 'font-sans tracking-widest', jsPdfFont: 'helvetica' },
  alegreya: { id: 'alegreya', name: 'Alegreya Humanities', category: 'serif', desc: 'Sastra & Humaniora', preview: 'Aa', cssFamily: 'font-serif', jsPdfFont: 'times' },
  poppins: { id: 'poppins', name: 'Poppins Friendly', category: 'sans', desc: 'Kreatif Edukasi', preview: 'Aa', cssFamily: 'font-sans font-bold', jsPdfFont: 'helvetica' },
  eb_garamond: { id: 'eb_garamond', name: 'EB Garamond', category: 'serif', desc: 'Diploma Tradisional', preview: 'Aa', cssFamily: 'font-serif', jsPdfFont: 'times' },
  libre_baskerville: { id: 'libre_baskerville', name: 'Libre Baskerville', category: 'serif', desc: 'Legal & Notaris', preview: 'Aa', cssFamily: 'font-serif', jsPdfFont: 'times' },
  oswald: { id: 'oswald', name: 'Oswald Condensed', category: 'sans', desc: 'Institusi Nasional', preview: 'Aa', cssFamily: 'font-sans uppercase tracking-tight', jsPdfFont: 'helvetica' },
  space_mono: { id: 'space_mono', name: 'Space Monospace', category: 'mono', desc: 'Teknik & Komputasi', preview: 'Aa', cssFamily: 'font-mono tracking-tight', jsPdfFont: 'courier' },
};

export const CERTIFICATE_BORDERS: Record<string, CertificateBorderDefinition> = {
  double_gold: { id: 'double_gold', name: 'Double Gold', category: 'classic', desc: 'Bingkai ganda emas klasik' },
  modern_clean: { id: 'modern_clean', name: 'Modern Clean', category: 'modern', desc: 'Minimalis siku geometris' },
  ornate: { id: 'ornate', name: 'Ornate Frame', category: 'ornate', desc: 'Bingkai mewah berornamen' },
  royal_crest: { id: 'royal_crest', name: 'Royal Crest', category: 'classic', desc: 'Aksen mahkota kerajaan' },
  geometric_art_deco: { id: 'geometric_art_deco', name: 'Art Deco', category: 'ornate', desc: 'Garis geometris bertingkat' },
  diploma_traditional: { id: 'diploma_traditional', name: 'Diploma Tradisional', category: 'classic', desc: 'Lis ganda tebal-tipis' },
  tech_bracket: { id: 'tech_bracket', name: 'Cyber Bracket', category: 'modern', desc: 'Sudut siku digital futuristik' },
  minimal_hairline: { id: 'minimal_hairline', name: 'Minimal Hairline', category: 'minimal', desc: 'Garis tipis presisi halus' },
  vintage_scroll: { id: 'vintage_scroll', name: 'Vintage Scroll', category: 'ornate', desc: 'Gaya piagam kuno berlekuk' },
  bold_executive: { id: 'bold_executive', name: 'Bold Executive', category: 'modern', desc: 'Bingkai masif korporat' },
  diamond_corners: { id: 'diamond_corners', name: 'Diamond Corners', category: 'classic', desc: 'Ornamen belah ketupat 4 sudut' },
  triple_line: { id: 'triple_line', name: 'Triple Line', category: 'classic', desc: 'Tiga garis bertingkat' },
  classic_dashed: { id: 'classic_dashed', name: 'Classic Dashed', category: 'classic', desc: 'Garis jahitan stitches halus' },
  floating_border: { id: 'floating_border', name: 'Floating Border', category: 'minimal', desc: 'Efek bingkai melayang' },
  arch_header: { id: 'arch_header', name: 'Arch Header', category: 'classic', desc: 'Lengkung garis atas' },
  corner_dots: { id: 'corner_dots', name: 'Corner Dots', category: 'minimal', desc: 'Bintik aksen emas di sudut' },
  notary_seal: { id: 'notary_seal', name: 'Notary Frame', category: 'classic', desc: 'Bingkai notaris & hukum' },
  islamic_geometric: { id: 'islamic_geometric', name: 'Islamic Geometric', category: 'ornate', desc: 'Pola bintang arabesque' },
  academic_laurel: { id: 'academic_laurel', name: 'Academic Laurel', category: 'ornate', desc: 'Bingkai daun kehormatan' },
  modern_gradient: { id: 'modern_gradient', name: 'Modern Split', category: 'modern', desc: 'Lis ganda warna asimetris' },
};

export const CERTIFICATE_THEMES: Record<string, ThemeDefinition> = {
  // 1. Emerald Gold (Default)
  emerald_gold: {
    id: 'emerald_gold',
    name: 'Emerald Gold',
    category: 'dark',
    desc: 'Hijau Zamrud Mewah & Aksen Emas',
    bg: [6, 38, 28],
    isLightBg: false,
    borderOuter: [16, 185, 129],
    borderInner: [245, 158, 11],
    brandText: [16, 185, 129],
    titleText: [255, 255, 255],
    subtitleText: [167, 243, 208],
    nameText: [251, 191, 36],
    examTitleText: [255, 255, 255],
    metaText: [148, 163, 184],
    accentLine: [245, 158, 11],
    badgeBgHex: 'rgba(16, 185, 129, 0.15)',
    badgeTextHex: '#34D399',
  },
  // 2. Royal Navy
  royal_navy: {
    id: 'royal_navy',
    name: 'Royal Navy',
    category: 'dark',
    desc: 'Slate Gelap 950 & Aksen Emas Amber',
    bg: [15, 23, 42],
    isLightBg: false,
    borderOuter: [30, 41, 59],
    borderInner: [245, 158, 11],
    brandText: [129, 140, 248],
    titleText: [255, 255, 255],
    subtitleText: [148, 163, 184],
    nameText: [245, 158, 11],
    examTitleText: [255, 255, 255],
    metaText: [148, 163, 184],
    accentLine: [245, 158, 11],
    badgeBgHex: 'rgba(245, 158, 11, 0.15)',
    badgeTextHex: '#FBBF24',
  },
  // 3. Academic Classic
  academic_classic: {
    id: 'academic_classic',
    name: 'Academic Classic',
    category: 'light',
    desc: 'Putih Gading & Lis Biru Kerajaan',
    bg: [253, 251, 247],
    isLightBg: true,
    borderOuter: [30, 58, 138],
    borderInner: [217, 119, 6],
    brandText: [30, 58, 138],
    titleText: [30, 58, 138],
    subtitleText: [71, 85, 105],
    nameText: [180, 83, 9],
    examTitleText: [15, 23, 42],
    metaText: [100, 116, 139],
    accentLine: [217, 119, 6],
    badgeBgHex: 'rgba(30, 58, 138, 0.1)',
    badgeTextHex: '#1E3A8A',
  },
  // 4. Crimson Luxury
  crimson_luxury: {
    id: 'crimson_luxury',
    name: 'Crimson Luxury',
    category: 'dark',
    desc: 'Merah Marun Mewah & Perak Platinum',
    bg: [42, 8, 18],
    isLightBg: false,
    borderOuter: [76, 5, 25],
    borderInner: [226, 232, 240],
    brandText: [244, 63, 94],
    titleText: [255, 255, 255],
    subtitleText: [254, 205, 211],
    nameText: [253, 164, 175],
    examTitleText: [255, 255, 255],
    metaText: [203, 213, 225],
    accentLine: [226, 232, 240],
    badgeBgHex: 'rgba(244, 63, 94, 0.2)',
    badgeTextHex: '#FDA4AF',
  },
  // 5. Midnight Amethyst
  midnight_amethyst: {
    id: 'midnight_amethyst',
    name: 'Midnight Amethyst',
    category: 'dark',
    desc: 'Ungu Malam Megah & Emas Lilac',
    bg: [46, 16, 101],
    isLightBg: false,
    borderOuter: [88, 28, 135],
    borderInner: [251, 191, 36],
    brandText: [192, 132, 252],
    titleText: [255, 255, 255],
    subtitleText: [233, 213, 255],
    nameText: [251, 191, 36],
    examTitleText: [255, 255, 255],
    metaText: [216, 180, 254],
    accentLine: [251, 191, 36],
    badgeBgHex: 'rgba(192, 132, 252, 0.2)',
    badgeTextHex: '#E9D5FF',
  },
  // 6. Slate Minimalist
  slate_minimalist: {
    id: 'slate_minimalist',
    name: 'Slate Minimalist',
    category: 'dark',
    desc: 'Abu-Abu Arang Elegan & Lis Teal',
    bg: [30, 41, 59],
    isLightBg: false,
    borderOuter: [51, 65, 85],
    borderInner: [20, 184, 166],
    brandText: [45, 212, 191],
    titleText: [255, 255, 255],
    subtitleText: [203, 213, 225],
    nameText: [45, 212, 191],
    examTitleText: [255, 255, 255],
    metaText: [148, 163, 184],
    accentLine: [20, 184, 166],
    badgeBgHex: 'rgba(20, 184, 166, 0.15)',
    badgeTextHex: '#2DD4BF',
  },
  // 7. Golden Prestige
  golden_prestige: {
    id: 'golden_prestige',
    name: 'Golden Prestige',
    category: 'dark',
    desc: 'Hitam Obsidian & Logam Mulia Emas',
    bg: [24, 24, 27],
    isLightBg: false,
    borderOuter: [39, 39, 42],
    borderInner: [234, 179, 8],
    brandText: [250, 204, 21],
    titleText: [255, 255, 255],
    subtitleText: [212, 212, 216],
    nameText: [234, 179, 8],
    examTitleText: [255, 255, 255],
    metaText: [161, 161, 170],
    accentLine: [234, 179, 8],
    badgeBgHex: 'rgba(234, 179, 8, 0.15)',
    badgeTextHex: '#FACC15',
  },
  // 8. Vintage Parchment
  vintage_parchment: {
    id: 'vintage_parchment',
    name: 'Vintage Parchment',
    category: 'academic',
    desc: 'Kertas Kuno Antik & Cokelat Sepia',
    bg: [247, 242, 231],
    isLightBg: true,
    borderOuter: [120, 53, 15],
    borderInner: [180, 83, 9],
    brandText: [120, 53, 15],
    titleText: [69, 26, 3],
    subtitleText: [146, 64, 14],
    nameText: [120, 53, 15],
    examTitleText: [69, 26, 3],
    metaText: [146, 64, 14],
    accentLine: [180, 83, 9],
    badgeBgHex: 'rgba(120, 53, 15, 0.12)',
    badgeTextHex: '#78350F',
  },
  // 9. Ocean Breeze
  ocean_breeze: {
    id: 'ocean_breeze',
    name: 'Ocean Breeze',
    category: 'dark',
    desc: 'Biru Samudra Dalam & Cyan Toska',
    bg: [8, 51, 68],
    isLightBg: false,
    borderOuter: [14, 116, 144],
    borderInner: [56, 189, 248],
    brandText: [56, 189, 248],
    titleText: [255, 255, 255],
    subtitleText: [186, 230, 253],
    nameText: [125, 211, 252],
    examTitleText: [255, 255, 255],
    metaText: [125, 211, 252],
    accentLine: [56, 189, 248],
    badgeBgHex: 'rgba(56, 189, 248, 0.15)',
    badgeTextHex: '#38BDF8',
  },
  // 10. Forest Moss
  forest_moss: {
    id: 'forest_moss',
    name: 'Forest Moss',
    category: 'dark',
    desc: 'Hijau Hutan Tropis & Emas Sage',
    bg: [5, 46, 22],
    isLightBg: false,
    borderOuter: [20, 83, 45],
    borderInner: [134, 239, 172],
    brandText: [74, 222, 128],
    titleText: [255, 255, 255],
    subtitleText: [187, 247, 208],
    nameText: [134, 239, 172],
    examTitleText: [255, 255, 255],
    metaText: [134, 239, 172],
    accentLine: [134, 239, 172],
    badgeBgHex: 'rgba(74, 222, 128, 0.15)',
    badgeTextHex: '#4ADE80',
  },
  // 11. Ruby Elegance
  ruby_elegance: {
    id: 'ruby_elegance',
    name: 'Ruby Elegance',
    category: 'dark',
    desc: 'Merah Delima & Emas Kerajaan',
    bg: [76, 5, 25],
    isLightBg: false,
    borderOuter: [136, 19, 55],
    borderInner: [252, 211, 77],
    brandText: [251, 113, 133],
    titleText: [255, 255, 255],
    subtitleText: [254, 205, 211],
    nameText: [252, 211, 77],
    examTitleText: [255, 255, 255],
    metaText: [254, 205, 211],
    accentLine: [252, 211, 77],
    badgeBgHex: 'rgba(252, 211, 77, 0.2)',
    badgeTextHex: '#FCD34D',
  },
  // 12. Corporate Blue
  clean_corporate_blue: {
    id: 'clean_corporate_blue',
    name: 'Corporate Blue',
    category: 'light',
    desc: 'Putih Terang & Biru Kobalt Modern',
    bg: [255, 255, 255],
    isLightBg: true,
    borderOuter: [29, 78, 216],
    borderInner: [96, 165, 250],
    brandText: [29, 78, 216],
    titleText: [30, 58, 138],
    subtitleText: [71, 85, 105],
    nameText: [29, 78, 216],
    examTitleText: [15, 23, 42],
    metaText: [100, 116, 139],
    accentLine: [37, 99, 235],
    badgeBgHex: 'rgba(29, 78, 216, 0.1)',
    badgeTextHex: '#1D4ED8',
  },
  // 13. Sunset Terracotta
  sunset_terracotta: {
    id: 'sunset_terracotta',
    name: 'Sunset Terracotta',
    category: 'dark',
    desc: 'Nuansa Hangat Senja & Oranye Emas',
    bg: [67, 20, 7],
    isLightBg: false,
    borderOuter: [124, 45, 18],
    borderInner: [249, 115, 22],
    brandText: [251, 146, 60],
    titleText: [255, 255, 255],
    subtitleText: [254, 215, 170],
    nameText: [253, 186, 116],
    examTitleText: [255, 255, 255],
    metaText: [254, 215, 170],
    accentLine: [249, 115, 22],
    badgeBgHex: 'rgba(249, 115, 22, 0.2)',
    badgeTextHex: '#FB923C',
  },
  // 14. Executive Monochrome
  monochrome_executive: {
    id: 'monochrome_executive',
    name: 'Executive Monochrome',
    category: 'dark',
    desc: 'Hitam Pekat & Perak Krom Presisi',
    bg: [9, 9, 11],
    isLightBg: false,
    borderOuter: [39, 39, 42],
    borderInner: [203, 213, 225],
    brandText: [226, 232, 240],
    titleText: [255, 255, 255],
    subtitleText: [161, 161, 170],
    nameText: [244, 244, 245],
    examTitleText: [255, 255, 255],
    metaText: [161, 161, 170],
    accentLine: [203, 213, 225],
    badgeBgHex: 'rgba(203, 213, 225, 0.15)',
    badgeTextHex: '#E2E8F0',
  },
  // 15. Rose Gold Luxe
  rose_gold: {
    id: 'rose_gold',
    name: 'Rose Gold Luxe',
    category: 'light',
    desc: 'Mawar Emas Lembut & Merah Muda Mewah',
    bg: [255, 241, 242],
    isLightBg: true,
    borderOuter: [190, 18, 60],
    borderInner: [244, 63, 94],
    brandText: [190, 18, 60],
    titleText: [136, 19, 55],
    subtitleText: [159, 18, 57],
    nameText: [190, 18, 60],
    examTitleText: [76, 5, 25],
    metaText: [159, 18, 57],
    accentLine: [244, 63, 94],
    badgeBgHex: 'rgba(190, 18, 60, 0.1)',
    badgeTextHex: '#BE123C',
  },
  // 16. Nordic Frost
  nordic_frost: {
    id: 'nordic_frost',
    name: 'Nordic Frost',
    category: 'dark',
    desc: 'Arang Dingin & Biru Es Sian',
    bg: [10, 15, 29],
    isLightBg: false,
    borderOuter: [22, 78, 99],
    borderInner: [6, 182, 212],
    brandText: [34, 211, 238],
    titleText: [255, 255, 255],
    subtitleText: [165, 243, 252],
    nameText: [34, 211, 238],
    examTitleText: [255, 255, 255],
    metaText: [165, 243, 252],
    accentLine: [6, 182, 212],
    badgeBgHex: 'rgba(6, 182, 212, 0.15)',
    badgeTextHex: '#22D3EE',
  },
  // 17. Majestic Bronze
  majestic_bronze: {
    id: 'majestic_bronze',
    name: 'Majestic Bronze',
    category: 'dark',
    desc: 'Cokelat Mahoni & Logam Perunggu',
    bg: [41, 21, 7],
    isLightBg: false,
    borderOuter: [69, 26, 3],
    borderInner: [217, 119, 6],
    brandText: [245, 158, 11],
    titleText: [255, 255, 255],
    subtitleText: [254, 215, 170],
    nameText: [251, 191, 36],
    examTitleText: [255, 255, 255],
    metaText: [217, 119, 6],
    accentLine: [217, 119, 6],
    badgeBgHex: 'rgba(217, 119, 6, 0.2)',
    badgeTextHex: '#F59E0B',
  },
  // 18. Clean Emerald Light
  clean_emerald_light: {
    id: 'clean_emerald_light',
    name: 'Clean Emerald',
    category: 'light',
    desc: 'Putih Bersih Lis Hijau Zamrud',
    bg: [250, 250, 250],
    isLightBg: true,
    borderOuter: [4, 120, 87],
    borderInner: [52, 211, 153],
    brandText: [4, 120, 87],
    titleText: [6, 78, 59],
    subtitleText: [55, 65, 81],
    nameText: [4, 120, 87],
    examTitleText: [17, 24, 39],
    metaText: [75, 85, 99],
    accentLine: [5, 150, 105],
    badgeBgHex: 'rgba(4, 120, 87, 0.1)',
    badgeTextHex: '#047857',
  },
  // 19. Sapphire Star
  sapphire_star: {
    id: 'sapphire_star',
    name: 'Sapphire Star',
    category: 'dark',
    desc: 'Biru Safir Pekat & Bintang Emas',
    bg: [2, 6, 23],
    isLightBg: false,
    borderOuter: [30, 58, 138],
    borderInner: [250, 204, 21],
    brandText: [96, 165, 250],
    titleText: [255, 255, 255],
    subtitleText: [191, 219, 254],
    nameText: [250, 204, 21],
    examTitleText: [255, 255, 255],
    metaText: [147, 197, 253],
    accentLine: [250, 204, 21],
    badgeBgHex: 'rgba(250, 204, 21, 0.2)',
    badgeTextHex: '#FACC15',
  },
  // 20. Royal Ivory Gold
  royal_ivory_gold: {
    id: 'royal_ivory_gold',
    name: 'Royal Ivory Gold',
    category: 'academic',
    desc: 'Krem Keraton & Bingkai Emas Ganda',
    bg: [254, 252, 232],
    isLightBg: true,
    borderOuter: [202, 138, 4],
    borderInner: [234, 179, 8],
    brandText: [161, 98, 7],
    titleText: [113, 63, 18],
    subtitleText: [133, 77, 14],
    nameText: [161, 98, 7],
    examTitleText: [66, 32, 6],
    metaText: [133, 77, 14],
    accentLine: [202, 138, 4],
    badgeBgHex: 'rgba(202, 138, 4, 0.15)',
    badgeTextHex: '#CA8A04',
  },
  // 21. Celestial Blue
  celestial_blue: {
    id: 'celestial_blue',
    name: 'Celestial Blue',
    category: 'dark',
    desc: 'Biru Langit Angkasa & Lis Perak Bintang',
    bg: [10, 25, 47],
    isLightBg: false,
    borderOuter: [23, 42, 69],
    borderInner: [100, 255, 218],
    brandText: [100, 255, 218],
    titleText: [255, 255, 255],
    subtitleText: [136, 146, 176],
    nameText: [100, 255, 218],
    examTitleText: [255, 255, 255],
    metaText: [136, 146, 176],
    accentLine: [100, 255, 218],
    badgeBgHex: 'rgba(100, 255, 218, 0.15)',
    badgeTextHex: '#64FFDA',
  },
  // 22. Deep Crimson Gold
  deep_crimson_gold: {
    id: 'deep_crimson_gold',
    name: 'Deep Crimson Gold',
    category: 'dark',
    desc: 'Merah Marun Pekat & Emas Murni',
    bg: [50, 6, 18],
    isLightBg: false,
    borderOuter: [88, 10, 32],
    borderInner: [245, 158, 11],
    brandText: [251, 191, 36],
    titleText: [255, 255, 255],
    subtitleText: [254, 205, 211],
    nameText: [251, 191, 36],
    examTitleText: [255, 255, 255],
    metaText: [244, 114, 182],
    accentLine: [245, 158, 11],
    badgeBgHex: 'rgba(245, 158, 11, 0.2)',
    badgeTextHex: '#FBBF24',
  },
  // 23. Sage Botanical
  sage_botanical: {
    id: 'sage_botanical',
    name: 'Sage Botanical',
    category: 'light',
    desc: 'Hijau Sage Lembut & Tembaga Hangat',
    bg: [244, 247, 244],
    isLightBg: true,
    borderOuter: [82, 115, 94],
    borderInner: [180, 83, 9],
    brandText: [46, 80, 58],
    titleText: [30, 58, 40],
    subtitleText: [85, 107, 92],
    nameText: [180, 83, 9],
    examTitleText: [20, 42, 28],
    metaText: [100, 120, 108],
    accentLine: [180, 83, 9],
    badgeBgHex: 'rgba(82, 115, 94, 0.15)',
    badgeTextHex: '#52735E',
  },
  // 24. Obsidian Neon Cyan
  obsidian_neon_cyan: {
    id: 'obsidian_neon_cyan',
    name: 'Obsidian Cyan',
    category: 'modern',
    desc: 'Hitam Pekat Doff & Sian Futuristik',
    bg: [15, 20, 25],
    isLightBg: false,
    borderOuter: [30, 40, 50],
    borderInner: [6, 182, 212],
    brandText: [34, 211, 238],
    titleText: [255, 255, 255],
    subtitleText: [148, 163, 184],
    nameText: [34, 211, 238],
    examTitleText: [255, 255, 255],
    metaText: [148, 163, 184],
    accentLine: [6, 182, 212],
    badgeBgHex: 'rgba(6, 182, 212, 0.15)',
    badgeTextHex: '#22D3EE',
  },
  // 25. Royal Purple Silver
  royal_purple_silver: {
    id: 'royal_purple_silver',
    name: 'Royal Purple Silver',
    category: 'dark',
    desc: 'Ungu Mahkota & Lis Perak Berkilau',
    bg: [35, 10, 60],
    isLightBg: false,
    borderOuter: [60, 20, 100],
    borderInner: [226, 232, 240],
    brandText: [216, 180, 254],
    titleText: [255, 255, 255],
    subtitleText: [233, 213, 255],
    nameText: [248, 250, 252],
    examTitleText: [255, 255, 255],
    metaText: [203, 213, 225],
    accentLine: [226, 232, 240],
    badgeBgHex: 'rgba(216, 180, 254, 0.2)',
    badgeTextHex: '#D8B4FE',
  },
  // 26. Desert Sand
  desert_sand: {
    id: 'desert_sand',
    name: 'Desert Sand',
    category: 'academic',
    desc: 'Pasir Gurun Sahara & Cokelat Keemasan',
    bg: [250, 246, 238],
    isLightBg: true,
    borderOuter: [161, 98, 7],
    borderInner: [217, 119, 6],
    brandText: [146, 64, 14],
    titleText: [113, 63, 18],
    subtitleText: [120, 53, 15],
    nameText: [180, 83, 9],
    examTitleText: [69, 26, 3],
    metaText: [146, 64, 14],
    accentLine: [217, 119, 6],
    badgeBgHex: 'rgba(161, 98, 7, 0.12)',
    badgeTextHex: '#A16207',
  },
  // 27. Midnight Teal
  midnight_teal: {
    id: 'midnight_teal',
    name: 'Midnight Teal',
    category: 'dark',
    desc: 'Teal Laut Dalam & Emas Dingin',
    bg: [4, 30, 36],
    isLightBg: false,
    borderOuter: [13, 74, 86],
    borderInner: [250, 204, 21],
    brandText: [45, 212, 191],
    titleText: [255, 255, 255],
    subtitleText: [153, 246, 228],
    nameText: [250, 204, 21],
    examTitleText: [255, 255, 255],
    metaText: [153, 246, 228],
    accentLine: [250, 204, 21],
    badgeBgHex: 'rgba(45, 212, 191, 0.18)',
    badgeTextHex: '#2DD4BF',
  },
  // 28. Champagne Luxe
  champagne_luxe: {
    id: 'champagne_luxe',
    name: 'Champagne Luxe',
    category: 'light',
    desc: 'Sampanye Mewah & Bronze Hangat',
    bg: [253, 250, 243],
    isLightBg: true,
    borderOuter: [180, 140, 70],
    borderInner: [212, 175, 55],
    brandText: [140, 100, 40],
    titleText: [90, 60, 20],
    subtitleText: [130, 105, 75],
    nameText: [160, 110, 30],
    examTitleText: [60, 40, 15],
    metaText: [130, 105, 75],
    accentLine: [212, 175, 55],
    badgeBgHex: 'rgba(212, 175, 55, 0.15)',
    badgeTextHex: '#B48C46',
  },
  // 29. Charcoal Amber
  charcoal_amber: {
    id: 'charcoal_amber',
    name: 'Charcoal Amber',
    category: 'dark',
    desc: 'Arang Antrasit & Amber Berpijar',
    bg: [20, 22, 26],
    isLightBg: false,
    borderOuter: [45, 50, 60],
    borderInner: [245, 158, 11],
    brandText: [251, 191, 36],
    titleText: [255, 255, 255],
    subtitleText: [156, 163, 175],
    nameText: [245, 158, 11],
    examTitleText: [255, 255, 255],
    metaText: [156, 163, 175],
    accentLine: [245, 158, 11],
    badgeBgHex: 'rgba(245, 158, 11, 0.18)',
    badgeTextHex: '#FBBF24',
  },
  // 30. Blush Pastel
  blush_pastel: {
    id: 'blush_pastel',
    name: 'Blush Pastel',
    category: 'light',
    desc: 'Merah Muda Pastel & Abu-abu Mutiara',
    bg: [254, 248, 248],
    isLightBg: true,
    borderOuter: [225, 170, 180],
    borderInner: [180, 100, 120],
    brandText: [180, 90, 110],
    titleText: [120, 50, 70],
    subtitleText: [140, 100, 110],
    nameText: [180, 70, 95],
    examTitleText: [80, 30, 45],
    metaText: [140, 100, 110],
    accentLine: [210, 130, 150],
    badgeBgHex: 'rgba(225, 170, 180, 0.25)',
    badgeTextHex: '#B46478',
  },
  // 31. Oxblood Formal
  oxblood_formal: {
    id: 'oxblood_formal',
    name: 'Oxblood Formal',
    category: 'academic',
    desc: 'Merah Marun Tua Formal & Emas Klasik',
    bg: [253, 248, 248],
    isLightBg: true,
    borderOuter: [120, 20, 30],
    borderInner: [180, 120, 40],
    brandText: [120, 20, 30],
    titleText: [90, 15, 25],
    subtitleText: [100, 50, 60],
    nameText: [140, 25, 35],
    examTitleText: [60, 10, 18],
    metaText: [120, 60, 70],
    accentLine: [180, 120, 40],
    badgeBgHex: 'rgba(120, 20, 30, 0.1)',
    badgeTextHex: '#78141E',
  },
  // 32. Monaco Blue
  monaco_blue: {
    id: 'monaco_blue',
    name: 'Monaco Blue',
    category: 'dark',
    desc: 'Biru Monaco & Emas Mediterania',
    bg: [8, 18, 40],
    isLightBg: false,
    borderOuter: [20, 45, 90],
    borderInner: [234, 179, 8],
    brandText: [96, 165, 250],
    titleText: [255, 255, 255],
    subtitleText: [191, 219, 254],
    nameText: [234, 179, 8],
    examTitleText: [255, 255, 255],
    metaText: [147, 197, 253],
    accentLine: [234, 179, 8],
    badgeBgHex: 'rgba(234, 179, 8, 0.2)',
    badgeTextHex: '#EAB308',
  },
  // 33. Olive Gold
  olive_gold: {
    id: 'olive_gold',
    name: 'Olive Gold',
    category: 'academic',
    desc: 'Hijau Zaitun Kuno & Emas Vintage',
    bg: [248, 248, 240],
    isLightBg: true,
    borderOuter: [65, 75, 45],
    borderInner: [180, 140, 50],
    brandText: [65, 75, 45],
    titleText: [45, 55, 30],
    subtitleText: [90, 100, 70],
    nameText: [65, 75, 45],
    examTitleText: [30, 40, 20],
    metaText: [90, 100, 70],
    accentLine: [180, 140, 50],
    badgeBgHex: 'rgba(65, 75, 45, 0.12)',
    badgeTextHex: '#414B2D',
  },
  // 34. Vintage Sepia
  vintage_sepia: {
    id: 'vintage_sepia',
    name: 'Vintage Sepia',
    category: 'academic',
    desc: 'Kertas Tua Sepia & Tinta Cokelat Espresso',
    bg: [242, 234, 218],
    isLightBg: true,
    borderOuter: [90, 55, 30],
    borderInner: [140, 90, 50],
    brandText: [90, 55, 30],
    titleText: [60, 35, 18],
    subtitleText: [110, 80, 55],
    nameText: [90, 55, 30],
    examTitleText: [40, 22, 10],
    metaText: [110, 80, 55],
    accentLine: [140, 90, 50],
    badgeBgHex: 'rgba(90, 55, 30, 0.15)',
    badgeTextHex: '#5A371E',
  },
  // 35. Glacier Ice
  glacier_ice: {
    id: 'glacier_ice',
    name: 'Glacier Ice',
    category: 'light',
    desc: 'Putih Gletser & Biru Kristal Es',
    bg: [246, 251, 255],
    isLightBg: true,
    borderOuter: [56, 140, 185],
    borderInner: [120, 195, 230],
    brandText: [25, 100, 145],
    titleText: [15, 60, 95],
    subtitleText: [70, 115, 145],
    nameText: [25, 110, 160],
    examTitleText: [10, 45, 75],
    metaText: [80, 125, 155],
    accentLine: [56, 140, 185],
    badgeBgHex: 'rgba(56, 140, 185, 0.12)',
    badgeTextHex: '#388CB9',
  },
  // 36. Copper Patina
  copper_patina: {
    id: 'copper_patina',
    name: 'Copper Patina',
    category: 'dark',
    desc: 'Hijau Tembaga Patina & Tembaga Bakar',
    bg: [12, 32, 34],
    isLightBg: false,
    borderOuter: [35, 75, 80],
    borderInner: [215, 110, 60],
    brandText: [90, 200, 185],
    titleText: [255, 255, 255],
    subtitleText: [160, 220, 210],
    nameText: [235, 140, 95],
    examTitleText: [255, 255, 255],
    metaText: [150, 210, 200],
    accentLine: [215, 110, 60],
    badgeBgHex: 'rgba(215, 110, 60, 0.2)',
    badgeTextHex: '#D76E3C',
  },
  // 37. Lavender Mist
  lavender_mist: {
    id: 'lavender_mist',
    name: 'Lavender Mist',
    category: 'light',
    desc: 'Kabut Lavender Lembut & Ungu Anggun',
    bg: [250, 248, 255],
    isLightBg: true,
    borderOuter: [130, 100, 180],
    borderInner: [180, 150, 220],
    brandText: [110, 75, 160],
    titleText: [70, 40, 110],
    subtitleText: [115, 95, 145],
    nameText: [110, 75, 160],
    examTitleText: [50, 25, 85],
    metaText: [120, 100, 150],
    accentLine: [150, 120, 195],
    badgeBgHex: 'rgba(130, 100, 180, 0.12)',
    badgeTextHex: '#8264B4',
  },
  // 38. Deep Espresso
  deep_espresso: {
    id: 'deep_espresso',
    name: 'Deep Espresso',
    category: 'dark',
    desc: 'Kopi Hitam Pekat & Emas Karamel',
    bg: [24, 14, 10],
    isLightBg: false,
    borderOuter: [55, 35, 25],
    borderInner: [217, 135, 45],
    brandText: [235, 170, 90],
    titleText: [255, 255, 255],
    subtitleText: [205, 180, 160],
    nameText: [240, 180, 100],
    examTitleText: [255, 255, 255],
    metaText: [190, 160, 140],
    accentLine: [217, 135, 45],
    badgeBgHex: 'rgba(217, 135, 45, 0.2)',
    badgeTextHex: '#D9872D',
  },
  // 39. Electric Violet
  electric_violet: {
    id: 'electric_violet',
    name: 'Electric Violet',
    category: 'modern',
    desc: 'Violet Pekat & Neon Magenta Halus',
    bg: [18, 10, 32],
    isLightBg: false,
    borderOuter: [50, 25, 85],
    borderInner: [217, 70, 239],
    brandText: [232, 121, 249],
    titleText: [255, 255, 255],
    subtitleText: [200, 175, 230],
    nameText: [232, 121, 249],
    examTitleText: [255, 255, 255],
    metaText: [185, 155, 220],
    accentLine: [217, 70, 239],
    badgeBgHex: 'rgba(217, 70, 239, 0.2)',
    badgeTextHex: '#D946EF',
  },
  // 40. Peacock Feather
  peacock_feather: {
    id: 'peacock_feather',
    name: 'Peacock Feather',
    category: 'dark',
    desc: 'Bulu Merak Biru Kehijauan & Emas Zamrud',
    bg: [6, 28, 38],
    isLightBg: false,
    borderOuter: [12, 65, 85],
    borderInner: [52, 211, 153],
    brandText: [45, 212, 191],
    titleText: [255, 255, 255],
    subtitleText: [167, 243, 208],
    nameText: [52, 211, 153],
    examTitleText: [255, 255, 255],
    metaText: [153, 246, 228],
    accentLine: [52, 211, 153],
    badgeBgHex: 'rgba(52, 211, 153, 0.18)',
    badgeTextHex: '#34D399',
  },
  // 41. Slate Rose
  slate_rose: {
    id: 'slate_rose',
    name: 'Slate Rose',
    category: 'modern',
    desc: 'Abu-abu Slate Dingin & Mawar Dusty',
    bg: [28, 32, 40],
    isLightBg: false,
    borderOuter: [50, 58, 72],
    borderInner: [244, 114, 182],
    brandText: [244, 114, 182],
    titleText: [255, 255, 255],
    subtitleText: [203, 213, 225],
    nameText: [249, 168, 212],
    examTitleText: [255, 255, 255],
    metaText: [148, 163, 184],
    accentLine: [244, 114, 182],
    badgeBgHex: 'rgba(244, 114, 182, 0.18)',
    badgeTextHex: '#F472B6',
  },
  // 42. Warm Vanilla
  warm_vanilla: {
    id: 'warm_vanilla',
    name: 'Warm Vanilla',
    category: 'light',
    desc: 'Krem Vanili Hangat & Karamel Tua',
    bg: [255, 252, 245],
    isLightBg: true,
    borderOuter: [210, 165, 110],
    borderInner: [175, 120, 60],
    brandText: [145, 95, 45],
    titleText: [95, 60, 25],
    subtitleText: [135, 105, 75],
    nameText: [160, 105, 45],
    examTitleText: [65, 40, 15],
    metaText: [140, 110, 80],
    accentLine: [195, 140, 80],
    badgeBgHex: 'rgba(175, 120, 60, 0.12)',
    badgeTextHex: '#AF783C',
  },
  // 43. Cyber Slate
  cyber_slate: {
    id: 'cyber_slate',
    name: 'Cyber Slate',
    category: 'modern',
    desc: 'Slate Gelap Cyber & Hijau Mint Elektrik',
    bg: [16, 24, 32],
    isLightBg: false,
    borderOuter: [35, 50, 65],
    borderInner: [74, 222, 128],
    brandText: [74, 222, 128],
    titleText: [255, 255, 255],
    subtitleText: [187, 247, 208],
    nameText: [74, 222, 128],
    examTitleText: [255, 255, 255],
    metaText: [148, 163, 184],
    accentLine: [74, 222, 128],
    badgeBgHex: 'rgba(74, 222, 128, 0.18)',
    badgeTextHex: '#4ADE80',
  },
  // 44. Bordeaux Wine
  bordeaux_wine: {
    id: 'bordeaux_wine',
    name: 'Bordeaux Wine',
    category: 'dark',
    desc: 'Merah Anggur Bordeaux & Lis Perak Murni',
    bg: [45, 8, 22],
    isLightBg: false,
    borderOuter: [78, 15, 38],
    borderInner: [226, 232, 240],
    brandText: [244, 63, 94],
    titleText: [255, 255, 255],
    subtitleText: [254, 205, 211],
    nameText: [253, 164, 175],
    examTitleText: [255, 255, 255],
    metaText: [226, 232, 240],
    accentLine: [226, 232, 240],
    badgeBgHex: 'rgba(226, 232, 240, 0.18)',
    badgeTextHex: '#E2E8F0',
  },
  // 45. Regal Gold White
  regal_gold_white: {
    id: 'regal_gold_white',
    name: 'Regal Gold White',
    category: 'academic',
    desc: 'Putih Bersih & Emas Murni 24K',
    bg: [255, 255, 255],
    isLightBg: true,
    borderOuter: [202, 138, 4],
    borderInner: [234, 179, 8],
    brandText: [161, 98, 7],
    titleText: [113, 63, 18],
    subtitleText: [133, 77, 14],
    nameText: [161, 98, 7],
    examTitleText: [66, 32, 6],
    metaText: [133, 77, 14],
    accentLine: [202, 138, 4],
    badgeBgHex: 'rgba(202, 138, 4, 0.12)',
    badgeTextHex: '#CA8A04',
  },
  // 46. Arctic Cyan
  arctic_cyan: {
    id: 'arctic_cyan',
    name: 'Arctic Cyan',
    category: 'light',
    desc: 'Putih Arktik & Biru Sian Jernih',
    bg: [248, 253, 255],
    isLightBg: true,
    borderOuter: [8, 145, 178],
    borderInner: [34, 211, 238],
    brandText: [14, 116, 144],
    titleText: [22, 78, 99],
    subtitleText: [71, 120, 140],
    nameText: [8, 145, 178],
    examTitleText: [15, 55, 70],
    metaText: [75, 125, 145],
    accentLine: [34, 211, 238],
    badgeBgHex: 'rgba(8, 145, 178, 0.12)',
    badgeTextHex: '#0891B2',
  },
  // 47. Cappuccino Cream
  cappuccino_cream: {
    id: 'cappuccino_cream',
    name: 'Cappuccino Cream',
    category: 'academic',
    desc: 'Cokelat Cappuccino Lembut & Busa Krim',
    bg: [250, 245, 240],
    isLightBg: true,
    borderOuter: [140, 105, 80],
    borderInner: [190, 150, 120],
    brandText: [110, 75, 55],
    titleText: [75, 48, 32],
    subtitleText: [120, 95, 75],
    nameText: [130, 90, 65],
    examTitleText: [55, 35, 22],
    metaText: [125, 100, 80],
    accentLine: [170, 130, 100],
    badgeBgHex: 'rgba(140, 105, 80, 0.12)',
    badgeTextHex: '#8C6950',
  },
  // 48. Emerald Silver
  emerald_silver: {
    id: 'emerald_silver',
    name: 'Emerald Silver',
    category: 'dark',
    desc: 'Hijau Zamrud Dalam & Perak Dingin',
    bg: [8, 36, 28],
    isLightBg: false,
    borderOuter: [15, 65, 50],
    borderInner: [203, 213, 225],
    brandText: [52, 211, 153],
    titleText: [255, 255, 255],
    subtitleText: [167, 243, 208],
    nameText: [241, 245, 249],
    examTitleText: [255, 255, 255],
    metaText: [203, 213, 225],
    accentLine: [203, 213, 225],
    badgeBgHex: 'rgba(203, 213, 225, 0.18)',
    badgeTextHex: '#CBD5E1',
  },
  // 49. Midnight Bronze
  midnight_bronze: {
    id: 'midnight_bronze',
    name: 'Midnight Bronze',
    category: 'dark',
    desc: 'Malam Hitam & Perunggu Antik Mulia',
    bg: [18, 16, 14],
    isLightBg: false,
    borderOuter: [45, 38, 32],
    borderInner: [217, 119, 6],
    brandText: [245, 158, 11],
    titleText: [255, 255, 255],
    subtitleText: [214, 185, 160],
    nameText: [251, 191, 36],
    examTitleText: [255, 255, 255],
    metaText: [195, 165, 140],
    accentLine: [217, 119, 6],
    badgeBgHex: 'rgba(217, 119, 6, 0.2)',
    badgeTextHex: '#F59E0B',
  },
  // 50. Sakura Blossom
  sakura_blossom: {
    id: 'sakura_blossom',
    name: 'Sakura Blossom',
    category: 'light',
    desc: 'Bunga Sakura Jepang & Abu Minimalis',
    bg: [255, 247, 250],
    isLightBg: true,
    borderOuter: [236, 72, 153],
    borderInner: [249, 168, 212],
    brandText: [219, 39, 119],
    titleText: [157, 23, 77],
    subtitleText: [190, 80, 130],
    nameText: [219, 39, 119],
    examTitleText: [131, 24, 67],
    metaText: [180, 95, 135],
    accentLine: [244, 114, 182],
    badgeBgHex: 'rgba(236, 72, 153, 0.12)',
    badgeTextHex: '#EC4899',
  },
  // 51. Cobalt Gold
  cobalt_gold: {
    id: 'cobalt_gold',
    name: 'Cobalt Gold',
    category: 'dark',
    desc: 'Biru Kobalt Royal & Emas Berkilau',
    bg: [10, 20, 50],
    isLightBg: false,
    borderOuter: [25, 45, 110],
    borderInner: [251, 191, 36],
    brandText: [96, 165, 250],
    titleText: [255, 255, 255],
    subtitleText: [191, 219, 254],
    nameText: [251, 191, 36],
    examTitleText: [255, 255, 255],
    metaText: [147, 197, 253],
    accentLine: [251, 191, 36],
    badgeBgHex: 'rgba(251, 191, 36, 0.2)',
    badgeTextHex: '#FBBF24',
  },
  // 52. Terracotta Cream
  terracotta_cream: {
    id: 'terracotta_cream',
    name: 'Terracotta Cream',
    category: 'academic',
    desc: 'Terakota Tanah Liat & Latar Krem Hangat',
    bg: [253, 248, 242],
    isLightBg: true,
    borderOuter: [194, 65, 12],
    borderInner: [234, 88, 12],
    brandText: [154, 52, 18],
    titleText: [124, 45, 18],
    subtitleText: [154, 80, 55],
    nameText: [194, 65, 12],
    examTitleText: [92, 35, 15],
    metaText: [150, 90, 70],
    accentLine: [234, 88, 12],
    badgeBgHex: 'rgba(194, 65, 12, 0.12)',
    badgeTextHex: '#C2410C',
  },
  // 53. Space Black
  space_black: {
    id: 'space_black',
    name: 'Space Black',
    category: 'modern',
    desc: 'Hitam Angkasa Pekat & Putih Bintang',
    bg: [5, 5, 8],
    isLightBg: false,
    borderOuter: [30, 30, 40],
    borderInner: [240, 240, 250],
    brandText: [200, 200, 220],
    titleText: [255, 255, 255],
    subtitleText: [150, 150, 170],
    nameText: [255, 255, 255],
    examTitleText: [255, 255, 255],
    metaText: [140, 140, 160],
    accentLine: [240, 240, 250],
    badgeBgHex: 'rgba(240, 240, 250, 0.15)',
    badgeTextHex: '#F0F0FA',
  },
  // 54. Forest Gold
  forest_gold: {
    id: 'forest_gold',
    name: 'Forest Gold',
    category: 'dark',
    desc: 'Hijau Pinus Malam & Emas Kuning Murni',
    bg: [6, 32, 20],
    isLightBg: false,
    borderOuter: [18, 70, 45],
    borderInner: [234, 179, 8],
    brandText: [74, 222, 128],
    titleText: [255, 255, 255],
    subtitleText: [187, 247, 208],
    nameText: [234, 179, 8],
    examTitleText: [255, 255, 255],
    metaText: [134, 239, 172],
    accentLine: [234, 179, 8],
    badgeBgHex: 'rgba(234, 179, 8, 0.2)',
    badgeTextHex: '#EAB308',
  },
  // 55. Plum Royalty
  plum_royalty: {
    id: 'plum_royalty',
    name: 'Plum Royalty',
    category: 'dark',
    desc: 'Ungu Plum Matang & Aksen Mawar Emas',
    bg: [40, 12, 38],
    isLightBg: false,
    borderOuter: [75, 25, 70],
    borderInner: [244, 114, 182],
    brandText: [244, 114, 182],
    titleText: [255, 255, 255],
    subtitleText: [240, 195, 225],
    nameText: [251, 191, 36],
    examTitleText: [255, 255, 255],
    metaText: [220, 175, 205],
    accentLine: [244, 114, 182],
    badgeBgHex: 'rgba(244, 114, 182, 0.2)',
    badgeTextHex: '#F472B6',
  },
  // 56. Dusty Denim
  dusty_denim: {
    id: 'dusty_denim',
    name: 'Dusty Denim',
    category: 'academic',
    desc: 'Biru Denim Pudar & Cokelat Kulit',
    bg: [245, 248, 252],
    isLightBg: true,
    borderOuter: [59, 90, 130],
    borderInner: [180, 110, 60],
    brandText: [45, 75, 110],
    titleText: [30, 52, 80],
    subtitleText: [80, 105, 135],
    nameText: [160, 95, 45],
    examTitleText: [25, 45, 70],
    metaText: [95, 115, 140],
    accentLine: [180, 110, 60],
    badgeBgHex: 'rgba(59, 90, 130, 0.12)',
    badgeTextHex: '#3B5A82',
  },
  // 57. Pearl White
  pearl_white: {
    id: 'pearl_white',
    name: 'Pearl White',
    category: 'light',
    desc: 'Putih Mutiara Berkilau & Lis Emas Halus',
    bg: [254, 254, 254],
    isLightBg: true,
    borderOuter: [220, 190, 140],
    borderInner: [210, 165, 90],
    brandText: [160, 125, 60],
    titleText: [80, 65, 40],
    subtitleText: [130, 115, 90],
    nameText: [170, 130, 55],
    examTitleText: [60, 48, 30],
    metaText: [140, 125, 100],
    accentLine: [210, 165, 90],
    badgeBgHex: 'rgba(210, 165, 90, 0.15)',
    badgeTextHex: '#D2A55A',
  },
  // 58. Graphite Lime
  graphite_lime: {
    id: 'graphite_lime',
    name: 'Graphite Lime',
    category: 'modern',
    desc: 'Grafit Hitam Doff & Jeruk Nipis Segar',
    bg: [22, 26, 30],
    isLightBg: false,
    borderOuter: [45, 52, 60],
    borderInner: [163, 230, 53],
    brandText: [163, 230, 53],
    titleText: [255, 255, 255],
    subtitleText: [195, 210, 175],
    nameText: [163, 230, 53],
    examTitleText: [255, 255, 255],
    metaText: [160, 175, 185],
    accentLine: [163, 230, 53],
    badgeBgHex: 'rgba(163, 230, 53, 0.18)',
    badgeTextHex: '#A3E635',
  },
  // 59. Moroccan Mint
  moroccan_mint: {
    id: 'moroccan_mint',
    name: 'Moroccan Mint',
    category: 'light',
    desc: 'Teh Mint Maroko & Emas Kuningan',
    bg: [246, 252, 248],
    isLightBg: true,
    borderOuter: [16, 140, 95],
    borderInner: [200, 150, 45],
    brandText: [12, 115, 78],
    titleText: [8, 75, 50],
    subtitleText: [65, 120, 95],
    nameText: [175, 130, 35],
    examTitleText: [6, 60, 40],
    metaText: [80, 125, 105],
    accentLine: [200, 150, 45],
    badgeBgHex: 'rgba(16, 140, 95, 0.12)',
    badgeTextHex: '#108C5F',
  },
  // 60. Sunset Coral
  sunset_coral: {
    id: 'sunset_coral',
    name: 'Sunset Coral',
    category: 'modern',
    desc: 'Koral Senja Memukau & Jingga Halus',
    bg: [35, 15, 18],
    isLightBg: false,
    borderOuter: [70, 30, 35],
    borderInner: [251, 146, 60],
    brandText: [251, 113, 133],
    titleText: [255, 255, 255],
    subtitleText: [254, 205, 211],
    nameText: [251, 146, 60],
    examTitleText: [255, 255, 255],
    metaText: [245, 175, 185],
    accentLine: [251, 146, 60],
    badgeBgHex: 'rgba(251, 146, 60, 0.2)',
    badgeTextHex: '#FB923C',
  },
  // 61. Deep Ocean Gold
  deep_ocean_gold: {
    id: 'deep_ocean_gold',
    name: 'Deep Ocean Gold',
    category: 'dark',
    desc: 'Palung Samudra & Emas Bahari',
    bg: [4, 15, 30],
    isLightBg: false,
    borderOuter: [12, 35, 68],
    borderInner: [234, 179, 8],
    brandText: [56, 189, 248],
    titleText: [255, 255, 255],
    subtitleText: [186, 230, 253],
    nameText: [234, 179, 8],
    examTitleText: [255, 255, 255],
    metaText: [125, 211, 252],
    accentLine: [234, 179, 8],
    badgeBgHex: 'rgba(234, 179, 8, 0.2)',
    badgeTextHex: '#EAB308',
  },
  // 62. Sandstone Academic
  sandstone_academic: {
    id: 'sandstone_academic',
    name: 'Sandstone Academic',
    category: 'academic',
    desc: 'Batu Pasir Candi & Cokelat Kuno',
    bg: [247, 243, 234],
    isLightBg: true,
    borderOuter: [140, 115, 85],
    borderInner: [185, 145, 95],
    brandText: [110, 85, 60],
    titleText: [75, 55, 35],
    subtitleText: [125, 105, 85],
    nameText: [120, 75, 35],
    examTitleText: [55, 40, 25],
    metaText: [130, 110, 90],
    accentLine: [185, 145, 95],
    badgeBgHex: 'rgba(140, 115, 85, 0.12)',
    badgeTextHex: '#8C7355',
  },
  // 63. Imperial Jade
  imperial_jade: {
    id: 'imperial_jade',
    name: 'Imperial Jade',
    category: 'dark',
    desc: 'Batu Giok Kekaisaran & Emas Dinasti',
    bg: [6, 40, 32],
    isLightBg: false,
    borderOuter: [16, 85, 68],
    borderInner: [251, 191, 36],
    brandText: [52, 211, 153],
    titleText: [255, 255, 255],
    subtitleText: [167, 243, 208],
    nameText: [251, 191, 36],
    examTitleText: [255, 255, 255],
    metaText: [110, 231, 183],
    accentLine: [251, 191, 36],
    badgeBgHex: 'rgba(251, 191, 36, 0.2)',
    badgeTextHex: '#FBBF24',
  },
  // 64. Silver Minimalist
  silver_minimalist: {
    id: 'silver_minimalist',
    name: 'Silver Minimalist',
    category: 'light',
    desc: 'Perak Monokrom & Abu-abu Halus Bersih',
    bg: [252, 252, 253],
    isLightBg: true,
    borderOuter: [100, 116, 139],
    borderInner: [148, 163, 184],
    brandText: [71, 85, 105],
    titleText: [30, 41, 59],
    subtitleText: [100, 116, 139],
    nameText: [51, 65, 85],
    examTitleText: [15, 23, 42],
    metaText: [100, 116, 139],
    accentLine: [148, 163, 184],
    badgeBgHex: 'rgba(100, 116, 139, 0.12)',
    badgeTextHex: '#64748B',
  },
  // 65. Mahogany Classic
  mahogany_classic: {
    id: 'mahogany_classic',
    name: 'Mahogany Classic',
    category: 'academic',
    desc: 'Kayu Mahoni Tua & Kuningan Tradisional',
    bg: [253, 249, 245],
    isLightBg: true,
    borderOuter: [105, 45, 25],
    borderInner: [195, 135, 45],
    brandText: [90, 35, 18],
    titleText: [65, 25, 12],
    subtitleText: [115, 65, 45],
    nameText: [125, 40, 20],
    examTitleText: [50, 18, 8],
    metaText: [120, 75, 55],
    accentLine: [195, 135, 45],
    badgeBgHex: 'rgba(105, 45, 25, 0.12)',
    badgeTextHex: '#692D19',
  },
  // 66. Alpine Green
  alpine_green: {
    id: 'alpine_green',
    name: 'Alpine Green',
    category: 'light',
    desc: 'Hijau Pegunungan Alpen & Putih Salju',
    bg: [247, 253, 250],
    isLightBg: true,
    borderOuter: [21, 128, 61],
    borderInner: [74, 222, 128],
    brandText: [22, 101, 52],
    titleText: [20, 83, 45],
    subtitleText: [60, 110, 80],
    nameText: [21, 128, 61],
    examTitleText: [15, 60, 35],
    metaText: [75, 120, 95],
    accentLine: [34, 197, 94],
    badgeBgHex: 'rgba(21, 128, 61, 0.12)',
    badgeTextHex: '#15803D',
  },
  // 67. Twilight Indigo
  twilight_indigo: {
    id: 'twilight_indigo',
    name: 'Twilight Indigo',
    category: 'dark',
    desc: 'Indigo Senja Hari & Aksen Oranye Senja',
    bg: [20, 15, 45],
    isLightBg: false,
    borderOuter: [45, 35, 95],
    borderInner: [249, 115, 22],
    brandText: [165, 180, 252],
    titleText: [255, 255, 255],
    subtitleText: [199, 210, 254],
    nameText: [249, 115, 22],
    examTitleText: [255, 255, 255],
    metaText: [165, 180, 252],
    accentLine: [249, 115, 22],
    badgeBgHex: 'rgba(249, 115, 22, 0.2)',
    badgeTextHex: '#F97316',
  },
  // 68. Quartz Rose
  quartz_rose: {
    id: 'quartz_rose',
    name: 'Quartz Rose',
    category: 'light',
    desc: 'Kristal Kuarsa Mawar & Emas Putih',
    bg: [255, 250, 252],
    isLightBg: true,
    borderOuter: [219, 115, 145],
    borderInner: [240, 170, 190],
    brandText: [180, 80, 110],
    titleText: [120, 45, 70],
    subtitleText: [145, 95, 115],
    nameText: [195, 75, 110],
    examTitleText: [80, 30, 50],
    metaText: [150, 105, 125],
    accentLine: [225, 130, 160],
    badgeBgHex: 'rgba(219, 115, 145, 0.15)',
    badgeTextHex: '#DB7391',
  },
  // 69. Vintage Blueprint
  vintage_blueprint: {
    id: 'vintage_blueprint',
    name: 'Vintage Blueprint',
    category: 'academic',
    desc: 'Biru Cetak Biru Teknik & Lis Garis Putih',
    bg: [15, 45, 85],
    isLightBg: false,
    borderOuter: [30, 75, 135],
    borderInner: [220, 235, 255],
    brandText: [147, 197, 253],
    titleText: [255, 255, 255],
    subtitleText: [191, 219, 254],
    nameText: [255, 255, 255],
    examTitleText: [255, 255, 255],
    metaText: [147, 197, 253],
    accentLine: [220, 235, 255],
    badgeBgHex: 'rgba(220, 235, 255, 0.18)',
    badgeTextHex: '#BFDBFE',
  },
  // 70. Platinum Prestige
  platinum_prestige: {
    id: 'platinum_prestige',
    name: 'Platinum Prestige',
    category: 'modern',
    desc: 'Latar Perak Platinum & Logam Emas Halus',
    bg: [245, 247, 250],
    isLightBg: true,
    borderOuter: [148, 163, 184],
    borderInner: [217, 119, 6],
    brandText: [71, 85, 105],
    titleText: [30, 41, 59],
    subtitleText: [100, 116, 139],
    nameText: [180, 83, 9],
    examTitleText: [15, 23, 42],
    metaText: [100, 116, 139],
    accentLine: [217, 119, 6],
    badgeBgHex: 'rgba(217, 119, 6, 0.15)',
    badgeTextHex: '#D97706',
  },
};

export const defaultCertificateConfig: CertificateConfig = {
  institutionName: 'Examigo Academy',
  certificateTitle: 'SERTIFIKAT KELULUSAN',
  subtitle: 'Dengan ini menerangkan bahwa peserta ujian:',
  completionText: 'Telah menyelesaikan rangkaian evaluasi dan dinyatakan LULUS dalam ujian:',
  logoUrl: null,
  theme: 'emerald_gold',
  borderStyle: 'double_gold',
  fontFamily: 'times',
  watermarkStyle: 'none',
  signer1: {
    name: 'Direktur Pendidikan',
    title: 'Kepala Lembaga / Sekolah',
    signatureUrl: null,
    scale: 1.0,
    yOffset: 0,
    xOffset: 0,
    colorMode: 'match_text',
  },
  signer2: {
    name: 'Ketua Tim Evaluasi',
    title: 'Koordinator Ujian',
    signatureUrl: null,
    scale: 1.0,
    yOffset: 0,
    xOffset: 0,
    colorMode: 'match_text',
  },
  showScore: true,
  showPassingScore: true,
  showDate: true,
  showCertificateId: true,
  showQrCode: true,
  enableCertificate: true,
  customNotes: 'Sertifikat ini sah dan diterbitkan secara digital oleh sistem Examigo.',
};

/**
 * Tints a signature image to match a given RGB color, cleaning background pixels
 */
export async function tintSignatureImage(
  dataUrl: string, 
  rgbColor: [number, number, number]
): Promise<string> {
  if (!dataUrl || !dataUrl.startsWith('data:image')) return dataUrl;
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(dataUrl);

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const d = imgData.data;

        for (let i = 0; i < d.length; i += 4) {
          const r = d[i];
          const g = d[i + 1];
          const b = d[i + 2];
          const a = d[i + 3];

          if (a > 10) {
            const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
            if (luminance > 220) {
              d[i + 3] = 0;
            } else {
              d[i] = rgbColor[0];
              d[i + 1] = rgbColor[1];
              d[i + 2] = rgbColor[2];
              if (luminance > 160) {
                d[i + 3] = Math.round(a * ((220 - luminance) / 60));
              }
            }
          }
        }
        ctx.putImageData(imgData, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } catch (err) {
        console.warn('tintSignatureImage error:', err);
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

/**
 * Generates and downloads or returns a high quality PDF certificate
 */
export async function generateCertificatePdf(
  config: Partial<CertificateConfig>,
  data: StudentCertificateData,
  download = true
): Promise<jsPDF> {
  const merged: CertificateConfig = { ...defaultCertificateConfig, ...config };
  
  // Lookup theme from 20 themes (fallback to emerald_gold)
  const themeKey = (merged.theme in CERTIFICATE_THEMES)
    ? merged.theme
    : (merged.theme === 'emerald' ? 'emerald_gold' : merged.theme === 'navy' ? 'royal_navy' : merged.theme === 'classic' ? 'academic_classic' : merged.theme === 'crimson' ? 'crimson_luxury' : 'emerald_gold');
    
  const theme = CERTIFICATE_THEMES[themeKey] || CERTIFICATE_THEMES.emerald_gold;
  const fontDef = CERTIFICATE_FONTS[merged.fontFamily] || CERTIFICATE_FONTS.times;
  const activeFont = fontDef ? fontDef.jsPdfFont : 'times';

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 297;
  const pageHeight = 210;
  const centerX = pageWidth / 2;
  const centerY = pageHeight / 2;

  // 1. Background Fill
  doc.setFillColor(...theme.bg);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // 2. Pattern Background / Watermark
  if (merged.watermarkStyle === 'center_logo' && merged.logoUrl && merged.logoUrl.startsWith('data:image')) {
    try {
      // Background large watermark logo in center
      // Set GState opacity if available, or draw softly
      const watermarkW = 75;
      const watermarkH = 55;
      doc.saveGraphicsState();
      // @ts-ignore (jsPDF setGState support)
      if (typeof doc.setGState === 'function') {
        // @ts-ignore
        doc.setGState(new doc.GState({ opacity: 0.12 }));
      }
      doc.addImage(merged.logoUrl, 'PNG', centerX - watermarkW / 2, centerY - watermarkH / 2 - 5, watermarkW, watermarkH, undefined, 'FAST');
      doc.restoreGraphicsState();
    } catch (e) {
      console.warn('Could not draw watermark logo:', e);
    }
  } else if (merged.watermarkStyle === 'security_seal') {
    // Elegant Security Medal / Seal in center
    doc.saveGraphicsState();
    // @ts-ignore
    if (typeof doc.setGState === 'function') {
      // @ts-ignore
      doc.setGState(new doc.GState({ opacity: 0.08 }));
    }
    doc.setDrawColor(...theme.borderInner);
    doc.setLineWidth(1);
    doc.circle(centerX, centerY - 5, 42);
    doc.circle(centerX, centerY - 5, 38);
    doc.circle(centerX, centerY - 5, 34);
    doc.setFont(activeFont, 'bold');
    doc.setFontSize(14);
    doc.setTextColor(...theme.borderInner);
    doc.text('OFFICIAL VERIFIED CERTIFICATE', centerX, centerY - 8, { align: 'center' });
    doc.text('EXAMIGO SECURITY SEAL', centerX, centerY, { align: 'center' });
    doc.restoreGraphicsState();
  } else if (merged.watermarkStyle === 'guilloche_frame') {
    // Guilloche security waves
    doc.saveGraphicsState();
    // @ts-ignore
    if (typeof doc.setGState === 'function') {
      // @ts-ignore
      doc.setGState(new doc.GState({ opacity: 0.15 }));
    }
    doc.setDrawColor(...theme.borderInner);
    doc.setLineWidth(0.2);
    for (let offset = 0; offset < 6; offset += 1.5) {
      doc.rect(14 + offset, 14 + offset, pageWidth - 28 - offset * 2, pageHeight - 28 - offset * 2);
    }
    doc.restoreGraphicsState();
  }

  // 3. Borders (20 Styles)
  const borderW = pageWidth;
  const borderH = pageHeight;
  
  switch (merged.borderStyle) {
    case 'modern_clean':
      doc.setDrawColor(...theme.borderInner);
      doc.setLineWidth(1.5);
      doc.rect(10, 10, borderW - 20, borderH - 20);
      doc.setLineWidth(3);
      doc.setDrawColor(...theme.borderOuter);
      doc.line(7, 7, 24, 7); doc.line(7, 7, 7, 24);
      doc.line(borderW - 24, 7, borderW - 7, 7); doc.line(borderW - 7, 7, borderW - 7, 24);
      doc.line(7, borderH - 7, 24, borderH - 7); doc.line(7, borderH - 24, 7, borderH - 7);
      doc.line(borderW - 24, borderH - 7, borderW - 7, borderH - 7); doc.line(borderW - 7, borderH - 24, borderW - 7, borderH - 7);
      doc.setDrawColor(...theme.accentLine);
      doc.setLineWidth(0.5);
      doc.line(50, 48, borderW - 50, 48);
      break;

    case 'ornate':
      doc.setDrawColor(...theme.borderOuter);
      doc.setLineWidth(3);
      doc.rect(9, 9, borderW - 18, borderH - 18);
      doc.setDrawColor(...theme.borderInner);
      doc.setLineWidth(1.5);
      doc.rect(12, 12, borderW - 24, borderH - 24);
      doc.setLineWidth(0.5);
      doc.rect(14, 14, borderW - 28, borderH - 28);
      doc.setDrawColor(...theme.accentLine);
      doc.line(40, 46, borderW - 40, 46);
      doc.line(40, 162, borderW - 40, 162);
      break;

    case 'royal_crest':
      doc.setDrawColor(...theme.borderOuter);
      doc.setLineWidth(2.2);
      doc.rect(8, 8, borderW - 16, borderH - 16);
      doc.setDrawColor(...theme.borderInner);
      doc.setLineWidth(1);
      doc.rect(11, 11, borderW - 22, borderH - 22);
      doc.setFillColor(...theme.borderInner);
      doc.circle(centerX, 11, 2.5, 'F');
      doc.circle(centerX - 8, 11, 1.5, 'F');
      doc.circle(centerX + 8, 11, 1.5, 'F');
      break;

    case 'geometric_art_deco':
      doc.setDrawColor(...theme.borderOuter);
      doc.setLineWidth(1.8);
      doc.rect(8, 8, borderW - 16, borderH - 16);
      doc.rect(12, 12, borderW - 24, borderH - 24);
      doc.setDrawColor(...theme.borderInner);
      doc.setLineWidth(0.8);
      for (let s = 0; s < 3; s++) {
        const d = s * 2.5;
        doc.rect(8 + d, 8 + d, 12 - d, 12 - d);
        doc.rect(borderW - 20 + d, 8 + d, 12 - d, 12 - d);
        doc.rect(8 + d, borderH - 20 + d, 12 - d, 12 - d);
        doc.rect(borderW - 20 + d, borderH - 20 + d, 12 - d, 12 - d);
      }
      break;

    case 'diploma_traditional':
      doc.setDrawColor(...theme.borderOuter);
      doc.setLineWidth(4);
      doc.rect(8, 8, borderW - 16, borderH - 16);
      doc.setDrawColor(...theme.borderInner);
      doc.setLineWidth(0.8);
      doc.rect(13, 13, borderW - 26, borderH - 26);
      doc.rect(15, 15, borderW - 30, borderH - 30);
      break;

    case 'tech_bracket':
      doc.setDrawColor(...theme.borderOuter);
      doc.setLineWidth(2.5);
      const brLen = 28;
      doc.line(10, 10, 10 + brLen, 10); doc.line(10, 10, 10, 10 + brLen);
      doc.line(borderW - 10, 10, borderW - 10 - brLen, 10); doc.line(borderW - 10, 10, borderW - 10, 10 + brLen);
      doc.line(10, borderH - 10, 10 + brLen, borderH - 10); doc.line(10, borderH - 10, 10, borderH - 10 - brLen);
      doc.line(borderW - 10, borderH - 10, borderW - 10 - brLen, borderH - 10); doc.line(borderW - 10, borderH - 10, borderW - 10, borderH - 10 - brLen);
      doc.setDrawColor(...theme.borderInner);
      doc.setLineWidth(0.6);
      doc.rect(16, 16, borderW - 32, borderH - 32);
      break;

    case 'minimal_hairline':
      doc.setDrawColor(...theme.borderInner);
      doc.setLineWidth(0.4);
      doc.rect(14, 14, borderW - 28, borderH - 28);
      break;

    case 'vintage_scroll':
      doc.setDrawColor(...theme.borderOuter);
      doc.setLineWidth(2);
      doc.rect(9, 9, borderW - 18, borderH - 18);
      doc.setDrawColor(...theme.borderInner);
      doc.setLineWidth(0.8);
      doc.roundedRect(12, 12, borderW - 24, borderH - 24, 4, 4);
      break;

    case 'bold_executive':
      doc.setDrawColor(...theme.borderOuter);
      doc.setLineWidth(4.5);
      doc.rect(7, 7, borderW - 14, borderH - 14);
      doc.setDrawColor(...theme.borderInner);
      doc.setLineWidth(1);
      doc.rect(11, 11, borderW - 22, borderH - 22);
      break;

    case 'diamond_corners':
      doc.setDrawColor(...theme.borderOuter);
      doc.setLineWidth(2);
      doc.rect(9, 9, borderW - 18, borderH - 18);
      doc.setDrawColor(...theme.borderInner);
      doc.setLineWidth(1);
      doc.rect(13, 13, borderW - 26, borderH - 26);
      doc.setFillColor(...theme.borderInner);
      [[11, 11], [borderW - 11, 11], [11, borderH - 11], [borderW - 11, borderH - 11]].forEach(([x, y]) => {
        doc.circle(x, y, 2.2, 'F');
      });
      break;

    case 'triple_line':
      doc.setDrawColor(...theme.borderOuter);
      doc.setLineWidth(1.6);
      doc.rect(8, 8, borderW - 16, borderH - 16);
      doc.setDrawColor(...theme.borderInner);
      doc.setLineWidth(0.6);
      doc.rect(11, 11, borderW - 22, borderH - 22);
      doc.rect(13.5, 13.5, borderW - 27, borderH - 27);
      break;

    case 'classic_dashed':
      doc.setDrawColor(...theme.borderOuter);
      doc.setLineWidth(2);
      doc.rect(8, 8, borderW - 16, borderH - 16);
      doc.setDrawColor(...theme.borderInner);
      doc.setLineWidth(0.8);
      doc.rect(12, 12, borderW - 24, borderH - 24);
      break;

    case 'floating_border':
      doc.setDrawColor(...theme.borderOuter);
      doc.setLineWidth(2.5);
      doc.line(16, 12, borderW - 16, 12);
      doc.line(16, borderH - 12, borderW - 16, borderH - 12);
      doc.setDrawColor(...theme.borderInner);
      doc.setLineWidth(1);
      doc.line(12, 16, 12, borderH - 16);
      doc.line(borderW - 12, 16, borderW - 12, borderH - 16);
      break;

    case 'arch_header':
      doc.setDrawColor(...theme.borderOuter);
      doc.setLineWidth(2);
      doc.rect(9, 9, borderW - 18, borderH - 18);
      doc.setDrawColor(...theme.borderInner);
      doc.setLineWidth(1);
      doc.line(14, 38, borderW - 14, 38);
      doc.line(14, borderH - 38, borderW - 14, borderH - 38);
      break;

    case 'corner_dots':
      doc.setDrawColor(...theme.borderOuter);
      doc.setLineWidth(1.5);
      doc.rect(10, 10, borderW - 20, borderH - 20);
      doc.setFillColor(...theme.borderInner);
      [[10, 10], [borderW - 10, 10], [10, borderH - 10], [borderW - 10, borderH - 10]].forEach(([cx, cy]) => {
        doc.circle(cx, cy, 2.5, 'F');
      });
      break;

    case 'notary_seal':
      doc.setDrawColor(...theme.borderOuter);
      doc.setLineWidth(3);
      doc.rect(8, 8, borderW - 16, borderH - 16);
      doc.setDrawColor(...theme.borderInner);
      doc.setLineWidth(0.8);
      doc.rect(11, 11, borderW - 22, borderH - 22);
      doc.rect(13, 13, borderW - 26, borderH - 26);
      break;

    case 'islamic_geometric':
      doc.setDrawColor(...theme.borderOuter);
      doc.setLineWidth(2);
      doc.rect(9, 9, borderW - 18, borderH - 18);
      doc.setDrawColor(...theme.borderInner);
      doc.setLineWidth(1);
      doc.rect(13, 13, borderW - 26, borderH - 26);
      doc.setFillColor(...theme.borderInner);
      [[11, 11], [borderW - 11, 11], [11, borderH - 11], [borderW - 11, borderH - 11]].forEach(([x, y]) => {
        doc.circle(x, y, 2, 'F');
      });
      break;

    case 'academic_laurel':
      doc.setDrawColor(...theme.borderOuter);
      doc.setLineWidth(2.2);
      doc.rect(8, 8, borderW - 16, borderH - 16);
      doc.setDrawColor(...theme.borderInner);
      doc.setLineWidth(1);
      doc.rect(12, 12, borderW - 24, borderH - 24);
      break;

    case 'modern_gradient':
      doc.setDrawColor(...theme.borderOuter);
      doc.setLineWidth(3.5);
      doc.line(8, 8, borderW - 8, 8);
      doc.line(8, borderH - 8, borderW - 8, borderH - 8);
      doc.setDrawColor(...theme.borderInner);
      doc.setLineWidth(1.2);
      doc.line(8, 8, 8, borderH - 8);
      doc.line(borderW - 8, 8, borderW - 8, borderH - 8);
      break;

    case 'double_gold':
    default:
      doc.setDrawColor(...theme.borderOuter);
      doc.setLineWidth(2.5);
      doc.rect(8, 8, borderW - 16, borderH - 16);
      doc.setDrawColor(...theme.borderInner);
      doc.setLineWidth(1);
      doc.rect(11, 11, borderW - 22, borderH - 22);
      doc.setFillColor(...theme.borderInner);
      doc.rect(9.5, 9.5, 3, 3, 'F');
      doc.rect(borderW - 12.5, 9.5, 3, 3, 'F');
      doc.rect(9.5, borderH - 12.5, 3, 3, 'F');
      doc.rect(borderW - 12.5, borderH - 12.5, 3, 3, 'F');
      doc.setDrawColor(...theme.accentLine);
      doc.setLineWidth(0.75);
      doc.line(35, 46, borderW - 35, 46);
      doc.line(35, 162, borderW - 35, 162);
      break;
  }

  // 4. Logo Header
  let headerStartY = 24;
  if (merged.logoUrl && merged.logoUrl.startsWith('data:image')) {
    try {
      doc.addImage(merged.logoUrl, 'PNG', centerX - 10, 15, 20, 15, undefined, 'FAST');
      headerStartY = 33;
    } catch (e) {
      console.warn('Could not render logo in certificate:', e);
    }
  }

  // 5. Institution / Brand Header
  doc.setTextColor(...theme.brandText);
  doc.setFont(activeFont, 'bold');
  doc.setFontSize(13);
  doc.text((merged.institutionName || 'EXAMIGO ACADEMY').toUpperCase(), centerX, headerStartY, { align: 'center' });

  // 6. Main Certificate Title
  doc.setTextColor(...theme.titleText);
  doc.setFont(activeFont, 'bold');
  doc.setFontSize(26);
  doc.text(merged.certificateTitle || 'SERTIFIKAT KELULUSAN', centerX, headerStartY + 14, { align: 'center' });

  // 7. Subtitle (Diberikan kepada...)
  doc.setTextColor(...theme.subtitleText);
  doc.setFont(activeFont, 'normal');
  doc.setFontSize(12);
  doc.text(merged.subtitle || 'Dengan ini menerangkan bahwa peserta ujian:', centerX, headerStartY + 27, { align: 'center' });

  // 8. Student Name
  doc.setTextColor(...theme.nameText);
  doc.setFont(activeFont, 'bold');
  doc.setFontSize(24);
  const displayName = (data.studentName || 'NAMA LENGKAP SISWA').toUpperCase();
  doc.text(displayName, centerX, headerStartY + 42, { align: 'center' });

  // Underline under name
  doc.setDrawColor(...theme.accentLine);
  doc.setLineWidth(0.5);
  const nameWidth = doc.getTextWidth(displayName);
  const linePad = Math.min(nameWidth / 2 + 10, 85);
  doc.line(centerX - linePad, headerStartY + 45, centerX + linePad, headerStartY + 45);

  // 9. Completion Text
  doc.setTextColor(...theme.subtitleText);
  doc.setFont(activeFont, 'normal');
  doc.setFontSize(11);
  doc.text(merged.completionText || 'Telah menyelesaikan rangkaian evaluasi dan dinyatakan LULUS dalam ujian:', centerX, headerStartY + 56, { align: 'center' });

  // 10. Exam Title
  doc.setTextColor(...theme.examTitleText);
  doc.setFont(activeFont, 'bold');
  doc.setFontSize(17);
  doc.text(data.examTitle || 'Evaluasi Kompetensi Mandiri', centerX, headerStartY + 66, { align: 'center' });

  // 11. Exam Metadata / Score line
  const metaItems: string[] = [];
  if (data.examCode) metaItems.push(`Kode Akses: ${data.examCode}`);
  if (merged.showScore && data.score !== undefined) metaItems.push(`Nilai Akhir: ${data.score}`);
  if (merged.showPassingScore && data.passingScore !== undefined) metaItems.push(`Passing Score: ${data.passingScore}`);
  if (merged.showDate) {
    const formattedDate = data.completionDate || new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    metaItems.push(`Tanggal: ${formattedDate}`);
  }

  if (metaItems.length > 0) {
    doc.setTextColor(...theme.metaText);
    doc.setFont(activeFont, 'normal');
    doc.setFontSize(9.5);
    doc.text(metaItems.join('   |   '), centerX, headerStartY + 77, { align: 'center' });
  }

  // 12. Signatures
  const signerY = 172;
  const signerLeftX = 65;
  const signerRightX = pageWidth - 65;

  // Signer 1 (Left)
  if (merged.signer1.signatureUrl && merged.signer1.signatureUrl.startsWith('data:image')) {
    try {
      const scale1 = Math.max(0.3, Math.min(2.5, merged.signer1.scale ?? 1.0));
      const yOff1 = (merged.signer1.yOffset ?? 0) * 0.35; // convert pixel offset to mm
      const xOff1 = (merged.signer1.xOffset ?? 0) * 0.35;
      const baseW = 36;
      const baseH = 16;
      const sigW1 = baseW * scale1;
      const sigH1 = baseH * scale1;

      const colorMode1 = merged.signer1.colorMode ?? 'match_text';
      let sigDataUrl1 = merged.signer1.signatureUrl;
      if (colorMode1 === 'match_text') {
        sigDataUrl1 = await tintSignatureImage(sigDataUrl1, theme.titleText);
      } else if (colorMode1 === 'theme_accent') {
        sigDataUrl1 = await tintSignatureImage(sigDataUrl1, theme.borderInner);
      }

      doc.addImage(
        sigDataUrl1, 
        'PNG', 
        (signerLeftX - sigW1 / 2) + xOff1, 
        (signerY - 4 - sigH1) + yOff1, 
        sigW1, 
        sigH1, 
        undefined, 
        'FAST'
      );
    } catch (e) {
      console.warn('Could not render signature 1 image:', e);
    }
  }
  doc.setDrawColor(...theme.metaText);
  doc.setLineWidth(0.5);
  doc.line(signerLeftX - 30, signerY - 4, signerLeftX + 30, signerY - 4);

  doc.setTextColor(...theme.titleText);
  doc.setFont(activeFont, 'bold');
  doc.setFontSize(10.5);
  doc.text(merged.signer1.name, signerLeftX, signerY, { align: 'center' });

  doc.setTextColor(...theme.metaText);
  doc.setFont(activeFont, 'normal');
  doc.setFontSize(9);
  doc.text(merged.signer1.title, signerLeftX, signerY + 5, { align: 'center' });

  // Signer 2 (Right)
  if (merged.signer2.signatureUrl && merged.signer2.signatureUrl.startsWith('data:image')) {
    try {
      const scale2 = Math.max(0.3, Math.min(2.5, merged.signer2.scale ?? 1.0));
      const yOff2 = (merged.signer2.yOffset ?? 0) * 0.35;
      const xOff2 = (merged.signer2.xOffset ?? 0) * 0.35;
      const baseW = 36;
      const baseH = 16;
      const sigW2 = baseW * scale2;
      const sigH2 = baseH * scale2;

      const colorMode2 = merged.signer2.colorMode ?? 'match_text';
      let sigDataUrl2 = merged.signer2.signatureUrl;
      if (colorMode2 === 'match_text') {
        sigDataUrl2 = await tintSignatureImage(sigDataUrl2, theme.titleText);
      } else if (colorMode2 === 'theme_accent') {
        sigDataUrl2 = await tintSignatureImage(sigDataUrl2, theme.borderInner);
      }

      doc.addImage(
        sigDataUrl2, 
        'PNG', 
        (signerRightX - sigW2 / 2) + xOff2, 
        (signerY - 4 - sigH2) + yOff2, 
        sigW2, 
        sigH2, 
        undefined, 
        'FAST'
      );
    } catch (e) {
      console.warn('Could not render signature 2 image:', e);
    }
  }
  doc.line(signerRightX - 30, signerY - 4, signerRightX + 30, signerY - 4);

  doc.setTextColor(...theme.titleText);
  doc.setFont(activeFont, 'bold');
  doc.setFontSize(10.5);
  doc.text(merged.signer2.name, signerRightX, signerY, { align: 'center' });

  doc.setTextColor(...theme.metaText);
  doc.setFont(activeFont, 'normal');
  doc.setFontSize(9);
  doc.text(merged.signer2.title, signerRightX, signerY + 5, { align: 'center' });

  // 13. Direct Verification QR Code & Serial
  const certId = data.certificateId || `EXM-${data.examCode || 'CERT'}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://examigo.id';
  const verifyUrl = `${origin}/verify/${certId}`;

  if (merged.showQrCode) {
    try {
      const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
        margin: 1,
        width: 100,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
      doc.addImage(qrDataUrl, 'PNG', centerX - 11, signerY - 14, 22, 22, undefined, 'FAST');
    } catch (e) {
      console.warn('Failed to generate certificate QR Code:', e);
    }
  }

  // Certificate ID and Footer Notes
  if (merged.showCertificateId) {
    doc.setTextColor(...theme.metaText);
    doc.setFont('courier', 'normal');
    doc.setFontSize(7.5);
    doc.text(`ID Verifikasi: ${certId}`, centerX, signerY + 13, { align: 'center' });
  }

  if (merged.customNotes) {
    doc.setTextColor(...theme.metaText);
    doc.setFont(activeFont, 'italic');
    doc.setFontSize(7.5);
    doc.text(merged.customNotes, centerX, pageHeight - 14, { align: 'center' });
  }

  if (download) {
    const filename = `Sertifikat_${(data.studentName || 'Peserta').replace(/\s+/g, '_')}_${data.examCode || 'EXAM'}.pdf`;
    doc.save(filename);
  }

  return doc;
}
