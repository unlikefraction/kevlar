import { LoadingOverlay as MantineLoadingOverlay, type LoadingOverlayProps as MantineLoadingOverlayProps } from '@mantine/core';
import {
  baseOverlayStates,
  baseOverlayActions,
  baseOverlayInput,
  baseOverlayFocus,
  baseOverlayAnimation,
} from '../base/BaseOverlay';
import {
  baseFeedbackStates,
} from '../base/BaseFeedback';
import { STRING_MUST_BE_DEFINED } from '@unlikefraction/kevlar/sentinels';
import { useKevlarOverlay, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { KevlarContext, DeepPartial } from '@unlikefraction/kevlar/types';

// LoadingOverlay: composite of BaseOverlay + Loader behavior.
// - No dismiss — controlled entirely by parent (visible prop)
// - Click outside: no-op (non-interactive overlay)
// - Escape: no-op (cannot be dismissed by user)
// - Screenreader: status + polite live region (from Loader)

const states    = { ...baseOverlayStates };
const actions   = {
  ...baseOverlayActions,
  // Override: no user-initiated dismiss
  onClickOutside: () => {},
  onEscape: () => {},
  onBackdropClick: () => {},
};
const input     = { ...baseOverlayInput };
const focus     = { ...baseOverlayFocus };
const animation = { ...baseOverlayAnimation };

// Loader-specific screenreader semantics (composite)
const loaderScreenreader = {
  role: 'status' as const,
  liveRegion: 'polite' as const,
  announcement: STRING_MUST_BE_DEFINED, // what does the screenreader say?
};


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarLoadingOverlayProps = MantineLoadingOverlayProps & {
  // REQUIRED — screenreader announcement for the loading state
  announce: string;

  // OPTIONAL — override anything from the base
  states?:      DeepPartial<typeof states>;
  userActions?: Partial<typeof actions>;
  input?:       DeepPartial<typeof input>;
  animation?:   DeepPartial<typeof animation>;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function LoadingOverlay(props: KevlarLoadingOverlayProps) {
  const {
    announce: ann,
    states: so, userActions: ao, input: io, animation: animo,
    ...mantineProps
  } = props;

  const spec = deepMerge(
    { states, userActions: actions, input, focus, animation },
    { states: so, userActions: ao, input: io, animation: animo },
  );

  // Fill loader screenreader
  const sr = { ...loaderScreenreader, announcement: ann };

  const overlay = useKevlarOverlay(spec);

  return (
    <MantineLoadingOverlay
      {...mantineProps}
      {...overlay.handlers}
      style={overlay.currentVisual}
      aria-live={sr.liveRegion}
      aria-label={sr.announcement}
    />
  );
}
