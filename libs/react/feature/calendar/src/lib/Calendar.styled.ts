import styled from '@emotion/styled';

import { SlidingDiv } from '@aon/ui-animations';
import { Button } from '@aon/ui-components';

export const Calendar = styled.div(({ solverStatus }: { solverStatus: string }) => ({
  display: 'grid',
  gridTemplate: ' 94% 1fr / 1fr',
  rowGap: '3px',
  ...(solverStatus !== 'closed' && { pointerEvents: 'none' }),
}));

export const Grid = styled(SlidingDiv)({
  display: 'grid',
  gridTemplate: 'repeat(5, 1fr) / repeat(5, 20%)',
  gap: '1px',
  gridRow: 1,
  gridColumn: 1,
});

export const Cell = styled(Button)({
  display: 'flex',
  flexFlow: 'column wrap',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const CellTitle = styled.div({
  fontSize: '12pt',
  height: 'fit-content',
  width: 'fit-content',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  paddingBottom: '0.2em',
  color: '#cccccc',
});

export const Nav = styled.div({
  display: 'grid',
  gridTemplate: '1fr / repeat(4, 1fr)',
  justifyContent: 'space-between',
  alignItems: 'center',
  whiteSpace: 'nowrap',
  columnGap: '1px',
});

export const NavButton = styled(Button)<{ disabled: boolean }>(({ disabled }) => ({
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '1.8em',
  fontWeight: 'bold',
  ...(disabled && { backgroundColor: '#020230' }),
  ...(!disabled && {
    color: '#00cc00',
    '&:hover': {
      color: '#99ff99',
    },
  }),
}));
