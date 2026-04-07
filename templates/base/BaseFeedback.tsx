// kevlar/base/BaseFeedback.tsx (as shipped — all MUST_BE_DEFINED)
//
// Base template for all feedback/notification components:
// Notification, Alert, Progress, RingProgress, Loader, Skeleton,
// NProgress (top loading bar)
//
// Feedback components appear, deliver a message, and (usually) disappear.
// Key decisions: auto-dismiss timing, dismiss gestures, stacking behavior.
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
// States — feedback components have a lifecycle:
// idle → entering → visible → dismissing → dismissed
// ─────────────────────────────────────────────────────────────────────────────
export const baseFeedbackStates = {
  // Not yet shown — component exists but is hidden/unmounted
  idle: {
    visual: OBJECT_MUST_BE_DEFINED,      // hidden, off-screen, not rendered
    audio: FUNCTION_MUST_BE_DEFINED,      // silent
    haptic: FUNCTION_MUST_BE_DEFINED,     // none
    screenreader: OBJECT_MUST_BE_DEFINED, // not in a11y tree
  },
  // Animating into view
  entering: {
    visual: OBJECT_MUST_BE_DEFINED,      // slide in from top/bottom/side? fade in?
    audio: FUNCTION_MUST_BE_DEFINED,      // notification sound? chime?
    haptic: FUNCTION_MUST_BE_DEFINED,     // attention haptic?
    screenreader: OBJECT_MUST_BE_DEFINED, // role="alert"? role="status"? aria-live?
    announcement: STRING_MUST_BE_DEFINED, // what does the screenreader say?
  },
  // Fully visible and readable
  visible: {
    visual: OBJECT_MUST_BE_DEFINED,      // position, colors, icon, close button
    audio: FUNCTION_MUST_BE_DEFINED,      // ambient? silent?
    haptic: FUNCTION_MUST_BE_DEFINED,     // none
    screenreader: OBJECT_MUST_BE_DEFINED, // live region content, role
  },
  // Animating out of view
  dismissing: {
    visual: OBJECT_MUST_BE_DEFINED,      // fade out, slide out, shrink?
    audio: FUNCTION_MUST_BE_DEFINED,      // dismiss sound?
    haptic: FUNCTION_MUST_BE_DEFINED,     // dismiss haptic?
    screenreader: OBJECT_MUST_BE_DEFINED, // announce dismissal?
  },
  // Fully gone — cleanup
  dismissed: {
    visual: OBJECT_MUST_BE_DEFINED,      // removed from DOM? hidden?
    audio: FUNCTION_MUST_BE_DEFINED,      // silent
    haptic: FUNCTION_MUST_BE_DEFINED,     // none
    screenreader: OBJECT_MUST_BE_DEFINED, // removed from a11y tree
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Actions — how the user can dismiss feedback, and auto-dismiss behavior
// ─────────────────────────────────────────────────────────────────────────────
export const baseFeedbackActions = {
  onSwipeToDismiss: FUNCTION_MUST_BE_DEFINED,  // swipe gesture to dismiss (mobile)
  onClickToDismiss: FUNCTION_MUST_BE_DEFINED,  // click/tap close button or the notification itself
  onAutoDismiss: FUNCTION_MUST_BE_DEFINED,     // what happens when auto-dismiss timer fires?
  onHoverPause: FUNCTION_MUST_BE_DEFINED,      // pause auto-dismiss timer on hover?
  onStackOverflow: FUNCTION_MUST_BE_DEFINED,   // too many notifications — queue? replace? stack?
  onAction: FUNCTION_MUST_BE_DEFINED,          // action button inside notification (e.g. "Undo")
};

// ─────────────────────────────────────────────────────────────────────────────
// Timing — auto-dismiss, delays
// ─────────────────────────────────────────────────────────────────────────────
export const baseFeedbackTiming = {
  autoDismissMs: NUMBER_MUST_BE_DEFINED,       // how long before auto-dismiss? 0 = no auto-dismiss
  enterDurationMs: NUMBER_MUST_BE_DEFINED,     // enter animation duration
  exitDurationMs: NUMBER_MUST_BE_DEFINED,      // exit animation duration
  staggerDelayMs: NUMBER_MUST_BE_DEFINED,      // delay between stacked notifications appearing
  triggers: [] as Trigger[],                   // scheduled or conditional triggers
};

// ─────────────────────────────────────────────────────────────────────────────
// Animation — enter, exit, stacking transitions
// ─────────────────────────────────────────────────────────────────────────────
export const baseFeedbackAnimation = {
  enter: ANIMATION_MUST_BE_DEFINED,    // slide in, fade in, pop in
  exit: ANIMATION_MUST_BE_DEFINED,     // slide out, fade out, shrink out
  transitions: {
    idle_to_entering: ANIMATION_MUST_BE_DEFINED,     // trigger → animating in
    entering_to_visible: ANIMATION_MUST_BE_DEFINED,  // animation complete
    visible_to_dismissing: ANIMATION_MUST_BE_DEFINED, // dismiss triggered
    dismissing_to_dismissed: ANIMATION_MUST_BE_DEFINED, // animation complete, cleanup
  },
  progressBar: ANIMATION_MUST_BE_DEFINED, // auto-dismiss countdown visual
  stackShift: ANIMATION_MUST_BE_DEFINED,  // how existing notifications shift when new one appears
};
