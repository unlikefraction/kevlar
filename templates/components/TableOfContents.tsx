import {
  baseNavigationStates,
  baseNavigationActions,
  baseNavigationInput,
  baseNavigationAnimation,
} from '../base/BaseNavigation';
import { STRING_MUST_BE_DEFINED } from '@unlikefraction/kevlar/sentinels';
import { useKevlarInteraction, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { KevlarContext, DeepPartial } from '@unlikefraction/kevlar/types';

// TableOfContents: no direct Mantine component, use div-based.
// Inherits BaseNavigation.
// screenreader: { role: 'navigation', label: 'Table of contents' }
// Dev-fill: onScrollSpy.

const states = {
  idle: {
    ...baseNavigationStates.idle,
    screenreader: { role: 'navigation' as const, label: 'Table of contents' },
  },
  hover: {
    ...baseNavigationStates.hover,
    screenreader: { role: 'navigation' as const, label: 'Table of contents' },
  },
  focused: {
    ...baseNavigationStates.focused,
    screenreader: { role: 'navigation' as const, label: 'Table of contents' },
  },
  active: {
    ...baseNavigationStates.active,
    screenreader: { role: 'navigation' as const, label: 'Table of contents', state: { current: 'location' as const } },
  },
  disabled: {
    ...baseNavigationStates.disabled,
    screenreader: { role: 'navigation' as const, label: 'Table of contents', state: { disabled: true } },
  },
};

const actions   = { ...baseNavigationActions };
const input     = { ...baseNavigationInput };
const animation = { ...baseNavigationAnimation };


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarTableOfContentsProps = React.HTMLAttributes<HTMLDivElement> & {
  // REQUIRED — dev-fill
  onScrollSpy: (activeId: string, ctx: KevlarContext) => void;
  announce: { active: string };

  // OPTIONAL — override anything from the base
  states?:      DeepPartial<typeof states>;
  userActions?: Partial<typeof actions>;
  input?:       DeepPartial<typeof input>;
  animation?:   DeepPartial<typeof animation>;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function TableOfContents(props: KevlarTableOfContentsProps) {
  const {
    onScrollSpy, announce: ann,
    states: so, userActions: ao, input: io, animation: animo,
    children, ...divProps
  } = props;

  const spec = deepMerge(
    { states, userActions: actions, input, animation },
    { states: so, userActions: ao, input: io, animation: animo },
  );

  // Fill the blanks that survived from base
  spec.states.active.announcement = ann.active;

  const interaction = useKevlarInteraction(spec, {
    onAction: async (ctx: KevlarContext) => { onScrollSpy(ctx.value as string, ctx); },
  });

  return (
    <div
      role="navigation"
      aria-label="Table of contents"
      {...divProps}
      {...interaction.handlers}
      style={interaction.currentVisual}
    >
      {children}
    </div>
  );
}
