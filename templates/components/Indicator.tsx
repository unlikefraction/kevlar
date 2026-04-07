import { Indicator as MantineIndicator, type IndicatorProps as MantineIndicatorProps } from '@mantine/core';
import { baseStaticStates, baseStaticInput } from '../base/BaseStatic';
import { useKevlarStatic, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { DeepPartial } from '@unlikefraction/kevlar/types';

// Indicator: purely visual dot/badge overlay. No overrides from BaseStatic.

const states = { ...baseStaticStates };
const input  = { ...baseStaticInput };


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarIndicatorProps = MantineIndicatorProps & {
  states?: DeepPartial<typeof states>;
  input?:  DeepPartial<typeof input>;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function Indicator(props: KevlarIndicatorProps) {
  const { states: so, input: io, children, ...mantineProps } = props;

  const spec = deepMerge({ states, input }, { states: so, input: io });
  const staticCtx = useKevlarStatic(spec);

  return (
    <MantineIndicator {...mantineProps} {...staticCtx.handlers}>
      {children}
    </MantineIndicator>
  );
}
