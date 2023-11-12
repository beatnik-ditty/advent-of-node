import styled from '@emotion/styled';

export const Anchor = styled.a<{ headerStyle?: boolean }>(({ headerStyle }) => ({
  color: '#00cc00',
  textDecoration: 'none',
  outline: 'none',
  display: 'inline-block',

  '&:hover': {
    color: '#99ff99',
  },

  ...(headerStyle && {
    textShadow: '0 0 2px #00cc00, 0 0 5px #00cc00',
  }),
}));

export const TitleWrapper = styled.span({
  opacity: '0.33',
  whiteSpace: 'pre',
  textShadow: '0 0 2px #00cc00, 0 0 5px #00cc00',
  color: '#00cc00',
});
