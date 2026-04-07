import { NumberFormatter as MantineNumberFormatter, type NumberFormatterProps as MantineNumberFormatterProps } from '@mantine/core';
import { baseStaticStates, baseStaticInput } from '../base/BaseStatic';
import { useKevlarStatic, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { DeepPartial } from '@unlikefraction/kevlar/types';

// NumberFormatter: locale-aware number display. No overrides from BaseStatic.

const states = { ...baseStaticStates };
const input  = { ...baseStaticInput };


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarNumberFormatterProps = MantineNumberFormatterProps & {
  states?: DeepPartial<typeof states>;
  input?:  DeepPartial<typeof input>;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function NumberFormatter(props: KevlarNumberFormatterProps) {
  const { states: so, input: io, ...mantineProps } = props;

  const spec = deepMerge({ states, input }, { states: so, input: io });
  useKevlarStatic(spec);

  return <MantineNumberFormatter {...mantineProps} />;
}
