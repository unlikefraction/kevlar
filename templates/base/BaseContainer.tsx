// kevlar/base/BaseContainer.tsx (as shipped — all MUST_BE_DEFINED)
//
// Base template for all container/layout components:
// Container, AppShell, Grid.Col, Accordion (wrapper), Tabs (wrapper),
// Card (non-interactive), Paper (non-interactive), AspectRatio,
// ScrollArea, Collapse (wrapper)
//
// Containers are minimal — they exist primarily so that every component
// in the tree passes Kevlar validation. A container with no base definition
// would fail the "every component must have a base" check.
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
// States — containers have a single state. They're structural wrappers.
// ─────────────────────────────────────────────────────────────────────────────
export const baseContainerStates = {
  // Default and only state — the container renders its children
  idle: {
    visual: OBJECT_MUST_BE_DEFINED, // padding, margin, max-width, background, border-radius
  },
};
