# Kevlar: Complete Implementation Specification

Version 0.3 / Mantine v9 / April 2026

---

## How to Read This Document

Kevlar is a scaffold. It forces devs to make conscious decisions about every dimension of user interaction. It fills what it knows. It leaves blank what it can't know. If a blank isn't filled, the element doesn't render.

This doc defines:

1. **The Design Config** — one file per project. Colors, sounds, haptics, animation curves, timing defaults, touch targets, breakpoints. Every component file imports from this. Change it once, it changes everywhere.
2. **Targets** — the 17 required dimensions every component must handle (platform, network, accessibility, input method, silent mode) plus 2 special targets (low battery, user segment). Kevlar detects all of them. Every component reacts to all of them.
3. **The Sentinel Constants** — `FUNCTION_MUST_BE_DEFINED`, `STRING_MUST_BE_DEFINED`, etc. Every unfilled slot in a base or component file uses these. If any survive to render time, the component throws with an error showing exactly what to fill.
4. **The Component Files** — 108 user-facing `.tsx` files generated into your project plus 9 base components and 1 design config. All ship full of `MUST_BE_DEFINED` markers. The tech lead fills them. The devs fill what's left. Your code. In your repo.
5. **Component Specs** — what each of the 108 components overrides from its base and what blanks it adds.

---

## 1. The Design Config

One file. `kevlar/design.config.ts`. Every component file imports from it. It's the project's design language across all sensory channels.

```ts
// kevlar/design.config.ts

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
```

Every component file does `import config from '../design.config';` and references values like `config.shadows.low`, `config.focusRing`, `config.sounds.click`, `config.touchTargets.mobile`, `config.animationPresets.springHover`, etc.

Change a sound file path here, every component that uses that sound changes. Change the focus ring width here, every component's focus ring changes. Change the breakpoint for "mobile" here, every `isMobile()` call recalibrates.

---

## 2. Targets

Targets are the dimensions every component must consciously handle. Kevlar detects them. The component reacts.

### 2.1 Required Targets (17)

Every component file must import and use all 17. You can't ship a Kevlar app that ignores TV users, or color blind users, or slow networks, or muted phones. That's the deal.

**Platform (6):**

| Target | Detection | What the component must decide |
|--------|-----------|-------------------------------|
| `isSmallMobile()` | viewport < breakpoints.small_mobile.max | Touch target size, layout, font size, simplified animations |
| `isMobile()` | viewport in mobile range | Touch targets, bottom-sheet overlays, simplified interactions |
| `isTablet()` | viewport in tablet range | Touch targets, layout density |
| `isDesktop()` | viewport in desktop range | Hover states, keyboard shortcuts, information density |
| `isWidescreen()` | viewport in widescreen range | Layout, content width |
| `isTV()` | viewport >= breakpoints.tv.min | 10-foot focus rings, scale on focus, remote/d-pad input, larger text |

**Network (3):**

| Target | Detection | What the component must decide |
|--------|-----------|-------------------------------|
| `isFast()` | online + good connection | Proceed normally? Preload? |
| `isSlow()` | effectiveType is 2g/slow-2g | Show loading immediately? Degrade gracefully? Show placeholder? |
| `isOffline()` | navigator.onLine === false | Disable? Queue? Show cached? Show message? |

**Accessibility (4):**

| Target | Detection | What the component must decide |
|--------|-----------|-------------------------------|
| `prefersReducedMotion()` | prefers-reduced-motion: reduce | Strip all animation, keep opacity fades only |
| `prefersHighContrast()` | prefers-contrast: more / forced-colors | Add visible borders, stronger outlines, thicker focus rings |
| `isKeyboardOnly()` | Tab/Arrow detected, no mouse/touch | Focus ring always visible |
| `isColorBlind()` | Set via KevlarProvider prop | Never communicate state through color alone (add icons, patterns, text) |

**Input Method (3):**

| Target | Detection | What the component must decide |
|--------|-----------|-------------------------------|
| `isTouchDevice()` | touchstart detected / pointer: coarse | Touch targets, instant feedback, swipe gestures |
| `isMouseDevice()` | mousemove detected / pointer: fine | Hover states, right-click, drag-and-drop |
| `isDpadDevice()` | TV platform + remote detected | Directional navigation, select/back mapping, large focus indicators |

**System (1):**

| Target | Detection | What the component must decide |
|--------|-----------|-------------------------------|
| `isSilentMode()` | System mute detection | If your component plays audio on press/success/error, what happens when the user is muted? Enhance haptic instead? Enhance visual feedback? Do nothing? You decide, but you must decide. |

### 2.2 Special Targets (2)

Available but not mandatory per component. For specific situations.

| Target | Detection | Used for |
|--------|-----------|----------|
| `isLowBattery()` | navigator.getBattery() < 15% | Components with haptic. When low battery, `fireHaptic()` is a no-op. Component can optionally enhance visual feedback instead. |
| `getUserSegment()` | localStorage `kevlar-user-segment` | Returns `'first_time'` / `'normal'` / `'power'`. Components can adjust animation speed, feedback verbosity, onboarding hints. Not every component needs to differ across segments. |

### 2.3 How Targets Are Used

No override objects. No platform blocks. Just the primitives called inline where they matter.

```tsx
// inside a component file — the hover visual for a button
hover: {
  visual: (ctx) => ({
    cursor: 'pointer',
    opacity: 1,
    shadow: isTV() ? config.shadows.high : config.shadows.low,
    translateY: isTV() ? 0 : -1,
    scale: isTV() ? config.tv.focusScale : 1,
  }),
},

// inside a component file — the animation for enter
enter: () => {
  if (prefersReducedMotion()) return config.animationPresets.none;
  if (getUserSegment() === 'power') return config.animationPresets.instant;
  return config.animationPresets.fadeIn;
},

// inside a component file — network handling
onFast:    (ctx) => {},
onSlow:    (ctx) => { ctx.setState('loading'); },
onOffline: (ctx) => { ctx.setState('disabled'); ctx.setText('You are offline'); },
```

The primitive is called at the point of use. The config value is referenced by name. No abstraction between the question ("are we on TV?") and the answer ("use a bigger shadow").

---

---

## 3. The Sentinel Constants

Kevlar exports constants that act as markers. They mean "the developer has not made a decision here yet." If any of these are still present at render time, the component throws in dev mode with an error showing exactly which slot needs filling.

```ts
// @unlikefraction/kevlar/sentinels

export const FUNCTION_MUST_BE_DEFINED: unique symbol;
export const STRING_MUST_BE_DEFINED: unique symbol;
export const NUMBER_MUST_BE_DEFINED: unique symbol;
export const OBJECT_MUST_BE_DEFINED: unique symbol;
export const BOOLEAN_MUST_BE_DEFINED: unique symbol;
export const ANIMATION_MUST_BE_DEFINED: unique symbol;
```

Every base component and every component file ships full of these. The tech lead's job is to replace every single one. The dev's job is to replace the ones the tech lead left for per-instance decisions.

The dev experience of setting up a Kevlar project is not pleasant. You open `BaseInteractive.tsx` and it's wall-to-wall `MUST_BE_DEFINED`. That's the point. By the time you're done, you've thought about every state, every target, every edge case for every kind of element in your app. The output is worth the cost.

### 3.1 How They Flow

```
Base component (kevlar/base/BaseInteractive.tsx)
  └─ 90% MUST_BE_DEFINED markers
  └─ Tech lead replaces them with project defaults
         │
Component file (kevlar/components/Button.tsx)
  └─ Imports from base
  └─ Overrides what's Button-specific
  └─ Some slots still MUST_BE_DEFINED (per-instance decisions)
         │
Instance (<Button onKevlarAction={...} announce={...} />)
  └─ Fills the remaining MUST_BE_DEFINED slots via props
  └─ If any MUST_BE_DEFINED survives to render → error
```

