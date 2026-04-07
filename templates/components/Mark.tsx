import { Mark as MantineMark, type MarkProps as MantineMarkProps } from '@mantine/core';
import { baseStaticStates, baseStaticInput } from '../base/BaseStatic';
import { useKevlarStatic, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { DeepPartial } from '@unlikefraction/kevlar/types';

// Mark: inherits BaseStatic. No overrides.

const states = { ...baseStaticStates };
const input  = { ...baseStaticInput };


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarMarkProps = MantineMarkProps & {
  states?: DeepPartial<typeof states>;
  input?:  DeepPartial<typeof input>;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function Mark(props: KevlarMarkProps) {
  const { states: so, input: io, children, ...mantineProps } = props;

  const spec = deepMerge({ states, input }, { states: so, input: io });
  const staticCtx = useKevlarStatic(spec);

  return (
    <MantineMark {...mantineProps} {...staticCtx.handlers}>
      {children}
    </MantineMark>
  );
}
