// kevlar/base/BaseInput.tsx (as shipped — all MUST_BE_DEFINED)
//
// Base template for all input components:
// TextInput, Textarea, NumberInput, PasswordInput, PinInput, JsonInput,
// Autocomplete, TagsInput, Select, MultiSelect, NativeSelect,
// Checkbox, Radio, Switch, Slider, RangeSlider, Rating,
// ColorInput, ColorPicker, FileInput, DatePickerInput, YearPickerInput,
// MonthPickerInput, DateTimePicker, Chip, SegmentedControl, TransferList,
// Fieldset
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
// States — input components cycle through these states during user interaction.
// Each state has 4 modalities: visual, audio, haptic, screenreader.
// ─────────────────────────────────────────────────────────────────────────────
export const baseInputStates = {
  // Default resting state — input is visible, empty or pre-filled
  idle: {
    visual: OBJECT_MUST_BE_DEFINED,      // border, background, placeholder color, label position
    audio: FUNCTION_MUST_BE_DEFINED,      // ambient — usually silent
    haptic: FUNCTION_MUST_BE_DEFINED,     // no haptic in idle
    screenreader: OBJECT_MUST_BE_DEFINED, // role, label, description, required status
  },
  // Pointer is over the input
  hover: {
    visual: OBJECT_MUST_BE_DEFINED,      // border highlight, cursor change
    audio: FUNCTION_MUST_BE_DEFINED,      // hover sound?
    haptic: FUNCTION_MUST_BE_DEFINED,     // light haptic?
    screenreader: OBJECT_MUST_BE_DEFINED, // any change?
  },
  // Input has keyboard/programmatic focus
  focused: {
    visual: OBJECT_MUST_BE_DEFINED,      // focus ring, label float, border glow
    audio: FUNCTION_MUST_BE_DEFINED,      // focus chime?
    haptic: FUNCTION_MUST_BE_DEFINED,     // focus haptic?
    screenreader: OBJECT_MUST_BE_DEFINED, // announce label, current value, constraints
  },
  // User is actively entering text/making selections
  typing: {
    visual: OBJECT_MUST_BE_DEFINED,      // active indicator, character count, live preview
    audio: FUNCTION_MUST_BE_DEFINED,      // keystroke feedback sound?
    haptic: FUNCTION_MUST_BE_DEFINED,     // per-keystroke haptic?
    screenreader: OBJECT_MUST_BE_DEFINED, // live region for character count? suggestions?
  },
  // Input value is being validated (async or complex sync validation)
  validating: {
    visual: OBJECT_MUST_BE_DEFINED,      // spinner in input, pulsing border
    audio: FUNCTION_MUST_BE_DEFINED,      // validation in-progress sound?
    haptic: FUNCTION_MUST_BE_DEFINED,     // subtle pulse?
    screenreader: OBJECT_MUST_BE_DEFINED, // "validating..." announcement
  },
  // Validation passed
  valid: {
    visual: OBJECT_MUST_BE_DEFINED,      // green border, checkmark icon
    audio: FUNCTION_MUST_BE_DEFINED,      // success chime?
    haptic: FUNCTION_MUST_BE_DEFINED,     // success haptic?
    screenreader: OBJECT_MUST_BE_DEFINED, // "valid" announcement
  },
  // Validation failed — user needs to correct input
  invalid: {
    visual: OBJECT_MUST_BE_DEFINED,      // red border, error icon, error message
    audio: FUNCTION_MUST_BE_DEFINED,      // error sound?
    haptic: FUNCTION_MUST_BE_DEFINED,     // error haptic pattern?
    screenreader: OBJECT_MUST_BE_DEFINED, // aria-invalid, error description
    announcement: STRING_MUST_BE_DEFINED, // e.g. "Invalid input. Please check and try again."
  },
  // Input is non-interactive
  disabled: {
    visual: OBJECT_MUST_BE_DEFINED,      // grayed out, reduced opacity, no cursor
    audio: FUNCTION_MUST_BE_DEFINED,      // muted interaction sound?
    haptic: FUNCTION_MUST_BE_DEFINED,     // denied haptic?
    screenreader: OBJECT_MUST_BE_DEFINED, // aria-disabled, explanation why
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Actions — validation and edge-case behaviors
// ─────────────────────────────────────────────────────────────────────────────
export const baseInputActions = {
  onValidate: FUNCTION_MUST_BE_DEFINED,         // validation function — sync or async
  onRageType: FUNCTION_MUST_BE_DEFINED,         // user typing rapidly/erratically
  onPaste: FUNCTION_MUST_BE_DEFINED,            // paste event — sanitize? allow? block?
  onClear: FUNCTION_MUST_BE_DEFINED,            // clear button behavior
  onFocusEscape: FUNCTION_MUST_BE_DEFINED,      // focus leaves input unexpectedly
  onSubmitAttemptWhileInvalid: FUNCTION_MUST_BE_DEFINED, // form submit with invalid input
};

// ─────────────────────────────────────────────────────────────────────────────
// Input — how each input device interacts with this component
// ─────────────────────────────────────────────────────────────────────────────
export const baseInputInput = {
  // Touch input (phones, tablets, touchscreens)
  touch: {
    onTap: FUNCTION_MUST_BE_DEFINED,           // focus the input
    onDoubleTap: FUNCTION_MUST_BE_DEFINED,     // select word?
    onLongPress: FUNCTION_MUST_BE_DEFINED,     // paste menu? magnifier?
    onSwipe: FUNCTION_MUST_BE_DEFINED,         // swipe to clear? swipe between fields?
    onPinch: FUNCTION_MUST_BE_DEFINED,         // zoom text?
    touchTargetSize: FUNCTION_MUST_BE_DEFINED, // min 44x44 per WCAG
    instantFeedback: BOOLEAN_MUST_BE_DEFINED,  // highlight on touch immediately?
  },
  // Mouse input (desktop, laptop)
  mouse: {
    onLeftClick: FUNCTION_MUST_BE_DEFINED,     // focus and place cursor
    onRightClick: FUNCTION_MUST_BE_DEFINED,    // context menu? spell check?
    onMiddleClick: FUNCTION_MUST_BE_DEFINED,   // paste on Linux? ignore?
    onDoubleClick: FUNCTION_MUST_BE_DEFINED,   // select word
    onHoverEnter: FUNCTION_MUST_BE_DEFINED,    // show tooltip? helper text?
    onHoverLeave: FUNCTION_MUST_BE_DEFINED,    // hide tooltip?
    onScroll: FUNCTION_MUST_BE_DEFINED,        // scroll within textarea? change number value?
    onDragAndDrop: FUNCTION_MUST_BE_DEFINED,   // drop text/files into input?
  },
  // Keyboard input
  keyboard: {
    bindings: {
      Enter: FUNCTION_MUST_BE_DEFINED,         // submit form? newline (textarea)? nothing?
      Space: FUNCTION_MUST_BE_DEFINED,         // type a space (default for text inputs)
      Escape: FUNCTION_MUST_BE_DEFINED,        // blur input? revert to last valid value?
    },
    Tab: OBJECT_MUST_BE_DEFINED,               // tab order, move to next field, skip logic
    focusRing: FUNCTION_MUST_BE_DEFINED,       // focus ring style for keyboard navigation
  },
  // TV remote / D-pad
  remote_dpad: {
    onSelect: FUNCTION_MUST_BE_DEFINED,        // open on-screen keyboard? activate input?
    onBack: FUNCTION_MUST_BE_DEFINED,          // close on-screen keyboard? blur?
    onDirectional: FUNCTION_MUST_BE_DEFINED,   // navigate between inputs
    focusRing: OBJECT_MUST_BE_DEFINED,         // larger focus ring for 10-foot UI
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Network — how the input behaves based on connectivity
// ─────────────────────────────────────────────────────────────────────────────
export const baseInputNetwork = {
  onFast: FUNCTION_MUST_BE_DEFINED,    // real-time validation, autocomplete suggestions
  onSlow: FUNCTION_MUST_BE_DEFINED,    // defer validation, reduce autocomplete calls
  onOffline: FUNCTION_MUST_BE_DEFINED, // cache input, disable server validation, queue
};

// ─────────────────────────────────────────────────────────────────────────────
// Timing — validation debounce, timeouts
// ─────────────────────────────────────────────────────────────────────────────
export const baseInputTiming = {
  debounceMs: NUMBER_MUST_BE_DEFINED,           // debounce validation — how long after last keystroke?
  validationTimeoutMs: NUMBER_MUST_BE_DEFINED,  // how long before async validation is considered failed?
  onValidationTimeout: FUNCTION_MUST_BE_DEFINED, // show error? retry? fallback?
  triggers: [] as Trigger[],                    // scheduled or conditional triggers
};

// ─────────────────────────────────────────────────────────────────────────────
// Animation — focus, validation, state transitions
// ─────────────────────────────────────────────────────────────────────────────
export const baseInputAnimation = {
  enter: ANIMATION_MUST_BE_DEFINED,     // how does the input appear on mount?
  exit: ANIMATION_MUST_BE_DEFINED,      // how does it disappear on unmount?
  transitions: {
    idle_to_focused: ANIMATION_MUST_BE_DEFINED,      // label float, border glow
    focused_to_typing: ANIMATION_MUST_BE_DEFINED,    // active indicator
    typing_to_validating: ANIMATION_MUST_BE_DEFINED, // spinner appears
    validating_to_valid: ANIMATION_MUST_BE_DEFINED,  // checkmark animation
    validating_to_invalid: ANIMATION_MUST_BE_DEFINED, // shake, red border
    focused_to_idle: ANIMATION_MUST_BE_DEFINED,      // defocus transition
  },
  labelFloat: ANIMATION_MUST_BE_DEFINED,   // floating label animation on focus
  errorShake: ANIMATION_MUST_BE_DEFINED,   // shake animation on validation error
  successFlash: ANIMATION_MUST_BE_DEFINED, // brief flash/pulse on valid
};
