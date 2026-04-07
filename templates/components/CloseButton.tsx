import { CloseButton as MantineCloseButton, type CloseButtonProps as MantineCloseButtonProps } from '@mantine/core';
import {
  baseInteractiveStates,
  baseInteractiveActions,
  baseInteractiveInput,
  baseInteractiveAnimation,
} from '../base/BaseInteractive';
import { useKevlarInteraction, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { KevlarContext, DeepPartial } from '@unlikefraction/kevlar/types';

// CloseButton: reduced states — idle, hover, focused, pressed, disabled.
// No loading, success, error (closing is local, not async).
// No network slots. No timing slots.
// Fixed screenreader: { role: 'button', label: 'Close' }.

const states = {
  idle:     { ...baseInteractiveStates.idle },
  hover:    { ...baseInteractiveStates.hover },
  focused:  { ...baseInteractiveStates.focused },
  pressed:  { ...baseInteractiveStates.pressed },
  disabled: { ...baseInteractiveStates.disabled },
};

// Override screenreader on all states
states.idle.screenreader     = { role: 'button' as const, label: 'Close' };
states.hover.screenreader    = { role: 'button' as const, label: 'Close' };
states.focused.screenreader  = { role: 'button' as const, label: 'Close' };
states.pressed.screenreader  = { role: 'button' as const, label: 'Close' };
states.disabled.screenreader = { role: 'button' as const, label: 'Close', state: { disabled: true } };

const actions   = { ...baseInteractiveActions };
const input     = { ...baseInteractiveInput };

// Reduced animation — no loading/success/error transitions
const animation = {
  enter: baseInteractiveAnimation.enter,
  exit:  baseInteractiveAnimation.exit,
  transitions: {
    idle_to_hover:   baseInteractiveAnimation.transitions.idle_to_hover,
    hover_to_idle:   baseInteractiveAnimation.transitions.hover_to_idle,
    idle_to_pressed: baseInteractiveAnimation.transitions.idle_to_pressed,
  },
  microFeedback: baseInteractiveAnimation.microFeedback,
};


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarCloseButtonProps = MantineCloseButtonProps & {
  // REQUIRED
  onKevlarAction: (ctx: KevlarContext) => void;

  // OPTIONAL — override anything from the base
  states?:      DeepPartial<typeof states>;
  userActions?: Partial<typeof actions>;
  input?:       DeepPartial<typeof input>;
  animation?:   DeepPartial<typeof animation>;
  screenreaderLabel?: string;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function CloseButton(props: KevlarCloseButtonProps) {
  const {
    onKevlarAction, screenreaderLabel,
    states: so, userActions: ao, input: io, animation: animo,
    ...mantineProps
  } = props;

  // Allow dev to override the screenreader label
  const mergedStates = { ...states };
  if (screenreaderLabel) {
    for (const key of Object.keys(mergedStates) as (keyof typeof mergedStates)[]) {
      mergedStates[key] = {
        ...mergedStates[key],
        screenreader: { ...mergedStates[key].screenreader, label: screenreaderLabel },
      };
    }
  }

  const spec = deepMerge(
    { states: mergedStates, userActions: actions, input, animation },
    { states: so, userActions: ao, input: io, animation: animo },
  );

  const interaction = useKevlarInteraction(spec, {
    onAction: async (ctx: KevlarContext) => { onKevlarAction(ctx); },
  });

  return (
    <MantineCloseButton
      aria-label={screenreaderLabel ?? 'Close'}
      {...mantineProps}
      {...interaction.handlers}
      style={interaction.currentVisual}
      disabled={interaction.state === 'disabled'}
    />
  );
}
