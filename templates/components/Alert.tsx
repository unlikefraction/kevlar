import { Alert as MantineAlert, type AlertProps as MantineAlertProps } from '@mantine/core';
import {
  baseFeedbackStates,
  baseFeedbackActions,
  baseFeedbackTiming,
  baseFeedbackAnimation,
} from '../base/BaseFeedback';
import { FUNCTION_MUST_BE_DEFINED } from '@unlikefraction/kevlar/sentinels';
import { useKevlarFeedback, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { KevlarContext, Trigger, DeepPartial } from '@unlikefraction/kevlar/types';

// Alert inherits BaseFeedback but overrides key behaviors:
// - Inline (not toast), no auto-dismiss, no swipe
// - Stays visible until explicitly dismissed by developer action

const states    = { ...baseFeedbackStates };
const actions   = {
  ...baseFeedbackActions,
  // Override: no swipe-to-dismiss (inline element, not a toast)
  onSwipeToDismiss: () => {},
};
const timing    = {
  ...baseFeedbackTiming,
  // Override: no auto-dismiss — alerts persist until explicitly dismissed
  autoDismissMs: null as number | null,
};
const animation = { ...baseFeedbackAnimation };

// Alert-specific: dismiss callback the developer must fill
const onDismiss = FUNCTION_MUST_BE_DEFINED; // dev-fill: what happens when user clicks dismiss?


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarAlertProps = MantineAlertProps & {
  // REQUIRED
  announce: { entering: string };
  onDismiss: (ctx: KevlarContext) => void; // dev-fill

  // OPTIONAL — override anything from the base
  states?:      DeepPartial<typeof states>;
  userActions?: Partial<typeof actions>;
  timing?:      Partial<typeof timing>;
  animation?:   DeepPartial<typeof animation>;
  triggers?:    Trigger[];
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function Alert(props: KevlarAlertProps) {
  const {
    announce: ann, onDismiss: dismissFn,
    states: so, userActions: ao, timing: to, animation: animo,
    triggers: trg,
    children, ...mantineProps
  } = props;

  const spec = deepMerge(
    { states, userActions: actions, timing, animation },
    { states: so, userActions: ao, timing: to, animation: animo },
  );
  if (trg) spec.timing.triggers = trg;

  // Fill the blanks that survived from base
  spec.states.entering.announcement = ann.entering;
  spec.userActions.onClickToDismiss = dismissFn;

  const feedback = useKevlarFeedback(spec);

  return (
    <MantineAlert
      {...mantineProps}
      {...feedback.handlers}
      style={feedback.currentVisual}
    >
      {children}
    </MantineAlert>
  );
}
