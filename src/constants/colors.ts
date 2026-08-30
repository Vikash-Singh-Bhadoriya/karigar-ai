export const colors = {
  brand: '#E07B1E',
  brandDark: '#C4521E',
  earth: '#C4521E',
  brandDeep: '#B5451A',
  cream: '#FDF7EF',
  ink: '#1C1208',
  inkLight: '#3D2E1A',
  inkMuted: '#7A6347',
  surface: '#F5EDE0',
  surface2: '#EDE0CE',
  card: '#FFFFFF',
  border: '#EAD8C4',
  ok: '#2A7D52',
  okBg: '#E8F5EE',
  warn: '#C49A0A',
  warnBg: '#FBF5DF',
  risk: '#C4331E',
  riskBg: '#FDE8E4',
  white: '#FFFFFF',
  white70: 'rgba(255,255,255,0.7)',
  white55: 'rgba(255,255,255,0.55)',
  ink15: 'rgba(28,18,8,0.15)',
  ink55: 'rgba(28,18,8,0.55)',
};

export const brandGradient = ['#E07B1E', '#C4521E', '#B5451A'] as const;

export const shadow = {
  card: {
    shadowColor: '#1C1208',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  brand: {
    shadowColor: '#E07B1E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.38,
    shadowRadius: 16,
    elevation: 6,
  },
};

export const radius = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 28,
};
