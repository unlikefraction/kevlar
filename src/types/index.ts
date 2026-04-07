import type { CSSProperties, ReactNode } from 'react';

// FocusRing
export type FocusRingConfig = {
  width: number;
  color: string;
  offset: number;
  style: string;
};

// Animation
export type AnimationType = 'fade' | 'scale' | 'spring' | 'shake' | 'slide' | 'shimmer' | 'spin' | 'none';
export type AnimationConfig = {
  type: AnimationType;
  duration?: string | number;
  easing?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  loop?: boolean;
};

// Design config types
export type DesignConfig = {
  colors: {
    focus: string;
    success: string;
    error: string;
    warning: string;
    info: string;
    border: { default: string; strong: string };
    text: { primary: string; muted: string; disabled: string };
    bg: { disabled: string };
  };
  typography: {
    fontFamily: { body: string; mono: string };
    fontSize: { xs: number; sm: number; md: number; lg: number; xl: number };
    fontWeight: { normal: number; medium: number; semibold: number; bold: number };
    lineHeight: { tight: number; normal: number; relaxed: number };
    mobileInputFontSize: number;
  };
  spacing: Record<string, number>;
  radius: Record<string, number>;
  shadows: Record<string, string>;
  sounds: Record<string, string | null>;
  haptics: Record<string, number[] | null>;
  duration: Record<string, number>;
  easing: Record<string, string>;
  animationPresets: Record<string, AnimationConfig>;
  sensoryBudget: {
    haptic: { maxFires: number; windowMs: number };
    audio: { maxFires: number; windowMs: number };
    announcement: { maxFires: number; windowMs: number; queue: boolean };
  };
  focusRing: FocusRingConfig;
  touchTargets: Record<string, { width: number; height: number }>;
  breakpoints: Record<string, { min?: number; max?: number }>;
  zIndex: Record<string, number>;
  timing: {
    defaultTimeoutMs: number;
    defaultDebounceMs: number;
    autoDismissMs: number;
    hoverOpenDelayMs: number;
    hoverCloseDelayMs: number;
    successRevertMs: number;
  };
  tv: {
    focusRing: FocusRingConfig & { glow: boolean };
    focusScale: number;
  };
};

// Kevlar context passed to all callbacks
export type KevlarContext = {
  state: string;
  setState: (state: string) => void;
  setText: (text: string) => void;
  cancel: () => void;
  signal: AbortSignal;
  element: HTMLElement | null;
  event?: Event;
};

// Trigger — used for minLoadTime sequences
export type Trigger = {
  at: number; // ms
  text: string;
};

// State modalities
export type StateVisual = Record<string, any> | ((ctx: KevlarContext) => Record<string, any>);
export type StateAudio = (ctx: KevlarContext) => void;
export type StateHaptic = (ctx: KevlarContext) => void;
export type ScreenreaderConfig = {
  role?: string;
  label?: string;
  liveRegion?: 'polite' | 'assertive' | 'off';
  state?: Record<string, any>;
  hidden?: boolean;
  controls?: string;
  labelledby?: string;
  describedby?: string;
  valuemin?: number;
  valuemax?: number;
  valuenow?: number | null;
  multiselectable?: boolean;
  level?: number | null;
};

export type StateDefinition = {
  visual: StateVisual;
  audio: StateAudio;
  haptic: StateHaptic;
  screenreader: ScreenreaderConfig;
  announcement?: string;
};

// Interactive states
export type InteractiveStates = {
  idle: StateDefinition;
  hover: StateDefinition;
  focused: StateDefinition;
  pressed: StateDefinition;
  loading: StateDefinition & { announcement: string };
  success: StateDefinition & { announcement: string };
  error: StateDefinition & { announcement: string };
  disabled: StateDefinition;
};

// Input states
export type InputStates = {
  idle: StateDefinition;
  hover: StateDefinition;
  focused: StateDefinition;
  typing: StateDefinition;
  validating: StateDefinition;
  valid: StateDefinition;
  invalid: StateDefinition & { announcement: string };
  disabled: StateDefinition;
};

// Overlay states
export type OverlayStates = {
  idle: StateDefinition;
  opening: StateDefinition;
  open: StateDefinition;
  closing: StateDefinition;
  closed: StateDefinition;
};

// Feedback states
export type FeedbackStates = {
  idle: StateDefinition;
  entering: StateDefinition;
  visible: StateDefinition;
  dismissing: StateDefinition;
  dismissed: StateDefinition;
};

// Navigation states
export type NavigationStates = {
  idle: StateDefinition;
  hover: StateDefinition;
  focused: StateDefinition;
  active: StateDefinition;
  disabled: StateDefinition;
};

// Disclosure states
export type DisclosureStates = {
  idle: StateDefinition;
  hover: StateDefinition;
  focused: StateDefinition;
  open: StateDefinition;
  closed: StateDefinition;
};

// Media states
export type MediaStates = {
  idle: StateDefinition;
  loading: StateDefinition;
  loaded: StateDefinition;
  error: StateDefinition;
};

