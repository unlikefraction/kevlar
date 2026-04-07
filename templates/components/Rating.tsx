import { Rating as MantineRating, type RatingProps as MantineRatingProps } from '@mantine/core';
import {
  baseInputStates,
  baseInputActions,
  baseInputInput,
  baseInputNetwork,
  baseInputTiming,
  baseInputAnimation,
  baseInputValidation,
} from '../base/BaseInput';
import { STRING_MUST_BE_DEFINED, NUMBER_MUST_BE_DEFINED, FUNCTION_MUST_BE_DEFINED } from '@unlikefraction/kevlar/sentinels';
import { useKevlarInteraction, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { KevlarContext, DeepPartial } from '@unlikefraction/kevlar/types';

// Rating inherits BaseInput.
// screenreader.role: radiogroup (each star is a radio).
// Dev-fill: count, allowHalf.

const states = {
  ...baseInputStates,
  idle: {
    ...baseInputStates.idle,
    screenreader: { role: 'radiogroup' as const },
  },
  hover: {
    ...baseInputStates.hover,
    screenreader: { role: 'radiogroup' as const },
  },
  focused: {
    ...baseInputStates.focused,
    screenreader: { role: 'radiogroup' as const },
  },
  typing: {
    ...baseInputStates.typing,
    screenreader: { role: 'radiogroup' as const },
  },
  valid: {
    ...baseInputStates.valid,
    screenreader: { role: 'radiogroup' as const },
  },
  invalid: {
    ...baseInputStates.invalid,
    screenreader: { role: 'radiogroup' as const },
  },
  disabled: {
    ...baseInputStates.disabled,
    screenreader: { role: 'radiogroup' as const, state: { disabled: true } },
  },
};

const actions    = { ...baseInputActions };
const input      = {
  ...baseInputInput,
  touch: {
    ...baseInputInput.touch,
    onTap: (ctx: KevlarContext, starIndex: number) => { ctx.setRating(starIndex); },
  },
  mouse: {
    ...baseInputInput.mouse,
    onHoverEnter: (ctx: KevlarContext, starIndex: number) => { ctx.previewRating(starIndex); },
    onHoverLeave: (ctx: KevlarContext) => { ctx.clearPreview(); },
  },
  keyboard: {
    ...baseInputInput.keyboard,
    bindings: {
      ...baseInputInput.keyboard.bindings,
      ArrowLeft:  (ctx: KevlarContext) => { ctx.decrement(); },
      ArrowRight: (ctx: KevlarContext) => { ctx.increment(); },
      ArrowDown:  (ctx: KevlarContext) => { ctx.decrement(); },
      ArrowUp:    (ctx: KevlarContext) => { ctx.increment(); },
    },
  },
};
const network    = { ...baseInputNetwork };
const timing     = { ...baseInputTiming };
const animation  = { ...baseInputAnimation };
const validation = { ...baseInputValidation };


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarRatingProps = MantineRatingProps & {
  // REQUIRED
  onKevlarAction: (ctx: KevlarContext) => Promise<void>;
  announce: { invalid: string };

  // OPTIONAL — override anything from the base
  states?:      DeepPartial<typeof states>;
  userActions?: Partial<typeof actions>;
  input?:       DeepPartial<typeof input>;
  network?:     Partial<typeof network>;
  timing?:      Partial<typeof timing>;
  animation?:   DeepPartial<typeof animation>;
  validation?:  Partial<typeof validation>;

  // Dev-fill: rating-specific
  count?:       number;
  allowHalf?:   boolean;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function Rating(props: KevlarRatingProps) {
  const {
    onKevlarAction, announce: ann,
    states: so, userActions: ao, input: io, network: no_,
    timing: to, animation: animo, validation: vo,
    count, allowHalf,
    ...mantineProps
  } = props;

  const spec = deepMerge(
    { states, userActions: actions, input, network, timing, animation, validation },
    { states: so, userActions: ao, input: io, network: no_, timing: to, animation: animo, validation: vo },
  );

  // Fill the blanks that survived from base
  spec.states.invalid.announcement = ann.invalid;

  const interaction = useKevlarInteraction(spec, {
    onAction: onKevlarAction,
  });

  return (
    <MantineRating
      count={count}
      fractions={allowHalf ? 2 : 1}
      {...mantineProps}
      {...interaction.handlers}
      style={interaction.currentVisual}
      readOnly={interaction.state === 'disabled'}
      value={interaction.value as number}
      onChange={interaction.onChange}
    />
  );
}
