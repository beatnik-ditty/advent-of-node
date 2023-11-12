import { FC } from 'react';

import * as S from './Banner.styled';

/* eslint-disable-next-line */
export interface BannerProps {
  day: number;
  stars?: number;
  title?: string;
}

export const Banner: FC<BannerProps> = ({ day, stars = 0, ...restProps }) => {
  return (
    <S.Banner { ...restProps }>
      <S.DaySpan>{ day }</S.DaySpan>
      <S.StarSpan>
        { '*'.repeat(stars) }
        { ' '.repeat(2 - stars) }
      </S.StarSpan>
    </S.Banner>
  );
};
