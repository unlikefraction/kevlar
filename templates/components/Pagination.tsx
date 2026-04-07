import { Pagination as MantinePagination, type PaginationProps as MantinePaginationProps } from '@mantine/core';
import {
  baseNavigationStates,
  baseNavigationActions,
  baseNavigationInput,
  baseNavigationAnimation,
} from '../base/BaseNavigation';
import { STRING_MUST_BE_DEFINED } from '@unlikefraction/kevlar/sentinels';
import { useKevlarInteraction, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { KevlarContext, DeepPartial } from '@unlikefraction/kevlar/types';

// Pagination: inherits BaseNavigation.
// screenreader: { role: 'navigation', label: 'Pagination' }
// Dev-fill: onPageChange.

const states = {
  idle: {
    ...baseNavigationStates.idle,
    screenreader: { role: 'navigation' as const, label: 'Pagination' },
  },
  hover: {
    ...baseNavigationStates.hover,
    screenreader: { role: 'navigation' as const, label: 'Pagination' },
  },
  focused: {
    ...baseNavigationStates.focused,
    screenreader: { role: 'navigation' as const, label: 'Pagination' },
  },
  active: {
    ...baseNavigationStates.active,
    screenreader: { role: 'navigation' as const, label: 'Pagination', state: { current: 'page' as const } },
  },
  disabled: {
    ...baseNavigationStates.disabled,
    screenreader: { role: 'navigation' as const, label: 'Pagination', state: { disabled: true } },
  },
};

const actions   = { ...baseNavigationActions };
const input     = { ...baseNavigationInput };
const animation = { ...baseNavigationAnimation };


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarPaginationProps = MantinePaginationProps & {
  // REQUIRED — dev-fill
  onPageChange: (page: number, ctx: KevlarContext) => void;
  announce: { active: string };

  // OPTIONAL — override anything from the base
  states?:      DeepPartial<typeof states>;
  userActions?: Partial<typeof actions>;
  input?:       DeepPartial<typeof input>;
  animation?:   DeepPartial<typeof animation>;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function Pagination(props: KevlarPaginationProps) {
  const {
    onPageChange, announce: ann,
    states: so, userActions: ao, input: io, animation: animo,
    ...mantineProps
  } = props;

  const spec = deepMerge(
    { states, userActions: actions, input, animation },
    { states: so, userActions: ao, input: io, animation: animo },
  );

  // Fill the blanks that survived from base
  spec.states.active.announcement = ann.active;

  const interaction = useKevlarInteraction(spec, {
    onAction: async (ctx: KevlarContext) => { onPageChange(ctx.value as number, ctx); },
  });

  return (
    <MantinePagination
      {...mantineProps}
      {...interaction.handlers}
      onChange={(page) => interaction.onChange(page)}
      aria-label="Pagination"
    />
  );
}
