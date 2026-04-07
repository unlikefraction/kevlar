// kevlar/base/BaseInteractive.tsx (as shipped — all MUST_BE_DEFINED)
//
// Base template for all interactive components:
// Button, ActionIcon, CloseButton, CopyButton, FileButton, UnstyledButton,
// Anchor, NavLink, Burger, Card (interactive), Pill
//
// Tech lead: replace every MUST_BE_DEFINED with your project's decisions.

import config from '../design.config';
import {
  // ── Viewport primitives ──
  isSmallMobile, isMobile, isTablet, isDesktop, isWidescreen, isTV,
  // ── Network primitives ──
  isFast, isSlow, isOffline,
  // ── Accessibility primitives ──
  prefersReducedMotion, prefersHighContrast, isKeyboardOnly, isColorBlind,
  // ── Input device primitives ──
  isTouchDevice, isMouseDevice, isDpadDevice,
  // ── Environment primitives ──
  isSilentMode,
  isLowBattery, getUserSegment,
  // ── Action primitives ──
  playSound, fireHaptic, announce, moveFocus,
} from '@unlikefraction/kevlar/primitives';
import {
  FUNCTION_MUST_BE_DEFINED,
  STRING_MUST_BE_DEFINED,
  NUMBER_MUST_BE_DEFINED,
  OBJECT_MUST_BE_DEFINED,
  BOOLEAN_MUST_BE_DEFINED,
  ANIMATION_MUST_BE_DEFINED,
} from '@unlikefraction/kevlar/sentinels';
import type { KevlarContext, Trigger } from '@unlikefraction/kevlar/types';

