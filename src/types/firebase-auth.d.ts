// `firebase/auth` paketinin tip tanımları web sürümüne işaret eder; React Native
// girişinde var olan getReactNativePersistence bu yüzden tiplerde görünmez.
// Metro çalışma zamanında RN girişini kullandığı için fonksiyon mevcuttur.
import type { Persistence } from 'firebase/auth';

declare module 'firebase/auth' {
  export function getReactNativePersistence(storage: {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
    removeItem(key: string): Promise<void>;
  }): Persistence;
}
