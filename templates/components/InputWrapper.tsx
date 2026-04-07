import { Input as MantineInput, type InputWrapperProps as MantineInputWrapperProps } from '@mantine/core';
import { baseContainerStates } from '../base/BaseContainer';
import { useKevlarContainer, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { DeepPartial } from '@unlikefraction/kevlar/types';

// InputWrapper: inherits BaseContainer.
// Wraps label, description, error, and input.

const states = { ...baseContainerStates };

const screenreader = {
  role: 'group' as const,
  label: null as string | null,
};


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarInputWrapperProps = MantineInputWrapperProps & {
  states?: DeepPartial<typeof states>;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function InputWrapper(props: KevlarInputWrapperProps) {
  const { states: so, children, ...mantineProps } = props;

  const spec = deepMerge({ states, screenreader }, { states: so });
  useKevlarContainer(spec);

  return (
    <MantineInput.Wrapper role="group" {...mantineProps}>
      {children}
    </MantineInput.Wrapper>
  );
}
