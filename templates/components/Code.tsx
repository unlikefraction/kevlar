import { Code as MantineCode, type CodeProps as MantineCodeProps } from '@mantine/core';
import { baseStaticStates, baseStaticInput } from '../base/BaseStatic';
import { useKevlarStatic, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { DeepPartial } from '@unlikefraction/kevlar/types';

// Code: inherits BaseStatic.
// screenreader.role: code

const states = {
  ...baseStaticStates,
  idle: {
    ...baseStaticStates.idle,
    screenreader: { role: 'code' as const },
  },
  focused: {
    ...baseStaticStates.focused,
    screenreader: { role: 'code' as const },
  },
};

const input = { ...baseStaticInput };


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarCodeProps = MantineCodeProps & {
  states?: DeepPartial<typeof states>;
  input?:  DeepPartial<typeof input>;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function Code(props: KevlarCodeProps) {
  const { states: so, input: io, children, ...mantineProps } = props;

  const spec = deepMerge({ states, input }, { states: so, input: io });
  const staticCtx = useKevlarStatic(spec);

  return (
    <MantineCode {...mantineProps} {...staticCtx.handlers}>
      {children}
    </MantineCode>
  );
}
