import { ComponentPropsWithoutRef, PropsWithChildren } from 'react';

import * as S from './Anchor.styled';

type AnchorProps = PropsWithChildren<{
  headerStyle?: boolean;
  wrapper?: [string, string];
}> &
  ComponentPropsWithoutRef<'a'>;

export const Anchor = ({ wrapper, ...restProps }: AnchorProps) => {
  return (
    <>
      { wrapper && <WrapperComponent text={ wrapper[0] } /> }
      <AnchorComponent { ...restProps } />
      { wrapper && <WrapperComponent text={ wrapper[1] } /> }
    </>
  );
};

const AnchorComponent = ({ children, ...restProps }: AnchorProps) => <S.Anchor { ...restProps }>{ children }</S.Anchor>;

const WrapperComponent = ({ text }: { text: string }) => <S.TitleWrapper>{ text }</S.TitleWrapper>;
