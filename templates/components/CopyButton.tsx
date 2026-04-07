import { CopyButton as MantineCopyButton, type CopyButtonProps as MantineCopyButtonProps } from '@mantine/core';
import {
  baseInteractiveStates,
  baseInteractiveActions,
  baseInteractiveInput,
  baseInteractiveAnimation,
} from '../base/BaseInteractive';
import { STRING_MUST_BE_DEFINED, NUMBER_MUST_BE_DEFINED } from '@unlikefraction/kevlar/sentinels';
import { useKevlarInteraction, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { KevlarContext, DeepPartial } from '@unlikefraction/kevlar/types';

// CopyButton: reduced states — idle, hover, focused, pressed, success, error, disabled.
// No loading (clipboard write is synchronous).
// No network slots.
// Additional: timing.successDurationMs (how long success shows before reverting to idle).

const states = {
  idle:     { ...baseInteractiveStates.idle },
  hover:    { ...baseInteractiveStates.hover },
  focused:  { ...baseInteractiveStates.focused },
  pressed:  { ...baseInteractiveStates.pressed },
  success:  { ...baseInteractiveStates.success },
  error:    { ...baseInteractiveStates.error },
  disabled: { ...baseInteractiveStates.disabled },
};

const actions = { ...baseInteractiveActions };
const input   = { ...baseInteractiveInput };

// Reduced animation — no loading transitions
const animation = {
  enter: baseInteractiveAnimation.enter,
  exit:  baseInteractiveAnimation.exit,
  transitions: {
    idle_to_hover:      baseInteractiveAnimation.transitions.idle_to_hover,
    hover_to_idle:      baseInteractiveAnimation.transitions.hover_to_idle,
    idle_to_pressed:    baseInteractiveAnimation.transitions.idle_to_pressed,
    pressed_to_success: baseInteractiveAnimation.transitions.loading_to_success,
    pressed_to_error:   baseInteractiveAnimation.transitions.loading_to_error,
  },
  microFeedback: baseInteractiveAnimation.microFeedback,
};

// Timing — only successDurationMs matters
const timing = {
  successDurationMs: NUMBER_MUST_BE_DEFINED as unknown as number,
};


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarCopyButtonProps = Omit<MantineCopyButtonProps, 'children'> & {
  // REQUIRED
  onKevlarAction: (ctx: KevlarContext) => void;
  announce: { success: string; error: string };

  // OPTIONAL — override anything from the base
  states?:      DeepPartial<typeof states>;
  userActions?: Partial<typeof actions>;
  input?:       DeepPartial<typeof input>;
  animation?:   DeepPartial<typeof animation>;
  successDurationMs?: number;
  children: (payload: { copied: boolean; copy: () => void }) => React.ReactNode;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function CopyButton(props: KevlarCopyButtonProps) {
  const {
    onKevlarAction, announce: ann,
    states: so, userActions: ao, input: io, animation: animo,
    successDurationMs,
    children, ...mantineProps
  } = props;

  const spec = deepMerge(
    { states, userActions: actions, input, animation, timing },
    { states: so, userActions: ao, input: io, animation: animo },
  );

  if (successDurationMs !== undefined) {
    spec.timing.successDurationMs = successDurationMs;
  }

  // Fill the blanks that survived from base
  spec.states.success.announcement = ann.success;
  spec.states.error.announcement = ann.error;

  const interaction = useKevlarInteraction(spec, {
    onAction: async (ctx: KevlarContext) => { onKevlarAction(ctx); },
  });

  return (
    <MantineCopyButton {...mantineProps}>
      {({ copied, copy }) => children({
        copied: copied || interaction.state === 'success',
        copy: () => {
          copy();
          interaction.handlers.onClick?.();
        },
      })}
    </MantineCopyButton>
  );
}