### 3.2 What the Error Looks Like

```
Kevlar: Button "Add Todo" cannot render.

  states.loading.announcement = STRING_MUST_BE_DEFINED
  ─ What should the screen reader announce when this button is loading?
  ─ Pass `announce={{ loading: 'Adding todo...' }}` to this Button instance.

  network.onOffline = FUNCTION_MUST_BE_DEFINED
  ─ What happens when the user clicks this button with no internet?
  ─ Define `network.onOffline` in kevlar/base/BaseInteractive.tsx for all buttons,
    or in kevlar/components/Button.tsx for all buttons,
    or pass `network={{ onOffline: (ctx) => { ... } }}` to this instance.
```

The error tells you exactly what's missing, which slot it is, and where to fill it (base, component file, or instance).

---

## 4. The Component Files

### 4.1 Folder Structure

```bash
npx kevlar init
```

Creates:

```
your-project/
  kevlar/
    design.config.ts            # the design config (Section 1)

    base/                       # 9 base components — the scaffolding
      BaseInteractive.tsx
      BaseInput.tsx
      BaseStatic.tsx
      BaseOverlay.tsx
      BaseContainer.tsx
      BaseFeedback.tsx
      BaseNavigation.tsx
      BaseDisclosure.tsx
      BaseMedia.tsx

    components/                 # 108 component files
      Button.tsx
      ActionIcon.tsx
      CloseButton.tsx
      TextInput.tsx
      NumberInput.tsx
      Modal.tsx
      Image.tsx
      ... (108 files total)

    index.ts                    # re-exports everything
```

Every file is user-facing. In your project. In your repo. Reviewed in PRs. When a new dev joins, they open the files and read exactly how everything works.

### 4.2 What a Base Component Looks Like (Out of the Box)

When you first run `npx kevlar init`, the base components are almost entirely `MUST_BE_DEFINED`. This is what the tech lead opens on day one:

```tsx
// kevlar/base/BaseInteractive.tsx (as shipped)

import config from '../design.config';
import {
  // Required targets (17)
  isSmallMobile, isMobile, isTablet, isDesktop, isWidescreen, isTV,
  isFast, isSlow, isOffline,
  prefersReducedMotion, prefersHighContrast, isKeyboardOnly, isColorBlind,
  isTouchDevice, isMouseDevice, isDpadDevice,
  isSilentMode,
  // Special targets (2)
  isLowBattery, getUserSegment,
  // Action primitives
  playSound, fireHaptic, announce, moveFocus,
} from '@unlikefraction/kevlar/primitives';
import {
  FUNCTION_MUST_BE_DEFINED,
  STRING_MUST_BE_DEFINED,
  NUMBER_MUST_BE_DEFINED,
  OBJECT_MUST_BE_DEFINED,
  ANIMATION_MUST_BE_DEFINED,
} from '@unlikefraction/kevlar/sentinels';
import type { KevlarContext, Trigger } from '@unlikefraction/kevlar/types';


// ─── STATES ────────────────────────────────────────────────────
//
// 8 states × 4 modalities = 32 slots. Fill them all.

export const baseInteractiveStates = {

  idle: {
    visual:       OBJECT_MUST_BE_DEFINED,
    audio:        FUNCTION_MUST_BE_DEFINED,
    haptic:       FUNCTION_MUST_BE_DEFINED,
    screenreader: OBJECT_MUST_BE_DEFINED,   // { role: 'button' } at minimum
  },

  hover: {
    visual:       OBJECT_MUST_BE_DEFINED,   // what does hover look like?
    audio:        FUNCTION_MUST_BE_DEFINED,  // sound on hover? probably () => {}
    haptic:       FUNCTION_MUST_BE_DEFINED,  // haptic on hover? probably () => {}
    screenreader: OBJECT_MUST_BE_DEFINED,
  },

  focused: {
    visual:       OBJECT_MUST_BE_DEFINED,   // must include a focus ring
    audio:        FUNCTION_MUST_BE_DEFINED,
    haptic:       FUNCTION_MUST_BE_DEFINED,
    screenreader: OBJECT_MUST_BE_DEFINED,
  },

  pressed: {
    visual:       OBJECT_MUST_BE_DEFINED,   // what does pressed look like? scale? color?
    audio:        FUNCTION_MUST_BE_DEFINED,  // click sound? use playSound(config.sounds.click)
    haptic:       FUNCTION_MUST_BE_DEFINED,  // tap haptic? use fireHaptic(config.haptics.tap)
    screenreader: OBJECT_MUST_BE_DEFINED,
  },

  loading: {
    visual:       OBJECT_MUST_BE_DEFINED,   // spinner? shimmer? disabled look?
    audio:        FUNCTION_MUST_BE_DEFINED,
    haptic:       FUNCTION_MUST_BE_DEFINED,
    screenreader: OBJECT_MUST_BE_DEFINED,   // must include liveRegion + busy state
    announcement: STRING_MUST_BE_DEFINED,   // "What is loading?" — per instance
  },

  success: {
    visual:       OBJECT_MUST_BE_DEFINED,
    audio:        FUNCTION_MUST_BE_DEFINED,  // success chime? use playSound(config.sounds.success)
    haptic:       FUNCTION_MUST_BE_DEFINED,  // success haptic? use fireHaptic(config.haptics.success)
    screenreader: OBJECT_MUST_BE_DEFINED,
    announcement: STRING_MUST_BE_DEFINED,   // "What succeeded?" — per instance
  },

  error: {
    visual:       OBJECT_MUST_BE_DEFINED,
    audio:        FUNCTION_MUST_BE_DEFINED,  // error sound? use playSound(config.sounds.error)
    haptic:       FUNCTION_MUST_BE_DEFINED,  // error haptic? use fireHaptic(config.haptics.error)
    screenreader: OBJECT_MUST_BE_DEFINED,   // must include liveRegion assertive
    announcement: STRING_MUST_BE_DEFINED,   // "What failed?" — per instance
  },

  disabled: {
    visual:       OBJECT_MUST_BE_DEFINED,
    audio:        FUNCTION_MUST_BE_DEFINED,
    haptic:       FUNCTION_MUST_BE_DEFINED,
    screenreader: OBJECT_MUST_BE_DEFINED,   // must include disabled state
  },

};


// ─── USER ACTIONS ──────────────────────────────────────────────

export const baseInteractiveActions = {
  onRageClick:          FUNCTION_MUST_BE_DEFINED,  // what happens on rage click?
  onDoubleClick:        FUNCTION_MUST_BE_DEFINED,  // what happens on double click?
  onClickDuringLoading: FUNCTION_MUST_BE_DEFINED,  // what happens if they click while loading?
  onFocusEscape:        FUNCTION_MUST_BE_DEFINED,  // what happens if they tab away during async?
};


// ─── INPUT ─────────────────────────────────────────────────────

export const baseInteractiveInput = {
  touch: {
    onTap:       FUNCTION_MUST_BE_DEFINED,
    onDoubleTap: FUNCTION_MUST_BE_DEFINED,
    onLongPress: FUNCTION_MUST_BE_DEFINED,
    onSwipe:     FUNCTION_MUST_BE_DEFINED,
    onPinch:     FUNCTION_MUST_BE_DEFINED,
    touchTargetSize: FUNCTION_MUST_BE_DEFINED,  // return { width, height } using config.touchTargets
    instantFeedback: BOOLEAN_MUST_BE_DEFINED,
  },
  mouse: {
    onLeftClick:   FUNCTION_MUST_BE_DEFINED,
    onRightClick:  FUNCTION_MUST_BE_DEFINED,
    onMiddleClick: FUNCTION_MUST_BE_DEFINED,
    onDoubleClick: FUNCTION_MUST_BE_DEFINED,
    onHoverEnter:  FUNCTION_MUST_BE_DEFINED,
    onHoverLeave:  FUNCTION_MUST_BE_DEFINED,
    onScroll:      FUNCTION_MUST_BE_DEFINED,
    onDragAndDrop: FUNCTION_MUST_BE_DEFINED,
  },
  keyboard: {
    bindings: {
      Enter:  FUNCTION_MUST_BE_DEFINED,
      Space:  FUNCTION_MUST_BE_DEFINED,
      Escape: FUNCTION_MUST_BE_DEFINED,
    },
    Tab:      OBJECT_MUST_BE_DEFINED,    // { trap: boolean }
    focusRing: FUNCTION_MUST_BE_DEFINED,  // return focus ring config using config.focusRing
  },
  remote_dpad: {
    onSelect:      FUNCTION_MUST_BE_DEFINED,
    onBack:        FUNCTION_MUST_BE_DEFINED,
    onDirectional: FUNCTION_MUST_BE_DEFINED,
    focusRing:     OBJECT_MUST_BE_DEFINED,  // use config.tv.focusRing
  },
};


// ─── NETWORK ───────────────────────────────────────────────────

export const baseInteractiveNetwork = {
  onFast:    FUNCTION_MUST_BE_DEFINED,  // what happens on a good connection?
  onSlow:    FUNCTION_MUST_BE_DEFINED,  // what happens on a bad connection?
  onOffline: FUNCTION_MUST_BE_DEFINED,  // what happens with no connection?
};


// ─── TIMING ────────────────────────────────────────────────────

export const baseInteractiveTiming = {
  timeoutMs:   NUMBER_MUST_BE_DEFINED,   // use config.timing.defaultTimeoutMs or pick your own
  onTimeout:   FUNCTION_MUST_BE_DEFINED, // what happens when the action times out?
  debounceMs:  NUMBER_MUST_BE_DEFINED,
  triggers:    [],                        // empty by default, filled per instance
  minLoadTime: null,                      // null by default, filled per instance
};


// ─── ANIMATION ─────────────────────────────────────────────────

export const baseInteractiveAnimation = {
  enter:            ANIMATION_MUST_BE_DEFINED,
  exit:             ANIMATION_MUST_BE_DEFINED,
  transitions: {
    idle_to_hover:       ANIMATION_MUST_BE_DEFINED,
    hover_to_idle:       ANIMATION_MUST_BE_DEFINED,
    idle_to_pressed:     ANIMATION_MUST_BE_DEFINED,
    pressed_to_loading:  ANIMATION_MUST_BE_DEFINED,
    loading_to_success:  ANIMATION_MUST_BE_DEFINED,
    loading_to_error:    ANIMATION_MUST_BE_DEFINED,
  },
  microFeedback:    ANIMATION_MUST_BE_DEFINED,
  loadingAnimation: ANIMATION_MUST_BE_DEFINED,
};
```

