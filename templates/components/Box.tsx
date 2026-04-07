import { Box as MantineBox, type BoxProps as MantineBoxProps } from '@mantine/core';
import { baseContainerStates } from '../base/BaseContainer';
import { useKevlarContainer, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { DeepPartial } from '@unlikefraction/kevlar/types';

// Box: inherits BaseContainer. No overrides.

const states = { ...baseContainerStates };


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarBoxProps = MantineBoxProps & {
  states?: DeepPartial<typeof states>;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function Box(props: KevlarBoxProps) {
  const { states: so, children, ...mantineProps } = props;

  const spec = deepMerge({ states }, { states: so });
  useKevlarContainer(spec);

  return (
    <MantineBox {...mantineProps}>
      {children}
    </MantineBox>
  );
}
