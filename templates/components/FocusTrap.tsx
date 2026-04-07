import { FocusTrap as MantineFocusTrap, type FocusTrapProps as MantineFocusTrapProps } from '@mantine/core';
import { baseContainerStates } from '../base/BaseContainer';
import { useKevlarContainer, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { DeepPartial } from '@unlikefraction/kevlar/types';

// FocusTrap: inherits BaseContainer.
// keyboard.Tab.trap: true — focus cannot leave the container via Tab.

const states = { ...baseContainerStates };

const focusTrapConfig = {
  keyboard: {
    Tab: { trap: true },
  },
};


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarFocusTrapProps = MantineFocusTrapProps & {
  states?: DeepPartial<typeof states>;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function FocusTrap(props: KevlarFocusTrapProps) {
  const { states: so, children, ...mantineProps } = props;

  const spec = deepMerge({ states, ...focusTrapConfig }, { states: so });
  useKevlarContainer(spec);

  return (
    <MantineFocusTrap {...mantineProps}>
      {children}
    </MantineFocusTrap>
  );
}
