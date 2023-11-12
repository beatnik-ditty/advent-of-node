import { ComponentPropsWithoutRef } from 'react';

import { withTooltip } from '@aon/ui-decorators';
import * as S from './Button.styled';

const ButtonComponent = ({ children, ...restProps }: ComponentPropsWithoutRef<'div'>) => {
  return <S.Button { ...restProps }>{ children }</S.Button>;
};

export const Button = withTooltip(ButtonComponent);
