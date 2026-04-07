# Kevlar — Agent Skill

## What is Kevlar?

Kevlar is a component scaffold for Mantine v9. It generates 108 component files, 9 base components, and 1 design config into a project. Every component ships full of `MUST_BE_DEFINED` sentinel markers. The developer replaces each marker with a conscious decision about visual, audio, haptic, and screenreader behavior across 17 required targets (platform, network, accessibility, input method, silent mode).

**Package:** `@unlikefraction/kevlar`  
**Peer deps:** `@mantine/core@^9`, `@mantine/hooks@^9`, `react@^18||^19`

## When to use this skill

- User is setting up Kevlar in a project (`npx kevlar init`)
- User is filling in `MUST_BE_DEFINED` markers in base or component files
- User is using Kevlar components (`import { Button } from './kevlar'`)
- User is configuring `kevlar/design.config.ts`
- User is wrapping their app with `KevlarProvider`
- User is debugging Kevlar validation errors

## Setup

### Initialize in existing project
```bash
npx kevlar init
```

Creates `kevlar/` folder with:
```
kevlar/
  design.config.ts        # design tokens (colors, sounds, haptics, animations, breakpoints)
  base/                   # 9 base components (all MUST_BE_DEFINED)
    BaseInteractive.tsx    # Button, ActionIcon, Anchor, etc.
    BaseInput.tsx          # TextInput, NumberInput, etc.
    BaseStatic.tsx         # Text, Badge, etc.
    BaseOverlay.tsx        # Modal, Popover, Tooltip, etc.
    BaseContainer.tsx      # Layout components
    BaseFeedback.tsx       # Notification, Alert, Progress, etc.
    BaseNavigation.tsx     # Tabs, Breadcrumbs, etc.
    BaseDisclosure.tsx     # Accordion, Spoiler, etc.
    BaseMedia.tsx          # Image, Avatar
  components/             # 108 component files
  index.ts                # re-exports everything
```

### Wrap app with provider
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

## Core concepts

### 1. Sentinels

Six marker constants that mean "no decision made yet":
- `FUNCTION_MUST_BE_DEFINED` — needs a function `(ctx: KevlarContext) => { ... }`
- `STRING_MUST_BE_DEFINED` — needs a string
- `NUMBER_MUST_BE_DEFINED` — needs a number
- `OBJECT_MUST_BE_DEFINED` — needs an object `{ ... }`
- `BOOLEAN_MUST_BE_DEFINED` — needs `true` or `false`
- `ANIMATION_MUST_BE_DEFINED` — needs an `AnimationConfig` or function returning one

If any sentinel survives to render time, the component throws with an error showing exactly what to fill:
```
Kevlar: Button "Add Todo" cannot render.
  states.loading.announcement = STRING_MUST_BE_DEFINED
  — What should the screen reader announce when this button is loading?
```

**A sentinel is NOT the same as `() => {}`.** A sentinel means "nobody decided." An empty function means "we decided to do nothing." Always replace sentinels with conscious decisions.

### 2. Targets (17 required + 2 special)

Every component must handle all 17 required targets. They're called inline where they matter.

**Platform (6):** `isSmallMobile()`, `isMobile()`, `isTablet()`, `isDesktop()`, `isWidescreen()`, `isTV()`  
**Network (3):** `isFast()`, `isSlow()`, `isOffline()`  
**Accessibility (4):** `prefersReducedMotion()`, `prefersHighContrast()`, `isKeyboardOnly()`, `isColorBlind()`  
**Input Method (3):** `isTouchDevice()`, `isMouseDevice()`, `isDpadDevice()`  
**System (1):** `isSilentMode()`  
**Special (2):** `isLowBattery()`, `getUserSegment()`

Usage pattern — always inline, never in override blocks:
```tsx
hover: {
  visual: (ctx) => ({
    shadow: isTV() ? config.shadows.high : config.shadows.low,
    scale: isTV() ? config.tv.focusScale : 1,
  }),
},

enter: () => {
  if (prefersReducedMotion()) return config.animationPresets.none;
  return config.animationPresets.fadeIn;
},

onOffline: (ctx) => { ctx.setState('disabled'); ctx.setText('You are offline'); },
```