That's what the tech lead sees. Wall-to-wall `MUST_BE_DEFINED`. Every slot a question. Every question needs an answer.

### 4.3 After the Tech Lead Fills It In

```tsx
// kevlar/base/BaseInteractive.tsx (after tech lead fills it in)

export const baseInteractiveStates = {

  idle: {
    visual: { cursor: 'pointer', opacity: 1 },
    audio:  (ctx: KevlarContext) => {},
    haptic: (ctx: KevlarContext) => {},
    screenreader: { role: 'button' as const },
  },

  hover: {
    visual: (ctx: KevlarContext) => ({
      cursor: 'pointer',
      opacity: 1,
      shadow: isTV() ? config.shadows.high : config.shadows.low,
      translateY: isTV() ? 0 : -1,
      scale: isTV() ? config.tv.focusScale : 1,
    }),
    audio:  (ctx: KevlarContext) => {},
    haptic: (ctx: KevlarContext) => {},
    screenreader: { role: 'button' as const },
  },

  focused: {
    visual: (ctx: KevlarContext) => ({
      cursor: 'pointer',
      opacity: 1,
      outline: {
        width: isTV() ? config.tv.focusRing.width : prefersHighContrast() ? 4 : config.focusRing.width,
        color: config.focusRing.color,
        offset: isTV() ? config.tv.focusRing.offset : config.focusRing.offset,
        style: config.focusRing.style,
      },
      ...(prefersHighContrast() && {
        borderWidth: 3, borderStyle: 'solid', borderColor: config.colors.focus,
      }),
    }),
    audio:  (ctx: KevlarContext) => {},
    haptic: (ctx: KevlarContext) => {},
    screenreader: { role: 'button' as const },
  },

  pressed: {
    visual: { cursor: 'pointer', scale: 0.97, opacity: 0.95 },
    audio:  (ctx: KevlarContext) => {
      if (!isSilentMode()) playSound(config.sounds.click);
    },
    haptic: (ctx: KevlarContext) => { fireHaptic(config.haptics.tap); },
    screenreader: { role: 'button' as const },
  },

  loading: {
    visual: { cursor: 'wait', opacity: 0.9 },
    audio:  (ctx: KevlarContext) => {},
    haptic: (ctx: KevlarContext) => {},
    screenreader: {
      role: 'button' as const,
      liveRegion: 'polite' as const,
      state: { busy: true },
    },
    announcement: STRING_MUST_BE_DEFINED,  // stays blank — per instance
  },

  success: {
    visual: { cursor: 'default', opacity: 1 },
    audio:  (ctx: KevlarContext) => {
      if (!isSilentMode()) playSound(config.sounds.success);
      // silent mode: enhance visual feedback instead
      if (isSilentMode()) { /* tech lead decides what to do */ }
    },
    haptic: (ctx: KevlarContext) => { fireHaptic(config.haptics.success); },
    screenreader: { role: 'button' as const, liveRegion: 'polite' as const },
    announcement: STRING_MUST_BE_DEFINED,  // stays blank — per instance
  },

  error: {
    visual: { cursor: 'default', opacity: 1 },
    audio:  (ctx: KevlarContext) => {
      if (!isSilentMode()) playSound(config.sounds.error);
    },
    haptic: (ctx: KevlarContext) => { fireHaptic(config.haptics.error); },
    screenreader: { role: 'button' as const, liveRegion: 'assertive' as const },
    announcement: STRING_MUST_BE_DEFINED,  // stays blank — per instance
  },

  disabled: {
    visual: { cursor: 'not-allowed', opacity: 0.5 },
    audio:  (ctx: KevlarContext) => {},
    haptic: (ctx: KevlarContext) => {},
    screenreader: { role: 'button' as const, state: { disabled: true } },
  },
};

export const baseInteractiveActions = {
  onRageClick:          (ctx: KevlarContext) => {},
  onDoubleClick:        (ctx: KevlarContext) => {},
  onClickDuringLoading: (ctx: KevlarContext) => {},
  onFocusEscape:        (ctx: KevlarContext) => {},
};

export const baseInteractiveInput = {
  touch: {
    onTap:       (ctx: KevlarContext) => { ctx.setState('pressed'); },
    onDoubleTap: (ctx: KevlarContext) => {},
    onLongPress: (ctx: KevlarContext) => {},
    onSwipe:     (ctx: KevlarContext) => {},
    onPinch:     (ctx: KevlarContext) => {},
    touchTargetSize: () => config.touchTargets[getPlatform()],
    instantFeedback: true,
  },
  mouse: {
    onLeftClick:   (ctx: KevlarContext) => { ctx.setState('pressed'); },
    onRightClick:  (ctx: KevlarContext) => {},
    onMiddleClick: (ctx: KevlarContext) => {},
    onDoubleClick: (ctx: KevlarContext) => {},
    onHoverEnter:  (ctx: KevlarContext) => { ctx.setState('hover'); },
    onHoverLeave:  (ctx: KevlarContext) => { ctx.setState('idle'); },
    onScroll:      (ctx: KevlarContext) => {},
    onDragAndDrop: (ctx: KevlarContext) => {},
  },
  keyboard: {
    bindings: {
      Enter:  (ctx: KevlarContext) => { ctx.setState('pressed'); },
      Space:  (ctx: KevlarContext) => { ctx.setState('pressed'); },
      Escape: (ctx: KevlarContext) => {},
    },
    Tab: { trap: false },
    focusRing: () => ({
      visible: isKeyboardOnly() ? 'always' : 'keyboard-only',
      ...config.focusRing,
    }),
  },
  remote_dpad: {
    onSelect:      (ctx: KevlarContext) => { ctx.setState('pressed'); },
    onBack:        (ctx: KevlarContext) => {},
    onDirectional: (ctx: KevlarContext, direction: string) => { moveFocus(direction); },
    focusRing:     config.tv.focusRing,
  },
};

export const baseInteractiveNetwork = {
  onFast:    (ctx: KevlarContext) => {},
  onSlow:    (ctx: KevlarContext) => { ctx.setState('loading'); },
  onOffline: (ctx: KevlarContext) => { ctx.setState('disabled'); ctx.setText('You are offline'); },
};

export const baseInteractiveTiming = {
  timeoutMs:   config.timing.defaultTimeoutMs,
  onTimeout:   (ctx: KevlarContext) => { ctx.setState('error'); },
  debounceMs:  0,
  triggers:    [] as Trigger[],
  minLoadTime: null as [number, number] | null,
};

export const baseInteractiveAnimation = {
  enter: () => {
    if (prefersReducedMotion()) return config.animationPresets.none;
    return config.animationPresets.fadeIn;
  },
  exit: () => {
    if (prefersReducedMotion()) return config.animationPresets.none;
    return config.animationPresets.fadeOut;
  },
  transitions: {
    idle_to_hover: () => {
      if (prefersReducedMotion()) return config.animationPresets.instant;
      return config.animationPresets.springHover;
    },
    hover_to_idle: () => {
      if (prefersReducedMotion()) return config.animationPresets.instant;
      return { type: 'spring', duration: 'fast', easing: 'out' };
    },
    idle_to_pressed:     config.animationPresets.scalePress,
    pressed_to_loading:  config.animationPresets.fadeIn,
    loading_to_success: () => {
      if (prefersReducedMotion()) return config.animationPresets.instant;
      return { type: 'scale', duration: 'normal', easing: 'spring' };
    },
    loading_to_error: () => {
      if (prefersReducedMotion()) return config.animationPresets.instant;
      return config.animationPresets.shake;
    },
  },
  microFeedback: () => {
    if (prefersReducedMotion()) return null;
    if (isSmallMobile()) return null;
    return config.animationPresets.scalePress;
  },
  loadingAnimation: { type: 'spinner', size: 'inherit' },
};
```

