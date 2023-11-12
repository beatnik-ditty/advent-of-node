import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const DISTANCE_PERCENT = 175;
const TIME_MS = 600;

type Animation = {
  transition?: 'in' | 'out';
  direction?: 'left' | 'right';
};

export const SlidingDiv = styled.div(({ transition, direction }: Animation) => ({
  ...(transition &&
    direction && {
      pointerEvents: 'none',
      animation: `${keyframes({
        from: {
          transform: `translateX(${transition === 'out' ? 0 : direction === 'right' ? -DISTANCE_PERCENT : DISTANCE_PERCENT}%)`,
        },
        to: {
          transform: `translateX(${transition === 'in' ? 0 : direction === 'right' ? DISTANCE_PERCENT : -DISTANCE_PERCENT}%)`,
        },
      })} ${TIME_MS}ms ease-${transition === 'in' ? 'out' : 'in'}`,
    }),
}));
