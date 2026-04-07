import { Button as MantineButton, type ButtonProps as MantineButtonProps } from '@mantine/core';
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

// Button uses everything from BaseInteractive.
// Only override what's Button-specific.

const states    = { ...baseInteractiveStates };
const actions   = { ...baseInteractiveActions };
const input     = { ...baseInteractiveInput };
const network   = { ...baseInteractiveNetwork };
const timing    = { ...baseInteractiveTiming };
const animation = { ...baseInteractiveAnimation };

// Button-specific: type defaults to 'button', not 'submit'
const typeDefault = 'button';

// Button-specific: announcements are still STRING_MUST_BE_DEFINED
// they stay that way — every Button instance fills them via the `announce` prop


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarButtonProps = MantineButtonProps & {
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

export function Button(props: KevlarButtonProps) {
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
    <MantineButton
      type={typeDefault}
      {...mantineProps}
      {...interaction.handlers}
      style={interaction.currentVisual}
      disabled={interaction.state === 'disabled'}
    >
      {interaction.displayText ?? children}
    </MantineButton>
  );
}
