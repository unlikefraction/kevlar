import { List as MantineList, type ListProps as MantineListProps } from '@mantine/core';
import { baseStaticStates, baseStaticInput } from '../base/BaseStatic';
import { useKevlarStatic, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { DeepPartial } from '@unlikefraction/kevlar/types';

// List: inherits BaseStatic.
// screenreader: { role: 'list', item: { role: 'listitem' } }

const states = {
  ...baseStaticStates,
  idle: {
    ...baseStaticStates.idle,
    screenreader: { role: 'list' as const, item: { role: 'listitem' as const } },
  },
  focused: {
    ...baseStaticStates.focused,
    screenreader: { role: 'list' as const, item: { role: 'listitem' as const } },
  },
};

const input = { ...baseStaticInput };


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarListProps = MantineListProps & {
  states?: DeepPartial<typeof states>;
  input?:  DeepPartial<typeof input>;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function List(props: KevlarListProps) {
  const { states: so, input: io, children, ...mantineProps } = props;

  const spec = deepMerge({ states, input }, { states: so, input: io });
  const staticCtx = useKevlarStatic(spec);

  return (
    <MantineList role="list" {...mantineProps} {...staticCtx.handlers}>
      {children}
    </MantineList>
  );
}
