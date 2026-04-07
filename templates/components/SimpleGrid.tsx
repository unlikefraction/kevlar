import { SimpleGrid as MantineSimpleGrid, type SimpleGridProps as MantineSimpleGridProps } from '@mantine/core';
import { baseContainerStates } from '../base/BaseContainer';
import { useKevlarContainer, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { DeepPartial } from '@unlikefraction/kevlar/types';

// SimpleGrid: inherits BaseContainer. No overrides, pure layout.

const states = { ...baseContainerStates };


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarSimpleGridProps = MantineSimpleGridProps & {
  states?: DeepPartial<typeof states>;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function SimpleGrid(props: KevlarSimpleGridProps) {
  const { states: so, children, ...mantineProps } = props;

  const spec = deepMerge({ states }, { states: so });
  useKevlarContainer(spec);

  return (
    <MantineSimpleGrid {...mantineProps}>
      {children}
    </MantineSimpleGrid>
  );
}