The tech lead went through every `MUST_BE_DEFINED` and replaced it with a conscious decision. Some reference the design config (`config.shadows.low`). Some use targets inline (`isTV()`, `prefersReducedMotion()`, `isSilentMode()`). Some stay as `STRING_MUST_BE_DEFINED` because they're per-instance (announcements).

### 4.4 What a Component File Looks Like

The component file imports from its base and overrides what's specific. Anything the base already filled stays. Anything that's still `MUST_BE_DEFINED` from the base, the component must either fill or leave for the instance.

```tsx
// kevlar/components/Button.tsx

import { Button as MantineButton, type ButtonProps as MantineButtonProps } from '@mantine/core';
import {
  baseInteractiveStates,
  baseInteractiveActions,
  baseInteractiveInput,
  baseInteractiveNetwork,
  baseInteractiveTiming,
  baseInteractiveAnimation,
} from '../base/BaseInteractive';
import { STRING_MUST_BE_DEFINED } from '@unlikefraction/kevlar/sentinels';
import { useKevlarInteraction, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { KevlarContext, Trigger, DeepPartial } from '@unlikefraction/kevlar/types';

// Button uses everything from BaseInteractive.
// Only override what's Button-specific.

const states    = { ...baseInteractiveStates };
const actions   = { ...baseInteractiveActions };
const input     = { ...baseInteractiveInput };
const network   = { ...baseInteractiveNetwork };
const timing    = { ...baseInteractiveTiming };
const animation = { ...baseInteractiveAnimation };

// Button-specific: type defaults to 'button', not 'submit'
const typeDefault = 'button';

// Button-specific: announcements are still STRING_MUST_BE_DEFINED
// they stay that way — every Button instance fills them via the `announce` prop


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarButtonProps = MantineButtonProps & {
  // REQUIRED — these are the STRING_MUST_BE_DEFINED markers that survive to here
  onKevlarAction: (ctx: KevlarContext) => Promise<void>;
  announce: { loading: string; success: string; error: string; };

  // OPTIONAL — override anything from the base
  states?:      DeepPartial<typeof states>;
  userActions?: Partial<typeof actions>;
  input?:       DeepPartial<typeof input>;
  network?:     Partial<typeof network>;
  timing?:      Partial<typeof timing>;
  animation?:   DeepPartial<typeof animation>;
  minLoadTime?: [number, number];
  triggers?:    Trigger[];
  destructive?: { onConfirm: (ctx: KevlarContext) => Promise<boolean>; };
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function Button(props: KevlarButtonProps) {
  const {
    onKevlarAction, announce: ann, destructive,
    states: so, userActions: ao, input: io, network: no_,
    timing: to, animation: animo, minLoadTime: mlt, triggers: trg,
    children, ...mantineProps
  } = props;

  const spec = deepMerge(
    { states, userActions: actions, input, network, timing, animation },
    { states: so, userActions: ao, input: io, network: no_, timing: to, animation: animo },
  );
  if (mlt) spec.timing.minLoadTime = mlt;
  if (trg) spec.timing.triggers = trg;

  // Fill the blanks that survived from base
  spec.states.loading.announcement = ann.loading;
  spec.states.success.announcement = ann.success;
  spec.states.error.announcement = ann.error;

  const interaction = useKevlarInteraction(spec, {
    onAction: onKevlarAction,
    destructive,
  });

  return (
    <MantineButton
      type={typeDefault}
      {...mantineProps}
      {...interaction.handlers}
      style={interaction.currentVisual}
      disabled={interaction.state === 'disabled'}
    >
      {interaction.displayText ?? children}
    </MantineButton>
  );
}
```

### 4.5 The Flow

```
Day 0: npx kevlar init
  └─ Everything is MUST_BE_DEFINED

Day 1-3: Tech lead fills kevlar/design.config.ts
  └─ Colors, sounds, haptics, animation curves, breakpoints, touch targets

Day 3-7: Tech lead fills kevlar/base/*.tsx
  └─ Goes through each base, replaces every MUST_BE_DEFINED
  └─ References config everywhere: config.shadows.low, config.sounds.click
  └─ Uses targets everywhere: isTV(), prefersReducedMotion(), isSilentMode()
  └─ Leaves STRING_MUST_BE_DEFINED for per-instance things (announcements, etc.)

Day 7+: Devs use components
  └─ import { Button } from '../kevlar'
  └─ Fill the remaining blanks via props (announce, onKevlarAction)
  └─ Override any base decision if their instance needs something different
  └─ Any surviving MUST_BE_DEFINED at render → error with exact instructions
```

### 4.6 Other Base Components (As Shipped)

All 9 bases follow the same pattern. Here's a summary of what each one scaffolds:

**BaseInput** — states: idle, hover, focused, typing, validating, valid, invalid, disabled. All `MUST_BE_DEFINED`. Extra slots: `onValidate`, `keyboard.bindings.Enter` (must be decided per component — submit? newline? nothing?), `debounceMs`.

