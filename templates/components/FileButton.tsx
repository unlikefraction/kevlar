import { FileButton as MantineFileButton, type FileButtonProps as MantineFileButtonProps } from '@mantine/core';
import {
  baseInteractiveStates,
  baseInteractiveActions,
  baseInteractiveInput,
  baseInteractiveAnimation,
} from '../base/BaseInteractive';
import { STRING_MUST_BE_DEFINED } from '@unlikefraction/kevlar/sentinels';
import { useKevlarInteraction, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { KevlarContext, DeepPartial } from '@unlikefraction/kevlar/types';

// FileButton: reduced states — idle, hover, focused, pressed, disabled.
// No loading/success/error (the button opens a picker; upload is handled elsewhere).
// No network slots. No timing slots.

const states = {
  idle:     { ...baseInteractiveStates.idle },
  hover:    { ...baseInteractiveStates.hover },
  focused:  { ...baseInteractiveStates.focused },
  pressed:  { ...baseInteractiveStates.pressed },
  disabled: { ...baseInteractiveStates.disabled },
};

const actions = { ...baseInteractiveActions };
const input   = { ...baseInteractiveInput };

// Reduced animation — no loading/success/error transitions
const animation = {
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

export type KevlarFileButtonProps = Omit<MantineFileButtonProps<boolean>, 'children' | 'onChange'> & {
  // REQUIRED
  onFilesSelected: (files: File | File[] | null) => void;

  // OPTIONAL — override anything from the base
  states?:      DeepPartial<typeof states>;
  userActions?: Partial<typeof actions>;
  input?:       DeepPartial<typeof input>;
  animation?:   DeepPartial<typeof animation>;
  accept?:      string;
  multiple?:    boolean;
  children:     (payload: { onClick: () => void }) => React.ReactNode;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function FileButton(props: KevlarFileButtonProps) {
  const {
    onFilesSelected,
    states: so, userActions: ao, input: io, animation: animo,
    accept, multiple,
    children, ...mantineProps
  } = props;

  const spec = deepMerge(
    { states, userActions: actions, input, animation },
    { states: so, userActions: ao, input: io, animation: animo },
  );

  const interaction = useKevlarInteraction(spec, {
    onAction: async () => {},
  });

  return (
    <MantineFileButton
      accept={accept}
      multiple={multiple}
      onChange={onFilesSelected}
      {...mantineProps}
    >
      {(fileButtonProps) => children({
        onClick: () => {
          interaction.handlers.onClick?.();
          fileButtonProps.onClick?.();
        },
      })}
    </MantineFileButton>
  );
}
