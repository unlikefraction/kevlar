// kevlar/base/BaseDisclosure.tsx (as shipped — all MUST_BE_DEFINED)
//
// Base template for all disclosure/expandable components:
// Accordion (item), Spoiler, Collapse, Fieldset (collapsible),
// NavLink (with children)
//
// Disclosure components toggle between open and closed states,
// revealing or hiding content. Key decisions: expand/collapse animation,
// toggle behavior, keyboard interaction.
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
// States — disclosure components toggle between open and closed
// ─────────────────────────────────────────────────────────────────────────────
export const baseDisclosureStates = {
  // Default resting state — trigger is visible, content may or may not be visible
  idle: {
    visual: OBJECT_MUST_BE_DEFINED,      // trigger appearance, chevron/icon direction
    audio: FUNCTION_MUST_BE_DEFINED,      // silent
    haptic: FUNCTION_MUST_BE_DEFINED,     // none
    screenreader: OBJECT_MUST_BE_DEFINED, // aria-expanded, aria-controls
  },
  // Pointer is over the disclosure trigger
  hover: {
    visual: OBJECT_MUST_BE_DEFINED,      // highlight trigger, cursor change
    audio: FUNCTION_MUST_BE_DEFINED,      // hover sound?
    haptic: FUNCTION_MUST_BE_DEFINED,     // light haptic?
    screenreader: OBJECT_MUST_BE_DEFINED, // any change?
  },
  // Trigger has keyboard focus
  focused: {
    visual: OBJECT_MUST_BE_DEFINED,      // focus ring on trigger
    audio: FUNCTION_MUST_BE_DEFINED,      // focus chime?
    haptic: FUNCTION_MUST_BE_DEFINED,     // focus haptic?
    screenreader: OBJECT_MUST_BE_DEFINED, // announce expanded/collapsed state
  },
  // Content is revealed
  open: {
    visual: OBJECT_MUST_BE_DEFINED,      // chevron rotated, content visible, border change
    audio: FUNCTION_MUST_BE_DEFINED,      // open sound? whoosh?
    haptic: FUNCTION_MUST_BE_DEFINED,     // open haptic?
    screenreader: OBJECT_MUST_BE_DEFINED, // aria-expanded=true
    announcement: STRING_MUST_BE_DEFINED, // e.g. "Section expanded"
  },
  // Content is hidden
  closed: {
    visual: OBJECT_MUST_BE_DEFINED,      // chevron default, content hidden
    audio: FUNCTION_MUST_BE_DEFINED,      // close sound?
    haptic: FUNCTION_MUST_BE_DEFINED,     // close haptic?
    screenreader: OBJECT_MUST_BE_DEFINED, // aria-expanded=false
    announcement: STRING_MUST_BE_DEFINED, // e.g. "Section collapsed"
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Actions — toggle behavior
// ─────────────────────────────────────────────────────────────────────────────
export const baseDisclosureActions = {
  onToggle: FUNCTION_MUST_BE_DEFINED,          // toggle open/closed — callback
  onOpenAll: FUNCTION_MUST_BE_DEFINED,         // expand all items (accordion context)
  onCloseAll: FUNCTION_MUST_BE_DEFINED,        // collapse all items
  onExclusiveOpen: FUNCTION_MUST_BE_DEFINED,   // opening one closes others? (accordion mode)
};

// ─────────────────────────────────────────────────────────────────────────────
// Input — how each input device interacts with disclosure trigger
// ─────────────────────────────────────────────────────────────────────────────
export const baseDisclosureInput = {
  touch: {
    onTap: FUNCTION_MUST_BE_DEFINED,           // toggle open/closed
    onSwipe: FUNCTION_MUST_BE_DEFINED,         // swipe to open? swipe to close?
    touchTargetSize: FUNCTION_MUST_BE_DEFINED, // min 44x44 per WCAG
  },
  mouse: {
    onLeftClick: FUNCTION_MUST_BE_DEFINED,     // toggle open/closed
    onHoverEnter: FUNCTION_MUST_BE_DEFINED,    // preview content on hover?
    onHoverLeave: FUNCTION_MUST_BE_DEFINED,    // hide preview?
  },
  keyboard: {
    bindings: {
      Enter: FUNCTION_MUST_BE_DEFINED,         // toggle open/closed
      Space: FUNCTION_MUST_BE_DEFINED,         // toggle open/closed
      ArrowUp: FUNCTION_MUST_BE_DEFINED,       // move to previous disclosure item
      ArrowDown: FUNCTION_MUST_BE_DEFINED,     // move to next disclosure item
      Home: FUNCTION_MUST_BE_DEFINED,          // move to first disclosure item
      End: FUNCTION_MUST_BE_DEFINED,           // move to last disclosure item
    },
    Tab: OBJECT_MUST_BE_DEFINED,               // tab into content when open? skip when closed?
    focusRing: FUNCTION_MUST_BE_DEFINED,       // focus ring on trigger
  },
  remote_dpad: {
    onSelect: FUNCTION_MUST_BE_DEFINED,        // toggle open/closed
    onBack: FUNCTION_MUST_BE_DEFINED,          // collapse if open? go back if closed?
    onDirectional: FUNCTION_MUST_BE_DEFINED,   // navigate between disclosure items
    focusRing: OBJECT_MUST_BE_DEFINED,         // 10-foot UI focus ring
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Animation — expand/collapse, chevron rotation, content reveal
// ─────────────────────────────────────────────────────────────────────────────
export const baseDisclosureAnimation = {
  enter: ANIMATION_MUST_BE_DEFINED,    // how does the disclosure appear on mount?
  exit: ANIMATION_MUST_BE_DEFINED,     // how does it disappear on unmount?
  transitions: {
    closed_to_open: ANIMATION_MUST_BE_DEFINED,   // expand content — height animation
    open_to_closed: ANIMATION_MUST_BE_DEFINED,   // collapse content — height animation
    idle_to_hover: ANIMATION_MUST_BE_DEFINED,    // trigger hover effect
    idle_to_focused: ANIMATION_MUST_BE_DEFINED,  // focus ring on trigger
  },
  chevronRotation: ANIMATION_MUST_BE_DEFINED,  // chevron/icon rotation on toggle
  contentReveal: ANIMATION_MUST_BE_DEFINED,    // content fade/slide as it appears
};
