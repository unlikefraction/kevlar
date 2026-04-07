import { Anchor as MantineAnchor, type AnchorProps as MantineAnchorProps } from '@mantine/core';
import {
  baseInteractiveStates,
  baseInteractiveActions,
  baseInteractiveInput,
  baseInteractiveAnimation,
} from '../base/BaseInteractive';
import { useKevlarInteraction, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { KevlarContext, DeepPartial } from '@unlikefraction/kevlar/types';

// Anchor: inherits BaseInteractive.
// Reduced states: idle, hover, focused, pressed, disabled (no loading/success/error).
// No network, no timing.
// screenreader: { role: 'link' }
// keyboard.bindings.Space: () => {} — Space does NOT activate links.

const states = {
  idle:     { ...baseInteractiveStates.idle,     screenreader: { role: 'link' as const } },
  hover:    { ...baseInteractiveStates.hover,    screenreader: { role: 'link' as const } },
  focused:  { ...baseInteractiveStates.focused,  screenreader: { role: 'link' as const } },
  pressed:  { ...baseInteractiveStates.pressed,  screenreader: { role: 'link' as const } },
  disabled: { ...baseInteractiveStates.disabled, screenreader: { role: 'link' as const, state: { disabled: true } } },
};

const actions = { ...baseInteractiveActions };

const input = {
  ...baseInteractiveInput,
  keyboard: {
    ...baseInteractiveInput.keyboard,
    bindings: {
      ...baseInteractiveInput.keyboard.bindings,
      Space: () => {}, // Space does NOT activate links
    },
  },
};

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

export type KevlarAnchorProps = MantineAnchorProps & {
  // REQUIRED
  onKevlarAction: (ctx: KevlarContext) => void;

  // OPTIONAL — override anything from the base
  states?:      DeepPartial<typeof states>;
  userActions?: Partial<typeof actions>;
  input?:       DeepPartial<typeof input>;
  animation?:   DeepPartial<typeof animation>;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function Anchor(props: KevlarAnchorProps) {
  const {
    onKevlarAction,
    states: so, userActions: ao, input: io, animation: animo,
    children, ...mantineProps
  } = props;

  const spec = deepMerge(
    { states, userActions: actions, input, animation },
    { states: so, userActions: ao, input: io, animation: animo },
  );

  const interaction = useKevlarInteraction(spec, {
    onAction: async (ctx: KevlarContext) => { onKevlarAction(ctx); },
  });

  return (
    <MantineAnchor
      {...mantineProps}
      {...interaction.handlers}
      style={interaction.currentVisual}
    >
      {children}
    </MantineAnchor>
  );
}
