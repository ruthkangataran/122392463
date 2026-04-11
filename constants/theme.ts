import { Platform } from 'react-native';

const brandBlue = '#1446A0';
const razzmatazz = '#DB3069';
const royalGold = '#F5D547';
const vividTangerine = '#FF7F11';
const periwinkle = '#ADBDFF';

export const Colors = {
  light: {
    text: '#14213D',
    background: '#F8FAFF',
    surface: '#FFFFFF',
    tint: brandBlue,
    icon: '#5B6475',
    tabIconDefault: '#7A8494',
    tabIconSelected: brandBlue,

    primary: brandBlue,
    secondary: periwinkle,
    accent: vividTangerine,
    highlight: royalGold,
    pink: razzmatazz,

    border: '#D9E2F2',
    card: '#FFFFFF',
    muted: '#6B7280',
    success: '#2E8B57',
    danger: '#C53030',
  },

  dark: {
    text: '#F3F6FC',
    background: '#0F172A',
    surface: '#1E293B',
    tint: periwinkle,
    icon: '#B8C1D1',
    tabIconDefault: '#94A3B8',
    tabIconSelected: periwinkle,

    primary: periwinkle,
    secondary: brandBlue,
    accent: vividTangerine,
    highlight: royalGold,
    pink: razzmatazz,

    border: '#334155',
    card: '#1E293B',
    muted: '#CBD5E1',
    success: '#4ADE80',
    danger: '#F87171',
  },
};

export const CategoryColors = {
  easy: '#1446A0',
  long: '#FF7F11',
  tempo: '#DB3069',
  intervals: '#F5D547',
  race: '#ADBDFF',
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});