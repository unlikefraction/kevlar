import { AspectRatio as MantineAspectRatio, type AspectRatioProps as MantineAspectRatioProps } from '@mantine/core';
import { baseContainerStates } from '../base/BaseContainer';
import { useKevlarContainer, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { DeepPartial } from '@unlikefraction/kevlar/types';

// AspectRatio: inherits BaseContainer. No overrides, pure layout.

const states = { ...baseContainerStates };


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarAspectRatioProps = MantineAspectRatioProps & {
  states?: DeepPartial<typeof states>;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function AspectRatio(props: KevlarAspectRatioProps) {
  const { states: so, children, ...mantineProps } = props;

  const spec = deepMerge({ states }, { states: so });
  useKevlarContainer(spec);

  return (
    <MantineAspectRatio {...mantineProps}>
      {children}
    </MantineAspectRatio>
  );
}
