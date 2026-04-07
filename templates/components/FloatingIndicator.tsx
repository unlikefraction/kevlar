import { FloatingIndicator as MantineFloatingIndicator, type FloatingIndicatorProps as MantineFloatingIndicatorProps } from '@mantine/core';
import {
  baseStaticStates,
  baseStaticInput,
} from '../base/BaseStatic';
import { ANIMATION_MUST_BE_DEFINED } from '@unlikefraction/kevlar/sentinels';
import { useKevlarStatic, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { DeepPartial } from '@unlikefraction/kevlar/types';

// FloatingIndicator inherits BaseStatic:
// - Decorative only (follows another element visually)
// - Hidden from screenreaders
// - Animation: spring move to follow target element

const states = {
  ...baseStaticStates,
  idle: {
    ...baseStaticStates.idle,
    screenreader: { hidden: true }, // decorative — not in a11y tree
  },
  focused: {
    ...baseStaticStates.focused,
    screenreader: { hidden: true },
  },
};

const input = { ...baseStaticInput };

// FloatingIndicator-specific: spring animation to follow target
const animation = {
  move: ANIMATION_MUST_BE_DEFINED, // spring animation when indicator moves to new target
};


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarFloatingIndicatorProps = MantineFloatingIndicatorProps & {
  // OPTIONAL — override anything from the base
  states?:    DeepPartial<typeof states>;
  input?:     DeepPartial<typeof input>;
  animation?: DeepPartial<typeof animation>;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function FloatingIndicator(props: KevlarFloatingIndicatorProps) {
  const {
    states: so, input: io, animation: animo,
    ...mantineProps
  } = props;

  const spec = deepMerge(
    { states, input, animation },
    { states: so, input: io, animation: animo },
  );

  const staticCtl = useKevlarStatic(spec);

  return (
    <MantineFloatingIndicator
      {...mantineProps}
      {...staticCtl.handlers}
      style={staticCtl.currentVisual}
      aria-hidden="true"
    />
  );
}
