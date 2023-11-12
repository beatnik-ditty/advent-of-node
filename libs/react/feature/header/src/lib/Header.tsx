import { FC } from 'react';

import { useFetchCalendarQuery, useUpdateCalendarMutation, useUpdatePuzzleMutation } from '@aon/data-access-api';
import { useAppSelector } from '@aon/data-access-store';
import { Anchor } from '@aon/ui-components';
import * as S from './Header.styled';

const aonTitle = 'Advent of Node';
const { VITE_AOC_URL } = import.meta.env;

export const Header: FC = props => (
  <S.Header { ...props }>
    <S.HeaderBlock>
      <TopRow />
      <BottomRow />
    </S.HeaderBlock>
    <S.HeaderFlex>
      <StarCount />
      <RefetchButton />
    </S.HeaderFlex>
  </S.Header>
);

const TopRow = () => (
  <S.Row>
    <GlobalTitle />
    <Nav links={ [{ text: 'About', url: '/about' }] } />
  </S.Row>
);

const BottomRow = () => {
  const { year } = useAppSelector(state => state.calendar);
  return (
    <S.Row>
      <EventTitle />
      <Nav links={ [{ text: 'Calendar', url: `/${year}`, external: true }] } />
    </S.Row>
  );
};

const GlobalTitle = () => (
  <S.H1>
    <Anchor href={ '/' } rel='noreferrer' headerStyle>
      { aonTitle }
    </Anchor>
  </S.H1>
);

const EventTitle = () => {
  const event = `${useAppSelector(state => state.calendar.year)}`;
  return (
    <S.H1>
      <Anchor href={ `${VITE_AOC_URL}/${event}` } target='_blank' rel='noreferrer' headerStyle { ...{ wrapper } }>
        { event }
      </Anchor>
    </S.H1>
  );
};

const Nav: FC<{ links: { text: string; url: string; external?: boolean }[] }> = ({ links }) => (
  <S.Nav>
    <S.Ul>
      { links.map(({ text, url, external }, index) => (
        <S.Li key={ index }>
          <Anchor { ...(external ? { href: `${VITE_AOC_URL}${url}`, target: '_blank' } : { href: url }) }>{ `[${text}]` }</Anchor>
        </S.Li>
      )) }
    </S.Ul>
  </S.Nav>
);

const titleWrappers: [string, string][] = [
  ['          ', ''],
  ['        //', ''],
  ['       λy.', ''],
  ['       y(', ')'],
  ['      /*', '*/'],
  ['      /^', '$/'],
  ['   $year=', ';'],
  ['   <y>', '</y>'],
  ['   0x0000|', ''],
  ['   0xffff&', ''],
  ['   int y=', ';'],
  ['   var y=', ';'],
  ['   sub y{', '}'],
  ['  {year=>', '}'],
  ['  {:year ', '}'],
  ['  0.0.0.0:', ''],
  [" {'year':", '}'],
];

const wrapper = titleWrappers[Math.floor(Math.random() * 17)];

const StarCount = () => {
  const { year } = useAppSelector(state => state.calendar);
  const { data: { totalStars } = {} } = useFetchCalendarQuery({ year });

  return <S.StarCount>{ totalStars || '' }</S.StarCount>;
};

const RefetchButton = () => {
  const { year } = useAppSelector(state => state.calendar);
  const { status: solverStatus, day } = useAppSelector(state => state.solver);
  const [updateStars] = useUpdateCalendarMutation();
  const [updatePuzzle] = useUpdatePuzzleMutation();

  const toFetch = solverStatus === 'closed' ? 'stars' : solverStatus === 'opened' && 'puzzle';

  const handleClick = () => {
    solverStatus === 'closed' && window.confirm('Fetch latest star counts?') && updateStars({ year });
    solverStatus === 'opened' && window.confirm('Fetch latest puzzle updates?') && updatePuzzle({ year, day });
  };

  return (
    <S.RefetchButton onClick={ handleClick } tooltip={ toFetch && `Refetch ${toFetch}` } left>
      *
    </S.RefetchButton>
  );
};
