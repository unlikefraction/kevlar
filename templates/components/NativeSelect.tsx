import { NativeSelect as MantineNativeSelect, type NativeSelectProps as MantineNativeSelectProps } from '@mantine/core';
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

// NativeSelect inherits BaseInput.
// Minimal overrides. Uses browser-native <select>.
// Kevlar tracks state but the browser handles keyboard/interaction natively.
// screenreader.role: listbox.

const states = {
  ...baseInputStates,
  idle: {
    ...baseInputStates.idle,
    screenreader: { role: 'listbox' as const },
  },
  hover: {
    ...baseInputStates.hover,
    screenreader: { role: 'listbox' as const },
  },
  focused: {
    ...baseInputStates.focused,
    screenreader: { role: 'listbox' as const },
  },
  typing: {
    ...baseInputStates.typing,
    screenreader: { role: 'listbox' as const },
  },
  valid: {
    ...baseInputStates.valid,
    screenreader: { role: 'listbox' as const },
  },
  invalid: {
    ...baseInputStates.invalid,
    screenreader: { role: 'listbox' as const },
  },
  disabled: {
    ...baseInputStates.disabled,
    screenreader: { role: 'listbox' as const, state: { disabled: true } },
  },
};

const actions    = { ...baseInputActions };
const input      = { ...baseInputInput };
const network    = { ...baseInputNetwork };
const timing     = { ...baseInputTiming };
const animation  = { ...baseInputAnimation };
const validation = { ...baseInputValidation };


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarNativeSelectProps = MantineNativeSelectProps & {
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
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function NativeSelect(props: KevlarNativeSelectProps) {
  const {
    onKevlarAction, announce: ann,
    states: so, userActions: ao, input: io, network: no_,
    timing: to, animation: animo, validation: vo,
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
    <MantineNativeSelect
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
