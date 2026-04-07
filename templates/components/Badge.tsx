import { Badge as MantineBadge, type BadgeProps as MantineBadgeProps } from '@mantine/core';
import { baseStaticStates, baseStaticInput } from '../base/BaseStatic';
import {
  baseInteractiveStates,
  baseInteractiveActions,
  baseInteractiveInput,
  baseInteractiveAnimation,
} from '../base/BaseInteractive';
import { useKevlarStatic, useKevlarInteraction, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { KevlarContext, DeepPartial } from '@unlikefraction/kevlar/types';

// Badge: inherits BaseStatic.
// When removable: remove button is a child BaseInteractive.
// Dev-fill (removable): onRemove.

const states = { ...baseStaticStates };
const input  = { ...baseStaticInput };

// Remove button states (subset of interactive)
const removeStates = {
  idle:     { ...baseInteractiveStates.idle },
  hover:    { ...baseInteractiveStates.hover },
  focused:  { ...baseInteractiveStates.focused },
  pressed:  { ...baseInteractiveStates.pressed },
  disabled: { ...baseInteractiveStates.disabled },
};
const removeActions   = { ...baseInteractiveActions };
const removeInput     = { ...baseInteractiveInput };
const removeAnimation = {
  enter: baseInteractiveAnimation.enter,
  exit:  baseInteractiveAnimation.exit,
  transitions: {
    idle_to_hover:   baseInteractiveAnimation.transitions.idle_to_hover,
    hover_to_idle:   baseInteractiveAnimation.transitions.hover_to_idle,
    idle_to_pressed: baseInteractiveAnimation.transitions.idle_to_pressed,
  },
  microFeedback: baseInteractiveAnimation.microFeedback,
};


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarBadgeProps = MantineBadgeProps & {
  // OPTIONAL — provide to make the badge removable
  onRemove?: (ctx: KevlarContext) => void;

  // OPTIONAL — override base
  states?: DeepPartial<typeof states>;
  input?:  DeepPartial<typeof input>;

  // OPTIONAL — override remove button behavior
  removeStates?:    DeepPartial<typeof removeStates>;
  removeActions?:   Partial<typeof removeActions>;
  removeInput?:     DeepPartial<typeof removeInput>;
  removeAnimation?: DeepPartial<typeof removeAnimation>;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function Badge(props: KevlarBadgeProps) {
  const {
    onRemove,
    states: so, input: io,
    removeStates: rso, removeActions: rao, removeInput: rio, removeAnimation: ranimo,
    children, ...mantineProps
  } = props;

  const spec = deepMerge({ states, input }, { states: so, input: io });
  const staticCtx = useKevlarStatic(spec);

  // Build remove handler if removable
  let removeHandler: (() => void) | undefined;
  if (onRemove) {
    const removeSpec = deepMerge(
      { states: removeStates, userActions: removeActions, input: removeInput, animation: removeAnimation },
      { states: rso, userActions: rao, input: rio, animation: ranimo },
    );
    const removeInteraction = useKevlarInteraction(removeSpec, {
      onAction: async (ctx: KevlarContext) => { onRemove(ctx); },
    });
    removeHandler = removeInteraction.handlers.onClick;
  }

  return (
    <MantineBadge
      {...mantineProps}
      {...staticCtx.handlers}
      rightSection={onRemove ? (
        <span
          role="button"
          aria-label="Remove"
          tabIndex={0}
          onClick={removeHandler}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') removeHandler?.(); }}
          style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
        >
          x
        </span>
      ) : mantineProps.rightSection}
    >
      {children}
    </MantineBadge>
  );
}
