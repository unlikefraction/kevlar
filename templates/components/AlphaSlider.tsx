import { AlphaSlider as MantineAlphaSlider, type AlphaSliderProps as MantineAlphaSliderProps } from '@mantine/core';
import {
  baseInputStates,
  baseInputActions,
  baseInputInput,
  baseInputNetwork,
  baseInputTiming,
  baseInputAnimation,
  baseInputValidation,
} from '../base/BaseInput';
import { STRING_MUST_BE_DEFINED, NUMBER_MUST_BE_DEFINED, FUNCTION_MUST_BE_DEFINED } from '@unlikefraction/kevlar/sentinels';
import { useKevlarInteraction, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { KevlarContext, DeepPartial } from '@unlikefraction/kevlar/types';

// AlphaSlider inherits Slider pattern.
// screenreader.role: slider.
// Pre-configured: min=0, max=1, step=0.01.
// Dev-fill: screenreader.onValueChange.

const states = {
  ...baseInputStates,
  idle: {
    ...baseInputStates.idle,
    screenreader: { role: 'slider' as const },
  },
  hover: {
    ...baseInputStates.hover,
    screenreader: { role: 'slider' as const },
  },
  focused: {
    ...baseInputStates.focused,
    screenreader: { role: 'slider' as const },
  },
  typing: {
    ...baseInputStates.typing,
    screenreader: { role: 'slider' as const },
  },
  valid: {
    ...baseInputStates.valid,
    screenreader: { role: 'slider' as const },
  },
  invalid: {
    ...baseInputStates.invalid,
    screenreader: { role: 'slider' as const },
  },
  disabled: {
    ...baseInputStates.disabled,
    screenreader: { role: 'slider' as const, state: { disabled: true } },
  },
};

const actions    = { ...baseInputActions };
const input      = {
  ...baseInputInput,
  touch: {
    ...baseInputInput.touch,
    onDrag: FUNCTION_MUST_BE_DEFINED as unknown as (ctx: KevlarContext, value: number) => void,
  },
  mouse: {
    ...baseInputInput.mouse,
    onDrag: FUNCTION_MUST_BE_DEFINED as unknown as (ctx: KevlarContext, value: number) => void,
  },
  keyboard: {
    ...baseInputInput.keyboard,
    bindings: {
      ...baseInputInput.keyboard.bindings,
      ArrowLeft:  (ctx: KevlarContext) => { ctx.decrement(); },
      ArrowRight: (ctx: KevlarContext) => { ctx.increment(); },
      ArrowDown:  (ctx: KevlarContext) => { ctx.decrement(); },
      ArrowUp:    (ctx: KevlarContext) => { ctx.increment(); },
      Home:       (ctx: KevlarContext) => { ctx.setMin(); },
      End:        (ctx: KevlarContext) => { ctx.setMax(); },
      PageUp:     (ctx: KevlarContext) => { ctx.incrementLargeStep(); },
      PageDown:   (ctx: KevlarContext) => { ctx.decrementLargeStep(); },
    },
  },
};
const network    = { ...baseInputNetwork };
const timing     = { ...baseInputTiming };
const animation  = { ...baseInputAnimation };
const validation = { ...baseInputValidation };

// Screenreader value announcer — dev-fill default
const screenreaderOnValueChange = (v: number) => `Opacity: ${Math.round(v * 100)}%`;


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarAlphaSliderProps = MantineAlphaSliderProps & {
  // REQUIRED
  onKevlarAction: (ctx: KevlarContext) => Promise<void>;
  announce: { invalid: string };

  // OPTIONAL — override anything from the base
  states?:       DeepPartial<typeof states>;
  userActions?:  Partial<typeof actions>;
  input?:        DeepPartial<typeof input>;
  network?:      Partial<typeof network>;
  timing?:       Partial<typeof timing>;
  animation?:    DeepPartial<typeof animation>;
  validation?:   Partial<typeof validation>;

  // Dev-fill: alpha-slider-specific
  onValueChangeAnnounce?: (value: number) => string;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function AlphaSlider(props: KevlarAlphaSliderProps) {
  const {
    onKevlarAction, announce: ann,
    states: so, userActions: ao, input: io, network: no_,
    timing: to, animation: animo, validation: vo,
    onValueChangeAnnounce,
    ...mantineProps
  } = props;

  const spec = deepMerge(
    { states, userActions: actions, input, network, timing, animation, validation },
    { states: so, userActions: ao, input: io, network: no_, timing: to, animation: animo, validation: vo },
  );

  // Fill the blanks that survived from base
  spec.states.invalid.announcement = ann.invalid;

  const interaction = useKevlarInteraction(spec, {
    onAction: onKevlarAction,
    screenreaderOnValueChange: onValueChangeAnnounce ?? screenreaderOnValueChange,
  });

  return (
    <MantineAlphaSlider
      {...mantineProps}
      {...interaction.handlers}
      style={interaction.currentVisual}
      value={interaction.value as number}
      onChange={interaction.onChange}
    />
  );
}