**BaseStatic** — states: idle, focused only. Minimal scaffolding. Most slots are `() => {}` because static elements don't do much. But focus ring and screenreader role are still `MUST_BE_DEFINED`.

**BaseOverlay** — states: idle, opening, open, closing, closed. Extra slots: `onClickOutside`, `onScrollBehind`, `onEscape`, `focus.onOpen`, `focus.onClose`, `keyboard.Tab.trap`. All `MUST_BE_DEFINED`.

**BaseContainer** — minimal. Just `idle` state visual. Exists so containers pass validation.

**BaseFeedback** — states: idle, entering, visible, dismissing, dismissed. Extra slots: `onSwipeToDismiss`, `onClickToDismiss`, `autoDismissMs`, `onAutoDismiss`. All `MUST_BE_DEFINED`.

**BaseNavigation** — states: idle, hover, focused, active, disabled. Extra slots: `onActivate`, roving tabindex keyboard bindings. Arrow keys and Home/End all `MUST_BE_DEFINED`.

**BaseDisclosure** — states: idle, hover, focused, open, closed. Extra slots: `onToggle`. Expand/collapse animation `ANIMATION_MUST_BE_DEFINED`.

**BaseMedia** — states: idle, loading, loaded, error. Extra slots: `network.onFast`, `network.onSlow`, `network.onOffline`, `fallback.onError`. All `MUST_BE_DEFINED`. The tech lead must decide the project's image loading strategy, LQIP approach, offline behavior, and error fallback.

### 4.7 Installation

**Into an existing project:**
```bash
npx kevlar init
```

**Scaffold a new Next.js project with Kevlar:**
```bash
npx kevlar create my-app
```

Both generate the `kevlar/` folder. Everything is `MUST_BE_DEFINED`. The tech lead fills it in. That's the work.

---

## 5. Component Specs

Every component inherits from a base. Only overrides and additional dev-fill slots are listed.

### 5.1 BUTTONS

#### Button

```
inherits: BaseInteractive
```

