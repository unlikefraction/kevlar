import { Box, type BoxProps } from '@mantine/core';
import {
  baseOverlayStates,
  baseOverlayActions,
  baseOverlayInput,
  baseOverlayFocus,
  baseOverlayAnimation,
} from '../base/BaseOverlay';
import { FUNCTION_MUST_BE_DEFINED, BOOLEAN_MUST_BE_DEFINED } from '@unlikefraction/kevlar/sentinels';
import { useKevlarOverlay, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { KevlarContext, Trigger, DeepPartial } from '@unlikefraction/kevlar/types';

// FloatingWindow: non-modal, draggable overlay.
// - No focus trap, no backdrop
// - Click outside does nothing
// - Draggable via mouse and touch
// - Constrained to viewport

const states    = { ...baseOverlayStates };
const actions   = {
  ...baseOverlayActions,
  onClickOutside: () => {},   // non-modal: clicking outside does nothing
  onBackdropClick: () => {},  // no backdrop
};
const input     = {
  ...baseOverlayInput,
  keyboard: {
    ...baseOverlayInput.keyboard,
    Tab: {
      ...baseOverlayInput.keyboard.Tab,
      trap: false, // non-modal
    },
  },
  mouse: {
    ...baseOverlayInput.mouse,
    onDrag: FUNCTION_MUST_BE_DEFINED, // drag to reposition
  },
  touch: {
    ...baseOverlayInput.touch,
    onDrag: FUNCTION_MUST_BE_DEFINED, // touch drag to reposition
  },
};
const focus     = {
  ...baseOverlayFocus,
  trapFocus: false,
};
const animation = { ...baseOverlayAnimation };

// FloatingWindow-specific: viewport constraint
const constrainToViewport = true;


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarFloatingWindowProps = BoxProps & {
  // REQUIRED
  announce: { open: string };

  // Dragging
  onDrag?: (ctx: KevlarContext) => void;
  constrainToViewport?: boolean;

  // OPTIONAL — override anything from the base
  states?:      DeepPartial<typeof states>;
  userActions?: Partial<typeof actions>;
  input?:       DeepPartial<typeof input>;
  animation?:   DeepPartial<typeof animation>;
  triggers?:    Trigger[];
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function FloatingWindow(props: KevlarFloatingWindowProps) {
  const {
    announce: ann, onDrag: dragFn,
    constrainToViewport: constrain,
    states: so, userActions: ao, input: io, animation: animo,
    triggers: trg,
    children, ...mantineProps
  } = props;

  const spec = deepMerge(
    { states, userActions: actions, input, focus, animation, constrainToViewport },
    { states: so, userActions: ao, input: io, animation: animo },
  );

  // Fill the blanks
  spec.states.open.announcement = ann.open;
  if (dragFn) {
    spec.input.mouse.onDrag = dragFn;
    spec.input.touch.onDrag = dragFn;
  }
  if (constrain !== undefined) spec.constrainToViewport = constrain;

  const overlay = useKevlarOverlay(spec);

  return (
    <Box
      {...mantineProps}
      {...overlay.handlers}
      style={overlay.currentVisual}
    >
      {children}
    </Box>
  );
}
