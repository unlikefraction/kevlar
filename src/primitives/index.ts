import { useContext, createContext } from 'react';

// ─── Internal Types ───────────────────────────────────────────

export type KevlarDetectedState = {
  platform: 'small_mobile' | 'mobile' | 'tablet' | 'desktop' | 'widescreen' | 'tv';
  network: 'fast' | 'slow' | 'offline';
  prefersReducedMotion: boolean;
  prefersHighContrast: boolean;
  isKeyboardOnly: boolean;
  colorBlind: boolean;
  inputMethod: 'touch' | 'mouse' | 'dpad';
  silentMode: boolean;
  lowBattery: boolean;
  userSegment: 'first_time' | 'normal' | 'power';
  // Config reference for action primitives
  config: any; // DesignConfig
};

// ─── React Context ────────────────────────────────────────────
// KevlarProvider populates this. Hook-based primitives read from it.

export const KevlarPrimitivesContext = createContext<KevlarDetectedState | null>(null);

function useKevlarState(): KevlarDetectedState {
  const state = useContext(KevlarPrimitivesContext);
  if (!state) {
    throw new Error(
      'Kevlar primitives must be used within a <KevlarProvider>. ' +
      'Wrap your app with <KevlarProvider config={config}>.'
    );
  }
  return state;
}

// ─── Module-Level Store (for non-hook usage in config objects) ─

let _currentState: KevlarDetectedState | null = null;

export function _setCurrentState(state: KevlarDetectedState): void {
  _currentState = state;
}

function getState(): KevlarDetectedState {
  if (!_currentState) {
    throw new Error(
      'Kevlar primitives called outside of render. Ensure KevlarProvider is mounted.'
    );
  }
  return _currentState;
}

// ═══════════════════════════════════════════════════════════════
// HOOK VERSIONS (for use inside React components)
// ═══════════════════════════════════════════════════════════════

// ─── Platform Targets (6 + getter) ───────────────────────────

export function useIsSmallMobile(): boolean {
  return useKevlarState().platform === 'small_mobile';
}

export function useIsMobile(): boolean {
  const p = useKevlarState().platform;
  return p === 'mobile' || p === 'small_mobile';
}

export function useIsTablet(): boolean {
  return useKevlarState().platform === 'tablet';
}

export function useIsDesktop(): boolean {
  return useKevlarState().platform === 'desktop';
}

export function useIsWidescreen(): boolean {
  return useKevlarState().platform === 'widescreen';
}

export function useIsTV(): boolean {
  return useKevlarState().platform === 'tv';
}

export function useGetPlatform() {
  return useKevlarState().platform;
}

// ─── Network Targets (3 + getter) ────────────────────────────

export function useIsFast(): boolean {
  return useKevlarState().network === 'fast';
}

export function useIsSlow(): boolean {
  return useKevlarState().network === 'slow';
}

export function useIsOffline(): boolean {
  return useKevlarState().network === 'offline';
}

export function useGetNetworkState() {
  return useKevlarState().network;
}

// ─── Accessibility Targets (4) ───────────────────────────────

export function usePrefersReducedMotion(): boolean {
  return useKevlarState().prefersReducedMotion;
}

export function usePrefersHighContrast(): boolean {
  return useKevlarState().prefersHighContrast;
}

export function useIsKeyboardOnly(): boolean {
  return useKevlarState().isKeyboardOnly;
}

export function useIsColorBlind(): boolean {
  return useKevlarState().colorBlind;
}

// ─── Input Method Targets (3) ────────────────────────────────

export function useIsTouchDevice(): boolean {
  return useKevlarState().inputMethod === 'touch';
}

export function useIsMouseDevice(): boolean {
  return useKevlarState().inputMethod === 'mouse';
}

export function useIsDpadDevice(): boolean {
  return useKevlarState().inputMethod === 'dpad';
}

// ─── System Target (1) ──────────────────────────────────────

export function useIsSilentMode(): boolean {
  return useKevlarState().silentMode;
}

// ─── Special Targets (2) ────────────────────────────────────

export function useIsLowBattery(): boolean {
  return useKevlarState().lowBattery;
}

export function useGetUserSegment() {
  return useKevlarState().userSegment;
}

// ═══════════════════════════════════════════════════════════════
// PLAIN FUNCTION VERSIONS (for use in component spec / config objects)
// ═══════════════════════════════════════════════════════════════

// ─── Platform Targets ────────────────────────────────────────

export function isSmallMobile(): boolean {
  return getState().platform === 'small_mobile';
}

export function isMobile(): boolean {
  const p = getState().platform;
  return p === 'mobile' || p === 'small_mobile';
}

export function isTablet(): boolean {
  return getState().platform === 'tablet';
}

export function isDesktop(): boolean {
  return getState().platform === 'desktop';
}

export function isWidescreen(): boolean {
  return getState().platform === 'widescreen';
}

export function isTV(): boolean {
  return getState().platform === 'tv';
}

export function getPlatform() {
  return getState().platform;
}

// ─── Network Targets ─────────────────────────────────────────

export function isFast(): boolean {
  return getState().network === 'fast';
}

