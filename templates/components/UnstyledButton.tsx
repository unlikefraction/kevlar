import { UnstyledButton as MantineUnstyledButton, type UnstyledButtonProps as MantineUnstyledButtonProps } from '@mantine/core';
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

// UnstyledButton: all visual state styles are empty {}.
// The dev owns the entire visual layer.
// Focus ring stays for accessibility. Everything else: wiped clean, dev fills.

const emptyVisual = {};

const states = {
  idle:     { ...baseInteractiveStates.idle,     visual: emptyVisual },
  hover:    { ...baseInteractiveStates.hover,    visual: emptyVisual },
  focused:  { ...baseInteractiveStates.focused   },  // focus ring stays
  pressed:  { ...baseInteractiveStates.pressed,  visual: emptyVisual },
  loading:  { ...baseInteractiveStates.loading,  visual: emptyVisual },
  success:  { ...baseInteractiveStates.success,  visual: emptyVisual },
  error:    { ...baseInteractiveStates.error,    visual: emptyVisual },
  disabled: { ...baseInteractiveStates.disabled, visual: emptyVisual },
};

const actions   = { ...baseInteractiveActions };
const input     = { ...baseInteractiveInput };
const network   = { ...baseInteractiveNetwork };
const timing    = { ...baseInteractiveTiming };
const animation = { ...baseInteractiveAnimation };


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarUnstyledButtonProps = MantineUnstyledButtonProps & {
  // REQUIRED — these are the STRING_MUST_BE_DEFINED markers that survive to here
  onKevlarAction: (ctx: KevlarContext) => Promise<void>;
  announce: { loading: string; success: string; error: string };

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
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function UnstyledButton(props: KevlarUnstyledButtonProps) {
  const {
    onKevlarAction, announce: ann, destructive,
    states: so, userActions: ao, input: io, network: no_,
    timing: to, animation: animo, minLoadTime: mlt, triggers: trg,
    children, ...mantineProps
  } = props;

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
    <MantineUnstyledButton
      {...mantineProps}
      {...interaction.handlers}
      style={interaction.currentVisual}
      disabled={interaction.state === 'disabled'}
    >
      {interaction.displayText ?? children}
    </MantineUnstyledButton>
  );
}
