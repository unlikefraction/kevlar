import { RingProgress as MantineRingProgress, type RingProgressProps as MantineRingProgressProps } from '@mantine/core';
import {
  baseFeedbackStates,
  baseFeedbackAnimation,
} from '../base/BaseFeedback';
import { FUNCTION_MUST_BE_DEFINED } from '@unlikefraction/kevlar/sentinels';
import { useKevlarFeedback, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { KevlarContext, DeepPartial } from '@unlikefraction/kevlar/types';

// RingProgress: same as Progress but ring shape.
// Display-only, no dismiss, no user actions.
// Screenreader role: progressbar with value semantics.

const states = { ...baseFeedbackStates };

// Override screenreader for progressbar semantics (ring variant)
const screenreader = {
  role: 'progressbar' as const,
  valuemin: 0,
  valuemax: 100,
  valuenow: null as number | null,
  onValueChange: FUNCTION_MUST_BE_DEFINED, // dev-fill: announce value changes to screenreader?
};

// Display-only: no user actions, no timing
const actions = {};
const timing  = {};

const animation = { ...baseFeedbackAnimation };


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarRingProgressProps = MantineRingProgressProps & {
  // REQUIRED
  screenreader: {
    valuenow: number | null;
    onValueChange?: (ctx: KevlarContext) => void; // dev-fill
  };

  // OPTIONAL — override anything from the base
  states?:    DeepPartial<typeof states>;
  animation?: DeepPartial<typeof animation>;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function RingProgress(props: KevlarRingProgressProps) {
  const {
    screenreader: srProps,
    states: so, animation: animo,
    ...mantineProps
  } = props;

  const spec = deepMerge(
    { states, animation },
    { states: so, animation: animo },
  );

  // Fill screenreader values
  const sr = {
    ...screenreader,
    valuenow: srProps.valuenow,
  };
  if (srProps.onValueChange) sr.onValueChange = srProps.onValueChange;

  const feedback = useKevlarFeedback(spec);

  return (
    <MantineRingProgress
      {...mantineProps}
      {...feedback.handlers}
      style={feedback.currentVisual}
      aria-valuemin={sr.valuemin}
      aria-valuemax={sr.valuemax}
      aria-valuenow={sr.valuenow ?? undefined}
      role={sr.role}
    />
  );
}
