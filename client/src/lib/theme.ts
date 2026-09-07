// Utility to apply dynamic CSS variables to :root based on theme config
export interface ThemeConfig {
  preset?: string;
  primaryColor?: string;
  accentColor?: string;
  highlightColor?: string;
}

export interface ThemePreset {
  id: string;
  name: string;
  primaryColor: string;
  accentColor: string;
  highlightColor: string;
  bgPreview: string;
  tokens: {
    primaryDark: string;
    primary: string;
    primaryHover: string;
    mint: string;
    mintHover: string;
    mintLight: string;
    mintSubtle: string;
    bg: string;
    border: string;
    borderStrong: string;
    textTitle: string;
    textBody: string;
    textMuted: string;
  };
}

export const THEME_PRESETS: ThemePreset[] = [
  // 1. Default Original Emerald
  {
    id: 'emerald',
    name: 'Emerald Forest (Default)',
    primaryColor: '#064E3B',
    accentColor: '#10B981',
    highlightColor: '#34D399',
    bgPreview: 'from-[#064E3B] to-[#047857]',
    tokens: {
      primaryDark: '#064E3B',
      primary: '#065F46',
      primaryHover: '#047857',
      mint: '#10B981',
      mintHover: '#059669',
      mintLight: '#F0FDF4',
      mintSubtle: '#DCFCE7',
      bg: '#F0FDF4',
      border: '#A7F3D0',
      borderStrong: '#6EE7B7',
      textTitle: '#064E3B',
      textBody: '#065F46',
      textMuted: '#047857',
    },
  },
  // 2. Modern Indigo
  {
    id: 'indigo',
    name: 'Modern Indigo / Slate',
    primaryColor: '#0F172A',
    accentColor: '#6366F1',
    highlightColor: '#818CF8',
    bgPreview: 'from-[#0F172A] to-[#312E81]',
    tokens: {
      primaryDark: '#0F172A',
      primary: '#312E81',
      primaryHover: '#1E1B4B',
      mint: '#6366F1',
      mintHover: '#4F46E5',
      mintLight: '#EEF2FF',
      mintSubtle: '#E0E7FF',
      bg: '#F8FAFC',
      border: '#C7D2FE',
      borderStrong: '#A5B4FC',
      textTitle: '#0F172A',
      textBody: '#1E293B',
      textMuted: '#475569',
    },
  },
  // 3. Ocean Cyan
  {
    id: 'ocean',
    name: 'Ocean Cyan & Navy',
    primaryColor: '#0C4A6E',
    accentColor: '#0284C7',
    highlightColor: '#38BDF8',
    bgPreview: 'from-[#0C4A6E] to-[#0369A1]',
    tokens: {
      primaryDark: '#0C4A6E',
      primary: '#0369A1',
      primaryHover: '#075985',
      mint: '#0284C7',
      mintHover: '#0369A1',
      mintLight: '#F0F9FF',
      mintSubtle: '#E0F2FE',
      bg: '#F0F9FF',
      border: '#BAE6FD',
      borderStrong: '#7DD3FC',
      textTitle: '#0C4A6E',
      textBody: '#0369A1',
      textMuted: '#0284C7',
    },
  },
  // 4. Royal Purple
  {
    id: 'purple',
    name: 'Royal Purple & Violet',
    primaryColor: '#3B0764',
    accentColor: '#9333EA',
    highlightColor: '#C084FC',
    bgPreview: 'from-[#3B0764] to-[#6B21A8]',
    tokens: {
      primaryDark: '#3B0764',
      primary: '#6B21A8',
      primaryHover: '#581C87',
      mint: '#9333EA',
      mintHover: '#7E22CE',
      mintLight: '#FAF5FF',
      mintSubtle: '#F3E8FF',
      bg: '#FAF5FF',
      border: '#E9D5FF',
      borderStrong: '#D8B4FE',
      textTitle: '#3B0764',
      textBody: '#581C87',
      textMuted: '#7E22CE',
    },
  },
  // 5. Crimson Ruby
  {
    id: 'crimson',
    name: 'Crimson Ruby & Rose',
    primaryColor: '#881337',
    accentColor: '#E11D48',
    highlightColor: '#FB7185',
    bgPreview: 'from-[#881337] to-[#BE123C]',
    tokens: {
      primaryDark: '#881337',
      primary: '#9F1239',
      primaryHover: '#BE123C',
      mint: '#E11D48',
      mintHover: '#BE123C',
      mintLight: '#FFF1F2',
      mintSubtle: '#FFE4E6',
      bg: '#FFF1F2',
      border: '#FECDD3',
      borderStrong: '#FDA4AF',
      textTitle: '#881337',
      textBody: '#4C0519',
      textMuted: '#9F1239',
    },
  },
  // 6. Sunset Amber
  {
    id: 'amber',
    name: 'Sunset Amber & Gold',
    primaryColor: '#78350F',
    accentColor: '#D97706',
    highlightColor: '#FBBF24',
    bgPreview: 'from-[#78350F] to-[#B45309]',
    tokens: {
      primaryDark: '#78350F',
      primary: '#92400E',
      primaryHover: '#B45309',
      mint: '#D97706',
      mintHover: '#B45309',
      mintLight: '#FFFBEB',
      mintSubtle: '#FEF3C7',
      bg: '#FFFBEB',
      border: '#FDE68A',
      borderStrong: '#FCD34D',
      textTitle: '#78350F',
      textBody: '#451A03',
      textMuted: '#B45309',
    },
  },
  // 7. Nordic Teal
  {
    id: 'teal',
    name: 'Nordic Teal & Cyan',
    primaryColor: '#134E4A',
    accentColor: '#0D9488',
    highlightColor: '#2DD4BF',
    bgPreview: 'from-[#134E4A] to-[#0F766E]',
    tokens: {
      primaryDark: '#134E4A',
      primary: '#0F766E',
      primaryHover: '#115E59',
      mint: '#0D9488',
      mintHover: '#0F766E',
      mintLight: '#F0FDFA',
      mintSubtle: '#CCFBF1',
      bg: '#F0FDFA',
      border: '#99F6E4',
      borderStrong: '#5EEAD4',
      textTitle: '#134E4A',
      textBody: '#042F2E',
      textMuted: '#0F766E',
    },
  },
  // 8. Midnight Rose
  {
    id: 'rose',
    name: 'Midnight Rose & Fuchsia',
    primaryColor: '#4C0519',
    accentColor: '#D946EF',
    highlightColor: '#F472B6',
    bgPreview: 'from-[#4C0519] to-[#9D174D]',
    tokens: {
      primaryDark: '#4C0519',
      primary: '#831843',
      primaryHover: '#9D174D',
      mint: '#C026D3',
      mintHover: '#A21CAF',
      mintLight: '#FDF2F8',
      mintSubtle: '#FCE7F3',
      bg: '#FDF2F8',
      border: '#FBCFE8',
      borderStrong: '#F472B6',
      textTitle: '#4C0519',
      textBody: '#831843',
      textMuted: '#9D174D',
    },
  },
  // 9. Royal Cobalt
  {
    id: 'cobalt',
    name: 'Royal Cobalt & Blue',
    primaryColor: '#172554',
    accentColor: '#2563EB',
    highlightColor: '#60A5FA',
    bgPreview: 'from-[#172554] to-[#1D4ED8]',
    tokens: {
      primaryDark: '#172554',
      primary: '#1E3A8A',
      primaryHover: '#1D4ED8',
      mint: '#2563EB',
      mintHover: '#1D4ED8',
      mintLight: '#EFF6FF',
      mintSubtle: '#DBEAFE',
      bg: '#EFF6FF',
      border: '#BFDBFE',
      borderStrong: '#93C5FD',
      textTitle: '#172554',
      textBody: '#1E3A8A',
      textMuted: '#2563EB',
    },
  },
  // 10. Monochrome Slate
  {
    id: 'slate',
    name: 'Monochrome Carbon & Steel',
    primaryColor: '#18181B',
    accentColor: '#52525B',
    highlightColor: '#A1A1AA',
    bgPreview: 'from-[#18181B] to-[#27272A]',
    tokens: {
      primaryDark: '#18181B',
      primary: '#27272A',
      primaryHover: '#3F3F46',
      mint: '#52525B',
      mintHover: '#3F3F46',
      mintLight: '#F4F4F5',
      mintSubtle: '#E4E4E7',
      bg: '#FAFAFA',
      border: '#E4E4E7',
      borderStrong: '#D4D4D8',
      textTitle: '#18181B',
      textBody: '#27272A',
      textMuted: '#71717A',
    },
  },
  // 11. Earthy Copper
  {
    id: 'copper',
    name: 'Earthy Copper & Terracotta',
    primaryColor: '#7C2D12',
    accentColor: '#EA580C',
    highlightColor: '#FB923C',
    bgPreview: 'from-[#7C2D12] to-[#C2410C]',
    tokens: {
      primaryDark: '#7C2D12',
      primary: '#9A3412',
      primaryHover: '#C2410C',
      mint: '#EA580C',
      mintHover: '#C2410C',
      mintLight: '#FFF7ED',
      mintSubtle: '#FFEDD5',
      bg: '#FFF7ED',
      border: '#FED7AA',
      borderStrong: '#FDBA74',
      textTitle: '#7C2D12',
      textBody: '#431407',
      textMuted: '#C2410C',
    },
  },
  // 12. Cyber Midnight
  {
    id: 'midnight',
    name: 'Cyber Neon & Dark Space',
    primaryColor: '#030712',
    accentColor: '#06B6D4',
    highlightColor: '#10B981',
    bgPreview: 'from-[#030712] to-[#0E7490]',
    tokens: {
      primaryDark: '#030712',
      primary: '#083344',
      primaryHover: '#164E63',
      mint: '#06B6D4',
      mintHover: '#0891B2',
      mintLight: '#F0FDFA',
      mintSubtle: '#CFFAFE',
      bg: '#F0FDFA',
      border: '#A5F3FC',
      borderStrong: '#67E8F9',
      textTitle: '#083344',
      textBody: '#164E63',
      textMuted: '#0891B2',
    },
  },
  // 13. Forest Sage
  {
    id: 'sage',
    name: 'Forest Sage & Matcha',
    primaryColor: '#14532D',
    accentColor: '#16A34A',
    highlightColor: '#86EFAC',
    bgPreview: 'from-[#14532D] to-[#15803D]',
    tokens: {
      primaryDark: '#14532D',
      primary: '#15803D',
      primaryHover: '#166534',
      mint: '#16A34A',
      mintHover: '#15803D',
      mintLight: '#F2FBF5',
      mintSubtle: '#DCFCE7',
      bg: '#F2FBF5',
      border: '#BBF7D0',
      borderStrong: '#86EFAC',
      textTitle: '#14532D',
      textBody: '#052E16',
      textMuted: '#15803D',
    },
  },
  // 14. Deep Amethyst
  {
    id: 'amethyst',
    name: 'Deep Amethyst & Lavender',
    primaryColor: '#2E1065',
    accentColor: '#7C3AED',
    highlightColor: '#A78BFA',
    bgPreview: 'from-[#2E1065] to-[#5B21B6]',
    tokens: {
      primaryDark: '#2E1065',
      primary: '#4C1D95',
      primaryHover: '#5B21B6',
      mint: '#7C3AED',
      mintHover: '#6D28D9',
      mintLight: '#FAF5FF',
      mintSubtle: '#EDE9FE',
      bg: '#FAF5FF',
      border: '#DDD6FE',
      borderStrong: '#C4B5FD',
      textTitle: '#2E1065',
      textBody: '#4C1D95',
      textMuted: '#6D28D9',
    },
  },
];

