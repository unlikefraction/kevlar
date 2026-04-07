import { Container as MantineContainer, type ContainerProps as MantineContainerProps } from '@mantine/core';
import { baseContainerStates } from '../base/BaseContainer';
import { useKevlarContainer, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { DeepPartial } from '@unlikefraction/kevlar/types';

// Container: inherits BaseContainer. No overrides, pure layout.

const states = { ...baseContainerStates };


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarContainerProps = MantineContainerProps & {
  states?: DeepPartial<typeof states>;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function Container(props: KevlarContainerProps) {
  const { states: so, children, ...mantineProps } = props;

  const spec = deepMerge({ states }, { states: so });
  useKevlarContainer(spec);

  return (
    <MantineContainer {...mantineProps}>
      {children}
    </MantineContainer>
  );
}
