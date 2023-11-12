import styled from '@emotion/styled';

export const Banner = styled.div({
  display: 'block',
  fontSize: '1.5em',
  padding: '0.25em',
  paddingTop: '0.1em',
  height: '1.5em',
});

const Span = styled.span({
  display: 'inline-block',
  textAlign: 'left',
});

export const DaySpan = styled(Span)({
  float: 'left',
});

export const StarSpan = styled(Span)({
  whiteSpace: 'pre',
  color: '#ffff66',
  float: 'right',
});
