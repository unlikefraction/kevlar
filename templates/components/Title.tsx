import { Title as MantineTitle, type TitleProps as MantineTitleProps } from '@mantine/core';
import { baseStaticStates, baseStaticInput } from '../base/BaseStatic';
import { useKevlarStatic, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { DeepPartial } from '@unlikefraction/kevlar/types';

// Title: inherits BaseStatic.
// screenreader: { role: 'heading', level: null } — set by order prop (1-6).

const states = {
  ...baseStaticStates,
  idle: {
    ...baseStaticStates.idle,
    screenreader: { role: 'heading' as const, level: null as number | null },
  },
  focused: {
    ...baseStaticStates.focused,
    screenreader: { role: 'heading' as const, level: null as number | null },
  },
};

const input = { ...baseStaticInput };


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarTitleProps = MantineTitleProps & {
  states?: DeepPartial<typeof states>;
  input?:  DeepPartial<typeof input>;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function Title(props: KevlarTitleProps) {
  const { states: so, input: io, order, children, ...mantineProps } = props;

  const spec = deepMerge({ states, input }, { states: so, input: io });

  // Set the heading level from the order prop
  const headingLevel = order ?? 1;
  spec.states.idle.screenreader = { role: 'heading', level: headingLevel };
  spec.states.focused.screenreader = { role: 'heading', level: headingLevel };

  const staticCtx = useKevlarStatic(spec);

  return (
    <MantineTitle order={order} {...mantineProps} {...staticCtx.handlers}>
      {children}
    </MantineTitle>
  );
}
