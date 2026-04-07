import { Notification as MantineNotification, type NotificationProps as MantineNotificationProps } from '@mantine/core';
import {
  baseFeedbackStates,
  baseFeedbackActions,
  baseFeedbackTiming,
  baseFeedbackAnimation,
} from '../base/BaseFeedback';
import { STRING_MUST_BE_DEFINED, NUMBER_MUST_BE_DEFINED, FUNCTION_MUST_BE_DEFINED } from '@unlikefraction/kevlar/sentinels';
import { useKevlarFeedback, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { KevlarContext, Trigger, DeepPartial } from '@unlikefraction/kevlar/types';

// Notification uses everything from BaseFeedback.
// Only override what's Notification-specific: stacking behavior.

const states    = { ...baseFeedbackStates };
const actions   = { ...baseFeedbackActions };
const timing    = { ...baseFeedbackTiming };
const animation = { ...baseFeedbackAnimation };

// Notification-specific: stacking — how many visible at once, what to do on overflow
const stacking = {
  maxVisible: NUMBER_MUST_BE_DEFINED,         // dev-fill: how many notifications visible at once?
  onOverflow: FUNCTION_MUST_BE_DEFINED,       // dev-fill: queue? replace oldest? collapse?
};


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarNotificationProps = MantineNotificationProps & {
  // REQUIRED — these are the STRING_MUST_BE_DEFINED markers that survive to here
  announce: { entering: string };

  // OPTIONAL — override anything from the base
  states?:      DeepPartial<typeof states>;
  userActions?: Partial<typeof actions>;
  timing?:      Partial<typeof timing>;
  animation?:   DeepPartial<typeof animation>;
  stacking?:    Partial<typeof stacking>;
  triggers?:    Trigger[];
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function Notification(props: KevlarNotificationProps) {
  const {
    announce: ann, stacking: stackO,
    states: so, userActions: ao, timing: to, animation: animo,
    triggers: trg,
    children, ...mantineProps
  } = props;

  const spec = deepMerge(
    { states, userActions: actions, timing, animation, stacking },
    { states: so, userActions: ao, timing: to, animation: animo, stacking: stackO },
  );
  if (trg) spec.timing.triggers = trg;

  // Fill the blanks that survived from base
  spec.states.entering.announcement = ann.entering;

  const feedback = useKevlarFeedback(spec);

  return (
    <MantineNotification
      {...mantineProps}
      {...feedback.handlers}
      style={feedback.currentVisual}
    >
      {children}
    </MantineNotification>
  );
}
