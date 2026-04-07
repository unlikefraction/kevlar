import { Burger as MantineBurger, type BurgerProps as MantineBurgerProps } from '@mantine/core';
import {
  baseInteractiveStates,
  baseInteractiveActions,
  baseInteractiveInput,
  baseInteractiveAnimation,
} from '../base/BaseInteractive';
import { STRING_MUST_BE_DEFINED, ANIMATION_MUST_BE_DEFINED } from '@unlikefraction/kevlar/sentinels';
import { useKevlarInteraction, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { KevlarContext, DeepPartial } from '@unlikefraction/kevlar/types';

// Burger: inherits BaseInteractive.
// States: idle, hover, focused, pressed, open, closed, disabled.
// screenreader: { role: 'button', state: { expanded: false }, label: 'Toggle navigation' }
// Dev-fill: onToggle.
// Animation: toggle (hamburger to X).

const states = {
  idle: {
    ...baseInteractiveStates.idle,
    screenreader: { role: 'button' as const, state: { expanded: false }, label: 'Toggle navigation' },
  },
  hover: {
    ...baseInteractiveStates.hover,
    screenreader: { role: 'button' as const, state: { expanded: false }, label: 'Toggle navigation' },
  },
  focused: {
    ...baseInteractiveStates.focused,
    screenreader: { role: 'button' as const, state: { expanded: false }, label: 'Toggle navigation' },
  },
  pressed: {
    ...baseInteractiveStates.pressed,
    screenreader: { role: 'button' as const, state: { expanded: false }, label: 'Toggle navigation' },
  },
  open: {
    ...baseInteractiveStates.pressed,
    screenreader: { role: 'button' as const, state: { expanded: true }, label: 'Toggle navigation' },
    announcement: STRING_MUST_BE_DEFINED,
  },
  closed: {
    ...baseInteractiveStates.idle,
    screenreader: { role: 'button' as const, state: { expanded: false }, label: 'Toggle navigation' },
    announcement: STRING_MUST_BE_DEFINED,
  },
  disabled: {
    ...baseInteractiveStates.disabled,
    screenreader: { role: 'button' as const, state: { expanded: false, disabled: true }, label: 'Toggle navigation' },
  },
};

const actions = { ...baseInteractiveActions };
const input   = { ...baseInteractiveInput };

// Animation includes toggle (hamburger to X)
const animation = {
  enter: baseInteractiveAnimation.enter,
  exit:  baseInteractiveAnimation.exit,
  transitions: {
    idle_to_hover:   baseInteractiveAnimation.transitions.idle_to_hover,
    hover_to_idle:   baseInteractiveAnimation.transitions.hover_to_idle,
    idle_to_pressed: baseInteractiveAnimation.transitions.idle_to_pressed,
    closed_to_open:  ANIMATION_MUST_BE_DEFINED,
    open_to_closed:  ANIMATION_MUST_BE_DEFINED,
  },
  microFeedback: baseInteractiveAnimation.microFeedback,
  toggle: ANIMATION_MUST_BE_DEFINED, // hamburger to X morph animation
};


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarBurgerProps = MantineBurgerProps & {
  // REQUIRED — dev-fill
  onToggle: (opened: boolean, ctx: KevlarContext) => void;
  announce: { open: string; closed: string };

  // OPTIONAL — override anything from the base
  states?:      DeepPartial<typeof states>;
  userActions?: Partial<typeof actions>;
  input?:       DeepPartial<typeof input>;
  animation?:   DeepPartial<typeof animation>;
  screenreaderLabel?: string;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function Burger(props: KevlarBurgerProps) {
  const {
    onToggle, announce: ann, screenreaderLabel,
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

  // Fill the blanks that survived from base
  spec.states.open.announcement = ann.open;
  spec.states.closed.announcement = ann.closed;

  const interaction = useKevlarInteraction(spec, {
    onAction: async (ctx: KevlarContext) => {
      const nextOpened = interaction.state !== 'open';
      onToggle(nextOpened, ctx);
    },
  });

  return (
    <MantineBurger
      aria-label={screenreaderLabel ?? 'Toggle navigation'}
      {...mantineProps}
      {...interaction.handlers}
      style={interaction.currentVisual}
      disabled={interaction.state === 'disabled'}
      opened={interaction.state === 'open'}
    />
  );
}
