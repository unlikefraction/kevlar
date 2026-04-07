import { ScrollArea as MantineScrollArea, type ScrollAreaProps as MantineScrollAreaProps } from '@mantine/core';
import { baseContainerStates } from '../base/BaseContainer';
import { useKevlarContainer, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { KevlarContext, DeepPartial } from '@unlikefraction/kevlar/types';

// ScrollArea: inherits BaseContainer.
// Dev-fill: onScroll, scrollbar.onVisibility.

const states = { ...baseContainerStates };


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarScrollAreaProps = MantineScrollAreaProps & {
  // OPTIONAL — scroll event handlers
  onKevlarScroll?: (position: { x: number; y: number }, ctx: KevlarContext) => void;
  onScrollbarVisibility?: (visible: boolean, ctx: KevlarContext) => void;

  states?: DeepPartial<typeof states>;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function ScrollArea(props: KevlarScrollAreaProps) {
  const {
    onKevlarScroll, onScrollbarVisibility,
    states: so, children, ...mantineProps
  } = props;

  const spec = deepMerge({ states }, { states: so });
  useKevlarContainer(spec);

  return (
    <MantineScrollArea
      {...mantineProps}
      onScrollPositionChange={(position) => {
        mantineProps.onScrollPositionChange?.(position);
        if (onKevlarScroll) onKevlarScroll(position, {} as KevlarContext);
      }}
    >
      {children}
    </MantineScrollArea>
  );
}