### 3. States × Modalities

Every interactive state has 4 modalities:
- **visual** — CSS-like properties (cursor, opacity, scale, shadow, outline)
- **audio** — sound to play (use `playSound(config.sounds.click)`)
- **haptic** — vibration pattern (use `fireHaptic(config.haptics.tap)`)
- **screenreader** — ARIA role, state, live region

BaseInteractive has 8 states: `idle`, `hover`, `focused`, `pressed`, `loading`, `success`, `error`, `disabled`  
BaseInput has 8 states: `idle`, `hover`, `focused`, `typing`, `validating`, `valid`, `invalid`, `disabled`  
BaseOverlay has 5 states: `idle`, `opening`, `open`, `closing`, `closed`  
BaseFeedback has 5 states: `idle`, `entering`, `visible`, `dismissing`, `dismissed`  

### 4. Design Config

`kevlar/design.config.ts` is the single source of truth. Components never use raw values — always `config.shadows.low`, `config.sounds.click`, `config.haptics.tap`, `config.focusRing`, `config.touchTargets.mobile`, `config.animationPresets.fadeIn`, etc.

Change the config once → changes everywhere.

### 5. Action Primitives

```tsx
playSound(config.sounds.click)    // respects isSilentMode(), audio budget
fireHaptic(config.haptics.tap)    // respects isLowBattery(), haptic budget
announce('Item added')            // ARIA live region, queues when budget exceeded
moveFocus('next')                 // directional focus navigation
```

### 6. Resolution Order

```
design.config.ts → Base component → Component file → Instance props
```

Instance props merge on top. Anything not in the component's TypeScript type can't be overridden at instance level.

## How to fill MUST_BE_DEFINED markers

### Filling a base component

When the user asks to fill a base component (e.g., `BaseInteractive.tsx`), replace every sentinel with a real value. Use the design config and targets.

**Pattern for states:**
```tsx
idle: {
  visual: { cursor: 'pointer', opacity: 1 },
  audio: (ctx: KevlarContext) => {},              // no sound on idle
  haptic: (ctx: KevlarContext) => {},             // no haptic on idle
  screenreader: { role: 'button' as const },
},

pressed: {
  visual: { cursor: 'pointer', scale: 0.97, opacity: 0.95 },
  audio: (ctx: KevlarContext) => {
    if (!isSilentMode()) playSound(config.sounds.click);
  },
  haptic: (ctx: KevlarContext) => { fireHaptic(config.haptics.tap); },
  screenreader: { role: 'button' as const },
},

loading: {
  visual: { cursor: 'wait', opacity: 0.9 },
  audio: (ctx: KevlarContext) => {},
  haptic: (ctx: KevlarContext) => {},
  screenreader: { role: 'button' as const, liveRegion: 'polite' as const, state: { busy: true } },
  announcement: STRING_MUST_BE_DEFINED,  // stays — filled per instance
},
```

**Pattern for input:**
```tsx
touch: {
  onTap: (ctx: KevlarContext) => { ctx.setState('pressed'); },
  onDoubleTap: (ctx: KevlarContext) => {},
  onLongPress: (ctx: KevlarContext) => {},
  onSwipe: (ctx: KevlarContext) => {},
  onPinch: (ctx: KevlarContext) => {},
  touchTargetSize: () => config.touchTargets[getPlatform()],
  instantFeedback: true,
},
keyboard: {
  bindings: {
    Enter: (ctx: KevlarContext) => { ctx.setState('pressed'); },
    Space: (ctx: KevlarContext) => { ctx.setState('pressed'); },
    Escape: (ctx: KevlarContext) => {},
  },
  Tab: { trap: false },
  focusRing: () => ({
    visible: isKeyboardOnly() ? 'always' : 'keyboard-only',
    ...config.focusRing,
  }),
},
```

