import styled from '@emotion/styled';

export const Tooltip = styled.div(({ left }: { left?: boolean }) => ({
  position: 'absolute',
  backgroundColor: 'black',
  visibility: 'hidden',
  transform: left ? 'translateX(-100%) translateX(-5px)' : 'translateY(-100%) translateY(-5px)',
  color: 'white',
  height: 'fit-content',
  width: 'fit-content',
  zIndex: 1000,
}));
