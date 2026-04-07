import { HoverCard as MantineHoverCard, type HoverCardProps as MantineHoverCardProps } from '@mantine/core';
import {
  baseOverlayStates,
  baseOverlayActions,
  baseOverlayInput,
  baseOverlayFocus,
  baseOverlayAnimation,
} from '../base/BaseOverlay';
import { NUMBER_MUST_BE_DEFINED, ANIMATION_MUST_BE_DEFINED } from '@unlikefraction/kevlar/sentinels';
import { useKevlarOverlay, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { KevlarContext, Trigger, DeepPartial } from '@unlikefraction/kevlar/types';

// HoverCard inherits Popover pattern:
// - Non-modal, no backdrop, no focus trap
// - Trigger: hover (not click)
// - Dev-fill: openDelay, closeDelay

const states    = { ...baseOverlayStates };
const actions   = {
  ...baseOverlayActions,
  onBackdropClick: () => {},  // no backdrop
};
const input     = {
  ...baseOverlayInput,
  keyboard: {
    ...baseOverlayInput.keyboard,
    Tab: {
      ...baseOverlayInput.keyboard.Tab,
      trap: false,
    },
  },
};
const focus     = {
  ...baseOverlayFocus,
  trapFocus: false,
};
const animation = {
  ...baseOverlayAnimation,
  enter: ANIMATION_MUST_BE_DEFINED, // fade in fast (like Popover)
  exit: ANIMATION_MUST_BE_DEFINED,  // fade out fast
};

// HoverCard-specific: delays
const hoverTiming = {
  openDelay: NUMBER_MUST_BE_DEFINED,  // dev-fill: ms before showing on hover
  closeDelay: NUMBER_MUST_BE_DEFINED, // dev-fill: ms before hiding on mouse leave
};


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarHoverCardProps = MantineHoverCardProps & {
  // Dev-fill: hover timing
  openDelay?: number;
  closeDelay?: number;

  // OPTIONAL — override anything from the base
  states?:      DeepPartial<typeof states>;
  userActions?: Partial<typeof actions>;
  input?:       DeepPartial<typeof input>;
  animation?:   DeepPartial<typeof animation>;
  triggers?:    Trigger[];
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function HoverCard(props: KevlarHoverCardProps) {
  const {
    openDelay: od, closeDelay: cd,
    states: so, userActions: ao, input: io, animation: animo,
    triggers: trg,
    children, ...mantineProps
  } = props;

  const spec = deepMerge(
    { states, userActions: actions, input, focus, animation, hoverTiming },
    { states: so, userActions: ao, input: io, animation: animo },
  );

  if (od !== undefined) spec.hoverTiming.openDelay = od;
  if (cd !== undefined) spec.hoverTiming.closeDelay = cd;

  const overlay = useKevlarOverlay(spec);

  return (
    <MantineHoverCard
      openDelay={spec.hoverTiming.openDelay}
      closeDelay={spec.hoverTiming.closeDelay}
      {...mantineProps}
      {...overlay.handlers}
    >
      {children}
    </MantineHoverCard>
  );
}
