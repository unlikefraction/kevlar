import { Radio as MantineRadio, type RadioGroupProps as MantineRadioGroupProps } from '@mantine/core';
import { baseContainerStates } from '../base/BaseContainer';
import { useKevlarContainer, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { DeepPartial } from '@unlikefraction/kevlar/types';

// RadioGroup: inherits BaseContainer.
// screenreader.role: radiogroup.
// Manages Radio children.

const states = { ...baseContainerStates };

const screenreader = {
  role: 'radiogroup' as const,
  label: null as string | null,
};


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarRadioGroupProps = MantineRadioGroupProps & {
  states?: DeepPartial<typeof states>;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function RadioGroup(props: KevlarRadioGroupProps) {
  const { states: so, children, ...mantineProps } = props;

  const spec = deepMerge({ states, screenreader }, { states: so });
  useKevlarContainer(spec);

  return (
    <MantineRadio.Group role="radiogroup" {...mantineProps}>
      {children}
    </MantineRadio.Group>
  );
}
