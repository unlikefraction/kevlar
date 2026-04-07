import { Divider as MantineDivider, type DividerProps as MantineDividerProps } from '@mantine/core';
import { baseStaticStates, baseStaticInput } from '../base/BaseStatic';
import { useKevlarStatic, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { DeepPartial } from '@unlikefraction/kevlar/types';

// Divider: inherits BaseStatic.
// screenreader: { role: 'separator' }

const states = {
  ...baseStaticStates,
  idle: {
    ...baseStaticStates.idle,
    screenreader: { role: 'separator' as const },
  },
  focused: {
    ...baseStaticStates.focused,
    screenreader: { role: 'separator' as const },
  },
};

const input = { ...baseStaticInput };


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarDividerProps = MantineDividerProps & {
  states?: DeepPartial<typeof states>;
  input?:  DeepPartial<typeof input>;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function Divider(props: KevlarDividerProps) {
  const { states: so, input: io, ...mantineProps } = props;

  const spec = deepMerge({ states, input }, { states: so, input: io });
  useKevlarStatic(spec);

  return <MantineDivider role="separator" {...mantineProps} />;
}
