// ============================================================
// Global SWR configuration provider
// Wraps the entire app so every useSWR call inherits defaults.
// ============================================================

import { SWRConfig } from 'swr';
import { swrConfig } from '../lib/api';

export function SWRProvider({ children }) {
  return <SWRConfig value={swrConfig}>{children}</SWRConfig>;
}
