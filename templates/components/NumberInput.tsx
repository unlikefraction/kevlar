import { NumberInput as MantineNumberInput, type NumberInputProps as MantineNumberInputProps } from '@mantine/core';
import {
  baseInputStates,
  baseInputActions,
  baseInputInput,
  baseInputNetwork,
  baseInputTiming,
  baseInputAnimation,
  baseInputValidation,
} from '../base/BaseInput';
import { STRING_MUST_BE_DEFINED, NUMBER_MUST_BE_DEFINED } from '@unlikefraction/kevlar/sentinels';
import { useKevlarInteraction, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { KevlarContext, DeepPartial } from '@unlikefraction/kevlar/types';

// NumberInput inherits BaseInput.
// Additional keyboard: ArrowUp (increment), ArrowDown (decrement).
// screenreader.role: spinbutton.
// Dev-fill: min, max, step, decimalScale.

const states = {
  ...baseInputStates,
  idle: {
    ...baseInputStates.idle,
    screenreader: { role: 'spinbutton' as const },
  },
  hover: {
    ...baseInputStates.hover,
    screenreader: { role: 'spinbutton' as const },
  },
  focused: {
    ...baseInputStates.focused,
    screenreader: { role: 'spinbutton' as const },
  },
  typing: {
    ...baseInputStates.typing,
    screenreader: { role: 'spinbutton' as const },
  },
  valid: {
    ...baseInputStates.valid,
    screenreader: { role: 'spinbutton' as const },
  },
  invalid: {
    ...baseInputStates.invalid,
    screenreader: { role: 'spinbutton' as const },
  },
  disabled: {
    ...baseInputStates.disabled,
    screenreader: { role: 'spinbutton' as const, state: { disabled: true } },
  },
};

const actions    = { ...baseInputActions };
const input      = {
  ...baseInputInput,
  keyboard: {
    ...baseInputInput.keyboard,
    bindings: {
      ...baseInputInput.keyboard.bindings,
      Enter:     (ctx: KevlarContext) => { ctx.submitForm(); },
      ArrowUp:   (ctx: KevlarContext) => { ctx.increment(); },
      ArrowDown: (ctx: KevlarContext) => { ctx.decrement(); },
    },
  },
};
const network    = { ...baseInputNetwork };
const timing     = { ...baseInputTiming };
const animation  = { ...baseInputAnimation };
const validation = { ...baseInputValidation };


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarNumberInputProps = MantineNumberInputProps & {
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

  // Dev-fill: number-specific
  min?:          number;
  max?:          number;
  step?:         number;
  decimalScale?: number;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function NumberInput(props: KevlarNumberInputProps) {
  const {
    onKevlarAction, announce: ann,
    states: so, userActions: ao, input: io, network: no_,
    timing: to, animation: animo, validation: vo,
    min, max, step, decimalScale,
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
  });

  return (
    <MantineNumberInput
      min={min}
      max={max}
      step={step}
      decimalScale={decimalScale}
      {...mantineProps}
      {...interaction.handlers}
      style={interaction.currentVisual}
      disabled={interaction.state === 'disabled'}
      error={interaction.state === 'invalid' ? interaction.errorMessage : undefined}
      value={interaction.value as number}
      onChange={interaction.onChange}
    />
  );
}
