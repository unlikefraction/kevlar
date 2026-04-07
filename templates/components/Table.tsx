import { Table as MantineTable, type TableProps as MantineTableProps } from '@mantine/core';
import { baseStaticStates, baseStaticInput } from '../base/BaseStatic';
import {
  baseInteractiveStates,
  baseInteractiveActions,
  baseInteractiveInput,
  baseInteractiveAnimation,
} from '../base/BaseInteractive';
import { useKevlarStatic, useKevlarInteraction, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { KevlarContext, DeepPartial } from '@unlikefraction/kevlar/types';

// Table: inherits BaseStatic.
// screenreader: { role: 'table' }
// When sortable: column headers become BaseInteractive children.
// Dev-fill: onSort per sortable column.

const states = {
  ...baseStaticStates,
  idle: {
    ...baseStaticStates.idle,
    screenreader: { role: 'table' as const },
  },
  focused: {
    ...baseStaticStates.focused,
    screenreader: { role: 'table' as const },
  },
};

const input = { ...baseStaticInput };

// Sortable column header states (subset of interactive)
const sortHeaderStates = {
  idle:    { ...baseInteractiveStates.idle },
  hover:   { ...baseInteractiveStates.hover },
  focused: { ...baseInteractiveStates.focused },
  pressed: { ...baseInteractiveStates.pressed },
};
const sortHeaderActions   = { ...baseInteractiveActions };
const sortHeaderInput     = { ...baseInteractiveInput };
const sortHeaderAnimation = {
  enter: baseInteractiveAnimation.enter,
  exit:  baseInteractiveAnimation.exit,
  transitions: {
    idle_to_hover:   baseInteractiveAnimation.transitions.idle_to_hover,
    hover_to_idle:   baseInteractiveAnimation.transitions.hover_to_idle,
    idle_to_pressed: baseInteractiveAnimation.transitions.idle_to_pressed,
  },
  microFeedback: baseInteractiveAnimation.microFeedback,
};


// ─── PROPS ─────────────────────────────────────────────────────

export type SortDirection = 'asc' | 'desc' | null;

export type KevlarTableProps = MantineTableProps & {
  // OPTIONAL — sortable column configuration
  onSort?: (column: string, direction: SortDirection, ctx: KevlarContext) => void;

  // OPTIONAL — override base
  states?: DeepPartial<typeof states>;
  input?:  DeepPartial<typeof input>;

  // OPTIONAL — override sort header behavior
  sortHeaderStates?:    DeepPartial<typeof sortHeaderStates>;
  sortHeaderActions?:   Partial<typeof sortHeaderActions>;
  sortHeaderInput?:     DeepPartial<typeof sortHeaderInput>;
  sortHeaderAnimation?: DeepPartial<typeof sortHeaderAnimation>;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function Table(props: KevlarTableProps) {
  const {
    onSort,
    states: so, input: io,
    sortHeaderStates: shso, sortHeaderActions: shao,
    sortHeaderInput: shio, sortHeaderAnimation: shanimo,
    children, ...mantineProps
  } = props;

  const spec = deepMerge({ states, input }, { states: so, input: io });
  const staticCtx = useKevlarStatic(spec);

  // If sortable, prepare sort header interaction spec for consumers
  if (onSort) {
    deepMerge(
      { states: sortHeaderStates, userActions: sortHeaderActions, input: sortHeaderInput, animation: sortHeaderAnimation },
      { states: shso, userActions: shao, input: shio, animation: shanimo },
    );
  }

  return (
    <MantineTable role="table" {...mantineProps} {...staticCtx.handlers}>
      {children}
    </MantineTable>
  );
}
