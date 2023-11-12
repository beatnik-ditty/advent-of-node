import styled from '@emotion/styled';

import { Button } from '@aon/ui-components';

export const Header = styled.header({
  display: 'grid',
  gridTemplate: '1fr / 6fr 1fr',
  WebkitTextSizeAdjust: 'none',
});

export const HeaderBlock = styled.div({
  width: 'auto',
  display: 'block',
});

export const HeaderFlex = styled.div({
  width: 'auto',
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: '0.25em',
});

export const StarCount = styled.span({
  color: '#ffff00',
  fontSize: '1.2em',
});

export const RefetchButton = styled(Button)({
  fontSize: '2em',
  height: '1em',
  width: '1em',
  justifySelf: 'end',
  alignSelf: 'center',
  marginRight: '0.25em',
  backgroundColor: 'black',
  color: '#ffff66',
  borderRadius: '0.2em',
});

export const Row = styled.div({
  height: '50%',
  whiteSpace: 'nowrap',
  cursor: 'default',
});

export const H1 = styled.h1({
  display: 'inline-block',
  margin: 0,
  paddingRight: '1em',
  fontSize: '1em',
  fontWeight: 'normal',
});

export const Nav = styled.nav({
  display: 'inline-block',
  listStyleType: 'none',
  padding: 0,
  margin: 0,
  paddingRight: '0.6em',
});

export const Ul = styled.ul({
  listStyleType: 'none',
  padding: 0,
  margin: 0,
});

export const Li = styled.li({
  display: 'inline-block',
  paddingLeft: '0.6em',
  paddingRight: '0.6em',
});
