// kevlar/design.config.ts
//
// One file. Every component imports from it.
// This is your project's design language across all sensory channels.
// Change it once, it changes everywhere.

import { defineDesignConfig } from '@unlikefraction/kevlar/runtime';

export default defineDesignConfig({

  // ─── COLORS ──────────────────────────────────────────────────
  // Semantic tokens. Resolve through Mantine theme at runtime.
  // Every component references these by name, never by hex.
  colors: {
    focus:          'theme.primaryColor',
    success:        'theme.colors.green.6',
    error:          'theme.colors.red.6',
    warning:        'theme.colors.yellow.6',
    info:           'theme.colors.blue.6',
    border: {
      default:      'theme.colors.gray.3',
      strong:       'theme.colors.gray.7',
    },
    text: {
      primary:      'theme.colors.dark.9',
      muted:        'theme.colors.gray.6',
      disabled:     'theme.colors.gray.4',
    },
    bg: {
      disabled:     'theme.colors.gray.1',
    },
  },

  // ─── TYPOGRAPHY ──────────────────────────────────────────────
  typography: {
    fontFamily: {
      body:     'theme.fontFamily',
      mono:     'theme.fontFamilyMonospace',
    },
    fontSize: {
      xs: 12, sm: 14, md: 16, lg: 18, xl: 20,
    },
    fontWeight: {
      normal: 400, medium: 500, semibold: 600, bold: 700,
    },
    lineHeight: {
      tight: 1.25, normal: 1.5, relaxed: 1.75,
    },
    // mobile inputs must be 16px to prevent iOS zoom
    mobileInputFontSize: 16,
  },

  // ─── SPACING ─────────────────────────────────────────────────
  spacing: {
    0: 0, xs: 4, sm: 8, md: 16, lg: 24, xl: 32,
  },

  // ─── BORDER RADIUS ───────────────────────────────────────────
  radius: {
    none: 0, xs: 2, sm: 4, md: 8, lg: 16, xl: 32, full: 9999,
  },

  // ─── SHADOWS ─────────────────────────────────────────────────
  shadows: {
    none: 'none',
    low:  '0 1px 2px rgba(0,0,0,0.05)',
    mid:  '0 4px 6px rgba(0,0,0,0.07)',
    high: '0 10px 15px rgba(0,0,0,0.1)',
  },

  // ─── SOUNDS ──────────────────────────────────────────────────
  // The sound palette. playSound('click') looks up 'click' here.
  // Set any entry to null to disable that sound project-wide.
  // Value can be: URL string, AudioBuffer, or () => void.
  sounds: {
    click:    '/sounds/click.mp3',
    success:  '/sounds/success.mp3',
    error:    '/sounds/error.mp3',
    warning:  '/sounds/warning.mp3',
    open:     '/sounds/open.mp3',
    close:    '/sounds/close.mp3',
  },

  // ─── HAPTICS ─────────────────────────────────────────────────
  // The haptic palette. fireHaptic('tap') looks up 'tap' here.
  // Values are vibration patterns: [duration, gap, duration, ...] in ms.
  // Set any entry to null to disable.
  haptics: {
    tap:      [10],
    success:  [10, 30, 10],
    error:    [10, 10, 10, 10, 10],
    warning:  [40],
  },

  // ─── ANIMATION ───────────────────────────────────────────────

  // Duration tokens. Referenced as 'fast', 'normal', etc. in animation configs.
  duration: {
    instant: 0,
    fast:    100,
    normal:  200,
    slow:    350,
    glacial: 500,
  },

  // Easing curves. Referenced by name in animation configs.
  easing: {
    default:  'cubic-bezier(0.4, 0.0, 0.2, 1)',
    in:       'cubic-bezier(0.4, 0.0, 1, 1)',
    out:      'cubic-bezier(0.0, 0.0, 0.2, 1)',
    inOut:    'cubic-bezier(0.4, 0.0, 0.2, 1)',
    spring:   'cubic-bezier(0.34, 1.56, 0.64, 1)',
    linear:   'cubic-bezier(0, 0, 1, 1)',
  },

  // Named animation presets. Components can reference these by name
  // or define inline configs using the duration/easing tokens above.
  animationPresets: {
    fadeIn:      { type: 'fade', duration: 'fast', easing: 'out' },
    fadeOut:     { type: 'fade', duration: 'fast', easing: 'in' },
    scalePress:  { type: 'scale', duration: 'instant' },
    springHover: { type: 'spring', duration: 'fast', easing: 'spring' },
    shake:       { type: 'shake', duration: 'normal' },
    slideUp:     { type: 'slide', direction: 'up', duration: 'normal', easing: 'out' },
    slideDown:   { type: 'slide', direction: 'down', duration: 'normal', easing: 'in' },
    slideLeft:   { type: 'slide', direction: 'left', duration: 'normal', easing: 'out' },
    slideRight:  { type: 'slide', direction: 'right', duration: 'normal', easing: 'out' },
    shimmer:     { type: 'shimmer', duration: 1500, easing: 'linear', loop: true },
    spin:        { type: 'spin', duration: 'slow', easing: 'linear', loop: true },
    none:        { type: 'none' },
    instant:     { type: 'none', duration: 'instant' },
  },

  // ─── SENSORY BUDGET ──────────────────────────────────────────
  // Rate limits to prevent sensory overload from rapid-fire interactions.
  sensoryBudget: {
    haptic:       { maxFires: 3, windowMs: 500 },
    audio:        { maxFires: 1, windowMs: 200 },
    announcement: { maxFires: 1, windowMs: 300, queue: true },  // announcements queue, never drop
  },

  // ─── FOCUS RING ──────────────────────────────────────────────
  // The default focus ring. Components import and use this.
  focusRing: {
    width:  3,
    color:  'focus',
    offset: 2,
    style:  'solid',
  },

  // ─── TOUCH TARGETS ───────────────────────────────────────────
  // Minimum interactive touch sizes per platform.
  touchTargets: {
    small_mobile: { width: 48, height: 48 },
    mobile:       { width: 48, height: 48 },
    tablet:       { width: 44, height: 44 },
    desktop:      { width: 44, height: 44 },   // for touch-enabled desktops
    widescreen:   { width: 44, height: 44 },
    tv:           { width: 44, height: 44 },
  },

  // ─── BREAKPOINTS ─────────────────────────────────────────────
  // Viewport pixel values that define each platform.
  // isMobile() checks against these. Change here, changes everywhere.
  breakpoints: {
    small_mobile: { max: 359 },
    mobile:       { min: 360, max: 767 },
    tablet:       { min: 768, max: 1023 },
    desktop:      { min: 1024, max: 1439 },
    widescreen:   { min: 1440, max: 1919 },
    tv:           { min: 1920 },
  },

  // ─── Z-INDEX ─────────────────────────────────────────────────
  // Layer ordering so overlays don't fight each other.
  zIndex: {
    dropdown:       100,
    sticky:         200,
    overlay:        300,
    modal:          400,
    popover:        500,
    tooltip:        600,
    notification:   700,
    floatingWindow: 800,
  },

  // ─── TIMING DEFAULTS ────────────────────────────────────────
  // Starting values for timing-related slots. Components can override.
  timing: {
    defaultTimeoutMs:      15000,
    defaultDebounceMs:     300,
    autoDismissMs:         5000,     // notifications
    hoverOpenDelayMs:      200,      // hover cards, tooltips
    hoverCloseDelayMs:     300,      // hover cards
    successRevertMs:       2000,     // CopyButton success → idle
  },

  // ─── TV ──────────────────────────────────────────────────────
  // TV-specific design tokens (10-foot UI).
  tv: {
    focusRing: { width: 8, color: 'focus', offset: 4, style: 'solid', glow: true },
    focusScale: 1.05,
  },

});
