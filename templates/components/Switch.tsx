import { Switch as MantineSwitch, type SwitchProps as MantineSwitchProps } from '@mantine/core';
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

// Switch inherits BaseInput.
// States: idle, hover, focused, checked, unchecked, disabled (NOT standard input states).
// screenreader.role: switch.
// keyboard.bindings.Space: toggle (NOT Enter).
// keyboard.bindings.Enter: explicitly nothing.
// touch.onTap: toggle, touch.onSwipe: dev fills (swipe left=off, right=on).
// Animation: toggle spring.

const states = {
  idle: {
    ...baseInputStates.idle,
    screenreader: { role: 'switch' as const },
  },
  hover: {
    ...baseInputStates.hover,
    screenreader: { role: 'switch' as const },
  },
  focused: {
    ...baseInputStates.focused,
    screenreader: { role: 'switch' as const },
  },
  checked: {
    ...baseInputStates.valid,
    screenreader: { role: 'switch' as const, state: { checked: true } },
  },
  unchecked: {
    ...baseInputStates.idle,
    screenreader: { role: 'switch' as const, state: { checked: false } },
  },
  disabled: {
    ...baseInputStates.disabled,
    screenreader: { role: 'switch' as const, state: { disabled: true } },
  },
};

const actions    = { ...baseInputActions };
const input      = {
  ...baseInputInput,
  touch: {
    ...baseInputInput.touch,
    onTap: (ctx: KevlarContext) => { ctx.toggle(); },
    onSwipe: FUNCTION_MUST_BE_DEFINED as unknown as (ctx: KevlarContext, direction: 'left' | 'right') => void,
    // Dev-fill: swipe left = off, swipe right = on
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
const animation  = {
  ...baseInputAnimation,
  toggle: { type: 'spring' as const, stiffness: 500, damping: 30 },
};
const validation = { ...baseInputValidation };


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarSwitchProps = MantineSwitchProps & {
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

export function Switch(props: KevlarSwitchProps) {
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
  spec.states.checked.announcement = ann.invalid;

  const interaction = useKevlarInteraction(spec, {
    onAction: onKevlarAction,
  });

  return (
    <MantineSwitch
      role="switch"
      {...mantineProps}
      {...interaction.handlers}
      style={interaction.currentVisual}
      disabled={interaction.state === 'disabled'}
      checked={interaction.value as boolean}
      onChange={interaction.onChange}
    />
  );
}
