import { Kbd as MantineKbd, type KbdProps as MantineKbdProps } from '@mantine/core';
import { baseStaticStates, baseStaticInput } from '../base/BaseStatic';
import { useKevlarStatic, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { DeepPartial } from '@unlikefraction/kevlar/types';

// Kbd: keyboard shortcut display. No overrides from BaseStatic.

const states = { ...baseStaticStates };
const input  = { ...baseStaticInput };


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarKbdProps = MantineKbdProps & {
  states?: DeepPartial<typeof states>;
  input?:  DeepPartial<typeof input>;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function Kbd(props: KevlarKbdProps) {
  const { states: so, input: io, children, ...mantineProps } = props;

  const spec = deepMerge({ states, input }, { states: so, input: io });
  const staticCtx = useKevlarStatic(spec);

  return (
    <MantineKbd {...mantineProps} {...staticCtx.handlers}>
      {children}
    </MantineKbd>
  );
}
