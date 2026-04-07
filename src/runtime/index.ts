import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useContext,
} from 'react';

import type {
  DesignConfig,
  DeepPartial,
  KevlarContext,
  KevlarInteractionSpec,
  KevlarInteractionResult,
  DestructiveConfig,
  Platform,
  NetworkState,
  UserSegment,
  KevlarProviderProps,
  StateDefinition,
} from '../types/index';

import {
  KevlarPrimitivesContext,
  _setCurrentState,
  playSound,
  fireHaptic,
  announce,
} from '../primitives/index';

import type { KevlarDetectedState } from '../primitives/index';

import {
  isSentinel,
  getSentinelName,
  getSentinelGuidance,
} from '../sentinels/index';

// ═══════════════════════════════════════════════════════════════
// 1. defineDesignConfig
// ═══════════════════════════════════════════════════════════════

export function defineDesignConfig(config: DesignConfig): DesignConfig {
  return config;
}

// ═══════════════════════════════════════════════════════════════
// 2. deepMerge
// ═══════════════════════════════════════════════════════════════

function isPlainObject(value: unknown): value is Record<string, any> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

export function deepMerge<T extends Record<string, any>>(
  target: T,
  source: DeepPartial<T> | undefined,
): T {
  if (source === undefined) return target;

  const result = { ...target };

  for (const key of Object.keys(source) as Array<keyof T>) {
    const sourceValue = (source as any)[key];

    // undefined in source: skip, keep target
    if (sourceValue === undefined) continue;

    // null in source: set to null, overriding target
    if (sourceValue === null) {
      (result as any)[key] = null;
      continue;
    }

    // Both are plain objects: recurse
    if (isPlainObject(sourceValue) && isPlainObject(result[key])) {
      (result as any)[key] = deepMerge(result[key] as any, sourceValue);
      continue;
    }

    // Arrays, functions, primitives: replace
    (result as any)[key] = sourceValue;
  }

  return result;
}

// ═══════════════════════════════════════════════════════════════
// 3. validate
// ═══════════════════════════════════════════════════════════════

type SentinelViolation = {
  path: string;
  sentinelName: string;
  guidance: string;
};

function collectSentinels(
  obj: Record<string, any>,
  prefix: string,
  violations: SentinelViolation[],
): void {
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    const path = prefix ? `${prefix}.${key}` : key;

    if (isSentinel(value)) {
      violations.push({
        path,
        sentinelName: getSentinelName(value as any),
        guidance: getSentinelGuidance(value as any),
      });
    } else if (isPlainObject(value)) {
      collectSentinels(value, path, violations);
    }
  }
}

export function validate(
  spec: Record<string, any>,
  componentName: string,
  instanceLabel?: string,
): void {
  if (process.env.NODE_ENV === 'production') return;

  const violations: SentinelViolation[] = [];
  collectSentinels(spec, '', violations);

  if (violations.length === 0) return;

  const label = instanceLabel ? ` "${instanceLabel}"` : '';
  const lines = violations.map(
    (v) =>
      `  ${v.path} = ${v.sentinelName}\n` +
      `  \u2500 ${v.guidance}`,
  );

  const message =
    `Kevlar: ${componentName}${label} cannot render.\n\n` +
    lines.join('\n\n') +
    '\n';

  throw new Error(message);
}

// ═══════════════════════════════════════════════════════════════
// 4. KevlarProvider
// ═══════════════════════════════════════════════════════════════

// ─── Detection Helpers ───────────────────────────────────────

function detectPlatform(breakpoints: DesignConfig['breakpoints']): Platform {
  if (typeof window === 'undefined') return 'desktop';

  const w = window.innerWidth;
  if (breakpoints.small_mobile?.max && w <= breakpoints.small_mobile.max) return 'small_mobile';
  if (breakpoints.tv?.min && w >= breakpoints.tv.min) return 'tv';
  if (breakpoints.widescreen?.min && w >= breakpoints.widescreen.min) return 'widescreen';
  if (breakpoints.desktop?.min && w >= breakpoints.desktop.min) return 'desktop';
  if (breakpoints.tablet?.min && w >= breakpoints.tablet.min) return 'tablet';
  return 'mobile';
}

