import { StyleSheet } from 'react-native';
import PALETTE from './colors';

export const TYPOGRAPHY = StyleSheet.create({
  h1: {
    fontSize: 32,
    fontWeight: '700',
    color: PALETTE.textPrimary,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600',
    color: PALETTE.textPrimary,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    color: PALETTE.textPrimary,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    color: PALETTE.textPrimary,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400',
    color: PALETTE.textSecondary,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    color: PALETTE.textMuted,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: PALETTE.textSecondary,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});

export default TYPOGRAPHY;
