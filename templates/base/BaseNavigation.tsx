// kevlar/base/BaseNavigation.tsx (as shipped — all MUST_BE_DEFINED)
//
// Base template for all navigation components:
// Tabs (tab items), NavLink, Breadcrumbs, Pagination, Stepper,
// Timeline (interactive), Anchor (nav context)
//
// Navigation components use roving tabindex patterns — only one item
// in the group is tabbable at a time, arrow keys move between items.
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
// States — navigation items cycle through these states
// ─────────────────────────────────────────────────────────────────────────────
export const baseNavigationStates = {
  // Default resting state — nav item is visible but not selected
  idle: {
    visual: OBJECT_MUST_BE_DEFINED,      // text color, background, icon color
    audio: FUNCTION_MUST_BE_DEFINED,      // silent
    haptic: FUNCTION_MUST_BE_DEFINED,     // none
    screenreader: OBJECT_MUST_BE_DEFINED, // role="tab"/"link", label, position in set
  },
  // Pointer is over the nav item
  hover: {
    visual: OBJECT_MUST_BE_DEFINED,      // underline, background highlight, color shift
    audio: FUNCTION_MUST_BE_DEFINED,      // hover tick?
    haptic: FUNCTION_MUST_BE_DEFINED,     // light haptic?
    screenreader: OBJECT_MUST_BE_DEFINED, // any change?
  },
  // Nav item has keyboard focus (via roving tabindex)
  focused: {
    visual: OBJECT_MUST_BE_DEFINED,      // focus ring, highlight
    audio: FUNCTION_MUST_BE_DEFINED,      // focus chime?
    haptic: FUNCTION_MUST_BE_DEFINED,     // focus haptic?
    screenreader: OBJECT_MUST_BE_DEFINED, // announce label, position, selected state
  },
  // Nav item is currently selected/active
  active: {
    visual: OBJECT_MUST_BE_DEFINED,      // bold, underline, indicator bar, active background
    audio: FUNCTION_MUST_BE_DEFINED,      // activation sound?
    haptic: FUNCTION_MUST_BE_DEFINED,     // activation haptic?
    screenreader: OBJECT_MUST_BE_DEFINED, // aria-selected=true, aria-current
    announcement: STRING_MUST_BE_DEFINED, // e.g. "Tab 2 of 5, selected"
  },
  // Nav item is disabled/unavailable
  disabled: {
    visual: OBJECT_MUST_BE_DEFINED,      // grayed out, reduced opacity
    audio: FUNCTION_MUST_BE_DEFINED,      // denied sound?
    haptic: FUNCTION_MUST_BE_DEFINED,     // denied haptic?
    screenreader: OBJECT_MUST_BE_DEFINED, // aria-disabled, explanation
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Actions — navigation-specific behaviors
// ─────────────────────────────────────────────────────────────────────────────
export const baseNavigationActions = {
  onActivate: FUNCTION_MUST_BE_DEFINED,        // user selects a nav item — navigate? switch panel?
  onDeactivate: FUNCTION_MUST_BE_DEFINED,      // previously active item becomes inactive
  onWrapAround: FUNCTION_MUST_BE_DEFINED,      // arrow past last item — wrap to first? stop?
  onExitGroup: FUNCTION_MUST_BE_DEFINED,       // Tab out of nav group — where does focus go?
};

// ─────────────────────────────────────────────────────────────────────────────
// Input — roving tabindex keyboard pattern + other input methods
// ─────────────────────────────────────────────────────────────────────────────
export const baseNavigationInput = {
  touch: {
    onTap: FUNCTION_MUST_BE_DEFINED,           // activate nav item
    onSwipe: FUNCTION_MUST_BE_DEFINED,         // swipe between nav items? scroll?
    touchTargetSize: FUNCTION_MUST_BE_DEFINED, // min 44x44 per WCAG
  },
  mouse: {
    onLeftClick: FUNCTION_MUST_BE_DEFINED,     // activate nav item
    onHoverEnter: FUNCTION_MUST_BE_DEFINED,    // preview? tooltip?
    onHoverLeave: FUNCTION_MUST_BE_DEFINED,    // cancel preview?
  },
  // Roving tabindex keyboard bindings — the core navigation pattern
  keyboard: {
    bindings: {
      ArrowUp: FUNCTION_MUST_BE_DEFINED,       // move focus to previous item (vertical nav)
      ArrowDown: FUNCTION_MUST_BE_DEFINED,     // move focus to next item (vertical nav)
      ArrowLeft: FUNCTION_MUST_BE_DEFINED,     // move focus to previous item (horizontal nav)
      ArrowRight: FUNCTION_MUST_BE_DEFINED,    // move focus to next item (horizontal nav)
      Home: FUNCTION_MUST_BE_DEFINED,          // move focus to first item
      End: FUNCTION_MUST_BE_DEFINED,           // move focus to last item
      Enter: FUNCTION_MUST_BE_DEFINED,         // activate focused item
      Space: FUNCTION_MUST_BE_DEFINED,         // activate focused item
    },
    Tab: OBJECT_MUST_BE_DEFINED,               // Tab enters/exits the group (only one item tabbable)
    focusRing: FUNCTION_MUST_BE_DEFINED,       // focus ring style for keyboard navigation
  },
  remote_dpad: {
    onSelect: FUNCTION_MUST_BE_DEFINED,        // activate focused item
    onBack: FUNCTION_MUST_BE_DEFINED,          // go back to previous section
    onDirectional: FUNCTION_MUST_BE_DEFINED,   // navigate between items
    focusRing: OBJECT_MUST_BE_DEFINED,         // 10-foot UI focus ring
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Animation — indicator movement, state transitions
// ─────────────────────────────────────────────────────────────────────────────
export const baseNavigationAnimation = {
  enter: ANIMATION_MUST_BE_DEFINED,    // how does the nav appear on mount?
  exit: ANIMATION_MUST_BE_DEFINED,     // how does it disappear on unmount?
  transitions: {
    idle_to_hover: ANIMATION_MUST_BE_DEFINED,     // hover highlight
    idle_to_active: ANIMATION_MUST_BE_DEFINED,    // activation transition
    active_to_idle: ANIMATION_MUST_BE_DEFINED,    // deactivation transition
    idle_to_focused: ANIMATION_MUST_BE_DEFINED,   // focus ring appears
  },
  indicator: ANIMATION_MUST_BE_DEFINED,   // active indicator sliding between items
  panelSwitch: ANIMATION_MUST_BE_DEFINED, // content panel transition (for tabs)
};
