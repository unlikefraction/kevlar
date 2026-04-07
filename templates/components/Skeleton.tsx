import { Skeleton as MantineSkeleton, type SkeletonProps as MantineSkeletonProps } from '@mantine/core';
import {
  baseFeedbackStates,
  baseFeedbackAnimation,
} from '../base/BaseFeedback';
import { FUNCTION_MUST_BE_DEFINED, ANIMATION_MUST_BE_DEFINED } from '@unlikefraction/kevlar/sentinels';
import { useKevlarFeedback, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { KevlarContext, DeepPartial } from '@unlikefraction/kevlar/types';

// Skeleton inherits BaseFeedback but is display-only:
// - No dismiss, no user actions
// - Animation: shimmer (loop) while loading + reveal (fade) when content loaded
// - Dev must provide onContentLoaded callback

const states = { ...baseFeedbackStates };

// Display-only: no user actions, no timing
const actions = {};
const timing  = {};

// Skeleton-specific animations
const animation = {
  ...baseFeedbackAnimation,
  shimmer: ANIMATION_MUST_BE_DEFINED,  // looping shimmer while placeholder is visible
  reveal: ANIMATION_MUST_BE_DEFINED,   // fade/transition when real content replaces skeleton
};

// Dev-fill: callback when content has loaded and skeleton should reveal
const onContentLoaded = FUNCTION_MUST_BE_DEFINED;


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarSkeletonProps = MantineSkeletonProps & {
  // REQUIRED
  onContentLoaded?: (ctx: KevlarContext) => void; // dev-fill: trigger reveal animation

  // OPTIONAL — override anything from the base
  states?:    DeepPartial<typeof states>;
  animation?: DeepPartial<typeof animation>;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function Skeleton(props: KevlarSkeletonProps) {
  const {
    onContentLoaded: onLoaded,
    states: so, animation: animo,
    ...mantineProps
  } = props;

  const spec = deepMerge(
    { states, animation },
    { states: so, animation: animo },
  );

  if (onLoaded) spec.animation.reveal = onLoaded;

  const feedback = useKevlarFeedback(spec);

  return (
    <MantineSkeleton
      {...mantineProps}
      {...feedback.handlers}
      style={feedback.currentVisual}
    />
  );
}
