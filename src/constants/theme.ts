// Renkler ThemeContext'te tanımlı; her zaman useTheme().colors kullanın.

export const Radius = {
  Card: 12,
  Button: 12,
  Input: 12,
  Full: 9999,
} as const;

export const Spacing = {
  ScreenPadding: 16,
  CardPadding: 12,
  ElementSpacing: 8,
  SectionSpacing: 20,
} as const;

export const Typography = {
  fontFamily: {
    regular: 'SometypeMono-Regular',
    medium: 'SometypeMono-Medium',
    semiBold: 'SometypeMono-SemiBold',
    bold: 'SometypeMono-Bold',
  },
  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
  },
} as const;
