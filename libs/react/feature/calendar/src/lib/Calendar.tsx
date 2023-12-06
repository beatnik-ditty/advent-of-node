import { FC, PropsWithChildren, useEffect, useState } from 'react';

import { useCreateCalendarMutation, useFetchCalendarQuery } from '@aon/data-access-api';
import { endYearChange, startYearChange, updatePresentDate } from '@aon/data-access-calendar';
import { openSolver } from '@aon/data-access-solver';
import { useAppDispatch, useAppSelector } from '@aon/data-access-store';
import { Banner } from '@aon/ui-components';
import { getFirstYear, getPresentDate, timeUntilMidnight } from '@aon/util-date';
import { CalendarDay } from '@aon/util-types';
import * as S from './Calendar.styled';

type CalendarProps = { year: number; previousYear: number };

export const Calendar: FC = props => {
  const { status: solverStatus } = useAppSelector(state => state.solver);

  return /^(?:closing|opening|closed)$/.test(solverStatus) ? (
    <S.Calendar { ...{ solverStatus, ...props } }>
      <GridDisplay />
      <YearNav />
    </S.Calendar>
  ) : null;
};

const GridDisplay = () => {
  const { year, previousYear } = useAppSelector(state => state.calendar);
  return previousYear === year ? <SingleGrid { ...{ year } } /> : <AnimatedGrids { ...{ year, previousYear } } />;
};

const AnimatedGrids = ({ year, previousYear }: CalendarProps) => {
  const dispatch = useAppDispatch();
  const onAnimationEnd = () => dispatch(endYearChange());
  const direction = previousYear < year ? 'left' : 'right';
  return (
    <>
      <SingleGrid
        { ...{
          direction,
          transition: 'in',
          year,
          onAnimationEnd,
        } }
      />
      <SingleGrid
        { ...{
          direction,
          transition: 'out',
          year: previousYear,
        } }
      />
    </>
  );
};

const SingleGrid: FC<{ year: number }> = ({ year, ...restProps }) => (
  <S.Grid { ...restProps }>
    { [...Array(25)].map((_, day) => {
      return <Cell key={ day } year={ year } day={ day + 1 } />;
    }) }
  </S.Grid>
);

const Cell = ({ year, day }: CalendarDay) => {
  const dispatch = useAppDispatch();
  const { presentYear, presentDay } = useAppSelector(state => state.calendar);
  const { data: calendar, isLoading } = useFetchCalendarQuery({ year });
  const [createCalendar, { isUninitialized }] = useCreateCalendarMutation({ fixedCacheKey: `calendar${year}` });

  useEffect(
    function createPageIfAbsent() {
      if (day === 1 && !isLoading && !calendar?.days?.length && isUninitialized) {
        createCalendar({ year });
      }
    },
    [calendar, year, day, isLoading, createCalendar, isUninitialized],
  );

  const { stars, title } = calendar?.days?.[day - 1] ?? {};

  const handleClick = () => {
    !isLoading && dispatch(openSolver(day));
  };

  const isDisabled = year === presentYear && day > presentDay;
  const hasCountdown = year === presentYear && day === presentDay + 1;

  return (
    <S.Cell customLayout onClick={ handleClick } disabled={ isDisabled }>
      <Banner { ...{ day, stars } } />
      { hasCountdown ? <Countdown /> : title ? <S.CellTitle>{ title }</S.CellTitle> : null }
    </S.Cell>
  );
};

const Countdown = () => {
  const [time, setTime] = useState('');
  const { presentDay } = useAppSelector(state => state.calendar);
  const dispatch = useAppDispatch();

  useEffect(
    function trackTime() {
      const tick = () => {
        const { h, m, s, ms } = timeUntilMidnight();
        if (h >= 0) {
          setTime(`${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? 0 : ''}${s}`);
          timeout = setTimeout(() => tick(), ms);
        } else {
          const { day } = getPresentDate();
          presentDay !== day && dispatch(updatePresentDate());
          timeout = setTimeout(() => tick(), 60 * 1000);
        }
      };
      let timeout: ReturnType<typeof setTimeout>;
      tick();

      return () => clearTimeout(timeout);
    },
    [dispatch, presentDay],
  );

  return <S.CellTitle>{ time }</S.CellTitle>;
};

const navLabels = ['<<', '<', '>', '>>'];
const navYears = [() => getFirstYear(), (year: number) => year - 1, (year: number) => year + 1, () => getPresentDate().year];
const YearNav = () => {
  return (
    <S.Nav>
      { [...Array(4)].map((_, index) => (
        <NavButton key={ index } { ...{ index } }>
          { navLabels[index] }
        </NavButton>
      )) }
    </S.Nav>
  );
};

const NavButton: FC<{ index: number } & PropsWithChildren> = ({ index, ...restProps }) => {
  const { year, presentYear } = useAppSelector(state => state.calendar);
  const { status: solverStatus } = useAppSelector(state => state.solver);
  const dispatch = useAppDispatch();

  const targetYear = navYears[index](year);
  const isDisabled = targetYear < getFirstYear() || targetYear > presentYear || targetYear === year;

  return (
    <S.NavButton
      disabled={ isDisabled }
      tooltip={ !isDisabled && solverStatus === 'closed' && `${targetYear}` }
      onClick={ () => dispatch(startYearChange(targetYear)) }
      { ...restProps }
    />
  );
};
