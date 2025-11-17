import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const TIME_MS = 800;
const PERCENT_SCALE_Y = 94;
const BOTTOM_GAP = 100 - PERCENT_SCALE_Y;

type Animation = {
  transition?: 'opening' | 'closing';
  day?: number;
  year?: number;
};

const gridParams = (year: number) => {
  const [rows, cols] = year < 2025 ? [5, 5] : [3, 4];
  const height = PERCENT_SCALE_Y / rows;
  const width = 100 / cols;
  const squaresAbove = (rows - 1) / 2;
  const squaresToLeft = (cols - 1) / 2;
  return { cols, height, width, squaresAbove, squaresToLeft };
};

const resizeTransform = ({ day = 0, year = 2015 }: Animation) => {
  const { cols, height, width } = gridParams(year);
  return {
    height: `${height}%`,
    width: `${width}%`,
    left: `${width * ((day - 1) % cols)}%`,
    top: `${height * Math.floor((day - 1) / cols)}%`,
  };
};

export const ResizeDiv = styled.div(({ transition, day, year }: Animation) => ({
  ...(transition &&
    day && {
      animation: `${keyframes({
        from: { ...(transition === 'opening' && resizeTransform({ day, year })) },
        to: { ...(transition === 'closing' && resizeTransform({ day, year })) },
      })} ${TIME_MS}ms ease-in-out`,
    }),
}));

const scaleTransform = ({ day = 0, year = 2015 }: Animation) => {
  const { cols, height, width, squaresAbove, squaresToLeft } = gridParams(year);
  return {
    transform: `translate(${width * (((day - 1) % cols) - squaresToLeft)}%, ${
      height * Math.floor((day - 1) / cols - squaresAbove) - BOTTOM_GAP / 2
    }%) scale(${width}%, ${height}%)`,
    backgroundColor: '#020230',
  };
};

export const ScaleDiv = styled.div(({ transition, day, year }: Animation) => ({
  ...(transition &&
    day && {
      animation: `${keyframes({
        from: { ...(transition === 'opening' && scaleTransform({ day, year })) },
        to: { ...(transition === 'closing' && scaleTransform({ day, year })) },
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
