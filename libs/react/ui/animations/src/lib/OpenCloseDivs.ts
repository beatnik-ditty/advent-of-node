import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const TIME_MS = 800;
const ROWS = 5;
const COLUMNS = 5;
const PERCENT_SCALE_Y = 94;

const WIDTH = 100 / COLUMNS;
const HEIGHT = PERCENT_SCALE_Y / ROWS;
const BOTTOM_GAP = 100 - PERCENT_SCALE_Y;
const SQUARES_TO_LEFT = (COLUMNS - 1) / 2;
const SQUARES_ABOVE = (ROWS - 1) / 2;

type Animation = {
  transition?: 'opening' | 'closing';
  day?: number;
};

const resizeTransform = ({ day = 0 }: Animation) => ({
  height: `${HEIGHT}%`,
  width: `${WIDTH}%`,
  left: `${WIDTH * ((day - 1) % COLUMNS)}%`,
  top: `${HEIGHT * Math.floor((day - 1) / ROWS)}%`,
});

export const ResizeDiv = styled.div(({ transition, day }: Animation) => ({
  ...(transition &&
    day && {
      animation: `${keyframes({
        from: { ...(transition === 'opening' && resizeTransform({ day })) },
        to: { ...(transition === 'closing' && resizeTransform({ day })) },
      })} ${TIME_MS}ms ease-in-out`,
    }),
}));

const scaleTransform = ({ day = 0 }: Animation) => ({
  transform: `translate(${WIDTH * (((day - 1) % COLUMNS) - SQUARES_TO_LEFT)}%, ${
    HEIGHT * Math.floor((day - 1) / ROWS - SQUARES_ABOVE) - BOTTOM_GAP / 2
  }%) scale(${WIDTH}%, ${HEIGHT}%)`,
  backgroundColor: '#020230',
});

export const ScaleDiv = styled.div(({ transition, day }: Animation) => ({
  ...(transition &&
    day && {
      animation: `${keyframes({
        from: { ...(transition === 'opening' && scaleTransform({ day })) },
        to: { ...(transition === 'closing' && scaleTransform({ day })) },
      })} ${TIME_MS}ms ease-in-out`,
    }),
}));

export const FadeDiv = styled.div(({ transition }: Animation) => ({
  ...(transition && {
    animation: `${keyframes({
      from: { ...(transition === 'opening' && { opacity: 0 }) },
      to: { ...(transition === 'closing' && { opacity: 0 }) },
    })} ${TIME_MS}ms ease-in-out`,
  }),
}));

const StyledTitle = styled.div({
  fontSize: '12pt',
  height: 'fit-content',
  width: 'fit-content',
  marginLeft: 'auto',
  marginRight: 'auto',
  marginTop: 'auto',
  whiteSpace: 'pre',
  overflow: 'hidden',
  color: '#cccccc',
  marginBottom: '0.2em',
  opacity: '0%',
});

export const TitleDiv = styled(StyledTitle)(({ transition }: Animation) => {
  return {
    animation: `${keyframes({
      ...(transition === 'opening' && { '0%': { opacity: '100%' }, '25%': { opacity: '0%' } }),
      ...(transition === 'closing' && { '75%': { opacity: '0%' }, '100%': { opacity: '100%' } }),
    })} ${TIME_MS}ms`,
  };
});
