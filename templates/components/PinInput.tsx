import { PinInput as MantinePinInput, type PinInputProps as MantinePinInputProps } from '@mantine/core';
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

// PinInput inherits BaseInput.
// keyboard: ArrowLeft/Right for cell navigation, Backspace for clear+prev.
// Dev-fill: length, onComplete, mask.

const states     = { ...baseInputStates };
const actions    = { ...baseInputActions };
const input      = {
  ...baseInputInput,
  keyboard: {
    ...baseInputInput.keyboard,
    bindings: {
      ...baseInputInput.keyboard.bindings,
      Enter:      (ctx: KevlarContext) => { ctx.submitForm(); },
      ArrowLeft:  (ctx: KevlarContext) => { ctx.focusPrevCell(); },
      ArrowRight: (ctx: KevlarContext) => { ctx.focusNextCell(); },
      Backspace:  (ctx: KevlarContext) => { ctx.clearAndFocusPrev(); },
    },
  },
};
const network    = { ...baseInputNetwork };
const timing     = { ...baseInputTiming };
const animation  = { ...baseInputAnimation };
const validation = { ...baseInputValidation };


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarPinInputProps = MantinePinInputProps & {
  // REQUIRED
  onKevlarAction: (ctx: KevlarContext) => Promise<void>;
  announce: { invalid: string };

  // OPTIONAL — override anything from the base
  states?:      DeepPartial<typeof states>;
  userActions?: Partial<typeof actions>;
  input?:       DeepPartial<typeof input>;
  network?:     Partial<typeof network>;
  timing?:      Partial<typeof timing>;
  animation?:   DeepPartial<typeof animation>;
  validation?:  Partial<typeof validation>;

  // Dev-fill: pin-specific
  length:       number;
  onComplete:   (value: string) => void;
  mask?:        boolean;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function PinInput(props: KevlarPinInputProps) {
  const {
    onKevlarAction, announce: ann,
    states: so, userActions: ao, input: io, network: no_,
    timing: to, animation: animo, validation: vo,
    length, onComplete, mask,
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
    <MantinePinInput
      length={length}
      mask={mask}
      onComplete={onComplete}
      {...mantineProps}
      {...interaction.handlers}
      style={interaction.currentVisual}
      disabled={interaction.state === 'disabled'}
      error={interaction.state === 'invalid'}
    />
  );
}
