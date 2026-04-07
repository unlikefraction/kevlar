import { Dialog as MantineDialog, type DialogProps as MantineDialogProps } from '@mantine/core';
import {
  baseOverlayStates,
  baseOverlayActions,
  baseOverlayInput,
  baseOverlayFocus,
  baseOverlayAnimation,
} from '../base/BaseOverlay';
import { useKevlarOverlay, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { KevlarContext, Trigger, DeepPartial } from '@unlikefraction/kevlar/types';

// Dialog inherits BaseOverlay but is non-modal:
// - No backdrop, no focus trap
// - Click outside does NOT close (non-blocking)
// - Scroll behind is allowed
// - keyboard.Tab.trap: false

const states    = { ...baseOverlayStates };
const actions   = {
  ...baseOverlayActions,
  // Override: non-modal behavior
  onClickOutside: () => {},   // non-blocking — clicking outside does nothing
  onScrollBehind: () => {},   // allow scrolling behind the dialog
  onBackdropClick: () => {},  // no backdrop
};
const input     = {
  ...baseOverlayInput,
  keyboard: {
    ...baseOverlayInput.keyboard,
    Tab: {
      ...baseOverlayInput.keyboard.Tab,
      trap: false, // non-modal: focus can leave the dialog
    },
  },
};
const focus     = {
  ...baseOverlayFocus,
  trapFocus: false,
};
const animation = { ...baseOverlayAnimation };


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarDialogProps = MantineDialogProps & {
  // REQUIRED
  announce: { open: string };

  // OPTIONAL — override anything from the base
  states?:      DeepPartial<typeof states>;
  userActions?: Partial<typeof actions>;
  input?:       DeepPartial<typeof input>;
  animation?:   DeepPartial<typeof animation>;
  triggers?:    Trigger[];
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function Dialog(props: KevlarDialogProps) {
  const {
    announce: ann,
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

  const overlay = useKevlarOverlay(spec);

  return (
    <MantineDialog
      {...mantineProps}
      {...overlay.handlers}
      style={overlay.currentVisual}
    >
      {children}
    </MantineDialog>
  );
}
