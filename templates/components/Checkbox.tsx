import { Checkbox as MantineCheckbox, type CheckboxProps as MantineCheckboxProps } from '@mantine/core';
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

// Checkbox inherits BaseInput.
// States: idle, hover, focused, checked, unchecked, indeterminate, disabled.
// screenreader.role: checkbox.
// keyboard.bindings.Space: toggle, keyboard.bindings.Enter: explicitly nothing.
// Dev-fill: indeterminate support.

const states = {
  idle: {
    ...baseInputStates.idle,
    screenreader: { role: 'checkbox' as const },
  },
  hover: {
    ...baseInputStates.hover,
    screenreader: { role: 'checkbox' as const },
  },
  focused: {
    ...baseInputStates.focused,
    screenreader: { role: 'checkbox' as const },
  },
  checked: {
    ...baseInputStates.valid,
    screenreader: { role: 'checkbox' as const, state: { checked: true } },
  },
  unchecked: {
    ...baseInputStates.idle,
    screenreader: { role: 'checkbox' as const, state: { checked: false } },
  },
  indeterminate: {
    ...baseInputStates.idle,
    screenreader: { role: 'checkbox' as const, state: { checked: 'mixed' as const } },
  },
  disabled: {
    ...baseInputStates.disabled,
    screenreader: { role: 'checkbox' as const, state: { disabled: true } },
  },
};

const actions    = { ...baseInputActions };
const input      = {
  ...baseInputInput,
  touch: {
    ...baseInputInput.touch,
    onTap: (ctx: KevlarContext) => { ctx.toggle(); },
  },
  keyboard: {
    ...baseInputInput.keyboard,
    bindings: {
      ...baseInputInput.keyboard.bindings,
      Space: (ctx: KevlarContext) => { ctx.toggle(); },
      Enter: () => {},  // explicitly nothing
    },
  },
};
const network    = { ...baseInputNetwork };
const timing     = { ...baseInputTiming };
const animation  = { ...baseInputAnimation };
const validation = { ...baseInputValidation };


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarCheckboxProps = MantineCheckboxProps & {
  // REQUIRED
  onKevlarAction: (ctx: KevlarContext) => Promise<void>;
  announce: { invalid: string };

  // OPTIONAL — override anything from the base
  states?:        DeepPartial<typeof states>;
  userActions?:   Partial<typeof actions>;
  input?:         DeepPartial<typeof input>;
  network?:       Partial<typeof network>;
  timing?:        Partial<typeof timing>;
  animation?:     DeepPartial<typeof animation>;
  validation?:    Partial<typeof validation>;

  // Dev-fill: checkbox-specific
  indeterminate?: boolean;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function Checkbox(props: KevlarCheckboxProps) {
  const {
    onKevlarAction, announce: ann,
    states: so, userActions: ao, input: io, network: no_,
    timing: to, animation: animo, validation: vo,
    indeterminate,
    ...mantineProps
  } = props;

  const spec = deepMerge(
    { states, userActions: actions, input, network, timing, animation, validation },
    { states: so, userActions: ao, input: io, network: no_, timing: to, animation: animo, validation: vo },
  );

  // Fill the blanks that survived from base
  spec.states.checked.announcement = ann.invalid;

  const interaction = useKevlarInteraction(spec, {
    onAction: onKevlarAction,
  });

  return (
    <MantineCheckbox
      {...mantineProps}
      {...interaction.handlers}
      style={interaction.currentVisual}
      disabled={interaction.state === 'disabled'}
      checked={interaction.value as boolean}
      indeterminate={indeterminate}
      onChange={interaction.onChange}
    />
  );
}