function detectNetwork(): NetworkState {
  if (typeof navigator === 'undefined') return 'fast';
  if (!navigator.onLine) return 'offline';

  const conn = (navigator as any).connection;
  if (conn && ['slow-2g', '2g'].includes(conn.effectiveType)) return 'slow';
  return 'fast';
}

function detectReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function detectHighContrast(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(prefers-contrast: more)').matches ||
    window.matchMedia('(forced-colors: active)').matches
  );
}

async function detectSilentMode(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  try {
    const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return false;

    const ctx = new AudioCtx();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    gain.gain.value = 0; // silent probe
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.01);

    // If the context is suspended, audio is likely blocked
    const isSilent = ctx.state === 'suspended';
    await ctx.close();
    return isSilent;
  } catch {
    return false;
  }
}

async function detectLowBattery(): Promise<boolean> {
  if (typeof navigator === 'undefined') return false;

  try {
    const battery = await (navigator as any).getBattery?.();
    if (battery) {
      return battery.level < 0.15;
    }
  } catch {}

  return false;
}

function resolveUserSegment(prop?: UserSegment): UserSegment {
  if (prop) return prop;

  if (typeof localStorage !== 'undefined') {
    try {
      const stored = localStorage.getItem('kevlar-user-segment');
      if (stored === 'first_time' || stored === 'normal' || stored === 'power') {
        return stored;
      }
    } catch {}
  }

  return 'normal';
}

export function KevlarProvider({
  config,
  colorBlind = false,
  userSegment: userSegmentProp,
  children,
}: KevlarProviderProps): React.ReactElement {
  const [detectedState, setDetectedState] = useState<KevlarDetectedState>(() => ({
    platform: detectPlatform(config.breakpoints),
    network: detectNetwork(),
    prefersReducedMotion: detectReducedMotion(),
    prefersHighContrast: detectHighContrast(),
    isKeyboardOnly: false,
    colorBlind,
    inputMethod: 'mouse' as const,
    silentMode: false,
    lowBattery: false,
    userSegment: resolveUserSegment(userSegmentProp),
    config,
  }));

  // Track keyboard vs pointer input
  const lastInputRef = useRef<'keyboard' | 'pointer'>('pointer');

  useEffect(() => {
    // ── Resize → platform ──
    function onResize() {
      setDetectedState((prev) => ({
        ...prev,
        platform: detectPlatform(config.breakpoints),
      }));
    }

    // ── Online/offline → network ──
    function onOnline() {
      setDetectedState((prev) => ({ ...prev, network: detectNetwork() }));
    }
    function onOffline() {
      setDetectedState((prev) => ({ ...prev, network: 'offline' as const }));
    }

    // ── Connection change → network ──
    const conn = (navigator as any).connection;
    function onConnectionChange() {
      setDetectedState((prev) => ({ ...prev, network: detectNetwork() }));
    }

    // ── Keyboard detection ──
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Tab' || e.key.startsWith('Arrow')) {
        lastInputRef.current = 'keyboard';
        setDetectedState((prev) => ({ ...prev, isKeyboardOnly: true }));
      }
    }
    function onMouseDown() {
      lastInputRef.current = 'pointer';
      setDetectedState((prev) => ({
        ...prev,
        isKeyboardOnly: false,
        inputMethod: 'mouse' as const,
      }));
    }
    function onTouchStart() {
      lastInputRef.current = 'pointer';
      setDetectedState((prev) => ({
        ...prev,
        isKeyboardOnly: false,
        inputMethod: 'touch' as const,
      }));
    }
    function onMouseMove() {
      if (lastInputRef.current !== 'keyboard') {
        setDetectedState((prev) => {
          if (prev.inputMethod === 'mouse') return prev;
          return { ...prev, inputMethod: 'mouse' as const };
        });
      }
    }

    // ── Media queries ──
    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const contrastMq = window.matchMedia('(prefers-contrast: more)');
    const forcedColorsMq = window.matchMedia('(forced-colors: active)');

    function onMotionChange(e: MediaQueryListEvent) {
      setDetectedState((prev) => ({ ...prev, prefersReducedMotion: e.matches }));
    }
    function onContrastChange() {
      setDetectedState((prev) => ({
        ...prev,
        prefersHighContrast: contrastMq.matches || forcedColorsMq.matches,
      }));
    }

    // ── Battery ──
    let batteryObj: any = null;
    function onBatteryChange() {
      if (batteryObj) {
        setDetectedState((prev) => ({
          ...prev,
          lowBattery: batteryObj.level < 0.15,
        }));
      }
    }

    // ── Async detection (silent mode + battery) ──
    detectSilentMode().then((silent) => {
      setDetectedState((prev) => ({ ...prev, silentMode: silent }));
    });

    (navigator as any).getBattery?.()
      .then((battery: any) => {
        batteryObj = battery;
        setDetectedState((prev) => ({
          ...prev,
          lowBattery: battery.level < 0.15,
        }));
        battery.addEventListener('levelchange', onBatteryChange);
      })
      .catch(() => {});

    // ── TV platform → dpad input ──
    const initialPlatform = detectPlatform(config.breakpoints);
    if (initialPlatform === 'tv') {
      setDetectedState((prev) => ({ ...prev, inputMethod: 'dpad' as const }));
    }

    // ── Attach listeners ──
    window.addEventListener('resize', onResize);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    conn?.addEventListener?.('change', onConnectionChange);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    motionMq.addEventListener('change', onMotionChange);
    contrastMq.addEventListener('change', onContrastChange);
    forcedColorsMq.addEventListener('change', onContrastChange);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
      conn?.removeEventListener?.('change', onConnectionChange);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('mousemove', onMouseMove);
      motionMq.removeEventListener('change', onMotionChange);
      contrastMq.removeEventListener('change', onContrastChange);
      forcedColorsMq.removeEventListener('change', onContrastChange);
      batteryObj?.removeEventListener?.('levelchange', onBatteryChange);
    };
  }, [config.breakpoints]);

  // Update colorBlind + userSegment from props
  useEffect(() => {
    setDetectedState((prev) => ({
      ...prev,
      colorBlind,
      userSegment: resolveUserSegment(userSegmentProp),
      config,
    }));
  }, [colorBlind, userSegmentProp, config]);

  // Sync module-level state for plain function primitives
  useEffect(() => {
    _setCurrentState(detectedState);
  });

  const contextValue = useMemo(() => detectedState, [detectedState]);

  return React.createElement(
    KevlarPrimitivesContext.Provider,
    { value: contextValue },
    children,
  );
}

