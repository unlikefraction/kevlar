import { Group, Menu } from '@mantine/core';
import { baseContainerStates } from '../base/BaseContainer';
import {
  baseOverlayStates,
  baseOverlayActions,
  baseOverlayInput,
  baseOverlayFocus,
  baseOverlayAnimation,
} from '../base/BaseOverlay';
import { useKevlarContainer, useKevlarOverlay, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { DeepPartial } from '@unlikefraction/kevlar/types';

// OverflowList: custom component — inherits BaseContainer.
// Overflow menu is a Menu (BaseOverlay).
// Items that don't fit are moved into the overflow Menu.

const containerStates = { ...baseContainerStates };

const menuStates    = { ...baseOverlayStates };
const menuActions   = { ...baseOverlayActions };
const menuInput     = { ...baseOverlayInput };
const menuFocus     = { ...baseOverlayFocus };
const menuAnimation = { ...baseOverlayAnimation };


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarOverflowListProps = {
  // REQUIRED
  items: React.ReactNode[];
  overflowRenderer?: (items: React.ReactNode[]) => React.ReactNode;

  // OPTIONAL — override container base
  containerStates?: DeepPartial<typeof containerStates>;

  // OPTIONAL — override overflow menu behavior
  menuStates?:    DeepPartial<typeof menuStates>;
  menuActions?:   Partial<typeof menuActions>;
  menuInput?:     DeepPartial<typeof menuInput>;
  menuFocus?:     DeepPartial<typeof menuFocus>;
  menuAnimation?: DeepPartial<typeof menuAnimation>;

  // Layout props
  gap?: number | string;
  className?: string;
  style?: React.CSSProperties;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function OverflowList(props: KevlarOverflowListProps) {
  const {
    items, overflowRenderer,
    containerStates: cso,
    menuStates: mso, menuActions: mao, menuInput: mio, menuFocus: mfo, menuAnimation: manimo,
    ...layoutProps
  } = props;

  const containerSpec = deepMerge({ states: containerStates }, { states: cso });
  useKevlarContainer(containerSpec);

  const menuSpec = deepMerge(
    { states: menuStates, userActions: menuActions, input: menuInput, focus: menuFocus, animation: menuAnimation },
    { states: mso, userActions: mao, input: mio, focus: mfo, animation: manimo },
  );
  const overlay = useKevlarOverlay(menuSpec);

  // In a real implementation, a ResizeObserver would determine visible vs overflowed items.
  // This template shows the structural pattern.
  const visibleItems = items;
  const overflowedItems: React.ReactNode[] = [];

  return (
    <Group gap={layoutProps.gap} className={layoutProps.className} style={layoutProps.style}>
      {visibleItems}
      {overflowedItems.length > 0 && (
        <Menu {...overlay.handlers}>
          <Menu.Target>
            <button aria-label="More items">...</button>
          </Menu.Target>
          <Menu.Dropdown>
            {overflowRenderer
              ? overflowRenderer(overflowedItems)
              : overflowedItems.map((item, i) => (
                  <Menu.Item key={i}>{item}</Menu.Item>
                ))}
          </Menu.Dropdown>
        </Menu>
      )}
    </Group>
  );
}
