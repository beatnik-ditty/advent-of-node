import styled from '@emotion/styled';

export const Button = styled.div<{ disabled?: boolean; noTransform?: boolean; customLayout?: boolean }>(
  ({ disabled, noTransform, customLayout }) => ({
    cursor: 'default',
    display: 'flex',
    textDecoration: 'none',
    outline: 'none',
    backgroundColor: '#020230',
    ...(!disabled
      ? {
          color: '#cccccc',
          border: '1px solid gray',
          '&:hover': {
            color: '#ffffff',
            border: '1px solid dimgray',
          },
          ...(!noTransform && {
            '&:active': {
              transform: 'scale(0.98)',
            },
          }),
        }
      : {
          pointerEvents: 'none',
          color: '#666666',
          border: '1px solid dimgray',
        }),
    ...(!customLayout && {
      justifyContent: 'center',
      alignItems: 'center',
    }),
  }),
);
