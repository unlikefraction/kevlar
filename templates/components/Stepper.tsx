import { Stepper as MantineStepper, type StepperProps as MantineStepperProps } from '@mantine/core';
import {
  baseNavigationStates,
  baseNavigationActions,
  baseNavigationInput,
  baseNavigationAnimation,
} from '../base/BaseNavigation';
import { STRING_MUST_BE_DEFINED } from '@unlikefraction/kevlar/sentinels';
import { useKevlarInteraction, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { KevlarContext, DeepPartial } from '@unlikefraction/kevlar/types';

// Stepper: inherits BaseNavigation.
// States: idle, hover, focused, active, completed, disabled.
// Dev-fill: onStepClick (can users click completed steps?)

const states = {
  idle: {
    ...baseNavigationStates.idle,
    screenreader: { role: 'navigation' as const, label: 'Stepper' },
  },
  hover: {
    ...baseNavigationStates.hover,
    screenreader: { role: 'navigation' as const, label: 'Stepper' },
  },
  focused: {
    ...baseNavigationStates.focused,
    screenreader: { role: 'navigation' as const, label: 'Stepper' },
  },
  active: {
    ...baseNavigationStates.active,
    screenreader: { role: 'navigation' as const, label: 'Stepper', state: { current: 'step' as const } },
  },
  completed: {
    ...baseNavigationStates.active,
    screenreader: { role: 'navigation' as const, label: 'Stepper', state: { completed: true } },
    announcement: STRING_MUST_BE_DEFINED,
  },
  disabled: {
    ...baseNavigationStates.disabled,
    screenreader: { role: 'navigation' as const, label: 'Stepper', state: { disabled: true } },
  },
};

const actions   = { ...baseNavigationActions };
const input     = { ...baseNavigationInput };
const animation = { ...baseNavigationAnimation };


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarStepperProps = MantineStepperProps & {
  // REQUIRED — dev-fill
  onStepClick: (step: number, ctx: KevlarContext) => void;
  announce: { active: string; completed: string };

  // OPTIONAL — override anything from the base
  states?:      DeepPartial<typeof states>;
  userActions?: Partial<typeof actions>;
  input?:       DeepPartial<typeof input>;
  animation?:   DeepPartial<typeof animation>;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function Stepper(props: KevlarStepperProps) {
  const {
    onStepClick, announce: ann,
    states: so, userActions: ao, input: io, animation: animo,
    children, ...mantineProps
  } = props;

  const spec = deepMerge(
    { states, userActions: actions, input, animation },
    { states: so, userActions: ao, input: io, animation: animo },
  );

  // Fill the blanks that survived from base
  spec.states.active.announcement = ann.active;
  spec.states.completed.announcement = ann.completed;

  const interaction = useKevlarInteraction(spec, {
    onAction: async (ctx: KevlarContext) => { onStepClick(ctx.value as number, ctx); },
  });

  return (
    <MantineStepper
      {...mantineProps}
      {...interaction.handlers}
      onStepClick={(step) => interaction.onChange(step)}
    >
      {children}
    </MantineStepper>
  );
}
