import { Modal as MantineModal, type ModalProps as MantineModalProps } from '@mantine/core';
import {
  baseOverlayStates,
  baseOverlayActions,
  baseOverlayInput,
  baseOverlayFocus,
  baseOverlayAnimation,
} from '../base/BaseOverlay';
import { FUNCTION_MUST_BE_DEFINED, STRING_MUST_BE_DEFINED } from '@unlikefraction/kevlar/sentinels';
import { useKevlarOverlay, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { KevlarContext, Trigger, DeepPartial } from '@unlikefraction/kevlar/types';

// Modal uses everything from BaseOverlay.
// Key requirements:
// - keyboard.Tab.trap MUST be true (or use dangerously_skip_focus_trap)
// - title is required (or use badly_skip_modal_title_and_hurt_accessibility)
// - Platform: small_mobile/mobile → bottom-sheet with swipe-down-to-close

const states    = { ...baseOverlayStates };
const actions   = { ...baseOverlayActions };
const input     = {
  ...baseOverlayInput,
  keyboard: {
    ...baseOverlayInput.keyboard,
    Tab: {
      ...baseOverlayInput.keyboard.Tab,
      trap: true, // MUST be true for modals — focus must not escape
    },
  },
};
const focus     = {
  ...baseOverlayFocus,
  trapFocus: true,
  onOpen: FUNCTION_MUST_BE_DEFINED,  // dev-fill: where does focus go on open?
  onClose: FUNCTION_MUST_BE_DEFINED, // dev-fill: where does focus return on close?
};
const animation = { ...baseOverlayAnimation };


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarModalProps = MantineModalProps & {
  // REQUIRED — title for accessibility (or opt out explicitly)
  title: string | typeof badly_skip_modal_title_and_hurt_accessibility;
  announce: { open: string };

  // Focus management — dev-fill
  focus?: {
    onOpen?: (ctx: KevlarContext) => void;
    onClose?: (ctx: KevlarContext) => void;
  };

  // OPTIONAL — override anything from the base
  states?:      DeepPartial<typeof states>;
  userActions?: Partial<typeof actions>;
  input?:       DeepPartial<typeof input>;
  animation?:   DeepPartial<typeof animation>;
  triggers?:    Trigger[];

  // Escape hatches
  dangerously_skip_focus_trap?: boolean;
  badly_skip_modal_title_and_hurt_accessibility?: boolean;
};

// Sentinel for skipping title — intentionally ugly name
const badly_skip_modal_title_and_hurt_accessibility = Symbol('badly_skip_modal_title');


// ─── THE COMPONENT ─────────────────────────────────────────────

export function Modal(props: KevlarModalProps) {
  const {
    announce: ann, focus: focusO,
    dangerously_skip_focus_trap: skipTrap,
    badly_skip_modal_title_and_hurt_accessibility: skipTitle,
    states: so, userActions: ao, input: io, animation: animo,
    triggers: trg,
    children, ...mantineProps
  } = props;

  const spec = deepMerge(
    { states, userActions: actions, input, focus, animation },
    { states: so, userActions: ao, input: io, animation: animo },
  );
  if (trg) spec.animation.transitions = { ...spec.animation.transitions };

  // Fill the blanks that survived from base
  spec.states.open.announcement = ann.open;

  // Apply focus callbacks if provided
  if (focusO?.onOpen) spec.focus.onOpen = focusO.onOpen;
  if (focusO?.onClose) spec.focus.onClose = focusO.onClose;

  // Escape hatch: disable focus trap (dangerous)
  if (skipTrap) {
    spec.input.keyboard.Tab.trap = false;
    spec.focus.trapFocus = false;
  }

  const overlay = useKevlarOverlay(spec);

  return (
    <MantineModal
      {...mantineProps}
      {...overlay.handlers}
      style={overlay.currentVisual}
      trapFocus={spec.focus.trapFocus}
    >
      {children}
    </MantineModal>
  );
}