**Pattern for animation:**
```tsx
enter: () => {
  if (prefersReducedMotion()) return config.animationPresets.none;
  return config.animationPresets.fadeIn;
},
transitions: {
  idle_to_hover: () => {
    if (prefersReducedMotion()) return config.animationPresets.instant;
    return config.animationPresets.springHover;
  },
  loading_to_error: () => {
    if (prefersReducedMotion()) return config.animationPresets.instant;
    return config.animationPresets.shake;
  },
},
```

**Pattern for network:**
```tsx
onFast: (ctx: KevlarContext) => {},
onSlow: (ctx: KevlarContext) => { ctx.setState('loading'); },
onOffline: (ctx: KevlarContext) => { ctx.setState('disabled'); ctx.setText('You are offline'); },
```

### Filling a component file

Component files import from their base and override what's specific. Only override what differs from the base.

```tsx
import { baseInteractiveStates, baseInteractiveActions, /* ... */ } from '../base/BaseInteractive';

const states = { ...baseInteractiveStates };
// Override only what's Button-specific, e.g.:
// states.pressed.audio = (ctx) => { playSound('/sounds/button-click.mp3'); };
```

### Using a component (instance level)

```tsx
import { Button } from './kevlar';

<Button
  onKevlarAction={async (ctx) => {
    const res = await fetch('/api/todos', {
      method: 'POST',
      signal: ctx.signal,  // abort support
    });
    if (!res.ok) throw new Error('Failed');
  }}
  announce={{
    loading: 'Adding todo...',
    success: 'Todo added',
    error: 'Failed to add todo',
  }}
>
  Add Todo
</Button>
```

## Shame props

When the user wants to skip a requirement, they use a shame prop. The name makes the skip visible in code review:

| Prop | Skips |
|------|-------|
| `badly_skip_alt_text_and_hurt_accessibility` | Image/Avatar alt |
| `badly_allow_layout_shift_and_dont_define_size` | Image width/height |
| `badly_skip_modal_title_and_hurt_accessibility` | Modal/Drawer title |
| `badly_skip_aria_label_and_hurt_accessibility` | ActionIcon aria-label |
| `badly_skip_input_label_and_hurt_accessibility` | Input label |
| `dangerously_skip_offline_decision` | Network offline handler |
| `dangerously_skip_timeout_decision` | Timeout handler |
| `dangerously_skip_focus_trap` | Modal focus trap |
| `dangerously_allow_submit_type_button` | Button type="submit" |

## Runtime API quick reference

```tsx
// Provider — wraps the app
<KevlarProvider config={config} colorBlind={false} userSegment="normal">

// State machine hook — used inside component files
const interaction = useKevlarInteraction(spec, {
  onAction: async (ctx) => { /* the async work */ },
  destructive: { onConfirm: async (ctx) => confirm('Sure?') },
});
// Returns: { state, handlers, setState, setText, cancel, displayText, signal, currentVisual }

// Merge utility — instance props onto component defaults
const merged = deepMerge(defaults, instanceOverrides);

// Dev validation — finds surviving sentinels
validate(spec, 'Button', 'Add Todo');  // throws in dev, no-op in prod

// Config helper
export default defineDesignConfig({ /* ... */ });
```

## Common mistakes to avoid

1. **Don't use raw values.** Never `color: '#ff0000'`. Always `config.colors.error`.
2. **Don't skip targets.** Every base must import and use all 17 target primitives.
3. **Don't confuse sentinels with no-ops.** `FUNCTION_MUST_BE_DEFINED` ≠ `() => {}`. The first throws. The second is a valid decision.
4. **Don't forget announcements.** Loading, success, and error states MUST have screenreader announcements. They're per-instance (filled via the `announce` prop).
5. **Don't ignore `prefersReducedMotion()`.** Every animation must check it. Return `config.animationPresets.none` when true.
6. **Don't ignore `isSilentMode()`.** Every sound must be gated. Enhance visual/haptic feedback instead when silent.
7. **Don't ignore `isTV()`.** TV needs 8px focus rings with glow, 1.05 focus scale, d-pad navigation.
8. **Don't set Button type to "submit" accidentally.** Kevlar defaults to `type="button"`. Use `dangerously_allow_submit_type_button` or explicit `type="submit"` when intended.

## Component categories and bases

| Category | Count | Base |
|----------|-------|------|
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