// Convert Hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16);
    const g = parseInt(cleanHex[1] + cleanHex[1], 16);
    const b = parseInt(cleanHex[2] + cleanHex[2], 16);
    return { r, g, b };
  } else if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return { r, g, b };
  }
  return null;
}

// Lighten/Darken color utility
function adjustBrightness(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const adjust = (val: number) => Math.min(255, Math.max(0, Math.round(val + (255 - val) * (percent / 100))));
  const r = adjust(rgb.r).toString(16).padStart(2, '0');
  const g = adjust(rgb.g).toString(16).padStart(2, '0');
  const b = adjust(rgb.b).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}

export function applyDynamicTheme(theme?: ThemeConfig) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  if (!theme || !theme.primaryColor || !theme.accentColor) {
    // Default Emerald Theme
    root.style.removeProperty('--theme-primary-dark');
    root.style.removeProperty('--theme-primary');
    root.style.removeProperty('--theme-primary-hover');
    root.style.removeProperty('--theme-mint');
    root.style.removeProperty('--theme-mint-hover');
    root.style.removeProperty('--theme-mint-light');
    root.style.removeProperty('--theme-mint-subtle');
    root.style.removeProperty('--theme-bg');
    root.style.removeProperty('--theme-border');
    root.style.removeProperty('--theme-border-strong');
    root.style.removeProperty('--theme-text-title');
    root.style.removeProperty('--theme-text-body');
    root.style.removeProperty('--theme-text-muted');
    return;
  }

  // 1. Check if theme matches one of the 14 predefined high-fidelity presets
  const matchedPreset = THEME_PRESETS.find((p) => p.id === theme.preset);

  if (matchedPreset) {
    const t = matchedPreset.tokens;
    root.style.setProperty('--theme-primary-dark', t.primaryDark);
    root.style.setProperty('--theme-primary', t.primary);
    root.style.setProperty('--theme-primary-hover', t.primaryHover);
    root.style.setProperty('--theme-mint', t.mint);
    root.style.setProperty('--theme-mint-hover', t.mintHover);
    root.style.setProperty('--theme-mint-light', t.mintLight);
    root.style.setProperty('--theme-mint-subtle', t.mintSubtle);
    root.style.setProperty('--theme-bg', t.bg);
    root.style.setProperty('--theme-border', t.border);
    root.style.setProperty('--theme-border-strong', t.borderStrong);
    root.style.setProperty('--theme-text-title', t.textTitle);
    root.style.setProperty('--theme-text-body', t.textBody);
    root.style.setProperty('--theme-text-muted', t.textMuted);
    return;
  }

  // 2. Custom Hex Palette Fallback
  const primary = theme.primaryColor;
  const accent = theme.accentColor;
  const lightSurface = adjustBrightness(accent, 92);
  const subtleSurface = adjustBrightness(accent, 85);
  const borderTint = adjustBrightness(accent, 70);
  const strongBorder = adjustBrightness(accent, 50);

  root.style.setProperty('--theme-primary-dark', primary);
  root.style.setProperty('--theme-primary', primary);
  root.style.setProperty('--theme-primary-hover', primary);
  root.style.setProperty('--theme-mint', accent);
  root.style.setProperty('--theme-mint-hover', accent);
  root.style.setProperty('--theme-mint-light', lightSurface);
  root.style.setProperty('--theme-mint-subtle', subtleSurface);
  root.style.setProperty('--theme-bg', lightSurface);
  root.style.setProperty('--theme-border', borderTint);
  root.style.setProperty('--theme-border-strong', strongBorder);
  root.style.setProperty('--theme-text-title', primary);
  root.style.setProperty('--theme-text-body', primary);
  root.style.setProperty('--theme-text-muted', accent);
}