// ─────────────────────────────────────────────────────────────────────────────
// States — every interactive component cycles through these states.
// Each state has 4 modalities: what does the user see, hear, feel, and
// what does the screen reader announce?
// ─────────────────────────────────────────────────────────────────────────────
export const baseInteractiveStates = {
  // Default resting state — component is visible and ready for interaction
  idle: {
    visual: OBJECT_MUST_BE_DEFINED,      // background, border, text color, shadow, etc.
    audio: FUNCTION_MUST_BE_DEFINED,      // ambient sound? usually silent
    haptic: FUNCTION_MUST_BE_DEFINED,     // no haptic in idle — but you decide
    screenreader: OBJECT_MUST_BE_DEFINED, // role, label, description
  },
  // Pointer is over the element (mouse/stylus)
  hover: {
    visual: OBJECT_MUST_BE_DEFINED,      // how does appearance change on hover?
    audio: FUNCTION_MUST_BE_DEFINED,      // hover tick sound?
    haptic: FUNCTION_MUST_BE_DEFINED,     // light haptic on hover?
    screenreader: OBJECT_MUST_BE_DEFINED, // any change in announcement?
  },
  // Element has keyboard/programmatic focus
  focused: {
    visual: OBJECT_MUST_BE_DEFINED,      // focus ring style, glow, outline
    audio: FUNCTION_MUST_BE_DEFINED,      // focus chime?
    haptic: FUNCTION_MUST_BE_DEFINED,     // focus haptic?
    screenreader: OBJECT_MUST_BE_DEFINED, // what does the reader say on focus?
  },
  // User is actively pressing (mousedown / touchstart)
  pressed: {
    visual: OBJECT_MUST_BE_DEFINED,      // depressed state — scale, color shift
    audio: FUNCTION_MUST_BE_DEFINED,      // press click sound?
    haptic: FUNCTION_MUST_BE_DEFINED,     // press haptic feedback
    screenreader: OBJECT_MUST_BE_DEFINED, // "activated" announcement?
  },
  // Async operation in progress
  loading: {
    visual: OBJECT_MUST_BE_DEFINED,      // spinner, skeleton, shimmer?
    audio: FUNCTION_MUST_BE_DEFINED,      // loading loop sound?
    haptic: FUNCTION_MUST_BE_DEFINED,     // periodic haptic pulse?
    screenreader: OBJECT_MUST_BE_DEFINED, // aria-busy, role updates
    announcement: STRING_MUST_BE_DEFINED, // e.g. "Loading, please wait"
  },
  // Async operation completed successfully
  success: {
    visual: OBJECT_MUST_BE_DEFINED,      // checkmark, green flash, confetti?
    audio: FUNCTION_MUST_BE_DEFINED,      // success chime?
    haptic: FUNCTION_MUST_BE_DEFINED,     // success haptic pattern
    screenreader: OBJECT_MUST_BE_DEFINED, // updated state announcement
    announcement: STRING_MUST_BE_DEFINED, // e.g. "Action completed successfully"
  },
  // Async operation failed
  error: {
    visual: OBJECT_MUST_BE_DEFINED,      // red border, shake, error icon?
    audio: FUNCTION_MUST_BE_DEFINED,      // error buzz?
    haptic: FUNCTION_MUST_BE_DEFINED,     // error haptic pattern
    screenreader: OBJECT_MUST_BE_DEFINED, // error role, description
    announcement: STRING_MUST_BE_DEFINED, // e.g. "Action failed. Please try again."
  },
  // Component is non-interactive
  disabled: {
    visual: OBJECT_MUST_BE_DEFINED,      // grayed out, reduced opacity?
    audio: FUNCTION_MUST_BE_DEFINED,      // muted click on attempt?
    haptic: FUNCTION_MUST_BE_DEFINED,     // no haptic? or denied buzz?
    screenreader: OBJECT_MUST_BE_DEFINED, // aria-disabled, explanation why
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Actions — edge-case user behaviors that need explicit handling
// ─────────────────────────────────────────────────────────────────────────────
export const baseInteractiveActions = {
  onRageClick: FUNCTION_MUST_BE_DEFINED,        // user clicks rapidly — throttle? show message?
  onDoubleClick: FUNCTION_MUST_BE_DEFINED,      // intentional double-click vs accidental
  onClickDuringLoading: FUNCTION_MUST_BE_DEFINED, // user clicks while async op is pending
  onFocusEscape: FUNCTION_MUST_BE_DEFINED,      // focus leaves the component unexpectedly
};

// ─────────────────────────────────────────────────────────────────────────────
// Input — how each input device interacts with this component
// ─────────────────────────────────────────────────────────────────────────────
export const baseInteractiveInput = {
  // Touch input (phones, tablets, touchscreens)
  touch: {
    onTap: FUNCTION_MUST_BE_DEFINED,           // primary action
    onDoubleTap: FUNCTION_MUST_BE_DEFINED,     // secondary action? zoom?
    onLongPress: FUNCTION_MUST_BE_DEFINED,     // context menu? tooltip?
    onSwipe: FUNCTION_MUST_BE_DEFINED,         // swipe on interactive — dismiss? ignore?
    onPinch: FUNCTION_MUST_BE_DEFINED,         // pinch on interactive — usually ignore
    touchTargetSize: FUNCTION_MUST_BE_DEFINED, // min 44x44 per WCAG, but what exactly?
    instantFeedback: BOOLEAN_MUST_BE_DEFINED,  // show feedback before waiting for tap delay?
  },
  // Mouse input (desktop, laptop)
  mouse: {
    onLeftClick: FUNCTION_MUST_BE_DEFINED,     // primary action
    onRightClick: FUNCTION_MUST_BE_DEFINED,    // context menu? custom menu? default?
    onMiddleClick: FUNCTION_MUST_BE_DEFINED,   // open in new tab? ignore?
    onDoubleClick: FUNCTION_MUST_BE_DEFINED,   // select text? trigger action?
    onHoverEnter: FUNCTION_MUST_BE_DEFINED,    // tooltip delay? preview?
    onHoverLeave: FUNCTION_MUST_BE_DEFINED,    // cancel tooltip? cleanup?
    onScroll: FUNCTION_MUST_BE_DEFINED,        // scroll over interactive — pass through?
    onDragAndDrop: FUNCTION_MUST_BE_DEFINED,   // is this component draggable? a drop target?
  },
  // Keyboard input
  keyboard: {
    bindings: {
      Enter: FUNCTION_MUST_BE_DEFINED,         // activate the component
      Space: FUNCTION_MUST_BE_DEFINED,         // activate the component (button behavior)
      Escape: FUNCTION_MUST_BE_DEFINED,        // cancel? blur? close parent?
    },
    Tab: OBJECT_MUST_BE_DEFINED,               // tab order, skip logic, focus group
    focusRing: FUNCTION_MUST_BE_DEFINED,       // focus ring style when keyboard-navigating
  },
  // TV remote / D-pad (game controllers, TV remotes)
  remote_dpad: {
    onSelect: FUNCTION_MUST_BE_DEFINED,        // OK/Enter button on remote
    onBack: FUNCTION_MUST_BE_DEFINED,          // Back button behavior
    onDirectional: FUNCTION_MUST_BE_DEFINED,   // Arrow keys — focus movement rules
    focusRing: OBJECT_MUST_BE_DEFINED,         // larger focus ring for 10-foot UI
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Network — how the component behaves based on connectivity
// ─────────────────────────────────────────────────────────────────────────────
export const baseInteractiveNetwork = {
  onFast: FUNCTION_MUST_BE_DEFINED,    // full experience — animations, sounds, prefetch
  onSlow: FUNCTION_MUST_BE_DEFINED,    // degrade gracefully — skip animations? lower quality?
  onOffline: FUNCTION_MUST_BE_DEFINED, // disable? queue action? show offline message?
};

// ─────────────────────────────────────────────────────────────────────────────
// Timing — timeouts, debouncing, scheduling
// ─────────────────────────────────────────────────────────────────────────────
export const baseInteractiveTiming = {
  timeoutMs: NUMBER_MUST_BE_DEFINED,   // how long before async op is considered failed?
  onTimeout: FUNCTION_MUST_BE_DEFINED, // show error? retry? fallback?
  debounceMs: NUMBER_MUST_BE_DEFINED,  // debounce rapid clicks — 0 = no debounce
  triggers: [] as Trigger[],           // scheduled or conditional triggers
  minLoadTime: null as [number, number] | null, // [min, max] to prevent flash of loading
};

// ─────────────────────────────────────────────────────────────────────────────
// Animation — enter, exit, transitions between states, micro-interactions
// ─────────────────────────────────────────────────────────────────────────────
export const baseInteractiveAnimation = {
  enter: ANIMATION_MUST_BE_DEFINED,    // how does the component appear on mount?
  exit: ANIMATION_MUST_BE_DEFINED,     // how does it disappear on unmount?
  transitions: {
    idle_to_hover: ANIMATION_MUST_BE_DEFINED,      // subtle scale/color shift
    hover_to_idle: ANIMATION_MUST_BE_DEFINED,      // reverse of above
    idle_to_pressed: ANIMATION_MUST_BE_DEFINED,    // press-down effect
    pressed_to_loading: ANIMATION_MUST_BE_DEFINED, // morph into loading state
    loading_to_success: ANIMATION_MUST_BE_DEFINED, // celebrate completion
    loading_to_error: ANIMATION_MUST_BE_DEFINED,   // indicate failure
  },
  microFeedback: ANIMATION_MUST_BE_DEFINED,   // ripple, bounce, glow on interaction
  loadingAnimation: ANIMATION_MUST_BE_DEFINED, // spinner, progress bar, shimmer style
};
