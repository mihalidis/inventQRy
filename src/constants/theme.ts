export const Colors = {
  PrimaryBlue: '#4A7BF7',
  SecondaryWhite: '#F5F7FA',
  Background: '#FFFFFF',
  DarkText: '#2A3342',
  GrayText: '#8E9196',
  SuccessGreen: '#6EE7B7',
  Danger: '#EF4444',
  Border: '#E8EBF0',
  InputBg: '#F0F2F5',
} as const;

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
