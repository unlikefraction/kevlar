import { Menu as MantineMenu, type MenuProps as MantineMenuProps } from '@mantine/core';
import {
  baseOverlayStates,
  baseOverlayActions,
  baseOverlayInput,
  baseOverlayFocus,
  baseOverlayAnimation,
} from '../base/BaseOverlay';
import { FUNCTION_MUST_BE_DEFINED } from '@unlikefraction/kevlar/sentinels';
import { useKevlarOverlay, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { KevlarContext, Trigger, DeepPartial } from '@unlikefraction/kevlar/types';

// Menu inherits BaseOverlay with full keyboard navigation:
// - Screenreader: role="menu", items have role="menuitem"
// - Keyboard: ArrowUp/Down, Enter/Space, Home/End, Escape
// - Dev-fill per item: onActivate

const states    = { ...baseOverlayStates };

// Override screenreader on open state for menu semantics
states.open = {
  ...states.open,
  screenreader: {
    role: 'menu' as const,
    item: { role: 'menuitem' as const },
  },
};

const actions   = { ...baseOverlayActions };
const input     = {
  ...baseOverlayInput,
  keyboard: {
    ...baseOverlayInput.keyboard,
    bindings: {
      ...baseOverlayInput.keyboard.bindings,
      Escape: FUNCTION_MUST_BE_DEFINED,    // close menu
      Enter: FUNCTION_MUST_BE_DEFINED,     // activate focused item
      Space: FUNCTION_MUST_BE_DEFINED,     // activate focused item
      ArrowUp: FUNCTION_MUST_BE_DEFINED,   // move focus up
      ArrowDown: FUNCTION_MUST_BE_DEFINED, // move focus down
      Home: FUNCTION_MUST_BE_DEFINED,      // move focus to first item
      End: FUNCTION_MUST_BE_DEFINED,       // move focus to last item
    },
  },
};
const focus     = { ...baseOverlayFocus };
const animation = { ...baseOverlayAnimation };

// Menu-specific: per-item action callback
const onItemActivate = FUNCTION_MUST_BE_DEFINED; // dev-fill per item: what happens when item is selected?


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarMenuProps = MantineMenuProps & {
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

export function Menu(props: KevlarMenuProps) {
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
    <MantineMenu
      {...mantineProps}
      {...overlay.handlers}
    >
      {children}
    </MantineMenu>
  );
}
