import { MultiSelect as MantineMultiSelect, type MultiSelectProps as MantineMultiSelectProps } from '@mantine/core';
import {
  baseInputStates,
  baseInputActions,
  baseInputInput,
  baseInputNetwork,
  baseInputTiming,
  baseInputAnimation,
  baseInputValidation,
} from '../base/BaseInput';
import {
  baseOverlayActions,
  baseOverlayInput,
  baseOverlayFocus,
  baseOverlayAnimation,
} from '../base/BaseOverlay';
import { STRING_MUST_BE_DEFINED, FUNCTION_MUST_BE_DEFINED } from '@unlikefraction/kevlar/sentinels';
import { useKevlarInteraction, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { KevlarContext, DeepPartial } from '@unlikefraction/kevlar/types';

// MultiSelect: inherits Select pattern.
// screenreader.state.multiselectable: true
// Each selected item is a Pill (BaseInteractive). Dev fills onRemove per pill.
// keyboard.bindings.Backspace: dev decides (remove last pill?)

const states = {
  idle: {
    ...baseInputStates.idle,
    screenreader: { role: 'combobox' as const, state: { expanded: false, hasPopup: 'listbox' as const, multiselectable: true } },
  },
  hover: {
    ...baseInputStates.hover,
    screenreader: { role: 'combobox' as const, state: { expanded: false, hasPopup: 'listbox' as const, multiselectable: true } },
  },
  focused: {
    ...baseInputStates.focused,
    screenreader: { role: 'combobox' as const, state: { expanded: false, hasPopup: 'listbox' as const, multiselectable: true } },
  },
  open: {
    ...baseInputStates.focused,
    screenreader: { role: 'combobox' as const, state: { expanded: true, hasPopup: 'listbox' as const, multiselectable: true } },
  },
  filtering: {
    ...baseInputStates.typing,
    screenreader: { role: 'combobox' as const, state: { expanded: true, hasPopup: 'listbox' as const, multiselectable: true } },
  },
  loading: {
    ...baseInputStates.validating,
    screenreader: { role: 'combobox' as const, state: { expanded: true, hasPopup: 'listbox' as const, multiselectable: true } },
    announcement: STRING_MUST_BE_DEFINED,
  },
  disabled: {
    ...baseInputStates.disabled,
    screenreader: { role: 'combobox' as const, state: { expanded: false, hasPopup: 'listbox' as const, multiselectable: true, disabled: true } },
  },
};

const actions = {
  ...baseInputActions,
  onClickOutside: baseOverlayActions.onClickOutside,
  onEscape: baseOverlayActions.onEscape,
};

const input = {
  ...baseInputInput,
  keyboard: {
    ...baseInputInput.keyboard,
    bindings: {
      ...baseInputInput.keyboard.bindings,
      Escape: baseOverlayInput.keyboard.bindings.Escape,
      Backspace: FUNCTION_MUST_BE_DEFINED, // dev decides: remove last pill?
    },
    Tab: { trap: false },
  },
};

const network    = { ...baseInputNetwork };
const timing     = { ...baseInputTiming };
const animation  = { ...baseInputAnimation };
const validation = { ...baseInputValidation };
const overlay    = {
  focus: { ...baseOverlayFocus },
  animation: { ...baseOverlayAnimation },
};


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarMultiSelectProps = MantineMultiSelectProps & {
  // REQUIRED — dev-fill
  onKevlarAction: (ctx: KevlarContext) => Promise<void>;
  announce: { invalid: string; loading?: string };
  onSearch?: (query: string, ctx: KevlarContext) => void;
  onSelect?: (values: string[], ctx: KevlarContext) => void;
  onOpen?: (ctx: KevlarContext) => void;
  onNoResults?: (query: string, ctx: KevlarContext) => void;
  onRemove?: (value: string, ctx: KevlarContext) => void;

  // OPTIONAL — override anything from the base
  states?:      DeepPartial<typeof states>;
  userActions?: Partial<typeof actions>;
  input?:       DeepPartial<typeof input>;
  network?:     Partial<typeof network>;
  timing?:      Partial<typeof timing>;
  animation?:   DeepPartial<typeof animation>;
  validation?:  Partial<typeof validation>;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function MultiSelect(props: KevlarMultiSelectProps) {
  const {
    onKevlarAction, announce: ann,
    onSearch, onSelect, onOpen, onNoResults, onRemove,
    states: so, userActions: ao, input: io, network: no_,
    timing: to, animation: animo, validation: vo,
    ...mantineProps
  } = props;

  const spec = deepMerge(
    { states, userActions: actions, input, network, timing, animation, validation, overlay },
    { states: so, userActions: ao, input: io, network: no_, timing: to, animation: animo, validation: vo },
  );

  // Fill the blanks that survived from base
  if (ann.invalid) spec.states.disabled.announcement = ann.invalid;
  if (ann.loading && spec.states.loading) spec.states.loading.announcement = ann.loading;

  const interaction = useKevlarInteraction(spec, {
    onAction: onKevlarAction,
    onSearch,
    onSelect,
    onOpen,
    onNoResults,
    onRemove,
  });

  return (
    <MantineMultiSelect
      {...mantineProps}
      {...interaction.handlers}
      style={interaction.currentVisual}
      disabled={interaction.state === 'disabled'}
      error={interaction.state === 'invalid' ? interaction.errorMessage : undefined}
      value={interaction.value as string[]}
      onChange={interaction.onChange}
    />
  );
}
