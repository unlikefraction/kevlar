import { Tree as MantineTree, type TreeProps as MantineTreeProps } from '@mantine/core';
import {
  baseNavigationStates,
  baseNavigationActions,
  baseNavigationInput,
  baseNavigationAnimation,
} from '../base/BaseNavigation';
import {
  baseDisclosureStates,
  baseDisclosureActions,
  baseDisclosureInput,
  baseDisclosureAnimation,
} from '../base/BaseDisclosure';
import { STRING_MUST_BE_DEFINED, FUNCTION_MUST_BE_DEFINED } from '@unlikefraction/kevlar/sentinels';
import { useKevlarInteraction, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { KevlarContext, DeepPartial } from '@unlikefraction/kevlar/types';

// Tree: composite BaseNavigation + BaseDisclosure.
// screenreader: { role: 'tree', item: { role: 'treeitem' }, group: { role: 'group' } }
// Keyboard: ArrowLeft (collapse/parent), ArrowRight (expand/first child),
//           Home, End, * (expand all siblings)

const states = {
  idle: {
    ...baseNavigationStates.idle,
    screenreader: { role: 'tree' as const, item: { role: 'treeitem' as const }, group: { role: 'group' as const } },
  },
  hover: {
    ...baseNavigationStates.hover,
    screenreader: { role: 'tree' as const, item: { role: 'treeitem' as const }, group: { role: 'group' as const } },
  },
  focused: {
    ...baseNavigationStates.focused,
    screenreader: { role: 'tree' as const, item: { role: 'treeitem' as const }, group: { role: 'group' as const } },
  },
  active: {
    ...baseNavigationStates.active,
    screenreader: { role: 'tree' as const, item: { role: 'treeitem' as const, state: { selected: true } }, group: { role: 'group' as const } },
  },
  disabled: {
    ...baseNavigationStates.disabled,
    screenreader: { role: 'tree' as const, item: { role: 'treeitem' as const, state: { disabled: true } }, group: { role: 'group' as const } },
  },
};

const actions = { ...baseNavigationActions };

const input = {
  ...baseNavigationInput,
  keyboard: {
    ...baseNavigationInput.keyboard,
    bindings: {
      ...baseNavigationInput.keyboard.bindings,
      ArrowLeft: FUNCTION_MUST_BE_DEFINED,    // collapse current node or move to parent
      ArrowRight: FUNCTION_MUST_BE_DEFINED,   // expand current node or move to first child
      Home: FUNCTION_MUST_BE_DEFINED,         // move to first visible node
      End: FUNCTION_MUST_BE_DEFINED,          // move to last visible node
      '*': FUNCTION_MUST_BE_DEFINED,          // expand all siblings at current level
    },
  },
};

const animation = { ...baseNavigationAnimation };

// Disclosure (for tree node expand/collapse)
const disclosure = {
  states: { ...baseDisclosureStates },
  actions: { ...baseDisclosureActions },
  input: { ...baseDisclosureInput },
  animation: { ...baseDisclosureAnimation },
};


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarTreeProps = MantineTreeProps & {
  // REQUIRED — dev-fill
  announce: { active: string };

  // OPTIONAL — override anything from the base
  states?:      DeepPartial<typeof states>;
  userActions?: Partial<typeof actions>;
  input?:       DeepPartial<typeof input>;
  animation?:   DeepPartial<typeof animation>;
  disclosure?:  DeepPartial<typeof disclosure>;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function Tree(props: KevlarTreeProps) {
  const {
    announce: ann,
    states: so, userActions: ao, input: io, animation: animo,
    disclosure: disclo,
    ...mantineProps
  } = props;

  const spec = deepMerge(
    { states, userActions: actions, input, animation, disclosure },
    { states: so, userActions: ao, input: io, animation: animo, disclosure: disclo },
  );

  // Fill the blanks that survived from base
  spec.states.active.announcement = ann.active;

  const interaction = useKevlarInteraction(spec, {
    onAction: async () => {},
  });

  return (
    <MantineTree
      {...mantineProps}
      {...interaction.handlers}
    />
  );
}
