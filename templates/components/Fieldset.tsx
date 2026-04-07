import { Fieldset as MantineFieldset, type FieldsetProps as MantineFieldsetProps } from '@mantine/core';
import { baseContainerStates } from '../base/BaseContainer';
import { useKevlarContainer, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { DeepPartial } from '@unlikefraction/kevlar/types';

// Fieldset: inherits BaseContainer.
// screenreader: { role: 'group', label: null } — from legend element.

const states = { ...baseContainerStates };

const screenreader = {
  role: 'group' as const,
  label: null as string | null,
};


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarFieldsetProps = MantineFieldsetProps & {
  states?: DeepPartial<typeof states>;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function Fieldset(props: KevlarFieldsetProps) {
  const { states: so, children, ...mantineProps } = props;

  const spec = deepMerge({ states, screenreader }, { states: so });
  useKevlarContainer(spec);

  // The legend prop in Mantine Fieldset provides the accessible label
  return (
    <MantineFieldset role="group" {...mantineProps}>
      {children}
    </MantineFieldset>
  );
}
