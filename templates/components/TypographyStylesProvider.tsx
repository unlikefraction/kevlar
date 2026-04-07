import { TypographyStylesProvider as MantineTypographyStylesProvider, type TypographyStylesProviderProps as MantineTypographyStylesProviderProps } from '@mantine/core';
import { baseStaticStates, baseStaticInput } from '../base/BaseStatic';
import { useKevlarStatic, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { DeepPartial } from '@unlikefraction/kevlar/types';

// TypographyStylesProvider: inherits BaseStatic. Wrapper component, no overrides.

const states = { ...baseStaticStates };
const input  = { ...baseStaticInput };


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarTypographyStylesProviderProps = MantineTypographyStylesProviderProps & {
  states?: DeepPartial<typeof states>;
  input?:  DeepPartial<typeof input>;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function TypographyStylesProvider(props: KevlarTypographyStylesProviderProps) {
  const { states: so, input: io, children, ...mantineProps } = props;

  const spec = deepMerge({ states, input }, { states: so, input: io });
  useKevlarStatic(spec);

  return (
    <MantineTypographyStylesProvider {...mantineProps}>
      {children}
    </MantineTypographyStylesProvider>
  );
}
