// kevlar/base/BaseOverlay.tsx (as shipped — all MUST_BE_DEFINED)
//
// Base template for all overlay/popup components:
// Modal, Drawer, Dialog, Popover, Tooltip, HoverCard, Menu, Combobox,
// Overlay, LoadingOverlay, Affix, FloatingIndicator
//
// Overlays have unique concerns: backdrop behavior, focus trapping,
// scroll locking, escape key handling, and click-outside dismissal.
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
// States — overlays have a lifecycle: idle → opening → open → closing → closed
// ─────────────────────────────────────────────────────────────────────────────
export const baseOverlayStates = {
  // Overlay is not visible — component exists but is hidden
  idle: {
    visual: OBJECT_MUST_BE_DEFINED,      // display: none? opacity: 0? off-screen?
    audio: FUNCTION_MUST_BE_DEFINED,      // silent
    haptic: FUNCTION_MUST_BE_DEFINED,     // none
    screenreader: OBJECT_MUST_BE_DEFINED, // aria-hidden=true, removed from tree?
  },
  // Overlay is animating into view
  opening: {
    visual: OBJECT_MUST_BE_DEFINED,      // fade in, slide in, scale up?
    audio: FUNCTION_MUST_BE_DEFINED,      // opening whoosh sound?
    haptic: FUNCTION_MUST_BE_DEFINED,     // opening haptic?
    screenreader: OBJECT_MUST_BE_DEFINED, // announce opening? aria-expanded?
  },
  // Overlay is fully visible and interactive
  open: {
    visual: OBJECT_MUST_BE_DEFINED,      // backdrop opacity, shadow, position
    audio: FUNCTION_MUST_BE_DEFINED,      // ambient overlay sound?
    haptic: FUNCTION_MUST_BE_DEFINED,     // none
    screenreader: OBJECT_MUST_BE_DEFINED, // role="dialog", aria-modal, aria-label
    announcement: STRING_MUST_BE_DEFINED, // e.g. "Dialog opened. Press Escape to close."
  },
  // Overlay is animating out
  closing: {
    visual: OBJECT_MUST_BE_DEFINED,      // fade out, slide out, scale down?
    audio: FUNCTION_MUST_BE_DEFINED,      // closing sound?
    haptic: FUNCTION_MUST_BE_DEFINED,     // closing haptic?
    screenreader: OBJECT_MUST_BE_DEFINED, // announce closing?
  },
  // Overlay has finished closing — cleanup
  closed: {
    visual: OBJECT_MUST_BE_DEFINED,      // fully hidden, unmounted?
    audio: FUNCTION_MUST_BE_DEFINED,      // silent
    haptic: FUNCTION_MUST_BE_DEFINED,     // none
    screenreader: OBJECT_MUST_BE_DEFINED, // aria-hidden, removed from a11y tree
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Actions — overlay-specific user behaviors
// ─────────────────────────────────────────────────────────────────────────────
export const baseOverlayActions = {
  onClickOutside: FUNCTION_MUST_BE_DEFINED,  // close the overlay? ignore? show warning?
  onScrollBehind: FUNCTION_MUST_BE_DEFINED,  // lock scroll? allow scroll? close on scroll?
  onEscape: FUNCTION_MUST_BE_DEFINED,        // close on Escape? confirm before closing?
  onBackdropClick: FUNCTION_MUST_BE_DEFINED, // same as clickOutside? or different?
  onMultipleOverlays: FUNCTION_MUST_BE_DEFINED, // stacking behavior — z-index, nesting
};

// ─────────────────────────────────────────────────────────────────────────────
// Input — how input devices interact with overlay
// ─────────────────────────────────────────────────────────────────────────────
export const baseOverlayInput = {
  touch: {
    onSwipeToDismiss: FUNCTION_MUST_BE_DEFINED, // swipe down/right to close?
    onPinchToDismiss: FUNCTION_MUST_BE_DEFINED, // pinch to close?
    touchTargetSize: FUNCTION_MUST_BE_DEFINED,  // close button min size
  },
  mouse: {
    onClickOutside: FUNCTION_MUST_BE_DEFINED,   // click outside behavior
    onScroll: FUNCTION_MUST_BE_DEFINED,         // scroll inside overlay content
  },
  keyboard: {
    bindings: {
      Escape: FUNCTION_MUST_BE_DEFINED,         // close overlay
      Enter: FUNCTION_MUST_BE_DEFINED,          // confirm action?
    },
    Tab: {
      trap: BOOLEAN_MUST_BE_DEFINED,            // trap focus inside overlay? (usually yes for modals)
      order: OBJECT_MUST_BE_DEFINED,            // focus order within overlay
    },
    focusRing: FUNCTION_MUST_BE_DEFINED,        // focus ring style inside overlay
  },
  remote_dpad: {
    onSelect: FUNCTION_MUST_BE_DEFINED,         // confirm action
    onBack: FUNCTION_MUST_BE_DEFINED,           // close overlay
    onDirectional: FUNCTION_MUST_BE_DEFINED,    // navigate within overlay
    focusRing: OBJECT_MUST_BE_DEFINED,          // 10-foot UI focus ring
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Focus — where does focus go when overlay opens and closes?
// ─────────────────────────────────────────────────────────────────────────────
export const baseOverlayFocus = {
  onOpen: FUNCTION_MUST_BE_DEFINED,    // move focus to first focusable? to title? to close button?
  onClose: FUNCTION_MUST_BE_DEFINED,   // restore focus to trigger element? to next element?
  trapFocus: BOOLEAN_MUST_BE_DEFINED,  // prevent focus from leaving overlay
  initialFocus: FUNCTION_MUST_BE_DEFINED, // which element gets focus on open?
  returnFocus: FUNCTION_MUST_BE_DEFINED,  // which element gets focus on close?
};

// ─────────────────────────────────────────────────────────────────────────────
// Animation — overlay lifecycle animations
// ─────────────────────────────────────────────────────────────────────────────
export const baseOverlayAnimation = {
  enter: ANIMATION_MUST_BE_DEFINED,    // overlay enter animation (fade, slide, scale)
  exit: ANIMATION_MUST_BE_DEFINED,     // overlay exit animation
  backdrop: {
    enter: ANIMATION_MUST_BE_DEFINED,  // backdrop fade-in
    exit: ANIMATION_MUST_BE_DEFINED,   // backdrop fade-out
  },
  transitions: {
    idle_to_opening: ANIMATION_MUST_BE_DEFINED,    // trigger → visible
    opening_to_open: ANIMATION_MUST_BE_DEFINED,    // animation complete
    open_to_closing: ANIMATION_MUST_BE_DEFINED,    // dismiss triggered
    closing_to_closed: ANIMATION_MUST_BE_DEFINED,  // animation complete, cleanup
  },
};
