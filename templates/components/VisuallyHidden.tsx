import { VisuallyHidden as MantineVisuallyHidden, type VisuallyHiddenProps as MantineVisuallyHiddenProps } from '@mantine/core';
import { baseStaticStates, baseStaticInput } from '../base/BaseStatic';
import { useKevlarStatic, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { DeepPartial } from '@unlikefraction/kevlar/types';

// VisuallyHidden: inherits BaseStatic. No overrides.

const states = { ...baseStaticStates };
const input  = { ...baseStaticInput };


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarVisuallyHiddenProps = MantineVisuallyHiddenProps & {
  states?: DeepPartial<typeof states>;
  input?:  DeepPartial<typeof input>;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function VisuallyHidden(props: KevlarVisuallyHiddenProps) {
  const { states: so, input: io, children, ...mantineProps } = props;

  const spec = deepMerge({ states, input }, { states: so, input: io });
  useKevlarStatic(spec);

  return (
    <MantineVisuallyHidden {...mantineProps}>
      {children}
    </MantineVisuallyHidden>
  );
}
