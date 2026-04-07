import { ActionIcon as MantineActionIcon, type ActionIconProps as MantineActionIconProps } from '@mantine/core';
import {
  baseInteractiveStates,
  baseInteractiveActions,
  baseInteractiveInput,
  baseInteractiveNetwork,
  baseInteractiveTiming,
  baseInteractiveAnimation,
} from '../base/BaseInteractive';
import { STRING_MUST_BE_DEFINED } from '@unlikefraction/kevlar/sentinels';
import { useKevlarInteraction, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { KevlarContext, Trigger, DeepPartial } from '@unlikefraction/kevlar/types';

// ActionIcon inherits everything from BaseInteractive.
// Override: loading replaces icon with centered spinner.
// Validation: aria-label is REQUIRED (icon-only buttons are invisible to screen readers).

const states = {
  ...baseInteractiveStates,
  loading: {
    ...baseInteractiveStates.loading,
    visual: { cursor: 'wait', opacity: 0.9, loadingAnimation: { type: 'spinner', size: 'inherit', centered: true } },
  },
};
const actions   = { ...baseInteractiveActions };
const input     = { ...baseInteractiveInput };
const network   = { ...baseInteractiveNetwork };
const timing    = { ...baseInteractiveTiming };
const animation = { ...baseInteractiveAnimation };


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarActionIconProps = MantineActionIconProps & {
  // REQUIRED
  onKevlarAction: (ctx: KevlarContext) => Promise<void>;
  announce: { loading: string; success: string; error: string };
  'aria-label': string;

  // OPTIONAL — override anything from the base
  states?:      DeepPartial<typeof states>;
  userActions?: Partial<typeof actions>;
  input?:       DeepPartial<typeof input>;
  network?:     Partial<typeof network>;
  timing?:      Partial<typeof timing>;
  animation?:   DeepPartial<typeof animation>;
  minLoadTime?: [number, number];
  triggers?:    Trigger[];
  destructive?: { onConfirm: (ctx: KevlarContext) => Promise<boolean> };

  // Escape hatch — deliberately ugly name
  badly_skip_aria_label_and_hurt_accessibility?: boolean;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function ActionIcon(props: KevlarActionIconProps) {
  const {
    onKevlarAction, announce: ann, destructive,
    states: so, userActions: ao, input: io, network: no_,
    timing: to, animation: animo, minLoadTime: mlt, triggers: trg,
    'aria-label': ariaLabel,
    badly_skip_aria_label_and_hurt_accessibility: skipAriaLabel,
    children, ...mantineProps
  } = props;

  // Validate aria-label
  if (!ariaLabel && !skipAriaLabel) {
    throw new Error(
      'Kevlar: ActionIcon requires `aria-label`. Icon-only buttons are invisible to screen readers. ' +
      'Pass `aria-label="Description of action"` or, if you truly want to skip this, ' +
      'pass `badly_skip_aria_label_and_hurt_accessibility={true}`.',
    );
  }

  const spec = deepMerge(
    { states, userActions: actions, input, network, timing, animation },
    { states: so, userActions: ao, input: io, network: no_, timing: to, animation: animo },
  );
  if (mlt) spec.timing.minLoadTime = mlt;
  if (trg) spec.timing.triggers = trg;

  // Fill the blanks that survived from base
  spec.states.loading.announcement = ann.loading;
  spec.states.success.announcement = ann.success;
  spec.states.error.announcement = ann.error;

  const interaction = useKevlarInteraction(spec, {
    onAction: onKevlarAction,
    destructive,
  });

  return (
    <MantineActionIcon
      aria-label={ariaLabel}
      {...mantineProps}
      {...interaction.handlers}
      style={interaction.currentVisual}
      disabled={interaction.state === 'disabled'}
    >
      {interaction.state === 'loading' ? interaction.loadingIndicator : children}
    </MantineActionIcon>
  );
}