// ═══════════════════════════════════════════════════════════════
// 5. useKevlarInteraction
// ═══════════════════════════════════════════════════════════════

type InteractionState =
  | 'idle'
  | 'hover'
  | 'focused'
  | 'pressed'
  | 'loading'
  | 'success'
  | 'error'
  | 'disabled';

export function useKevlarInteraction(
  spec: KevlarInteractionSpec,
  options: {
    onAction: (ctx: KevlarContext) => Promise<void>;
    destructive?: DestructiveConfig;
  },
): KevlarInteractionResult {
  const { onAction, destructive } = options;

  // ── Dev mode validation ──
  if (process.env.NODE_ENV !== 'production') {
    // We run validate once on mount / spec change, but in a ref guard to
    // avoid double-fire in StrictMode causing noise.
    validate(spec as any, 'Component');
  }

  // ── Core state ──
  const [state, setStateRaw] = useState<InteractionState>('idle');
  const [displayText, setDisplayText] = useState<string | null>(null);
  const stateRef = useRef<InteractionState>(state);
  const elementRef = useRef<HTMLElement | null>(null);
  const abortControllerRef = useRef<AbortController>(new AbortController());

  // ── Rage click detection ──
  const clickTimestampsRef = useRef<number[]>([]);
  const RAGE_CLICK_COUNT = 3;
  const RAGE_CLICK_WINDOW = 500;

  // ── Debounce tracking ──
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Trigger timers ──
  const triggerTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // ── Focused tracking (separate from state machine to allow focus + hover) ──
  const isFocusedRef = useRef(false);

  function setState(next: InteractionState) {
    stateRef.current = next;
    setStateRaw(next);
  }

  function setText(text: string) {
    setDisplayText(text);
  }

  function cancel() {
    abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
    clearTriggerTimers();
    if (stateRef.current === 'loading') {
      setState('idle');
    }
  }

  function clearTriggerTimers() {
    for (const t of triggerTimersRef.current) {
      clearTimeout(t);
    }
    triggerTimersRef.current = [];
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current.abort();
      clearTriggerTimers();
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  // ── Build KevlarContext ──
  function makeContext(event?: Event): KevlarContext {
    return {
      state: stateRef.current,
      setState: (s: string) => setState(s as InteractionState),
      setText,
      cancel,
      signal: abortControllerRef.current.signal,
      element: elementRef.current,
      event,
    };
  }

  // ── Fire state modalities ──
  function fireStateModalities(stateDef: StateDefinition | undefined, ctx: KevlarContext) {
    if (!stateDef) return;
    if (stateDef.audio) {
      try { stateDef.audio(ctx); } catch {}
    }
    if (stateDef.haptic) {
      try { stateDef.haptic(ctx); } catch {}
    }
    if (stateDef.announcement) {
      announce(stateDef.announcement);
    }
  }

  // ── Execute action flow ──
  async function executeAction(event?: Event) {
    const currentState = stateRef.current;

    // Don't re-trigger if already loading
    if (currentState === 'loading') {
      // Click during loading
      const clickDuringLoading = spec.userActions?.onClickDuringLoading;
      if (clickDuringLoading) {
        clickDuringLoading(makeContext(event));
      }
      return;
    }

    if (currentState === 'disabled') return;

    // ── Rage click detection ──
    const now = Date.now();
    clickTimestampsRef.current.push(now);
    clickTimestampsRef.current = clickTimestampsRef.current.filter(
      (t) => now - t < RAGE_CLICK_WINDOW,
    );
    if (clickTimestampsRef.current.length >= RAGE_CLICK_COUNT) {
      clickTimestampsRef.current = [];
      const rageHandler = spec.userActions?.onRageClick;
      if (rageHandler) {
        rageHandler(makeContext(event));
        return;
      }
    }

    // ── Debounce ──
    const debounceMs = spec.timing?.debounceMs;
    if (debounceMs && debounceMs > 0) {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      await new Promise<void>((resolve) => {
        debounceTimerRef.current = setTimeout(resolve, debounceMs);
      });
    }

    // ── Destructive confirmation ──
    if (destructive) {
      const ctx = makeContext(event);
      const confirmed = await destructive.onConfirm(ctx);
      if (!confirmed) return;
    }

    // ── Enter loading state ──
    setState('loading');
    const loadingState = spec.states.loading as StateDefinition & { announcement?: string };
    const ctx = makeContext(event);
    fireStateModalities(loadingState, ctx);

    // ── Start trigger timers ──
    clearTriggerTimers();
    if (spec.timing?.triggers) {
      for (const trigger of spec.timing.triggers) {
        const timer = setTimeout(() => {
          if (stateRef.current === 'loading') {
            setText(trigger.text);
          }
        }, trigger.at);
        triggerTimersRef.current.push(timer);
      }
    }

    // ── Track min load time ──
    const loadStartTime = Date.now();
    const minLoadTime = spec.timing?.minLoadTime;
    const minLoadMs = minLoadTime ? minLoadTime[0] : 0;

    // ── Timeout ──
    const timeoutMs = spec.timing?.timeoutMs;
    let timeoutTimer: ReturnType<typeof setTimeout> | null = null;
    let didTimeout = false;

    if (timeoutMs && timeoutMs > 0) {
      timeoutTimer = setTimeout(() => {
        if (stateRef.current === 'loading') {
          didTimeout = true;
          abortControllerRef.current.abort();
          if (spec.timing?.onTimeout) {
            spec.timing.onTimeout(makeContext(event));
          }
          setState('error');
          const errorState = spec.states.error as StateDefinition & { announcement?: string };
          fireStateModalities(errorState, makeContext(event));
        }
      }, timeoutMs);
    }

    // ── Execute action ──
    try {
      await onAction(makeContext(event));

      if (didTimeout) return; // timeout already handled
      if (timeoutTimer) clearTimeout(timeoutTimer);
      clearTriggerTimers();

      // ── Ensure min load time ──
      const elapsed = Date.now() - loadStartTime;
      if (minLoadMs > 0 && elapsed < minLoadMs) {
        await new Promise<void>((resolve) =>
          setTimeout(resolve, minLoadMs - elapsed),
        );
      }

      // ── Success ──
      setState('success');
      const successState = spec.states.success as StateDefinition & { announcement?: string };
      fireStateModalities(successState, makeContext(event));
    } catch (err: any) {
      if (didTimeout) return;
      if (timeoutTimer) clearTimeout(timeoutTimer);
      clearTriggerTimers();

      // Aborted by user
      if (err?.name === 'AbortError') return;

      // ── Error ──
      setState('error');
      const errorState = spec.states.error as StateDefinition & { announcement?: string };
      fireStateModalities(errorState, makeContext(event));
    }
  }

  // ── Handlers ──

  const onClick = useCallback(
    (e: React.MouseEvent | MouseEvent) => {
      elementRef.current = e.currentTarget as HTMLElement;
      executeAction('nativeEvent' in e ? (e as React.MouseEvent).nativeEvent : e);
    },
    [spec, onAction, destructive],
  );

  const onMouseEnter = useCallback(
    (e: React.MouseEvent | MouseEvent) => {
      if (stateRef.current === 'idle' || stateRef.current === 'focused') {
        setState('hover');
      }
    },
    [],
  );

  const onMouseLeave = useCallback(
    (e: React.MouseEvent | MouseEvent) => {
      if (stateRef.current === 'hover' || stateRef.current === 'pressed') {
        setState(isFocusedRef.current ? 'focused' : 'idle');
      }
    },
    [],
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent | KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        elementRef.current = e.currentTarget as HTMLElement;
        executeAction(e instanceof Event ? e : (e as any).nativeEvent ?? e);
      }
    },
    [spec, onAction, destructive],
  );

  const onFocus = useCallback(
    (e: React.FocusEvent | FocusEvent) => {
      isFocusedRef.current = true;
      if (stateRef.current === 'idle') {
        setState('focused');
      }
    },
    [],
  );

  const onBlur = useCallback(
    (e: React.FocusEvent | FocusEvent) => {
      isFocusedRef.current = false;
      if (stateRef.current === 'focused' || stateRef.current === 'hover') {
        setState('idle');
      }
    },
    [],
  );

  const onTouchStart = useCallback(
    (e: React.TouchEvent | TouchEvent) => {
      elementRef.current = e.currentTarget as HTMLElement;
      if (
        stateRef.current === 'idle' ||
        stateRef.current === 'hover' ||
        stateRef.current === 'focused'
      ) {
        setState('pressed');
      }
    },
    [],
  );

  const onTouchEnd = useCallback(
    (e: React.TouchEvent | TouchEvent) => {
      if (stateRef.current === 'pressed') {
        setState('idle');
        executeAction(e instanceof Event ? e : (e as any).nativeEvent ?? e);
      }
    },
    [spec, onAction, destructive],
  );

  // ── Resolve current visual ──
  const currentStateDef = spec.states[state];
  let currentVisual: Record<string, any> = {};
  if (currentStateDef) {
    const visual = currentStateDef.visual;
    if (typeof visual === 'function') {
      currentVisual = visual(makeContext());
    } else if (visual) {
      currentVisual = visual;
    }
  }

  // ── Build result ──
  const handlers = useMemo(
    () => ({
      onClick,
      onMouseEnter,
      onMouseLeave,
      onKeyDown,
      onFocus,
      onBlur,
      onTouchStart,
      onTouchEnd,
    }),
    [onClick, onMouseEnter, onMouseLeave, onKeyDown, onFocus, onBlur, onTouchStart, onTouchEnd],
  );

  return {
    state,
    handlers,
    setState: (s: string) => setState(s as InteractionState),
    setText,
    cancel,
    displayText,
    signal: abortControllerRef.current.signal,
    currentVisual: currentVisual as React.CSSProperties,
  };
}
