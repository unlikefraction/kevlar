import { Card as MantineCard, type CardProps as MantineCardProps } from '@mantine/core';
import { baseContainerStates } from '../base/BaseContainer';
import {
  baseInteractiveStates,
  baseInteractiveActions,
  baseInteractiveInput,
  baseInteractiveNetwork,
  baseInteractiveTiming,
  baseInteractiveAnimation,
} from '../base/BaseInteractive';
import { useKevlarContainer, useKevlarInteraction, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { KevlarContext, Trigger, DeepPartial } from '@unlikefraction/kevlar/types';

// Card: BaseContainer (static) OR BaseInteractive (when clickable via onKevlarAction).
// When interactive: idle, hover, focused, pressed, skeleton, selected, disabled.
// Dev-fill (interactive): onKevlarAction, touch.onLongPress, touch.onSwipe.

const containerStates = { ...baseContainerStates };

const interactiveStates = {
  idle:     { ...baseInteractiveStates.idle },
  hover:    { ...baseInteractiveStates.hover },
  focused:  { ...baseInteractiveStates.focused },
  pressed:  { ...baseInteractiveStates.pressed },
  skeleton: { visual: { opacity: 0.5, animation: 'shimmer' } },
  selected: { visual: { outline: '2px solid var(--mantine-primary-color-filled)', outlineOffset: '2px' },
              screenreader: { 'aria-selected': true } },
  disabled: { ...baseInteractiveStates.disabled },
};

const actions   = { ...baseInteractiveActions };
const input     = { ...baseInteractiveInput };
const network   = { ...baseInteractiveNetwork };
const timing    = { ...baseInteractiveTiming };
const animation = { ...baseInteractiveAnimation };


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarCardProps = MantineCardProps & {
  // OPTIONAL — provide to make the card interactive
  onKevlarAction?: (ctx: KevlarContext) => Promise<void>;

  // OPTIONAL — override anything from the base
  states?:      DeepPartial<typeof interactiveStates>;
  userActions?: Partial<typeof actions>;
  input?:       DeepPartial<typeof input>;
  network?:     Partial<typeof network>;
  timing?:      Partial<typeof timing>;
  animation?:   DeepPartial<typeof animation>;
  triggers?:    Trigger[];
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function Card(props: KevlarCardProps) {
  const {
    onKevlarAction,
    states: so, userActions: ao, input: io, network: no_,
    timing: to, animation: animo, triggers: trg,
    children, ...mantineProps
  } = props;

  // Static card — no onKevlarAction
  if (!onKevlarAction) {
    const spec = deepMerge({ states: containerStates }, {});
    useKevlarContainer(spec);

    return (
      <MantineCard {...mantineProps}>
        {children}
      </MantineCard>
    );
  }

  // Interactive card
  const spec = deepMerge(
    { states: interactiveStates, userActions: actions, input, network, timing, animation },
    { states: so, userActions: ao, input: io, network: no_, timing: to, animation: animo },
  );
  if (trg) spec.timing.triggers = trg;

  const interaction = useKevlarInteraction(spec, {
    onAction: onKevlarAction,
  });

  return (
    <MantineCard
      {...mantineProps}
      {...interaction.handlers}
      style={interaction.currentVisual}
      tabIndex={0}
      role="button"
    >
      {children}
    </MantineCard>
  );
}
