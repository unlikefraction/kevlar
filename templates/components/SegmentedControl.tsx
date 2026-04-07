import { SegmentedControl as MantineSegmentedControl, type SegmentedControlProps as MantineSegmentedControlProps } from '@mantine/core';
import {
  baseNavigationStates,
  baseNavigationActions,
  baseNavigationInput,
  baseNavigationAnimation,
} from '../base/BaseNavigation';
import { useKevlarNavigation, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { KevlarContext, DeepPartial } from '@unlikefraction/kevlar/types';

// SegmentedControl: inherits BaseNavigation.
// screenreader.role: radiogroup
// Animation: sliding indicator { type: 'slide', duration: 'normal', easing: 'spring' }

const states = {
  ...baseNavigationStates,
  idle: {
    ...baseNavigationStates.idle,
    screenreader: { role: 'radiogroup' as const },
  },
};

const actions   = { ...baseNavigationActions };
const input     = { ...baseNavigationInput };
const animation = {
  ...baseNavigationAnimation,
  indicator: { type: 'slide' as const, duration: 'normal' as const, easing: 'spring' as const },
};


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarSegmentedControlProps = MantineSegmentedControlProps & {
  // OPTIONAL — override anything from the base
  states?:      DeepPartial<typeof states>;
  userActions?: Partial<typeof actions>;
  input?:       DeepPartial<typeof input>;
  animation?:   DeepPartial<typeof animation>;
  onKevlarChange?: (value: string, ctx: KevlarContext) => void;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function SegmentedControl(props: KevlarSegmentedControlProps) {
  const {
    onKevlarChange,
    states: so, userActions: ao, input: io, animation: animo,
    ...mantineProps
  } = props;

  const spec = deepMerge(
    { states, userActions: actions, input, animation },
    { states: so, userActions: ao, input: io, animation: animo },
  );

  const navigation = useKevlarNavigation(spec, {
    onActivate: onKevlarChange,
  });

  return (
    <MantineSegmentedControl
      role="radiogroup"
      {...mantineProps}
      {...navigation.handlers}
      onChange={(value) => navigation.activate(value)}
    />
  );
}
