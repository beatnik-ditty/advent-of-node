import styled from '@emotion/styled';

import { FadeDiv, ResizeDiv, ScaleDiv, SlidingDiv } from '@aon/ui-animations';
import { Button } from '@aon/ui-components';

export const SolverWindow = styled.div({
  position: 'relative',
  display: 'grid',
});

export const SolverContainer = styled(SlidingDiv)({
  gridRow: 1,
  gridColumn: 1,
});

export const BannerContainer = styled(ResizeDiv)({
  color: '#cccccc',
  position: 'absolute',
  height: '100%',
  width: '100%',
  top: '0%',
  left: '0%',
  zIndex: 101,
  pointerEvents: 'none',
  border: '1px solid gray',
  display: 'grid',
  gridTemplate: '2.5em 1fr / 1fr',
});

export const SolverPane = styled(ScaleDiv)({
  zIndex: 100,
  position: 'absolute',
  background: '#0f0f24',
  border: '1px solid transparent',
});

export const SolverBody = styled(FadeDiv)({
  gridRow: 2,
  gridColumn: 1,
  display: 'grid',
  gridTemplate: '2.5em 1fr / 50% 50%',
});

export const Menu = styled.div({
  padding: '3px',
  display: 'grid',
  gridTemplate: '1fr / repeat(4, 1fr)',
  columnGap: '1px',
});

export const NavMenu = styled(Menu)({
  paddingLeft: '5em',
  gridTemplate: '1fr / repeat(4, 1fr)',
});

export const MainMenu = styled(Menu)({
  paddingRight: '5em',
  height: '100%',
});

export const MenuButton = styled(Button)({
  overflow: 'hidden',
  height: '100%',
});

export const DropdownContainer = styled.div({
  position: 'relative',
  display: 'inline-block',
  zIndex: 1000,
});

export const DropdownList = styled.div({
  position: 'absolute',
  display: 'inline',
});

export const DropdownButton = styled(MenuButton)(({ disabled }) => ({
  position: 'relative',
  width: '15em',
  height: '2em',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  ...(disabled
    ? { pointerEvents: 'auto', '$:active': { outline: 0 } }
    : {
        '&:active': {
          transform: '',
        },
      }),
}));

export const DropdownOptionSpan = styled.span({
  display: 'flex',
});

const InternalDropdownButton = styled(Button)({
  width: '1em',
  height: '1em',
  margin: '0.2em',
  fontWeight: 'bolder',
  color: '#020230',
});

export const ReorderButton = styled(InternalDropdownButton)({
  backgroundColor: 'gray',
});

export const DeleteButton = styled(InternalDropdownButton)({
  backgroundColor: 'red',
});

export const ExternalButton = styled(MenuButton)({
  color: '#00cc00',
  '&:hover': {
    color: '#99ff99',
  },
});

export const NavButton = styled(MenuButton)({
  fontSize: '1.5em',
  justifySelf: 'flex-start',
});

export const StarSpan = styled.span({
  color: '#ffff66',
  fontSize: '2em',
});

export const Pane = styled.div({
  border: '1px solid dimgray',
  display: 'flex',
  flexDirection: 'column',
});

export const Content = styled.div({
  color: '#cccccc',
  overflow: 'scroll',
  height: '85vh',
  flexGrow: 1,
  fontSize: '14pt',
  WebkitTextSizeAdjust: 'none',

  // Not firefox? Don't care, you now have a rough approximation of its scrollbars.
  '&::-webkit-scrollbar': {
    width: '10px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    border: '3px solid transparent',
    borderRadius: '10px',
    background: '#6E6E6E',
    backgroundClip: 'content-box',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    border: 0,
    background: '#8C8C8C',
  },
  '&::-webkit-scrollbar-thumb:active': {
    border: '2px solid transparent',
    background: '#FFA756',
  },
  '&:not(:hover)::-webkit-scrollbar-thumb': {
    background: 'transparent',
  },
});

export const Article = styled.article({
  margin: '0.3em',
  maxWidth: '45em',
});

export const H2 = styled.h2({
  fontSize: '1em',
  fontWeight: 'normal',
  color: '#ffffff',
  whiteSpace: 'pre',
  a: {
    textDecoration: 'none',
    color: '#ffffff',
    '&:hover': {
      color: '#ffffff',
    },
  },
});

export const ResultHeader = styled(H2)({
  marginTop: '3em',
});

export const Em = styled.em({
  color: '#ffffff',
  fontStyle: 'normal',
  textShadow: '0 0 5px #ffffff',
});

export const Ul = styled.ul({
  listStyleType: 'none',
  padding: 0,
});

export const Li = styled.li({
  paddingLeft: '2.5em',
  position: 'relative',
  '&::before': {
    content: '"\\00a0\\00a0-\\00a0"',
    position: 'absolute',
    left: 0,
    top: 0,
  },
});

export const EasterEgg = styled.span(({ title }) => ({
  ...(title && { borderBottom: '1px dotted #ffff66' }),
}));

export const Code = styled.code({
  position: 'relative',
  display: 'inline-block',
  margin: 0,
  padding: 0,
  fontFamily: 'Source Code Pro, monospace',
  userSelect: 'all',
  cursor: 'default',
  '&::before': {
    zIndex: -1,
    content: '""',
    position: 'absolute',
    display: 'block',
    left: '-2px',
    right: '-2px',
    top: '3px',
    bottom: '0px',
    border: '1px solid #333340',
    background: '#10101A',
  },
});

export const FormatError = styled(Code)({
  color: 'red',
});

export const InputBody = styled.div({
  display: 'grid',
  gridTemplate: '93% 7% / 100%',
  border: '1px solid dimgray',
});

export const TitleInput = styled.input({
  fontFamily: 'inherit',
  fontSize: 'inherit',
  border: '1px solid #333340',
  background: '#10101A',
  outline: 'none',
  cursor: 'default',
  color: '#ffffff',
  margin: 0,
});

export const InactiveTitleInput = styled(TitleInput)({
  color: '#cccccc',
  caretColor: 'transparent',
  '::-moz-selection': { background: 'transparent' },
  '::selection': { background: 'transparent' },
});

export const Input = styled.textarea({
  fontFamily: 'inherit',
  fontSize: 'inherit',
  border: '1px solid #333340',
  background: '#10101A',
  resize: 'none',
  outline: 'none',
  color: '#cccccc',
  whiteSpace: 'pre',
  overflowWrap: 'normal',
  overflow: 'auto',
  tabSize: '1em',
  cursor: 'default',
  margin: 0,
});

export const DaySuccess = styled.p({
  color: '#ffff66',
  textShadow: '0 0 5px #ffff66',
});
