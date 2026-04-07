import { Box, type BoxProps } from '@mantine/core';
import {
  baseFeedbackStates,
  baseFeedbackAnimation,
} from '../base/BaseFeedback';
import { FUNCTION_MUST_BE_DEFINED } from '@unlikefraction/kevlar/sentinels';
import { useKevlarFeedback, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { KevlarContext, DeepPartial } from '@unlikefraction/kevlar/types';

// SemiCircleProgress: same as Progress but semi-circle shape.
// Uses Box as Mantine container (no native SemiCircleProgress in Mantine).
// Display-only, no dismiss, no user actions.
// Screenreader role: progressbar with value semantics.

const states = { ...baseFeedbackStates };

// Override screenreader for progressbar semantics (semi-circle variant)
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

export type KevlarSemiCircleProgressProps = BoxProps & {
  // REQUIRED
  value: number;
  screenreader: {
    valuenow: number | null;
    onValueChange?: (ctx: KevlarContext) => void; // dev-fill
  };

  // OPTIONAL — override anything from the base
  states?:    DeepPartial<typeof states>;
  animation?: DeepPartial<typeof animation>;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function SemiCircleProgress(props: KevlarSemiCircleProgressProps) {
  const {
    value, screenreader: srProps,
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
    <Box
      {...mantineProps}
      {...feedback.handlers}
      style={feedback.currentVisual}
      role={sr.role}
      aria-valuemin={sr.valuemin}
      aria-valuemax={sr.valuemax}
      aria-valuenow={sr.valuenow ?? undefined}
    />
  );
}
