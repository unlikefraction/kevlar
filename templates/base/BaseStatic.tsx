// kevlar/base/BaseStatic.tsx (as shipped — all MUST_BE_DEFINED)
//
// Base template for all static/presentational components:
// Text, Title, Highlight, Mark, Code, Blockquote, List, Table,
// Badge, ThemeIcon, Avatar, Image (non-interactive), Divider,
// Paper, Box, Center, Stack, Group, SimpleGrid, Grid, Flex, Space,
// BackgroundImage, ColorSwatch, Timeline, Spoiler (display only)
//
// Static elements don't have many states, but they still need focus ring
// decisions (for keyboard navigation) and screenreader role definitions.
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
// States — static components have minimal states.
// They exist primarily for rendering and accessibility.
// ─────────────────────────────────────────────────────────────────────────────
export const baseStaticStates = {
  // Default and only visual state for most static elements
  idle: {
    visual: OBJECT_MUST_BE_DEFINED,      // typography, color, spacing, layout
    screenreader: OBJECT_MUST_BE_DEFINED, // role (e.g. "img", "heading", "list"), aria-label
  },
  // When the element receives focus (tabindex=0 or focusable container)
  focused: {
    visual: OBJECT_MUST_BE_DEFINED,      // focus ring — even static elements can be focused
    screenreader: OBJECT_MUST_BE_DEFINED, // what does the reader announce on focus?
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Input — static elements only need keyboard focus ring definition.
// No touch, mouse, or remote_dpad handlers — those belong on interactive
// wrappers if needed.
// ─────────────────────────────────────────────────────────────────────────────
export const baseStaticInput = {
  keyboard: {
    focusRing: FUNCTION_MUST_BE_DEFINED, // focus ring style — is this element even focusable?
    Tab: OBJECT_MUST_BE_DEFINED,         // tab order — should this be in the tab sequence?
  },
};
