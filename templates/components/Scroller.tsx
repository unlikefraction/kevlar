import { ScrollArea } from '@mantine/core';
import { baseContainerStates } from '../base/BaseContainer';
import { useKevlarContainer, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { KevlarContext, DeepPartial } from '@unlikefraction/kevlar/types';

// Scroller: wrapper around ScrollArea pattern.
// Inherits BaseContainer.

const states = { ...baseContainerStates };


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarScrollerProps = {
  children: React.ReactNode;
  type?: 'auto' | 'always' | 'scroll' | 'hover' | 'never';
  offsetScrollbars?: boolean;

  // OPTIONAL — scroll event handlers
  onKevlarScroll?: (position: { x: number; y: number }, ctx: KevlarContext) => void;

  states?: DeepPartial<typeof states>;
  className?: string;
  style?: React.CSSProperties;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function Scroller(props: KevlarScrollerProps) {
  const {
    onKevlarScroll,
    states: so,
    children, ...restProps
  } = props;

  const spec = deepMerge({ states }, { states: so });
  useKevlarContainer(spec);

  return (
    <ScrollArea
      type={restProps.type}
      offsetScrollbars={restProps.offsetScrollbars}
      className={restProps.className}
      style={restProps.style}
      onScrollPositionChange={(position) => {
        if (onKevlarScroll) onKevlarScroll(position, {} as KevlarContext);
      }}
    >
      {children}
    </ScrollArea>
  );
}
