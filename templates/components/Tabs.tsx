import { Tabs as MantineTabs, type TabsProps as MantineTabsProps } from '@mantine/core';
import {
  baseNavigationStates,
  baseNavigationActions,
  baseNavigationInput,
  baseNavigationAnimation,
} from '../base/BaseNavigation';
import { STRING_MUST_BE_DEFINED } from '@unlikefraction/kevlar/sentinels';
import { useKevlarInteraction, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { KevlarContext, DeepPartial } from '@unlikefraction/kevlar/types';

// Tabs: inherits BaseNavigation.
// screenreader: tablist/tab/tabpanel roles.
// Dev-fill: onTabChange.

const states = {
  idle: {
    ...baseNavigationStates.idle,
    screenreader: { role: 'tab' as const },
  },
  hover: {
    ...baseNavigationStates.hover,
    screenreader: { role: 'tab' as const },
  },
  focused: {
    ...baseNavigationStates.focused,
    screenreader: { role: 'tab' as const },
  },
  active: {
    ...baseNavigationStates.active,
    screenreader: { role: 'tab' as const, state: { selected: true } },
  },
  disabled: {
    ...baseNavigationStates.disabled,
    screenreader: { role: 'tab' as const, state: { disabled: true } },
  },
};

const actions   = { ...baseNavigationActions };
const input     = { ...baseNavigationInput };
const animation = { ...baseNavigationAnimation };


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarTabsProps = MantineTabsProps & {
  // REQUIRED — dev-fill
  onTabChange: (value: string | null, ctx: KevlarContext) => void;
  announce: { active: string };

  // OPTIONAL — override anything from the base
  states?:      DeepPartial<typeof states>;
  userActions?: Partial<typeof actions>;
  input?:       DeepPartial<typeof input>;
  animation?:   DeepPartial<typeof animation>;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function Tabs(props: KevlarTabsProps) {
  const {
    onTabChange, announce: ann,
    states: so, userActions: ao, input: io, animation: animo,
    children, ...mantineProps
  } = props;

  const spec = deepMerge(
    { states, userActions: actions, input, animation },
    { states: so, userActions: ao, input: io, animation: animo },
  );

  // Fill the blanks that survived from base
  spec.states.active.announcement = ann.active;

  const interaction = useKevlarInteraction(spec, {
    onAction: async (ctx: KevlarContext) => { onTabChange(ctx.value as string | null, ctx); },
  });

  return (
    <MantineTabs
      {...mantineProps}
      {...interaction.handlers}
      onChange={(value) => interaction.onChange(value)}
    >
      {children}
    </MantineTabs>
  );
}
