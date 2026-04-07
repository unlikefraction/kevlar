import { PasswordInput as MantinePasswordInput, type PasswordInputProps as MantinePasswordInputProps } from '@mantine/core';
import {
  baseInputStates,
  baseInputActions,
  baseInputInput,
  baseInputNetwork,
  baseInputTiming,
  baseInputAnimation,
  baseInputValidation,
} from '../base/BaseInput';
import { STRING_MUST_BE_DEFINED } from '@unlikefraction/kevlar/sentinels';
import { useKevlarInteraction, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { KevlarContext, DeepPartial } from '@unlikefraction/kevlar/types';

// PasswordInput inherits BaseInput.
// keyboard.bindings.Enter: submit.
// Dev-fill: autocomplete ('current-password' or 'new-password').
// Child element: visibility toggle has its own aria-label.

const states     = { ...baseInputStates };
const actions    = { ...baseInputActions };
const input      = {
  ...baseInputInput,
  keyboard: {
    ...baseInputInput.keyboard,
    bindings: {
      ...baseInputInput.keyboard.bindings,
      Enter: (ctx: KevlarContext) => { ctx.submitForm(); },
    },
  },
};
const network    = { ...baseInputNetwork };
const timing     = { ...baseInputTiming };
const animation  = { ...baseInputAnimation };
const validation = { ...baseInputValidation };

// Visibility toggle screenreader
const visibilityToggle = {
  'aria-label': 'Toggle password visibility',
};


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarPasswordInputProps = MantinePasswordInputProps & {
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

  // Dev-fill: password-specific
  autocomplete?: 'current-password' | 'new-password';
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function PasswordInput(props: KevlarPasswordInputProps) {
  const {
    onKevlarAction, announce: ann,
    states: so, userActions: ao, input: io, network: no_,
    timing: to, animation: animo, validation: vo,
    autocomplete,
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
    <MantinePasswordInput
      autoComplete={autocomplete}
      visibilityToggleButtonProps={visibilityToggle}
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
