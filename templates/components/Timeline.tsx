import { Timeline as MantineTimeline, type TimelineProps as MantineTimelineProps } from '@mantine/core';
import { baseStaticStates, baseStaticInput } from '../base/BaseStatic';
import { useKevlarStatic, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { DeepPartial } from '@unlikefraction/kevlar/types';

// Timeline: inherits BaseStatic.
// screenreader: { role: 'list', item: { role: 'listitem' } }

const states = {
  ...baseStaticStates,
  idle: {
    ...baseStaticStates.idle,
    screenreader: { role: 'list' as const },
  },
  focused: {
    ...baseStaticStates.focused,
    screenreader: { role: 'list' as const },
  },
};

const input = { ...baseStaticInput };


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarTimelineProps = MantineTimelineProps & {
  states?: DeepPartial<typeof states>;
  input?:  DeepPartial<typeof input>;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function Timeline(props: KevlarTimelineProps) {
  const { states: so, input: io, children, ...mantineProps } = props;

  const spec = deepMerge({ states, input }, { states: so, input: io });
  const staticCtx = useKevlarStatic(spec);

  return (
    <MantineTimeline role="list" {...mantineProps} {...staticCtx.handlers}>
      {children}
    </MantineTimeline>
  );
}
