import { Space as MantineSpace, type SpaceProps as MantineSpaceProps } from '@mantine/core';
import { baseContainerStates } from '../base/BaseContainer';
import { useKevlarContainer, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { DeepPartial } from '@unlikefraction/kevlar/types';

// Space: inherits BaseContainer. No overrides, pure layout spacer.

const states = { ...baseContainerStates };


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarSpaceProps = MantineSpaceProps & {
  states?: DeepPartial<typeof states>;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function Space(props: KevlarSpaceProps) {
  const { states: so, ...mantineProps } = props;

  const spec = deepMerge({ states }, { states: so });
  useKevlarContainer(spec);

  return <MantineSpace {...mantineProps} />;
}
