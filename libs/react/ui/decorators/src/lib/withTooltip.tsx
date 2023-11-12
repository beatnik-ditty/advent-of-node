import { ComponentPropsWithoutRef, ElementType, PointerEvent, PropsWithChildren, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import * as S from './withTooltip.styled';

const tooltipContainer = document.querySelector('#tooltip-container') as HTMLElement;

const Tooltip = ({ children, left }: PropsWithChildren & { left?: boolean }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  if (!ref.current) ref.current = document.createElement('div');

  useEffect(function bindPointerListener() {
    const tooltip = ref.current as HTMLElement;
    const handler = (e: PointerEventInit) => {
      const x = e.clientX;
      const y = e.clientY;
      tooltip.style.left = `${x}px`;
      tooltip.style.top = `${y}px`;
      tooltip.style.visibility = 'visible';
    };
    document.addEventListener('pointermove', handler);
    return () => {
      document.removeEventListener('pointermove', handler);
    };
  }, []);

  return <>{ createPortal(<S.Tooltip { ...{ ref, left } }>{ children }</S.Tooltip>, tooltipContainer) }</>;
};

type PointerHandler = (event: PointerEvent<HTMLElement>) => void;

type TooltipContainerProps = {
  tooltip?: string | boolean;
  left?: boolean;
  onPointerEnter?: PointerHandler;
  onPointerLeave?: PointerHandler;
};

type Props<C extends ElementType> = PropsWithChildren<TooltipContainerProps> &
  Omit<ComponentPropsWithoutRef<C>, keyof TooltipContainerProps>;

export const withTooltip = (Component: ElementType) => {
  return <C extends ElementType>({ children, tooltip, left, onPointerEnter, onPointerLeave, ...restProps }: Props<C>) => {
    const [showTooltip, setShowTooltip] = useState(false);

    const handlePointerEnter: PointerHandler = event => {
      setShowTooltip(true);
      onPointerEnter?.(event);
    };

    const handlePointerLeave: PointerHandler = event => {
      setShowTooltip(false);
      onPointerLeave?.(event);
    };

    return (
      <Component onPointerEnter={ handlePointerEnter } onPointerLeave={ handlePointerLeave } { ...restProps }>
        { tooltip && showTooltip && <Tooltip { ...{ left } }>{ tooltip }</Tooltip> }
        { children }
      </Component>
    );
  };
};
