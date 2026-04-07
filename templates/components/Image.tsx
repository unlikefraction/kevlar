import { Image as MantineImage, type ImageProps as MantineImageProps } from '@mantine/core';
import {
  baseMediaStates,
  baseMediaNetwork,
  baseMediaFallback,
  baseMediaAnimation,
} from '../base/BaseMedia';
import { useKevlarMedia, deepMerge } from '@unlikefraction/kevlar/runtime';
import type { KevlarContext, DeepPartial } from '@unlikefraction/kevlar/types';

// Image: inherits BaseMedia.
// Dev-fill: alt (required), width+height or aspectRatio (required),
// network handlers, fallback.onError, onPinchZoom.
// Shame props for skipping accessibility and layout shift prevention.

const states    = { ...baseMediaStates };
const network   = { ...baseMediaNetwork };
const fallback  = { ...baseMediaFallback };
const animation = { ...baseMediaAnimation };


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarImageProps = MantineImageProps & {
  // REQUIRED — accessibility and layout
  alt: string;

  // REQUIRED — one of these must be provided to prevent CLS
  width?: number | string;
  height?: number | string;
  aspectRatio?: string;

  // OPTIONAL — override anything from the base
  states?:    DeepPartial<typeof states>;
  network?:   Partial<typeof network>;
  fallback?:  DeepPartial<typeof fallback>;
  animation?: DeepPartial<typeof animation>;
  onPinchZoom?: (ctx: KevlarContext) => void;

  // Escape hatches — deliberately ugly names
  badly_skip_alt_text_and_hurt_accessibility?: boolean;
  badly_allow_layout_shift_and_dont_define_size?: boolean;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function Image(props: KevlarImageProps) {
  const {
    alt, width, height, aspectRatio, onPinchZoom,
    states: so, network: no_, fallback: fo, animation: animo,
    badly_skip_alt_text_and_hurt_accessibility: skipAlt,
    badly_allow_layout_shift_and_dont_define_size: skipSize,
    ...mantineProps
  } = props;

  // Validate alt text
  if (!alt && !skipAlt) {
    throw new Error(
      'Kevlar: Image requires `alt` text for accessibility. ' +
      'Pass `alt="Description of image"` or, if decorative, pass `alt=""`. ' +
      'To skip this check, pass `badly_skip_alt_text_and_hurt_accessibility={true}`.',
    );
  }

  // Validate size definition (prevents CLS)
  if (!width && !height && !aspectRatio && !skipSize) {
    throw new Error(
      'Kevlar: Image requires `width`+`height` or `aspectRatio` to prevent layout shift. ' +
      'To skip this check, pass `badly_allow_layout_shift_and_dont_define_size={true}`.',
    );
  }

  const spec = deepMerge(
    { states, network, fallback, animation },
    { states: so, network: no_, fallback: fo, animation: animo },
  );

  const media = useKevlarMedia(spec);

  const sizeStyle = aspectRatio
    ? { aspectRatio, width: width ?? '100%' }
    : { width, height };

  return (
    <MantineImage
      alt={alt}
      {...mantineProps}
      {...media.handlers}
      style={{ ...sizeStyle, ...media.currentVisual }}
      onError={media.onError}
    />
  );
}
