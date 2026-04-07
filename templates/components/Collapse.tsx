import { Collapse as MantineCollapse, type CollapseProps as MantineCollapseProps } from '@mantine/core';
import {
  baseDisclosureStates,
  baseDisclosureActions,
  baseDisclosureInput,
  baseDisclosureAnimation,
} from '../base/BaseDisclosure';
import { useKevlarDisclosure, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { DeepPartial } from '@unlikefraction/kevlar/types';

// Collapse: inherits BaseDisclosure (panel only, no trigger).
// Animation: expand/collapse slide.
// orientation: vertical | horizontal.

const states    = { ...baseDisclosureStates };
const actions   = { ...baseDisclosureActions };
const input     = { ...baseDisclosureInput };
const animation = {
  ...baseDisclosureAnimation,
  // Collapse-specific: slide animation for expand/collapse
  contentReveal: { type: 'slide' as const, orientation: 'vertical' as const },
};


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarCollapseProps = MantineCollapseProps & {
  // OPTIONAL — orientation of the collapse animation
  orientation?: 'vertical' | 'horizontal';

  // OPTIONAL — override anything from the base
  states?:      DeepPartial<typeof states>;
  userActions?: Partial<typeof actions>;
  input?:       DeepPartial<typeof input>;
  animation?:   DeepPartial<typeof animation>;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function Collapse(props: KevlarCollapseProps) {
  const {
    orientation,
    states: so, userActions: ao, input: io, animation: animo,
    children, ...mantineProps
  } = props;

  const spec = deepMerge(
    { states, userActions: actions, input, animation },
    { states: so, userActions: ao, input: io, animation: animo },
  );

  if (orientation) {
    spec.animation.contentReveal = { ...spec.animation.contentReveal, orientation };
  }

  useKevlarDisclosure(spec);

  return (
    <MantineCollapse {...mantineProps}>
      {children}
    </MantineCollapse>
  );
}
