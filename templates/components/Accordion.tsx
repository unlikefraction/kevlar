import { Accordion as MantineAccordion, type AccordionProps as MantineAccordionProps } from '@mantine/core';
import {
  baseDisclosureStates,
  baseDisclosureActions,
  baseDisclosureInput,
  baseDisclosureAnimation,
} from '../base/BaseDisclosure';
import { useKevlarDisclosure, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { KevlarContext, DeepPartial } from '@unlikefraction/kevlar/types';

// Accordion: inherits BaseDisclosure.
// Manages multiple items. Dev-fill: onItemToggle.
// Keyboard: ArrowUp/Down between headers, Home/End.

const states    = { ...baseDisclosureStates };
const actions   = { ...baseDisclosureActions };
const input     = { ...baseDisclosureInput };
const animation = { ...baseDisclosureAnimation };


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarAccordionProps = MantineAccordionProps & {
  // REQUIRED — called when any item is toggled
  onItemToggle: (value: string, ctx: KevlarContext) => void;

  // OPTIONAL — override anything from the base
  states?:      DeepPartial<typeof states>;
  userActions?: Partial<typeof actions>;
  input?:       DeepPartial<typeof input>;
  animation?:   DeepPartial<typeof animation>;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function Accordion(props: KevlarAccordionProps) {
  const {
    onItemToggle,
    states: so, userActions: ao, input: io, animation: animo,
    children, ...mantineProps
  } = props;

  const spec = deepMerge(
    { states, userActions: actions, input, animation },
    { states: so, userActions: ao, input: io, animation: animo },
  );

  const disclosure = useKevlarDisclosure(spec, {
    onToggle: onItemToggle,
  });

  return (
    <MantineAccordion
      {...mantineProps}
      {...disclosure.handlers}
      onChange={(value) => {
        const val = Array.isArray(value) ? value[value.length - 1] : value;
        if (val != null) disclosure.toggle(val);
      }}
    >
      {children}
    </MantineAccordion>
  );
}
