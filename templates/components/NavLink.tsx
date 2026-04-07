import { NavLink as MantineNavLink, type NavLinkProps as MantineNavLinkProps } from '@mantine/core';
import {
  baseInteractiveStates,
  baseInteractiveActions,
  baseInteractiveInput,
  baseInteractiveAnimation,
} from '../base/BaseInteractive';
import {
  baseDisclosureStates,
  baseDisclosureActions,
  baseDisclosureInput,
  baseDisclosureAnimation,
} from '../base/BaseDisclosure';
import { STRING_MUST_BE_DEFINED } from '@unlikefraction/kevlar/sentinels';
import { useKevlarInteraction, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { KevlarContext, DeepPartial } from '@unlikefraction/kevlar/types';

// NavLink: inherits BaseInteractive.
// Reduced states: idle, hover, focused, active, disabled.
// When it has children → composite BaseInteractive + BaseDisclosure.

const states = {
  idle:     { ...baseInteractiveStates.idle },
  hover:    { ...baseInteractiveStates.hover },
  focused:  { ...baseInteractiveStates.focused },
  active: {
    ...baseInteractiveStates.pressed,
    screenreader: { role: 'link' as const, state: { current: 'page' as const } },
    announcement: STRING_MUST_BE_DEFINED,
  },
  disabled: { ...baseInteractiveStates.disabled },
};

const actions = { ...baseInteractiveActions };
const input   = { ...baseInteractiveInput };

// Reduced animation — no loading/success/error transitions
const animation = {
  enter: baseInteractiveAnimation.enter,
  exit:  baseInteractiveAnimation.exit,
  transitions: {
    idle_to_hover:   baseInteractiveAnimation.transitions.idle_to_hover,
    hover_to_idle:   baseInteractiveAnimation.transitions.hover_to_idle,
    idle_to_active:  baseInteractiveAnimation.transitions.idle_to_pressed,
  },
  microFeedback: baseInteractiveAnimation.microFeedback,
};

// Disclosure (for NavLink with children)
const disclosure = {
  states: { ...baseDisclosureStates },
  actions: { ...baseDisclosureActions },
  input: { ...baseDisclosureInput },
  animation: { ...baseDisclosureAnimation },
};


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarNavLinkProps = MantineNavLinkProps & {
  // REQUIRED
  onKevlarAction: (ctx: KevlarContext) => void;
  announce?: { active: string };

  // OPTIONAL — override anything from the base
  states?:      DeepPartial<typeof states>;
  userActions?: Partial<typeof actions>;
  input?:       DeepPartial<typeof input>;
  animation?:   DeepPartial<typeof animation>;
  disclosure?:  DeepPartial<typeof disclosure>;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function NavLink(props: KevlarNavLinkProps) {
  const {
    onKevlarAction, announce: ann,
    states: so, userActions: ao, input: io, animation: animo,
    disclosure: disclo,
    children, ...mantineProps
  } = props;

  const spec = deepMerge(
    { states, userActions: actions, input, animation, disclosure },
    { states: so, userActions: ao, input: io, animation: animo, disclosure: disclo },
  );

  // Fill the blanks that survived from base
  if (ann?.active) spec.states.active.announcement = ann.active;

  const interaction = useKevlarInteraction(spec, {
    onAction: async (ctx: KevlarContext) => { onKevlarAction(ctx); },
  });

  return (
    <MantineNavLink
      {...mantineProps}
      {...interaction.handlers}
      style={interaction.currentVisual}
      disabled={interaction.state === 'disabled'}
      active={interaction.state === 'active'}
    >
      {children}
    </MantineNavLink>
  );
}