Additional slots:
- `typeDefault`: 'button' (not 'submit'. Dev must explicitly write `type="submit"` if that's the intent.)
- `destructive.onConfirm`: If this button is destructive, dev provides the confirmation function. Kevlar doesn't render confirmation dialogs. You build it.

---

#### ActionIcon

```
inherits: BaseInteractive
```

Additional validation: Must have `aria-label`. An icon-only button is invisible to screen readers. Use `badly_skip_aria_label_and_hurt_accessibility` to skip.

Additional slot:
- `states.loading.visual.loadingAnimation`: spinner replaces icon (centered)

---

#### CloseButton

```
inherits: BaseInteractive
```

Reduced states: idle, hover, focused, pressed, disabled. No loading/success/error (closing is local, not async).

No network slots. No timing slots.

Fixed screenreader: `{ role: button, label: 'Close' }`. Dev can override the label.

---

#### CopyButton

```
inherits: BaseInteractive
```

Reduced states: idle, hover, focused, pressed, success, error, disabled. No loading (clipboard write is synchronous).

No network slots.

Additional slot:
- `timing.successDurationMs`: How long to show the success state before reverting to idle. Dev fills.

---

#### FileButton

```
inherits: BaseInteractive
```

Reduced states: idle, hover, focused, pressed, disabled. No loading/success/error (the button opens a picker; upload is handled elsewhere).

No network slots. No timing slots.

Additional dev-fill slots:
- `accept`: What file types?
- `multiple`: Multiple files?
- `onFilesSelected`: Your function. What happens with the files?

---

#### UnstyledButton

```
inherits: BaseInteractive
```

All visual state styles are empty `{}`. The dev owns the entire visual layer. Focus ring stays (accessibility). Everything else: wiped clean, dev fills.

---

### 5.2 INPUTS

#### TextInput

```
inherits: BaseInput
```

Additional:
- `keyboard.bindings.Enter`: `(ctx) => { submitForm() }` — base leaves this null, TextInput fills it as "submit".

---

#### NumberInput

```
inherits: BaseInput
```

Additional:
- `keyboard.bindings.ArrowUp`: `(ctx) => { increment() }`
- `keyboard.bindings.ArrowDown`: `(ctx) => { decrement() }`
- `screenreader.role`: spinbutton

Dev-fill slots:
- `min` / `max` / `step` / `decimalScale`: Dev provides. Kevlar clamps.

---

#### PasswordInput

```
inherits: BaseInput
```

Additional:
- `keyboard.bindings.Enter`: submit
- Child element: visibility toggle (inherits BaseInteractive, has its own `aria-label: 'Toggle password visibility'`)

Dev-fill:
- `autocomplete`: 'current-password' or 'new-password'. Dev decides.

---

#### Textarea

```
inherits: BaseInput
```

Additional:
- `keyboard.bindings.Enter`: `(ctx) => { insertNewline() }` — NOT submit
- `keyboard.bindings.Ctrl+Enter`: `(ctx) => { submitForm() }` — Ctrl+Enter submits

Dev-fill:
- `autosize.onResize`: Your function if you need to react to auto-resize. Or `() => {}`.

---

#### JsonInput

```
inherits: Textarea
```

Additional dev-fill:
- `onFormatOnBlur`: Your formatting function. Kevlar doesn't know JSON.
- `onValidate`: Your JSON validation function.

---

#### ColorInput

```
inherits: BaseInput
```

Composite: text input + color picker overlay (BaseOverlay) + swatch preview (BaseStatic).

Dev fills the overlay slots (onClickOutside, onEscape, etc.) per BaseOverlay rules.

---

#### PinInput

```
inherits: BaseInput
```

Additional:
- `keyboard.bindings.ArrowLeft`: `(ctx) => { focusPrevCell() }`
- `keyboard.bindings.ArrowRight`: `(ctx) => { focusNextCell() }`
- `keyboard.bindings.Backspace`: `(ctx) => { clearAndFocusPrev() }`

Dev-fill:
- `length`: How many cells? Required.
- `onComplete`: Your function. What happens when all cells are filled?
- `mask`: true/false. Show dots instead of characters?

---

#### FileInput

```
inherits: BaseInput
```

Additional:
- `screenreader.role`: button (it behaves like a button, not a textbox)
- `input.mouse.onDragAndDrop`: `(ctx, files) => { /* dev handles dropped files */ }`

Dev-fill:
- `accept`: File types.
- `multiple`: Boolean.
- `onFilesSelected`: Your function.
- `onDragOver`: Your function (visual feedback for drag state).

---

#### NativeSelect

```
inherits: BaseInput
```

Minimal overrides. Uses browser-native `<select>`. Kevlar tracks state but the browser handles keyboard/interaction natively.

`screenreader.role`: listbox

---

#### Slider

```
inherits: BaseInput
```

Additional:
- `screenreader.role`: slider
- `input.touch.onDrag`: `(ctx, value) => { setValue(value) }`
- `input.mouse.onDrag`: `(ctx, value) => { setValue(value) }`
- `keyboard.bindings.ArrowLeft/ArrowDown`: decrement
- `keyboard.bindings.ArrowRight/ArrowUp`: increment
- `keyboard.bindings.Home`: set min
- `keyboard.bindings.End`: set max
- `keyboard.bindings.PageUp/PageDown`: increment/decrement large step

Dev-fill:
- `min` / `max` / `step`: Range definition.
- `screenreader.onValueChange`: `(value) => 'Volume: 75%'` — your function that returns a human-readable string for the current value.

---

#### RangeSlider

```
inherits: Slider
```

Two thumbs. Each is its own Slider. Tab switches between thumbs.

Dev-fill:
- `minRange`: Minimum distance between thumbs.

---

#### AlphaSlider / HueSlider

```
inherits: Slider
```

Pre-configured ranges (Alpha: 0-1, step 0.01. Hue: 0-360, step 1).

Dev-fill:
- `screenreader.onValueChange`: `(v) => 'Opacity: ${Math.round(v * 100)}%'` or `(v) => 'Hue: ${v}°'`

---

#### Rating

```
inherits: BaseInput
```

Additional:
- `screenreader.role`: radiogroup (each star is a radio)
- `input.touch.onTap`: `(ctx, starIndex) => { setRating(starIndex) }`
- `input.mouse.onHoverEnter`: `(ctx, starIndex) => { previewRating(starIndex) }`
- `input.mouse.onHoverLeave`: `(ctx) => { clearPreview() }`

Dev-fill:
- `count`: How many stars?
- `allowHalf`: Boolean.

---

#### SegmentedControl

```
inherits: BaseNavigation
```

Additional:
- `screenreader.role`: radiogroup
- `animation.indicator`: `{ type: slide, duration: normal, easing: spring }` — the sliding indicator

---

#### Switch

```
inherits: BaseInput
```

States: idle, hover, focused, checked, unchecked, disabled.

Additional:
- `screenreader.role`: switch
- `input.keyboard.bindings.Space`: `(ctx) => { toggle() }` — Space toggles, NOT Enter
- `input.keyboard.bindings.Enter`: `() => {}` — explicitly nothing
- `input.touch.onTap`: `(ctx) => { toggle() }`
- `input.touch.onSwipe`: `(ctx, direction) => { /* swipe left=off, right=on */ }` — dev fills

Animation:
- `toggle`: `{ type: spring, duration: fast, easing: spring }`

---

#### Checkbox

```
inherits: BaseInput
```

States: idle, hover, focused, checked, unchecked, indeterminate, disabled.

Additional:
- `screenreader.role`: checkbox
- `input.keyboard.bindings.Space`: `(ctx) => { toggle() }` — Space toggles, NOT Enter
- `input.keyboard.bindings.Enter`: `() => {}` — explicitly nothing

Dev-fill:
- `indeterminate`: Does this support a third state?

---

#### Radio

```
inherits: Checkbox (minus indeterminate)
```

Additional:
- `screenreader.role`: radio
- `keyboard.bindings.ArrowUp/ArrowDown`: move selection within radio group

---

#### Chip

```
inherits: Checkbox
```

Visual overrides only. Same interaction as Checkbox.

---

### 5.3 COMBOBOX

#### Select

```
inherits: BaseInput + BaseOverlay (composite)
```

States: idle, hover, focused, open, filtering, loading, disabled.

The input portion:
- `screenreader`: `{ role: combobox, state: { expanded: false, hasPopup: listbox } }`

The dropdown portion (BaseOverlay):
- Dev fills: `onClickOutside`, `onEscape`, `Tab.trap: false` (not modal)

Dev-fill:
- `data`: What are the options? Required.
- `onSearch`: Your function. Filter locally? Fetch from API? You decide. Kevlar doesn't know where your data lives.
- `onSelect`: Your function. What happens when an option is selected?
- `onOpen`: Your function. What happens when the dropdown opens? Load options? Show cached?
- `onNoResults`: Your function. What to show when search matches nothing?

---

#### MultiSelect

```
inherits: Select
```

Additional:
- `screenreader.state.multiselectable`: true
- Each selected item is a Pill (BaseInteractive). Dev fills `onRemove` per pill.
- `keyboard.bindings.Backspace`: `(ctx) => { /* remove last pill? Dev decides */ }`

---

#### Autocomplete

```
inherits: Select
```

Additional:
- Free-text input allowed. The value doesn't have to match an option.

---

#### TagsInput

```
inherits: MultiSelect
```

Additional:
- `keyboard.bindings.Enter`: `(ctx) => { createTag(ctx.value) }` — creates a new tag from typed text
- `keyboard.bindings.Comma`: `(ctx) => { createTag(ctx.value) }` — comma also creates tags
- Dev fills `onCreateTag`: your validation/creation function.

---

#### Combobox

```
inherits: Select
```

The low-level primitive. Select, MultiSelect, Autocomplete, TagsInput are built on it. Dev uses Combobox directly for custom behavior.

---

#### Pill

```
inherits: BaseInteractive
```

Reduced states: idle, hover, focused, disabled. No loading/success/error.

No network. No timing.

Dev-fill:
- `onRemove`: Your function. Remove the pill?

---

#### PillsInput

```
inherits: BaseInput
```

Container for Pill components + a text input. Interaction handled by children.

---

### 5.4 NAVIGATION

#### Tabs

```
inherits: BaseNavigation
```

Screenreader:
- tablist: `{ role: tablist }`
- tab: `{ role: tab, state: { selected: false }, controls: 'panel-id' }`
- panel: `{ role: tabpanel, labelledby: 'tab-id' }`

Dev-fill:
- `onTabChange`: Your function. What happens when a tab is activated? Load content? Switch view?

---

#### Breadcrumbs

```
inherits: BaseNavigation
```

Screenreader: `{ role: navigation, label: 'Breadcrumb' }`

Each item is an Anchor. Last item has `{ state: { current: page } }`.

No arrow key navigation (breadcrumbs aren't a tablist).

---

#### Pagination

```
inherits: BaseNavigation
```

Screenreader: `{ role: navigation, label: 'Pagination' }`

Dev-fill:
- `onPageChange`: Your function.

---

#### Stepper

```
inherits: BaseNavigation
```

States: idle, hover, focused, active, completed, disabled.

Dev-fill:
- `onStepClick`: Your function. Can users click completed steps to go back? If so, what happens?

---

#### NavLink

```
inherits: BaseInteractive
```

Reduced states: idle, hover, focused, active, disabled.

When it has children (nested navigation), it becomes a composite of BaseInteractive + BaseDisclosure.

---

#### TableOfContents

```
inherits: BaseNavigation
```

Screenreader: `{ role: navigation, label: 'Table of contents' }`

Dev-fill:
- `onScrollSpy`: Your function. How to track active section during scrolling?

---

#### Tree

```
inherits: BaseNavigation + BaseDisclosure (composite)
```

Screenreader: `{ role: tree, item: { role: treeitem }, group: { role: group } }`

Keyboard:
- ArrowLeft: collapse or move to parent
- ArrowRight: expand or move to first child
- Home: first item
- End: last item
- `*`: expand all siblings

---

#### Anchor

```
inherits: BaseInteractive
```

Reduced states: idle, hover, focused, pressed, disabled. No loading/success/error (navigation is router-handled).

No network. No timing.

Screenreader: `{ role: link }`

Additional: `keyboard.bindings.Space`: `() => {}` — Space does NOT activate links (only Enter). Dev can override.

---

#### Burger

```
inherits: BaseInteractive
```

States: idle, hover, focused, pressed, open, closed, disabled.

Screenreader: `{ role: button, state: { expanded: false }, label: 'Toggle navigation' }`

Dev-fill:
- `onToggle`: Your function.

Animation:
- `toggle`: `{ type: spring, duration: normal }` — hamburger to X

---

### 5.5 FEEDBACK

#### Notification

```
inherits: BaseFeedback
```

Dev-fill (all from BaseFeedback, plus):
- `stacking.maxVisible`: How many before overflow?
- `stacking.onOverflow`: Your function. Queue? Collapse? Replace oldest?

---

#### Alert

```
inherits: BaseFeedback
```

Overrides: Inline (not a toast). No auto-dismiss. No swipe.

```yaml
timing.autoDismissMs: null
userActions.onSwipeToDismiss: () => {}   # no-op, it's inline
```

Dev-fill:
- `onDismiss`: Your function. What happens when the user closes the alert?

---

#### Progress / RingProgress / SemiCircleProgress

```
inherits: BaseFeedback
```

Display-only. No dismiss. No user action slots.

Screenreader: `{ role: progressbar, valuemin: 0, valuemax: 100, valuenow: null }`

Dev-fill:
- `screenreader.onValueChange`: `(v) => '${v}% complete'` — your function returns the announcement string.

---

#### Loader

```
inherits: BaseFeedback
```

Display-only. No dismiss. No timing.

Screenreader: `{ role: status, liveRegion: polite }`

Dev-fill:
- `screenreader.announcement`: What is loading?

---

#### Skeleton

```
inherits: BaseFeedback
```

Display-only. No dismiss.

Animation: `{ shimmer: { type: shimmer, loop: true }, reveal: { type: fade, duration: normal } }`

Dev-fill:
- `onContentLoaded`: Your function. When should the skeleton be replaced with real content?

---

#### LoadingOverlay

```
inherits: BaseOverlay + Loader (composite)
```

No dismiss. Controlled by parent's loading state.

```yaml
userActions.onClickOutside: () => {}   # no-op, can't dismiss
onEscape: () => {}                     # no-op
```

---

### 5.6 OVERLAYS

#### Modal

```
inherits: BaseOverlay
```

Additional enforcement:
- `keyboard.Tab.trap`: must be true. Use `dangerously_skip_focus_trap` to override.
- `title`: required. Use `badly_skip_modal_title_and_hurt_accessibility` to skip.

Dev-fill:
- `focus.onOpen`: Your function. Where does focus go?
- `focus.onClose`: Your function. Where does focus return?

Platform overrides:
```yaml
platforms:
  small_mobile:
    layout: bottom-sheet
    input.touch.onSwipe: (ctx, dir) => { if (dir === 'down') ctx.close() }
  mobile:
    layout: bottom-sheet
    input.touch.onSwipe: (ctx, dir) => { if (dir === 'down') ctx.close() }
```

---

#### Drawer

```
inherits: Modal
```

Animation overrides (direction-based):
```yaml
animation:
  enter: { type: slide, direction: left, duration: normal, easing: ease-out }
  exit:  { type: slide, direction: left, duration: normal, easing: ease-in }
```

Dev-fill:
- `position`: left | right | top | bottom
- `input.touch.onSwipe`: Your function. Swipe to close in the direction it came from?

---

#### Dialog

```
inherits: BaseOverlay
```

Non-modal. No backdrop. No focus trap.

```yaml
keyboard.Tab.trap: false
userActions.onClickOutside: () => {}    # non-blocking
onScrollBehind: () => {}                # allow
```

---

#### Popover

```
inherits: BaseOverlay
```

Non-modal. No backdrop.

```yaml
keyboard.Tab.trap: false
```

Animation overrides:
```yaml
animation:
  enter: { type: fade, duration: fast, easing: ease-out }
  exit:  { type: fade, duration: fast, easing: ease-in }
```

---

#### HoverCard

```
inherits: Popover
```

Trigger: hover (not click).

Dev-fill:
- `openDelay`: ms before opening
- `closeDelay`: ms before closing (gives user time to move cursor to card)

---

#### Tooltip

```
inherits: BaseOverlay
```

Simplest overlay. Display-only content.

```yaml
keyboard.Tab.trap: false
userActions.onClickOutside: () => {}
onEscape: () => {}
```

Screenreader: `{ role: tooltip }` — trigger element gets `aria-describedby`.

Dev-fill:
- `openDelay`: ms before showing.

---

#### Menu

```
inherits: BaseOverlay
```

Screenreader: `{ role: menu, item: { role: menuitem } }`

Keyboard:
- ArrowUp/ArrowDown: move between items
- Enter/Space: activate focused item
- Home/End: first/last item
- Escape: close

Dev-fill per menu item:
- `onActivate`: Your function.

---

#### FloatingWindow

```
inherits: BaseOverlay
```

Non-modal. Draggable.

```yaml
keyboard.Tab.trap: false
userActions.onClickOutside: () => {}
```

Additional:
- `input.mouse.onDrag`: `(ctx, position) => { moveWindow(position) }`
- `input.touch.onDrag`: `(ctx, position) => { moveWindow(position) }`
- `constrainToViewport`: true

---

#### FloatingIndicator

```
inherits: BaseStatic
```

Decorative only. Follows another element (used by Tabs, SegmentedControl).

```yaml
screenreader.hidden: true
animation.move: { type: spring, duration: normal, easing: spring }
```

---

#### Overlay

```
inherits: BaseStatic
```

Backdrop/dimmer.

```yaml
screenreader.hidden: true
```

Dev-fill:
- `onClick`: Your function. Usually triggers parent overlay to close.

---

#### Affix

```
inherits: BaseContainer
```

Pins content to a viewport position. What's inside gets its own spec.

---

### 5.7 DATA DISPLAY

#### Card

```
inherits: BaseContainer (static) | BaseInteractive (when clickable)
```

When interactive (dev provides `onKevlarAction`):
- States: idle, hover, focused, pressed, skeleton, selected, disabled

Dev-fill (when interactive):
- `onKevlarAction`: Your function. What happens on click?
- `input.touch.onLongPress`: Your function. Preview? Context menu?
- `input.touch.onSwipe`: Your function. Save? Dismiss?

When static: just a container.

---

#### Image

```
inherits: BaseMedia
```

Dev-fill:
- `alt`: Required.
- `width` + `height` or `aspectRatio`: Required.
- `network.onFast/onSlow/onOffline`: Your functions.
- `fallback.onError`: Your function.
- `onPinchZoom`: Your function. Enable zoom? How?

---

#### Avatar

```
inherits: BaseMedia
```

Fallback chain is DEV-PROVIDED:

```yaml
fallback:
  onImageError:    null   # REQUIRED — your function. Show initials? Show generic icon? Try another URL?
  onInitialsError: null   # your function. If you can't compute initials, what then?
```

Size enforcement: always (avatars are always fixed-size, can't opt out).

---

#### Badge

```
inherits: BaseStatic
```

When removable, the remove button is a child BaseInteractive.

Dev-fill (when removable):
- `onRemove`: Your function.

---

#### Accordion

```
inherits: BaseDisclosure
```

Manages multiple disclosure items.

Dev-fill:
- `onItemToggle`: Your function. Called when any item opens/closes. Controls single vs. multiple open behavior.

Keyboard:
- ArrowUp/ArrowDown: move between headers
- Home/End: first/last header

---

#### Spoiler

```
inherits: BaseDisclosure
```

Dev-fill:
- `maxHeight`: How tall before collapsing?
- `showLabel` / `hideLabel`: Your strings.

---

#### Indicator / ColorSwatch / Kbd / NumberFormatter / ThemeIcon

```
inherits: BaseStatic
```

No overrides. Purely visual. No dev-fill slots.

---

#### OverflowList

```
inherits: BaseContainer
```

Overflow menu is a Menu (BaseOverlay). Dev fills Menu slots.

---

#### Timeline

```
inherits: BaseStatic
```

Screenreader: `{ role: list, item: { role: listitem } }`

---

### 5.8 TYPOGRAPHY

#### Text

```
inherits: BaseStatic
```

No overrides.

---

#### Title

```
inherits: BaseStatic
```

Screenreader: `{ role: heading, level: null }` — level set by `order` prop (1-6).

---

#### Typography / Blockquote / Code / Highlight / Mark / List / Table

```
inherits: BaseStatic
```

Component-specific screenreader roles:
- Blockquote: `{ role: blockquote }`
- Code: `{ role: code }`
- List: `{ role: list, item: { role: listitem } }`
- Table: `{ role: table }`

Table when sortable: column headers become BaseInteractive children.
Dev-fill: `onSort`: Your function per sortable column.

---

### 5.9 LAYOUT

#### AppShell

```
inherits: BaseContainer
```

Platform overrides:
```yaml
platforms:
  small_mobile:
    navbar: { collapsed: true }
    aside: { collapsed: true }
  mobile:
    navbar: { collapsed: true }
    aside: { collapsed: true }
```

Toggle button for collapsed navbar: inherits Burger.

---

#### Container / Flex / Grid / Group / SimpleGrid / Stack / Center / Space / AspectRatio / Box / Paper

```
inherits: BaseContainer
```

No overrides. Pure layout. Exist in the system so they pass validation.

---

#### Fieldset

```
inherits: BaseContainer
```

Screenreader: `{ role: group, label: null }` — from legend element.

---

### 5.10 MISCELLANEOUS

#### Collapse

```
inherits: BaseDisclosure (panel only, no trigger)
```

Animation:
```yaml
expand:   { type: slide, direction: down, duration: normal, easing: ease-out }
collapse: { type: slide, direction: up, duration: normal, easing: ease-in }
```

Supports horizontal orientation (Mantine v9): `orientation: vertical | horizontal`

---

#### Divider

```
inherits: BaseStatic
```

Screenreader: `{ role: separator }`

---

#### FocusTrap

```
inherits: BaseContainer
```

`keyboard.Tab.trap: true`

---

#### Marquee

```
inherits: BaseStatic
```

Animation: `{ scroll: { type: linear, duration: slow, loop: true, direction: left } }`

Accessibility: `reduced_motion` → stops scrolling, shows all content statically.

---

#### Portal

```
inherits: BaseContainer
```

No overrides. Moves children to different DOM location.

---

#### ScrollArea / Scroller

```
inherits: BaseContainer
```

Dev-fill:
- `onScroll`: Your function. Track scroll position? Infinite load? You decide.
- `scrollbar.onVisibility`: Your function. When to show scrollbar?

---

#### Transition

```
inherits: BaseStatic
```

Accessibility: `reduced_motion` → all transitions instant.

---

#### VisuallyHidden

```
inherits: BaseStatic
```

No overrides. Hides content visually, keeps it for screen readers.

---


## 6. Shame Props

When the dev wants to skip a requirement, they say it out loud:

| Shame Prop | What it skips |
|------------|---------------|
| `badly_skip_alt_text_and_hurt_accessibility` | Image/Avatar alt text |
| `badly_allow_layout_shift_and_dont_define_size` | Image width/height enforcement |
| `badly_skip_modal_title_and_hurt_accessibility` | Modal/Drawer title |
| `badly_skip_aria_label_and_hurt_accessibility` | ActionIcon aria-label |
| `badly_skip_input_label_and_hurt_accessibility` | Input label |
| `dangerously_skip_offline_decision` | Network offline slot |
| `dangerously_skip_timeout_decision` | Timeout slot |
| `dangerously_skip_focus_trap` | Modal focus trap |
| `dangerously_allow_submit_type_button` | Button defaulting to type="submit" |

Each triggers a console warning in dev mode with a link to the relevant WCAG guideline or UX rationale.

---

## 7. Validation (Dev Mode)

Every render checks:

### Universal
1. All states have all 4 modality definitions (visual, audio, haptic, screenreader)
2. All animation transitions reference valid states
3. Consistency: if `onHoverEnter` does something, the equivalent behavior must be reachable via keyboard or touch
4. All 17 required targets are handled (the component file imports and uses every required target primitive)

### BaseInteractive
5. `onKevlarAction` is defined
6. Loading/success/error announcements are defined (blanks filled)
7. `network.onFast`, `network.onSlow`, `network.onOffline` all have functions
8. `timing.onTimeout` has a function

### BaseInput
9. `label` is defined (or shame prop)
10. `states.invalid.screenreader.announcement` returns an error string
11. `keyboard.bindings.Enter` is defined

### BaseOverlay
12. `title` is defined for Modal/Drawer (or shame prop)
13. `onClickOutside` is defined
14. `onEscape` is defined
15. `keyboard.Tab.trap` is defined
16. `focus.onOpen` and `focus.onClose` are defined

### BaseMedia
17. `alt` is defined (or shame prop)
18. `width`+`height` or `aspectRatio` is defined (or shame prop)
19. `network.onFast/onSlow/onOffline` are defined
20. `fallback.onError` is defined

### Component-specific
21. Radio is inside a RadioGroup
22. Tab is inside Tabs
23. Accordion.Item is inside Accordion

If any check fails, the element doesn't render. A dev overlay shows exactly what's missing and how to fix it.

---

## 8. Runtime

### What You Install

The component files and design config are your code. What you install from `@unlikefraction/kevlar`:

```
@unlikefraction/kevlar/primitives
  ── Required Targets (17) ──
  isSmallMobile, isMobile, isTablet, isDesktop, isWidescreen, isTV, getPlatform
  isFast, isSlow, isOffline, getNetworkState
  prefersReducedMotion, prefersHighContrast, isKeyboardOnly, isColorBlind
  isTouchDevice, isMouseDevice, isDpadDevice
  isSilentMode

  ── Special Targets (2) ──
  isLowBattery, getUserSegment

  ── Action Primitives ──
  playSound          respects config.sounds, config.sensoryBudget, isSilentMode()
  fireHaptic         respects config.haptics, config.sensoryBudget, isLowBattery()
  announce           respects config.sensoryBudget, queues FIFO
  moveFocus          moves focus to next/prev focusable element

@unlikefraction/kevlar/runtime
  useKevlarInteraction    state machine (transitions, abort, triggers, minLoadTime)
  KevlarProvider          wraps app, sets up detection for all targets
  deepMerge               merges instance props onto file defaults
  validate                dev-mode: catches null blanks at render time

@unlikefraction/kevlar/types
  KevlarContext, Trigger, AnimationConfig, DesignConfig, etc.
```

### KevlarProvider

Wraps the app. Initializes detection for all 19 targets (17 required + 2 special). Reads `design.config.ts` and makes it available to primitives.

```tsx
import { KevlarProvider } from '@unlikefraction/kevlar/runtime';
import config from './kevlar/design.config';

function App() {
  return (
    <KevlarProvider config={config} colorBlind={false}>
      <YourApp />
    </KevlarProvider>
  );
}
```

`colorBlind` is passed as a prop because there's no browser API for it. The app detects it however it wants (user setting, profile flag, etc.) and passes it in.

### useKevlarInteraction

The state machine hook. Returns:

```ts
{
  state: string;                    // current state name
  handlers: EventHandlers;          // attach to the element
  setState: (state: string) => void;
  setText: (text: string) => void;
  cancel: () => void;               // cancel in-flight action (aborts signal)
  displayText: string;              // current text (changes with triggers)
  signal: AbortSignal;              // passed to onKevlarAction
  currentVisual: CSSProperties;     // resolved visual for current state + targets
}
```

### Resolution Order

```
1. Design config (kevlar/design.config.ts)
     ↓ imported by
2. Base component (kevlar/base/BaseInteractive.tsx)
     ↓ imported by
3. Component file (kevlar/components/Button.tsx)
     ↓ receives props from
4. Instance (<Button onKevlarAction={...} />)
```

Instance props merge on top of component file defaults. Component file imports base. Base imports config. No runtime resolution. Just imports.

What the instance can't override: whatever isn't in the component's TypeScript type definition.

---

## 9. Component Count

| Category | Components | Base |
|----------|-----------|------|
| Buttons | 6 | BaseInteractive |
| Inputs | 23 | BaseInput |
| Combobox | 7 | BaseInput + BaseOverlay |
| Navigation | 9 | BaseNavigation |
| Feedback | 7 | BaseFeedback |
| Overlays | 12 | BaseOverlay |
| Data Display | 14 | BaseStatic / BaseMedia / BaseContainer |
| Typography | 9 | BaseStatic |
| Layout | 10 | BaseContainer |
| Miscellaneous | 11 | Various |
| **Total** | **108** | |

All 108 Mantine v9 core components specced. 9 base components. 1 design config. 17 required targets. 2 special targets.

---

*Kevlar. Build an insanely good product, or it won't render.*
