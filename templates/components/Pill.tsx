import { Pill as MantinePill, type PillProps as MantinePillProps } from '@mantine/core';
import {
  baseInteractiveStates,
  baseInteractiveActions,
  baseInteractiveInput,
  baseInteractiveAnimation,
} from '../base/BaseInteractive';
import { useKevlarInteraction, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { KevlarContext, DeepPartial } from '@unlikefraction/kevlar/types';

// Pill: inherits BaseInteractive.
// Reduced states: idle, hover, focused, disabled (no loading/success/error).
// No network, no timing.
// Dev-fill: onRemove.

const states = {
  idle:     { ...baseInteractiveStates.idle },
  hover:    { ...baseInteractiveStates.hover },
  focused:  { ...baseInteractiveStates.focused },
  disabled: { ...baseInteractiveStates.disabled },
};

const actions = { ...baseInteractiveActions };
const input   = { ...baseInteractiveInput };

// Reduced animation — no loading/success/error transitions
const animation = {
  enter: baseInteractiveAnimation.enter,
  exit:  baseInteractiveAnimation.exit,
  transitions: {
    idle_to_hover: baseInteractiveAnimation.transitions.idle_to_hover,
    hover_to_idle: baseInteractiveAnimation.transitions.hover_to_idle,
  },
  microFeedback: baseInteractiveAnimation.microFeedback,
};


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarPillProps = MantinePillProps & {
  // REQUIRED
  onRemove?: (ctx: KevlarContext) => void;

  // OPTIONAL — override anything from the base
  states?:      DeepPartial<typeof states>;
  userActions?: Partial<typeof actions>;
  input?:       DeepPartial<typeof input>;
  animation?:   DeepPartial<typeof animation>;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function Pill(props: KevlarPillProps) {
  const {
    onRemove,
    states: so, userActions: ao, input: io, animation: animo,
    children, ...mantineProps
  } = props;

  const spec = deepMerge(
    { states, userActions: actions, input, animation },
    { states: so, userActions: ao, input: io, animation: animo },
  );

  const interaction = useKevlarInteraction(spec, {
    onAction: async (ctx: KevlarContext) => { onRemove?.(ctx); },
  });

  return (
    <MantinePill
      {...mantineProps}
      {...interaction.handlers}
      style={interaction.currentVisual}
      disabled={interaction.state === 'disabled'}
    >
      {children}
    </MantinePill>
  );
}
