import { Transition as MantineTransition, type TransitionProps as MantineTransitionProps } from '@mantine/core';
import { baseStaticStates, baseStaticInput } from '../base/BaseStatic';
import { useKevlarStatic, deepMerge } from '@unlikefraction/kevlar/runtime';
import { prefersReducedMotion } from '@unlikefraction/kevlar/primitives';
import type { DeepPartial } from '@unlikefraction/kevlar/types';

// Transition: inherits BaseStatic.
// reduced_motion → all transitions instant (duration: 0).

const states = { ...baseStaticStates };
const input  = { ...baseStaticInput };


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarTransitionProps = MantineTransitionProps & {
  states?: DeepPartial<typeof states>;
  input?:  DeepPartial<typeof input>;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function Transition(props: KevlarTransitionProps) {
  const { states: so, input: io, ...mantineProps } = props;

  const spec = deepMerge({ states, input }, { states: so, input: io });
  useKevlarStatic(spec);

  // reduced_motion → instant transitions
  const duration = prefersReducedMotion() ? 0 : mantineProps.duration;

  return <MantineTransition {...mantineProps} duration={duration} />;
}
