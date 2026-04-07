import { Autocomplete as MantineAutocomplete, type AutocompleteProps as MantineAutocompleteProps } from '@mantine/core';
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
import { STRING_MUST_BE_DEFINED } from '@unlikefraction/kevlar/sentinels';
import { useKevlarInteraction, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { KevlarContext, DeepPartial } from '@unlikefraction/kevlar/types';

// Autocomplete: inherits Select pattern.
// Free-text input allowed — value doesn't have to match an option.
// screenreader: { role: 'combobox', state: { expanded: false, hasPopup: 'listbox' } }

const states = {
  idle: {
    ...baseInputStates.idle,
    screenreader: { role: 'combobox' as const, state: { expanded: false, hasPopup: 'listbox' as const } },
  },
  hover: {
    ...baseInputStates.hover,
    screenreader: { role: 'combobox' as const, state: { expanded: false, hasPopup: 'listbox' as const } },
  },
  focused: {
    ...baseInputStates.focused,
    screenreader: { role: 'combobox' as const, state: { expanded: false, hasPopup: 'listbox' as const } },
  },
  open: {
    ...baseInputStates.focused,
    screenreader: { role: 'combobox' as const, state: { expanded: true, hasPopup: 'listbox' as const } },
  },
  filtering: {
    ...baseInputStates.typing,
    screenreader: { role: 'combobox' as const, state: { expanded: true, hasPopup: 'listbox' as const } },
  },
  loading: {
    ...baseInputStates.validating,
    screenreader: { role: 'combobox' as const, state: { expanded: true, hasPopup: 'listbox' as const } },
    announcement: STRING_MUST_BE_DEFINED,
  },
  disabled: {
    ...baseInputStates.disabled,
    screenreader: { role: 'combobox' as const, state: { expanded: false, hasPopup: 'listbox' as const, disabled: true } },
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

export type KevlarAutocompleteProps = MantineAutocompleteProps & {
  // REQUIRED — dev-fill
  onKevlarAction: (ctx: KevlarContext) => Promise<void>;
  announce: { invalid: string; loading?: string };
  onSearch?: (query: string, ctx: KevlarContext) => void;
  onSelect?: (value: string, ctx: KevlarContext) => void;
  onOpen?: (ctx: KevlarContext) => void;
  onNoResults?: (query: string, ctx: KevlarContext) => void;

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

export function Autocomplete(props: KevlarAutocompleteProps) {
  const {
    onKevlarAction, announce: ann,
    onSearch, onSelect, onOpen, onNoResults,
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
  });

  return (
    <MantineAutocomplete
      {...mantineProps}
      {...interaction.handlers}
      style={interaction.currentVisual}
      disabled={interaction.state === 'disabled'}
      error={interaction.state === 'invalid' ? interaction.errorMessage : undefined}
      value={interaction.value as string}
      onChange={interaction.onChange}
    />
  );
}
