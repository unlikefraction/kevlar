import { Slider as MantineSlider, type SliderProps as MantineSliderProps } from '@mantine/core';
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

// Slider inherits BaseInput.
// screenreader.role: slider.
// keyboard: ArrowLeft/Right, Home/End, PageUp/PageDown.
// Dev-fill: min, max, step, screenreader.onValueChange.

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

// Screenreader value announcer — dev must provide
const screenreaderOnValueChange = FUNCTION_MUST_BE_DEFINED as unknown as (value: number) => string;


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarSliderProps = MantineSliderProps & {
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

  // Dev-fill: slider-specific
  min?:          number;
  max?:          number;
  step?:         number;
  onValueChangeAnnounce?: (value: number) => string;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function Slider(props: KevlarSliderProps) {
  const {
    onKevlarAction, announce: ann,
    states: so, userActions: ao, input: io, network: no_,
    timing: to, animation: animo, validation: vo,
    min, max, step, onValueChangeAnnounce,
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
    <MantineSlider
      min={min}
      max={max}
      step={step}
      {...mantineProps}
      {...interaction.handlers}
      style={interaction.currentVisual}
      disabled={interaction.state === 'disabled'}
      value={interaction.value as number}
      onChange={interaction.onChange}
    />
  );
}
