import * as Sentry from '@sentry/react-native';
import PostHog from 'posthog-react-native';

// Anahtarlar .env'den gelir; boşsa ilgili araç sessizce devre dışı kalır (geliştirme ortamı).
const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN || '';
const POSTHOG_KEY = process.env.EXPO_PUBLIC_POSTHOG_KEY || '';
const POSTHOG_HOST = process.env.EXPO_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com';

let posthog: PostHog | null = null;

export function initAnalytics(): void {
  if (SENTRY_DSN) {
    Sentry.init({
      dsn: SENTRY_DSN,
      enableAutoSessionTracking: true,
      tracesSampleRate: 0.2,
    });
  }
  if (POSTHOG_KEY) {
    posthog = new PostHog(POSTHOG_KEY, { host: POSTHOG_HOST });
  }
}

/** Uygulama kökünü Sentry ile sarmalar; DSN yoksa bileşeni olduğu gibi döndürür. */
export function wrapRoot(component: React.ComponentType): React.ComponentType {
  return SENTRY_DSN ? Sentry.wrap(component) : component;
}

/**
 * Ürün olayları. ROADMAP §4'teki metrikler bunlardan türetilir:
 * aktivasyon = shelf_created + qr_scanned (ilk 24 saat), yazdırma oranı = qr_shared / shelf_created
 */
export type AnalyticsEvent =
  | 'signed_up'
  | 'logged_in'
  | 'shelf_created'
  | 'shelf_deleted'
  | 'item_added'
  | 'item_removed'
  | 'qr_scanned'
  | 'qr_scan_not_found'
  | 'qr_shared'
  | 'search_used'
  | 'account_deleted';

export function track(event: AnalyticsEvent, properties?: Record<string, string | number | boolean>): void {
  posthog?.capture(event, properties);
}

export function identifyUser(userId: string | null): void {
  if (userId) {
    posthog?.identify(userId);
    Sentry.setUser({ id: userId });
  } else {
    posthog?.reset();
    Sentry.setUser(null);
  }
}

export function captureError(error: unknown, context?: Record<string, string>): void {
  if (SENTRY_DSN) {
    Sentry.captureException(error, context ? { extra: context } : undefined);
  } else {
    console.error(error, context);
  }
}
