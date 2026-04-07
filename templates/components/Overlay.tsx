import { Overlay as MantineOverlay, type OverlayProps as MantineOverlayProps } from '@mantine/core';
import {
  baseStaticStates,
  baseStaticInput,
} from '../base/BaseStatic';
import { FUNCTION_MUST_BE_DEFINED } from '@unlikefraction/kevlar/sentinels';
import { useKevlarStatic, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { KevlarContext, DeepPartial } from '@unlikefraction/kevlar/types';

// Overlay inherits BaseStatic:
// - Backdrop/dimmer element
// - Hidden from screenreaders (decorative)
// - Dev-fill: onClick (what happens when backdrop is clicked)

const states = {
  ...baseStaticStates,
  idle: {
    ...baseStaticStates.idle,
    screenreader: { hidden: true }, // decorative backdrop — not in a11y tree
  },
  focused: {
    ...baseStaticStates.focused,
    screenreader: { hidden: true },
  },
};

const input = { ...baseStaticInput };

// Overlay-specific: click handler
const onClick = FUNCTION_MUST_BE_DEFINED; // dev-fill: what happens when backdrop is clicked?


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarOverlayProps = MantineOverlayProps & {
  // Dev-fill
  onClick?: (ctx: KevlarContext) => void;

  // OPTIONAL — override anything from the base
  states?:    DeepPartial<typeof states>;
  input?:     DeepPartial<typeof input>;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function Overlay(props: KevlarOverlayProps) {
  const {
    onClick: clickFn,
    states: so, input: io,
    ...mantineProps
  } = props;

  const spec = deepMerge(
    { states, input },
    { states: so, input: io },
  );

  const staticCtl = useKevlarStatic(spec);

  return (
    <MantineOverlay
      {...mantineProps}
      {...staticCtl.handlers}
      style={staticCtl.currentVisual}
      onClick={clickFn}
      aria-hidden="true"
    />
  );
}
