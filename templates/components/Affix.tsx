import { Affix as MantineAffix, type AffixProps as MantineAffixProps } from '@mantine/core';
import {
  baseContainerStates,
} from '../base/BaseContainer';
import { useKevlarContainer, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { DeepPartial } from '@unlikefraction/kevlar/types';

// Affix inherits BaseContainer:
// - Pins content to a fixed viewport position
// - Structural wrapper — minimal behavior

const states = { ...baseContainerStates };


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarAffixProps = MantineAffixProps & {
  // OPTIONAL — override anything from the base
  states?: DeepPartial<typeof states>;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function Affix(props: KevlarAffixProps) {
  const {
    states: so,
    children, ...mantineProps
  } = props;

  const spec = deepMerge(
    { states },
    { states: so },
  );

  const container = useKevlarContainer(spec);

  return (
    <MantineAffix
      {...mantineProps}
      {...container.handlers}
      style={container.currentVisual}
    >
      {children}
    </MantineAffix>
  );
}
