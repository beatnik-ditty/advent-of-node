import styled from '@emotion/styled';
import { Outlet } from 'react-router-dom';

import { Header } from '@aon/feature-header';
import { GlobalStyles } from '@aon/ui-styles';

const StyledRoot = styled.div({
  display: 'grid',
  gridTemplate: '1fr 24fr / 1fr',
});

export const Root = () => (
  <>
    <GlobalStyles />
    <StyledRoot>
      <Header />
      <Outlet />
    </StyledRoot>
  </>
);
