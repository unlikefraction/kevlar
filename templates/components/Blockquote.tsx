import { Blockquote as MantineBlockquote, type BlockquoteProps as MantineBlockquoteProps } from '@mantine/core';
import { baseStaticStates, baseStaticInput } from '../base/BaseStatic';
import { useKevlarStatic, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { DeepPartial } from '@unlikefraction/kevlar/types';

// Blockquote: inherits BaseStatic.
// screenreader.role: blockquote

const states = {
  ...baseStaticStates,
  idle: {
    ...baseStaticStates.idle,
    screenreader: { role: 'blockquote' as const },
  },
  focused: {
    ...baseStaticStates.focused,
    screenreader: { role: 'blockquote' as const },
  },
};

const input = { ...baseStaticInput };


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarBlockquoteProps = MantineBlockquoteProps & {
  states?: DeepPartial<typeof states>;
  input?:  DeepPartial<typeof input>;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function Blockquote(props: KevlarBlockquoteProps) {
  const { states: so, input: io, children, ...mantineProps } = props;

  const spec = deepMerge({ states, input }, { states: so, input: io });
  const staticCtx = useKevlarStatic(spec);

  return (
    <MantineBlockquote {...mantineProps} {...staticCtx.handlers}>
      {children}
    </MantineBlockquote>
  );
}
