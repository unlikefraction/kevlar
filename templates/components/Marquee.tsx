import { baseStaticStates, baseStaticInput } from '../base/BaseStatic';
import { useKevlarStatic, deepMerge } from '@unlikefraction/kevlar/runtime';
import { prefersReducedMotion } from '@unlikefraction/kevlar/primitives';
import type { DeepPartial } from '@unlikefraction/kevlar/types';

// Marquee: custom component (not in Mantine).
// Inherits BaseStatic.
// Animation: linear scroll loop.
// reduced_motion → stops, shows all content statically.

const states = { ...baseStaticStates };
const input  = { ...baseStaticInput };

const marqueeAnimation = {
  type: 'linear-scroll' as const,
  direction: 'left' as const,
  speed: 50,
  pauseOnHover: true,
};


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarMarqueeProps = {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  speed?: number;
  pauseOnHover?: boolean;
  states?: DeepPartial<typeof states>;
  input?:  DeepPartial<typeof input>;
  animation?: Partial<typeof marqueeAnimation>;
  className?: string;
  style?: React.CSSProperties;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function Marquee(props: KevlarMarqueeProps) {
  const {
    direction, speed, pauseOnHover,
    states: so, input: io, animation: animo,
    children, ...restProps
  } = props;

  const spec = deepMerge({ states, input }, { states: so, input: io });
  const staticCtx = useKevlarStatic(spec);

  const anim = deepMerge({ ...marqueeAnimation }, animo ?? {});
  if (direction) anim.direction = direction;
  if (speed != null) anim.speed = speed;
  if (pauseOnHover != null) anim.pauseOnHover = pauseOnHover;

  // reduced_motion → stop animation, show all content statically
  const shouldAnimate = !prefersReducedMotion();

  const marqueeStyle: React.CSSProperties = shouldAnimate
    ? {
        overflow: 'hidden',
        whiteSpace: 'nowrap' as const,
        ...restProps.style,
      }
    : {
        overflow: 'visible',
        whiteSpace: 'normal' as const,
        ...restProps.style,
      };

  return (
    <div
      className={restProps.className}
      style={marqueeStyle}
      aria-live="off"
      {...staticCtx.handlers}
    >
      <div
        style={shouldAnimate ? {
          display: 'inline-block',
          animation: `kevlar-marquee-${anim.direction} ${anim.speed}s linear infinite`,
        } : undefined}
      >
        {children}
      </div>
    </div>
  );
}
