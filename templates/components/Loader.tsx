import { Loader as MantineLoader, type LoaderProps as MantineLoaderProps } from '@mantine/core';
import {
  baseFeedbackStates,
  baseFeedbackAnimation,
} from '../base/BaseFeedback';
import { STRING_MUST_BE_DEFINED } from '@unlikefraction/kevlar/sentinels';
import { useKevlarFeedback, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { KevlarContext, DeepPartial } from '@unlikefraction/kevlar/types';

// Loader inherits BaseFeedback but is display-only:
// - No dismiss, no timing, no user actions
// - Screenreader role: status with polite live region
// - Dev must provide an announcement for screenreaders

const states = { ...baseFeedbackStates };

// Loader-specific screenreader semantics
const screenreader = {
  role: 'status' as const,
  liveRegion: 'polite' as const,
  announcement: STRING_MUST_BE_DEFINED, // dev-fill: what does the screenreader say? e.g. "Loading content"
};

// Display-only: no user actions, no timing
const actions = {};
const timing  = {};

const animation = { ...baseFeedbackAnimation };


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarLoaderProps = MantineLoaderProps & {
  // REQUIRED — screenreader announcement
  announce: string; // dev-fill: e.g. "Loading content"

  // OPTIONAL — override anything from the base
  states?:    DeepPartial<typeof states>;
  animation?: DeepPartial<typeof animation>;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function Loader(props: KevlarLoaderProps) {
  const {
    announce: ann,
    states: so, animation: animo,
    ...mantineProps
  } = props;

  const spec = deepMerge(
    { states, animation },
    { states: so, animation: animo },
  );

  // Fill screenreader announcement
  const sr = { ...screenreader, announcement: ann };

  const feedback = useKevlarFeedback(spec);

  return (
    <MantineLoader
      {...mantineProps}
      {...feedback.handlers}
      style={feedback.currentVisual}
      role={sr.role}
      aria-live={sr.liveRegion}
      aria-label={sr.announcement}
    />
  );
}
