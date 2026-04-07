import { Highlight as MantineHighlight, type HighlightProps as MantineHighlightProps } from '@mantine/core';
import { baseStaticStates, baseStaticInput } from '../base/BaseStatic';
import { useKevlarStatic, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { DeepPartial } from '@unlikefraction/kevlar/types';

// Highlight: inherits BaseStatic. No overrides.

const states = { ...baseStaticStates };
const input  = { ...baseStaticInput };


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarHighlightProps = MantineHighlightProps & {
  states?: DeepPartial<typeof states>;
  input?:  DeepPartial<typeof input>;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function Highlight(props: KevlarHighlightProps) {
  const { states: so, input: io, ...mantineProps } = props;

  const spec = deepMerge({ states, input }, { states: so, input: io });
  useKevlarStatic(spec);

  return <MantineHighlight {...mantineProps} />;
}
