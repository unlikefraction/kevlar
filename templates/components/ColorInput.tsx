import { ColorInput as MantineColorInput, type ColorInputProps as MantineColorInputProps } from '@mantine/core';
import {
  baseInputStates,
  baseInputActions,
  baseInputInput,
  baseInputNetwork,
  baseInputTiming,
  baseInputAnimation,
  baseInputValidation,
} from '../base/BaseInput';
import { STRING_MUST_BE_DEFINED, FUNCTION_MUST_BE_DEFINED } from '@unlikefraction/kevlar/sentinels';
import { useKevlarInteraction, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { KevlarContext, DeepPartial } from '@unlikefraction/kevlar/types';

// ColorInput inherits BaseInput.
// Composite: text input + color picker overlay.
// Dev fills the overlay slots (onClickOutside, onEscape, etc.).

const states     = { ...baseInputStates };
const actions    = { ...baseInputActions };
const input      = {
  ...baseInputInput,
  keyboard: {
    ...baseInputInput.keyboard,
    bindings: {
      ...baseInputInput.keyboard.bindings,
      Enter:  (ctx: KevlarContext) => { ctx.submitForm(); },
      Escape: (ctx: KevlarContext) => { ctx.closeOverlay(); },
    },
  },
};
const network    = { ...baseInputNetwork };
const timing     = { ...baseInputTiming };
const animation  = { ...baseInputAnimation };
const validation = { ...baseInputValidation };

// Overlay slots for the color picker dropdown
const overlay = {
  onClickOutside: FUNCTION_MUST_BE_DEFINED as unknown as (ctx: KevlarContext) => void,
  onEscape:       FUNCTION_MUST_BE_DEFINED as unknown as (ctx: KevlarContext) => void,
  onOpen:         FUNCTION_MUST_BE_DEFINED as unknown as (ctx: KevlarContext) => void,
  onClose:        FUNCTION_MUST_BE_DEFINED as unknown as (ctx: KevlarContext) => void,
};


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarColorInputProps = MantineColorInputProps & {
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
  overlay?:     Partial<typeof overlay>;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function ColorInput(props: KevlarColorInputProps) {
  const {
    onKevlarAction, announce: ann,
    states: so, userActions: ao, input: io, network: no_,
    timing: to, animation: animo, validation: vo, overlay: oo,
    ...mantineProps
  } = props;

  const spec = deepMerge(
    { states, userActions: actions, input, network, timing, animation, validation, overlay },
    { states: so, userActions: ao, input: io, network: no_, timing: to, animation: animo, validation: vo, overlay: oo },
  );

  // Fill the blanks that survived from base
  spec.states.invalid.announcement = ann.invalid;

  const interaction = useKevlarInteraction(spec, {
    onAction: onKevlarAction,
  });

  return (
    <MantineColorInput
      {...mantineProps}
      {...interaction.handlers}
      style={interaction.currentVisual}
      disabled={interaction.state === 'disabled'}
      error={interaction.state === 'invalid' ? interaction.errorMessage : undefined}
      value={interaction.value as string}
      onChange={interaction.onChange}
    />
  );
}
