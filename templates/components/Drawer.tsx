import { Drawer as MantineDrawer, type DrawerProps as MantineDrawerProps } from '@mantine/core';
import {
  baseOverlayStates,
  baseOverlayActions,
  baseOverlayInput,
  baseOverlayFocus,
  baseOverlayAnimation,
} from '../base/BaseOverlay';
import { FUNCTION_MUST_BE_DEFINED, STRING_MUST_BE_DEFINED, ANIMATION_MUST_BE_DEFINED } from '@unlikefraction/kevlar/sentinels';
import { useKevlarOverlay, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { KevlarContext, Trigger, DeepPartial } from '@unlikefraction/kevlar/types';

// Drawer inherits Modal pattern:
// - Focus trap, title required, escape closes
// - Animation: slide from position (left/right/top/bottom)
// - Dev-fill: position, touch swipe to dismiss

type DrawerPosition = 'left' | 'right' | 'top' | 'bottom';

const states    = { ...baseOverlayStates };
const actions   = { ...baseOverlayActions };
const input     = {
  ...baseOverlayInput,
  keyboard: {
    ...baseOverlayInput.keyboard,
    Tab: {
      ...baseOverlayInput.keyboard.Tab,
      trap: true, // focus trap like Modal
    },
  },
  touch: {
    ...baseOverlayInput.touch,
    onSwipe: FUNCTION_MUST_BE_DEFINED, // dev-fill: swipe to dismiss in slide direction
  },
};
const focus     = {
  ...baseOverlayFocus,
  trapFocus: true,
  onOpen: FUNCTION_MUST_BE_DEFINED,  // dev-fill
  onClose: FUNCTION_MUST_BE_DEFINED, // dev-fill
};
const animation = {
  ...baseOverlayAnimation,
  // Override: slide animation from position
  enter: ANIMATION_MUST_BE_DEFINED, // slide in from position
  exit: ANIMATION_MUST_BE_DEFINED,  // slide out to position
};


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarDrawerProps = MantineDrawerProps & {
  // REQUIRED
  title: string;
  announce: { open: string };
  position?: DrawerPosition; // dev-fill: which side does the drawer slide from?

  // Focus management — dev-fill
  focus?: {
    onOpen?: (ctx: KevlarContext) => void;
    onClose?: (ctx: KevlarContext) => void;
  };

  // Touch — dev-fill
  onSwipeToDismiss?: (ctx: KevlarContext) => void;

  // OPTIONAL — override anything from the base
  states?:      DeepPartial<typeof states>;
  userActions?: Partial<typeof actions>;
  input?:       DeepPartial<typeof input>;
  animation?:   DeepPartial<typeof animation>;
  triggers?:    Trigger[];

  // Escape hatches
  dangerously_skip_focus_trap?: boolean;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function Drawer(props: KevlarDrawerProps) {
  const {
    announce: ann, position: pos, focus: focusO,
    onSwipeToDismiss: swipeFn,
    dangerously_skip_focus_trap: skipTrap,
    states: so, userActions: ao, input: io, animation: animo,
    triggers: trg,
    children, ...mantineProps
  } = props;

  const spec = deepMerge(
    { states, userActions: actions, input, focus, animation },
    { states: so, userActions: ao, input: io, animation: animo },
  );

  // Fill the blanks that survived from base
  spec.states.open.announcement = ann.open;

  if (focusO?.onOpen) spec.focus.onOpen = focusO.onOpen;
  if (focusO?.onClose) spec.focus.onClose = focusO.onClose;
  if (swipeFn) spec.input.touch.onSwipe = swipeFn;

  if (skipTrap) {
    spec.input.keyboard.Tab.trap = false;
    spec.focus.trapFocus = false;
  }

  const overlay = useKevlarOverlay(spec);

  return (
    <MantineDrawer
      position={pos}
      {...mantineProps}
      {...overlay.handlers}
      style={overlay.currentVisual}
      trapFocus={spec.focus.trapFocus}
    >
      {children}
    </MantineDrawer>
  );
}