// Touch input config
export type TouchInput = {
  onTap: (ctx: KevlarContext) => void;
  onDoubleTap: (ctx: KevlarContext) => void;
  onLongPress: (ctx: KevlarContext) => void;
  onSwipe: (ctx: KevlarContext, direction?: string) => void;
  onPinch: (ctx: KevlarContext) => void;
  touchTargetSize: () => { width: number; height: number };
  instantFeedback: boolean;
};

// Mouse input config
export type MouseInput = {
  onLeftClick: (ctx: KevlarContext) => void;
  onRightClick: (ctx: KevlarContext) => void;
  onMiddleClick: (ctx: KevlarContext) => void;
  onDoubleClick: (ctx: KevlarContext) => void;
  onHoverEnter: (ctx: KevlarContext) => void;
  onHoverLeave: (ctx: KevlarContext) => void;
  onScroll: (ctx: KevlarContext) => void;
  onDragAndDrop: (ctx: KevlarContext, data?: any) => void;
};

// Keyboard input config
export type KeyboardInput = {
  bindings: Record<string, (ctx: KevlarContext) => void>;
  Tab: { trap: boolean };
  focusRing: () => FocusRingConfig & { visible: string };
};

// Remote/d-pad input config
export type RemoteDpadInput = {
  onSelect: (ctx: KevlarContext) => void;
  onBack: (ctx: KevlarContext) => void;
  onDirectional: (ctx: KevlarContext, direction: string) => void;
  focusRing: FocusRingConfig & { glow?: boolean };
};

// Full input config
export type InputConfig = {
  touch: TouchInput;
  mouse: MouseInput;
  keyboard: KeyboardInput;
  remote_dpad: RemoteDpadInput;
};

// Network config
export type NetworkConfig = {
  onFast: (ctx: KevlarContext) => void;
  onSlow: (ctx: KevlarContext) => void;
  onOffline: (ctx: KevlarContext) => void;
};

// Timing config
export type TimingConfig = {
  timeoutMs: number;
  onTimeout: (ctx: KevlarContext) => void;
  debounceMs: number;
  triggers: Trigger[];
  minLoadTime: [number, number] | null;
};

// Animation transitions config
export type AnimationTransitions = Record<string, AnimationConfig | (() => AnimationConfig | null)>;

// Full animation config for a component
export type ComponentAnimationConfig = {
  enter: AnimationConfig | (() => AnimationConfig | null);
  exit: AnimationConfig | (() => AnimationConfig | null);
  transitions: AnimationTransitions;
  microFeedback: AnimationConfig | (() => AnimationConfig | null);
  loadingAnimation: AnimationConfig;
};

// User actions
export type InteractiveActions = {
  onRageClick: (ctx: KevlarContext) => void;
  onDoubleClick: (ctx: KevlarContext) => void;
  onClickDuringLoading: (ctx: KevlarContext) => void;
  onFocusEscape: (ctx: KevlarContext) => void;
};

// DeepPartial utility
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// KevlarInteractionSpec - the full spec passed to useKevlarInteraction
export type KevlarInteractionSpec = {
  states: Record<string, StateDefinition>;
  userActions: Record<string, (ctx: KevlarContext) => void>;
  input: InputConfig;
  network: NetworkConfig;
  timing: TimingConfig;
  animation: ComponentAnimationConfig;
};

// KevlarInteractionResult - what useKevlarInteraction returns
export type KevlarInteractionResult = {
  state: string;
  handlers: Record<string, (...args: any[]) => void>;
  setState: (state: string) => void;
  setText: (text: string) => void;
  cancel: () => void;
  displayText: string | null;
  signal: AbortSignal;
  currentVisual: CSSProperties;
};

// Destructive action config
export type DestructiveConfig = {
  onConfirm: (ctx: KevlarContext) => Promise<boolean>;
};

// Platform type
export type Platform = 'small_mobile' | 'mobile' | 'tablet' | 'desktop' | 'widescreen' | 'tv';

// Network state
export type NetworkState = 'fast' | 'slow' | 'offline';

// User segment
export type UserSegment = 'first_time' | 'normal' | 'power';

// Overlay-specific types
export type OverlayFocusConfig = {
  onOpen: (ctx: KevlarContext) => void;
  onClose: (ctx: KevlarContext) => void;
};

// Feedback-specific types
export type FeedbackActions = {
  onSwipeToDismiss: (ctx: KevlarContext) => void;
  onClickToDismiss: (ctx: KevlarContext) => void;
  autoDismissMs: number | null;
  onAutoDismiss: (ctx: KevlarContext) => void;
};

// Shame props type
export type ShameProps = {
  badly_skip_alt_text_and_hurt_accessibility?: boolean;
  badly_allow_layout_shift_and_dont_define_size?: boolean;
  badly_skip_modal_title_and_hurt_accessibility?: boolean;
  badly_skip_aria_label_and_hurt_accessibility?: boolean;
  badly_skip_input_label_and_hurt_accessibility?: boolean;
  dangerously_skip_offline_decision?: boolean;
  dangerously_skip_timeout_decision?: boolean;
  dangerously_skip_focus_trap?: boolean;
  dangerously_allow_submit_type_button?: boolean;
};

// Provider props
export type KevlarProviderProps = {
  config: DesignConfig;
  colorBlind?: boolean;
  userSegment?: UserSegment;
  children: ReactNode;
};
