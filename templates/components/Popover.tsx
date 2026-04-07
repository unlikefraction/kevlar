import { Popover as MantinePopover, type PopoverProps as MantinePopoverProps } from '@mantine/core';
import {
  baseOverlayStates,
  baseOverlayActions,
  baseOverlayInput,
  baseOverlayFocus,
  baseOverlayAnimation,
} from '../base/BaseOverlay';
import { ANIMATION_MUST_BE_DEFINED } from '@unlikefraction/kevlar/sentinels';
import { useKevlarOverlay, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { KevlarContext, Trigger, DeepPartial } from '@unlikefraction/kevlar/types';

// Popover inherits BaseOverlay but is non-modal:
// - No backdrop, no focus trap
// - keyboard.Tab.trap: false
// - Animation: fade in/out fast

const states    = { ...baseOverlayStates };
const actions   = {
  ...baseOverlayActions,
  // Override: non-modal behavior
  onBackdropClick: () => {},  // no backdrop
};
const input     = {
  ...baseOverlayInput,
  keyboard: {
    ...baseOverlayInput.keyboard,
    Tab: {
      ...baseOverlayInput.keyboard.Tab,
      trap: false, // non-modal: focus can leave
    },
  },
};
const focus     = {
  ...baseOverlayFocus,
  trapFocus: false,
};
const animation = {
  ...baseOverlayAnimation,
  // Override: fast fade in/out
  enter: ANIMATION_MUST_BE_DEFINED, // fade in fast
  exit: ANIMATION_MUST_BE_DEFINED,  // fade out fast
};


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarPopoverProps = MantinePopoverProps & {
  // OPTIONAL — override anything from the base
  states?:      DeepPartial<typeof states>;
  userActions?: Partial<typeof actions>;
  input?:       DeepPartial<typeof input>;
  animation?:   DeepPartial<typeof animation>;
  triggers?:    Trigger[];
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function Popover(props: KevlarPopoverProps) {
  const {
    states: so, userActions: ao, input: io, animation: animo,
    triggers: trg,
    children, ...mantineProps
  } = props;

  const spec = deepMerge(
    { states, userActions: actions, input, focus, animation },
    { states: so, userActions: ao, input: io, animation: animo },
  );

  const overlay = useKevlarOverlay(spec);

  return (
    <MantinePopover
      {...mantineProps}
      {...overlay.handlers}
    >
      {children}
    </MantinePopover>
  );
}
