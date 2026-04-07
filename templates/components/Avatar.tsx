import { Avatar as MantineAvatar, type AvatarProps as MantineAvatarProps } from '@mantine/core';
import {
  baseMediaStates,
  baseMediaNetwork,
  baseMediaFallback,
  baseMediaAnimation,
} from '../base/BaseMedia';
import { useKevlarMedia, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { KevlarContext, DeepPartial } from '@unlikefraction/kevlar/types';

// Avatar: inherits BaseMedia.
// Fallback chain: onImageError → show initials → onInitialsError → show placeholder.
// Size enforcement always on — Avatar always has a fixed size from Mantine.

const states    = { ...baseMediaStates };
const network   = { ...baseMediaNetwork };
const fallback  = { ...baseMediaFallback };
const animation = { ...baseMediaAnimation };


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarAvatarProps = MantineAvatarProps & {
  // OPTIONAL — fallback handlers
  onImageError?: (ctx: KevlarContext) => void;
  onInitialsError?: (ctx: KevlarContext) => void;

  // OPTIONAL — override anything from the base
  states?:    DeepPartial<typeof states>;
  network?:   Partial<typeof network>;
  fallback?:  DeepPartial<typeof fallback>;
  animation?: DeepPartial<typeof animation>;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function Avatar(props: KevlarAvatarProps) {
  const {
    onImageError, onInitialsError,
    states: so, network: no_, fallback: fo, animation: animo,
    children, ...mantineProps
  } = props;

  const spec = deepMerge(
    { states, network, fallback, animation },
    { states: so, network: no_, fallback: fo, animation: animo },
  );

  const media = useKevlarMedia(spec, {
    onImageError,
    onInitialsError,
  });

  return (
    <MantineAvatar
      {...mantineProps}
      {...media.handlers}
      style={media.currentVisual}
      onError={media.onError}
    >
      {children}
    </MantineAvatar>
  );
}
