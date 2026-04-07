import { Breadcrumbs as MantineBreadcrumbs, type BreadcrumbsProps as MantineBreadcrumbsProps } from '@mantine/core';
import {
  baseNavigationStates,
  baseNavigationActions,
  baseNavigationInput,
  baseNavigationAnimation,
} from '../base/BaseNavigation';
import { useKevlarInteraction, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { KevlarContext, DeepPartial } from '@unlikefraction/kevlar/types';

// Breadcrumbs: inherits BaseNavigation.
// screenreader: { role: 'navigation', label: 'Breadcrumb' }
// Last item: { state: { current: 'page' } }
// No arrow key navigation — breadcrumbs are a flat list of links.

const states = {
  idle: {
    ...baseNavigationStates.idle,
    screenreader: { role: 'navigation' as const, label: 'Breadcrumb' },
  },
  hover: {
    ...baseNavigationStates.hover,
    screenreader: { role: 'navigation' as const, label: 'Breadcrumb' },
  },
  focused: {
    ...baseNavigationStates.focused,
    screenreader: { role: 'navigation' as const, label: 'Breadcrumb' },
  },
  active: {
    ...baseNavigationStates.active,
    screenreader: { role: 'navigation' as const, label: 'Breadcrumb', state: { current: 'page' as const } },
  },
  disabled: {
    ...baseNavigationStates.disabled,
    screenreader: { role: 'navigation' as const, label: 'Breadcrumb', state: { disabled: true } },
  },
};

const actions = { ...baseNavigationActions };

// No arrow key navigation for breadcrumbs — standard tab order
const input = {
  ...baseNavigationInput,
  keyboard: {
    ...baseNavigationInput.keyboard,
    bindings: {
      ...baseNavigationInput.keyboard.bindings,
      ArrowUp: () => {},
      ArrowDown: () => {},
      ArrowLeft: () => {},
      ArrowRight: () => {},
    },
  },
};

const animation = { ...baseNavigationAnimation };


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarBreadcrumbsProps = MantineBreadcrumbsProps & {
  // OPTIONAL — override anything from the base
  states?:      DeepPartial<typeof states>;
  userActions?: Partial<typeof actions>;
  input?:       DeepPartial<typeof input>;
  animation?:   DeepPartial<typeof animation>;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function Breadcrumbs(props: KevlarBreadcrumbsProps) {
  const {
    states: so, userActions: ao, input: io, animation: animo,
    children, ...mantineProps
  } = props;

  const spec = deepMerge(
    { states, userActions: actions, input, animation },
    { states: so, userActions: ao, input: io, animation: animo },
  );

  const interaction = useKevlarInteraction(spec, {
    onAction: async () => {},
  });

  return (
    <MantineBreadcrumbs
      {...mantineProps}
      {...interaction.handlers}
      aria-label="Breadcrumb"
    >
      {children}
    </MantineBreadcrumbs>
  );
}
