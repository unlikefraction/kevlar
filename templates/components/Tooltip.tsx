import { Tooltip as MantineTooltip, type TooltipProps as MantineTooltipProps } from '@mantine/core';
import {
  baseOverlayStates,
  baseOverlayActions,
  baseOverlayInput,
  baseOverlayFocus,
  baseOverlayAnimation,
} from '../base/BaseOverlay';
import { NUMBER_MUST_BE_DEFINED } from '@unlikefraction/kevlar/sentinels';
import { useKevlarOverlay, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { KevlarContext, Trigger, DeepPartial } from '@unlikefraction/kevlar/types';

// Tooltip inherits BaseOverlay — simplest overlay, display-only:
// - No focus trap, no backdrop
// - Screenreader role: tooltip
// - Dev-fill: openDelay

const states    = { ...baseOverlayStates };

// Override screenreader on open state
states.open = {
  ...states.open,
  screenreader: { role: 'tooltip' as const },
};

const actions   = {
  ...baseOverlayActions,
  onBackdropClick: () => {},
};
const input     = {
  ...baseOverlayInput,
  keyboard: {
    ...baseOverlayInput.keyboard,
    Tab: {
      ...baseOverlayInput.keyboard.Tab,
      trap: false, // tooltips don't trap focus
    },
  },
};
const focus     = {
  ...baseOverlayFocus,
  trapFocus: false,
};
const animation = { ...baseOverlayAnimation };

// Tooltip-specific: open delay
const openDelay = NUMBER_MUST_BE_DEFINED; // dev-fill: ms before showing tooltip


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarTooltipProps = MantineTooltipProps & {
  // Dev-fill
  openDelay?: number;

  // OPTIONAL — override anything from the base
  states?:      DeepPartial<typeof states>;
  userActions?: Partial<typeof actions>;
  input?:       DeepPartial<typeof input>;
  animation?:   DeepPartial<typeof animation>;
  triggers?:    Trigger[];
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function Tooltip(props: KevlarTooltipProps) {
  const {
    openDelay: od,
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
    <MantineTooltip
      openDelay={od}
      {...mantineProps}
      {...overlay.handlers}
    >
      {children}
    </MantineTooltip>
  );
}
