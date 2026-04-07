import { Portal as MantinePortal, type PortalProps as MantinePortalProps } from '@mantine/core';
import { baseContainerStates } from '../base/BaseContainer';
import { useKevlarContainer, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { DeepPartial } from '@unlikefraction/kevlar/types';

// Portal: inherits BaseContainer. No overrides.

const states = { ...baseContainerStates };


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarPortalProps = MantinePortalProps & {
  states?: DeepPartial<typeof states>;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function Portal(props: KevlarPortalProps) {
  const { states: so, children, ...mantineProps } = props;

  const spec = deepMerge({ states }, { states: so });
  useKevlarContainer(spec);

  return (
    <MantinePortal {...mantineProps}>
      {children}
    </MantinePortal>
  );
}
