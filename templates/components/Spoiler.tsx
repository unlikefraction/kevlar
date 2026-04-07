import { Spoiler as MantineSpoiler, type SpoilerProps as MantineSpoilerProps } from '@mantine/core';
import {
  baseDisclosureStates,
  baseDisclosureActions,
  baseDisclosureInput,
  baseDisclosureAnimation,
} from '../base/BaseDisclosure';
import { useKevlarDisclosure, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { DeepPartial } from '@unlikefraction/kevlar/types';

// Spoiler: inherits BaseDisclosure.
// Dev-fill: maxHeight, showLabel, hideLabel.

const states    = { ...baseDisclosureStates };
const actions   = { ...baseDisclosureActions };
const input     = { ...baseDisclosureInput };
const animation = { ...baseDisclosureAnimation };


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarSpoilerProps = MantineSpoilerProps & {
  // REQUIRED — Mantine Spoiler requires these
  maxHeight: number;
  showLabel: React.ReactNode;
  hideLabel: React.ReactNode;

  // OPTIONAL — override anything from the base
  states?:      DeepPartial<typeof states>;
  userActions?: Partial<typeof actions>;
  input?:       DeepPartial<typeof input>;
  animation?:   DeepPartial<typeof animation>;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function Spoiler(props: KevlarSpoilerProps) {
  const {
    states: so, userActions: ao, input: io, animation: animo,
    children, ...mantineProps
  } = props;

  const spec = deepMerge(
    { states, userActions: actions, input, animation },
    { states: so, userActions: ao, input: io, animation: animo },
  );

  useKevlarDisclosure(spec);

  return (
    <MantineSpoiler {...mantineProps}>
      {children}
    </MantineSpoiler>
  );
}
