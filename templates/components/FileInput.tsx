import { FileInput as MantineFileInput, type FileInputProps as MantineFileInputProps } from '@mantine/core';
import {
  baseInputStates,
  baseInputActions,
  baseInputInput,
  baseInputNetwork,
  baseInputTiming,
  baseInputAnimation,
  baseInputValidation,
} from '../base/BaseInput';
import { STRING_MUST_BE_DEFINED, FUNCTION_MUST_BE_DEFINED } from '@unlikefraction/kevlar/sentinels';
import { useKevlarInteraction, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { KevlarContext, DeepPartial } from '@unlikefraction/kevlar/types';

// FileInput inherits BaseInput.
// screenreader.role: button (it behaves like a button, not a textbox).
// Dev-fill: accept, multiple, onFilesSelected, onDragOver.

const states = {
  ...baseInputStates,
  idle: {
    ...baseInputStates.idle,
    screenreader: { role: 'button' as const },
  },
  hover: {
    ...baseInputStates.hover,
    screenreader: { role: 'button' as const },
  },
  focused: {
    ...baseInputStates.focused,
    screenreader: { role: 'button' as const },
  },
  typing: {
    ...baseInputStates.typing,
    screenreader: { role: 'button' as const },
  },
  valid: {
    ...baseInputStates.valid,
    screenreader: { role: 'button' as const },
  },
  invalid: {
    ...baseInputStates.invalid,
    screenreader: { role: 'button' as const },
  },
  disabled: {
    ...baseInputStates.disabled,
    screenreader: { role: 'button' as const, state: { disabled: true } },
  },
};

const actions    = { ...baseInputActions };
const input      = {
  ...baseInputInput,
  mouse: {
    ...baseInputInput.mouse,
    onDragAndDrop: FUNCTION_MUST_BE_DEFINED as unknown as (ctx: KevlarContext, files: File[]) => void,
  },
};
const network    = { ...baseInputNetwork };
const timing     = { ...baseInputTiming };
const animation  = { ...baseInputAnimation };
const validation = { ...baseInputValidation };


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarFileInputProps = Omit<MantineFileInputProps<boolean>, 'onChange'> & {
  // REQUIRED
  onKevlarAction:  (ctx: KevlarContext) => Promise<void>;
  onFilesSelected: (files: File | File[] | null) => void;
  announce: { invalid: string };

  // OPTIONAL — override anything from the base
  states?:      DeepPartial<typeof states>;
  userActions?: Partial<typeof actions>;
  input?:       DeepPartial<typeof input>;
  network?:     Partial<typeof network>;
  timing?:      Partial<typeof timing>;
  animation?:   DeepPartial<typeof animation>;
  validation?:  Partial<typeof validation>;

  // Dev-fill: file-specific
  accept?:      string;
  multiple?:    boolean;
  onDragOver?:  (ctx: KevlarContext) => void;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function FileInput(props: KevlarFileInputProps) {
  const {
    onKevlarAction, onFilesSelected, announce: ann,
    states: so, userActions: ao, input: io, network: no_,
    timing: to, animation: animo, validation: vo,
    accept, multiple, onDragOver,
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
    <MantineFileInput
      accept={accept}
      multiple={multiple}
      onChange={onFilesSelected}
      {...mantineProps}
      {...interaction.handlers}
      style={interaction.currentVisual}
      disabled={interaction.state === 'disabled'}
      error={interaction.state === 'invalid' ? interaction.errorMessage : undefined}
    />
  );
}
