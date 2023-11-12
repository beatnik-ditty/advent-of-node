import styled from '@emotion/styled';

import { Calendar } from '@aon/feature-calendar';
import { Solver } from '@aon/feature-solver';

export const App = () => {
  return (
    <>
      <StyledCalendar />
      <StyledSolver />
    </>
  );
};

const StyledCalendar = styled(Calendar)({
  gridColumn: 1,
  gridRow: 2,
});

const StyledSolver = styled(Solver)({
  gridColumn: 1,
  gridRow: 2,
});
