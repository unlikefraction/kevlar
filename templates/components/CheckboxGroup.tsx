import { Checkbox as MantineCheckbox, type CheckboxGroupProps as MantineCheckboxGroupProps } from '@mantine/core';
import { baseContainerStates } from '../base/BaseContainer';
import { useKevlarContainer, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { DeepPartial } from '@unlikefraction/kevlar/types';

// CheckboxGroup: inherits BaseContainer.
// screenreader.role: group.
// Manages Checkbox children.

const states = { ...baseContainerStates };

const screenreader = {
  role: 'group' as const,
  label: null as string | null,
};


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarCheckboxGroupProps = MantineCheckboxGroupProps & {
  states?: DeepPartial<typeof states>;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function CheckboxGroup(props: KevlarCheckboxGroupProps) {
  const { states: so, children, ...mantineProps } = props;

  const spec = deepMerge({ states, screenreader }, { states: so });
  useKevlarContainer(spec);

  return (
    <MantineCheckbox.Group role="group" {...mantineProps}>
      {children}
    </MantineCheckbox.Group>
  );
}
