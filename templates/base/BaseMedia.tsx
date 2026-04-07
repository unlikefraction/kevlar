// kevlar/base/BaseMedia.tsx (as shipped — all MUST_BE_DEFINED)
//
// Base template for all media components:
// Image, BackgroundImage, Avatar (with image), Video (if added),
// Carousel (media items)
//
// Media components have unique concerns: loading strategy (eager vs lazy),
// LQIP (Low Quality Image Placeholder), offline fallbacks, error states,
// and network-adaptive quality selection.
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
// States — media components have a loading lifecycle:
// idle → loading → loaded (success) or error
// ─────────────────────────────────────────────────────────────────────────────
export const baseMediaStates = {
  // Media element exists but hasn't started loading
  idle: {
    visual: OBJECT_MUST_BE_DEFINED,      // placeholder, skeleton, LQIP, blank space?
    audio: FUNCTION_MUST_BE_DEFINED,      // silent
    haptic: FUNCTION_MUST_BE_DEFINED,     // none
    screenreader: OBJECT_MUST_BE_DEFINED, // role="img", alt text source, aria-label
  },
  // Media is being fetched/decoded
  loading: {
    visual: OBJECT_MUST_BE_DEFINED,      // skeleton shimmer, LQIP blur, progress bar, spinner?
    audio: FUNCTION_MUST_BE_DEFINED,      // loading sound?
    haptic: FUNCTION_MUST_BE_DEFINED,     // none
    screenreader: OBJECT_MUST_BE_DEFINED, // "Image loading" announcement
    announcement: STRING_MUST_BE_DEFINED, // e.g. "Loading image"
  },
  // Media has loaded successfully
  loaded: {
    visual: OBJECT_MUST_BE_DEFINED,      // full resolution image, fade-in from placeholder
    audio: FUNCTION_MUST_BE_DEFINED,      // loaded sound?
    haptic: FUNCTION_MUST_BE_DEFINED,     // none
    screenreader: OBJECT_MUST_BE_DEFINED, // alt text, role, dimensions
  },
  // Media failed to load
  error: {
    visual: OBJECT_MUST_BE_DEFINED,      // broken image icon, fallback image, error message
    audio: FUNCTION_MUST_BE_DEFINED,      // error sound?
    haptic: FUNCTION_MUST_BE_DEFINED,     // error haptic?
    screenreader: OBJECT_MUST_BE_DEFINED, // announce error, provide alt text fallback
    announcement: STRING_MUST_BE_DEFINED, // e.g. "Image failed to load"
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Network — media components are heavily network-dependent.
// These decisions directly impact Core Web Vitals (LCP, CLS).
// ─────────────────────────────────────────────────────────────────────────────
export const baseMediaNetwork = {
  onFast: FUNCTION_MUST_BE_DEFINED,    // load full resolution, prefetch, eager loading
  onSlow: FUNCTION_MUST_BE_DEFINED,    // load lower quality, defer offscreen, LQIP longer
  onOffline: FUNCTION_MUST_BE_DEFINED, // show cached version? show placeholder? show error?

  // Loading strategy decisions
  loadingStrategy: FUNCTION_MUST_BE_DEFINED,   // lazy vs eager vs auto — when does loading start?
  qualitySelection: FUNCTION_MUST_BE_DEFINED,  // which resolution/format based on device + network?
  prefetchStrategy: FUNCTION_MUST_BE_DEFINED,  // prefetch next images? how many? when?
  cacheStrategy: FUNCTION_MUST_BE_DEFINED,     // service worker cache? browser cache? CDN hints?
};

// ─────────────────────────────────────────────────────────────────────────────
// Fallback — what happens when media can't be loaded
// ─────────────────────────────────────────────────────────────────────────────
export const baseMediaFallback = {
  onError: FUNCTION_MUST_BE_DEFINED,           // show fallback image? retry? hide element?
  fallbackImage: STRING_MUST_BE_DEFINED,       // URL or data URI for fallback image
  retryCount: NUMBER_MUST_BE_DEFINED,          // how many times to retry loading?
  retryDelayMs: NUMBER_MUST_BE_DEFINED,        // delay between retries
  onAllRetriesFailed: FUNCTION_MUST_BE_DEFINED, // final fallback behavior
  lqip: FUNCTION_MUST_BE_DEFINED,              // Low Quality Image Placeholder strategy
  blurhash: STRING_MUST_BE_DEFINED,            // BlurHash string for placeholder? or skip?
};

// ─────────────────────────────────────────────────────────────────────────────
// Animation — loading transitions, reveal effects
// ─────────────────────────────────────────────────────────────────────────────
export const baseMediaAnimation = {
  enter: ANIMATION_MUST_BE_DEFINED,    // how does the media element appear on mount?
  exit: ANIMATION_MUST_BE_DEFINED,     // how does it disappear on unmount?
  transitions: {
    idle_to_loading: ANIMATION_MUST_BE_DEFINED,   // placeholder appears
    loading_to_loaded: ANIMATION_MUST_BE_DEFINED, // LQIP → full image crossfade
    loading_to_error: ANIMATION_MUST_BE_DEFINED,  // show error state
  },
  shimmer: ANIMATION_MUST_BE_DEFINED,      // skeleton shimmer while loading
  reveal: ANIMATION_MUST_BE_DEFINED,       // image reveal effect (fade, blur-up, slide)
  placeholder: ANIMATION_MUST_BE_DEFINED,  // LQIP/blurhash animation while loading
};