export function isSlow(): boolean {
  return getState().network === 'slow';
}

export function isOffline(): boolean {
  return getState().network === 'offline';
}

export function getNetworkState() {
  return getState().network;
}

// ─── Accessibility Targets ───────────────────────────────────

export function prefersReducedMotion(): boolean {
  return getState().prefersReducedMotion;
}

export function prefersHighContrast(): boolean {
  return getState().prefersHighContrast;
}

export function isKeyboardOnly(): boolean {
  return getState().isKeyboardOnly;
}

export function isColorBlind(): boolean {
  return getState().colorBlind;
}

// ─── Input Method Targets ────────────────────────────────────

export function isTouchDevice(): boolean {
  return getState().inputMethod === 'touch';
}

export function isMouseDevice(): boolean {
  return getState().inputMethod === 'mouse';
}

export function isDpadDevice(): boolean {
  return getState().inputMethod === 'dpad';
}

// ─── System Target ───────────────────────────────────────────

export function isSilentMode(): boolean {
  return getState().silentMode;
}

// ─── Special Targets ─────────────────────────────────────────

export function isLowBattery(): boolean {
  return getState().lowBattery;
}

export function getUserSegment() {
  return getState().userSegment;
}

// ═══════════════════════════════════════════════════════════════
// ACTION PRIMITIVES
// ═══════════════════════════════════════════════════════════════

// ─── Sensory Budget Tracking ─────────────────────────────────

const budgetTrackers = {
  haptic: { fires: [] as number[] },
  audio: { fires: [] as number[] },
  announcement: { fires: [] as number[], queue: [] as string[] },
};

function checkBudget(channel: 'haptic' | 'audio' | 'announcement'): boolean {
  const state = getState();
  const budget = state.config.sensoryBudget[channel];
  const tracker = budgetTrackers[channel];
  const now = Date.now();

  // Clean old fires outside window
  tracker.fires = tracker.fires.filter(t => now - t < budget.windowMs);

  if (tracker.fires.length >= budget.maxFires) {
    return false; // budget exceeded
  }

  tracker.fires.push(now);
  return true;
}

// ─── playSound ───────────────────────────────────────────────

export function playSound(soundUrlOrBuffer: string | AudioBuffer | (() => void) | null): void {
  if (soundUrlOrBuffer === null) return;
  if (isSilentMode()) return;
  if (!checkBudget('audio')) return;

  if (typeof soundUrlOrBuffer === 'function') {
    soundUrlOrBuffer();
    return;
  }

  if (typeof soundUrlOrBuffer === 'string') {
    try {
      const audio = new Audio(soundUrlOrBuffer);
      audio.volume = 0.5;
      audio.play().catch(() => {}); // ignore autoplay restrictions
    } catch {}
    return;
  }

  // AudioBuffer
  if (soundUrlOrBuffer instanceof AudioBuffer) {
    try {
      const audioCtx = new AudioContext();
      const source = audioCtx.createBufferSource();
      source.buffer = soundUrlOrBuffer;
      source.connect(audioCtx.destination);
      source.start();
    } catch {}
  }
}

// ─── fireHaptic ──────────────────────────────────────────────

export function fireHaptic(pattern: number[] | null): void {
  if (pattern === null) return;
  if (isLowBattery()) return; // no haptics on low battery
  if (!checkBudget('haptic')) return;

  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {}
  }
}

// ─── announce ────────────────────────────────────────────────

export function announce(message: string): void {
  const state = getState();
  const budget = state.config.sensoryBudget.announcement;

  if (!checkBudget('announcement')) {
    if (budget.queue) {
      budgetTrackers.announcement.queue.push(message);
      // Process queue after window
      setTimeout(() => {
        const next = budgetTrackers.announcement.queue.shift();
        if (next) announce(next);
      }, budget.windowMs);
    }
    return;
  }

  // Create or reuse a live region
  if (typeof document !== 'undefined') {
    let liveRegion = document.getElementById('kevlar-live-region');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'kevlar-live-region';
      liveRegion.setAttribute('role', 'status');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      Object.assign(liveRegion.style, {
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: '0',
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: '0',
      });
      document.body.appendChild(liveRegion);
    }
    // Clear and set to trigger announcement
    liveRegion.textContent = '';
    requestAnimationFrame(() => {
      liveRegion!.textContent = message;
    });
  }
}

// ─── moveFocus ───────────────────────────────────────────────

export function moveFocus(direction: string): void {
  if (typeof document === 'undefined') return;

  const focusable = Array.from(
    document.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  );

  const current = document.activeElement as HTMLElement;
  const currentIndex = focusable.indexOf(current);

  if (currentIndex === -1) return;

  let nextIndex: number;
  switch (direction) {
    case 'next':
    case 'right':
    case 'down':
      nextIndex = (currentIndex + 1) % focusable.length;
      break;
    case 'prev':
    case 'left':
    case 'up':
      nextIndex = (currentIndex - 1 + focusable.length) % focusable.length;
      break;
    default:
      return;
  }

  focusable[nextIndex]?.focus();
}
