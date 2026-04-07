import { Flex as MantineFlex, type FlexProps as MantineFlexProps } from '@mantine/core';
import { baseContainerStates } from '../base/BaseContainer';
import { useKevlarContainer, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { DeepPartial } from '@unlikefraction/kevlar/types';

// Flex: inherits BaseContainer. No overrides, pure layout.

const states = { ...baseContainerStates };


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarFlexProps = MantineFlexProps & {
  states?: DeepPartial<typeof states>;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function Flex(props: KevlarFlexProps) {
  const { states: so, children, ...mantineProps } = props;

  const spec = deepMerge({ states }, { states: so });
  useKevlarContainer(spec);

  return (
    <MantineFlex {...mantineProps}>
      {children}
    </MantineFlex>
  );
}
