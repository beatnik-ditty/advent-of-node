import { QueryStatus } from '@reduxjs/toolkit/query';
import { ChangeEvent, FC, FocusEvent, MouseEvent, PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react';

import * as api from '@aon/data-access-api';
import * as rx from '@aon/data-access-solver';
import { useAppDispatch, useAppSelector } from '@aon/data-access-store';
import { TitleDiv } from '@aon/ui-animations';
import { Anchor, Banner } from '@aon/ui-components';
import { getPresentDate } from '@aon/util-date';
import { PuzzleElementNode, PuzzleNode } from '@aon/util-types';
import * as S from './Solver.styled';

const { VITE_AOC_URL } = import.meta.env;

const unsavedConfirmation = () => window.confirm('You have unsaved changes to your current input. Close without saving?');

export const Solver: FC = props => {
  const { status, day, newDay } = useAppSelector(state => state.solver);
  const dispatch = useAppDispatch();

  const onAnimationEnd = () => dispatch(rx.endAnimation());

  return status !== 'closed' ? (
    <S.SolverWindow { ...props }>
      <SolverContainer key={ day } />
      <SolverContainer key={ day === newDay ? 0 : newDay } incoming { ...{ onAnimationEnd } } />
    </S.SolverWindow>
  ) : null;
};

const SolverContainer: FC<{ incoming?: boolean }> = ({ incoming, ...restProps }) => {
  const { year } = useAppSelector(state => state.calendar);
  const { day: presentDay, newDay, status } = useAppSelector(state => state.solver);

  const day = incoming ? newDay : presentDay;
  const direction = presentDay < newDay ? 'left' : 'right';
  const { data } = api.useFetchCalendarQuery({ year });
  const { stars, title: puzzleTitle } = data?.days[day - 1] ?? {};

  return incoming && status !== 'sliding' ? null : (
    <S.SolverContainer { ...{ ...(status === 'sliding' && { direction, transition: incoming ? 'in' : 'out' }), ...restProps } }>
      <BannerContainer day={ day } stars={ stars } puzzleTitle={ puzzleTitle }></BannerContainer>
      <SolverPane day={ day } />
    </S.SolverContainer>
  );
};

const openAnimation = (status: rx.Status) => ({
  ...((status === 'opening' || status === 'closing') && { transition: status }),
});

const BannerContainer = ({ day, stars, puzzleTitle }: { day: number; stars?: number; puzzleTitle?: string | null }) => {
  const { status } = useAppSelector(state => state.solver);
  const dispatch = useAppDispatch();

  const onAnimationEnd = () => dispatch(rx.endAnimation());
  const transition = openAnimation(status).transition;
  return (
    <S.BannerContainer { ...{ day, ...openAnimation(status), onAnimationEnd } }>
      <Banner { ...{ day, stars } } />
      { puzzleTitle && transition ? <TitleDiv { ...{ transition } }>{ `    ${puzzleTitle}    ` }</TitleDiv> : null }
    </S.BannerContainer>
  );
};

const SolverPane: FC<{ day: number }> = props => {
  const { status } = useAppSelector(state => state.solver);
  return (
    <S.SolverPane { ...{ ...openAnimation(status), ...props } }>
      <SolverBody { ...props } />
    </S.SolverPane>
  );
};

const SolverBody = ({ day }: { day: number }) => {
  const { year } = useAppSelector(state => state.calendar);
  const { status } = useAppSelector(state => state.solver);

  return (
    <S.SolverBody { ...{ day, year, ...openAnimation(status) } }>
      <NavMenu { ...{ day } } />
      <MainMenu { ...{ day } } />
      <PuzzlePane { ...{ day } } />
      <InputBody { ...{ day } } />
    </S.SolverBody>
  );
};

const { day: presentDay, year: presentYear } = getPresentDate();

const NavMenu = ({ day }: { day: number }) => {
  const { year } = useAppSelector(state => state.calendar);
  const dispatch = useAppDispatch();
  const highestDay = year === presentYear ? presentDay : 25;
  const aocLink = `${VITE_AOC_URL}/${year}/day/${day}`;

  return (
    <S.NavMenu>
      <S.NavButton onClick={ () => dispatch(rx.chooseDay(day - 1)) } disabled={ day <= 1 }>
        { '<' }
      </S.NavButton>
      <S.ExternalButton onClick={ () => window.open(aocLink) } tooltip={ 'Go to puzzle' }>
        <span>{ `//` }</span>
        <S.StarSpan>*</S.StarSpan>
      </S.ExternalButton>
      <S.NavButton onClick={ () => dispatch(rx.chooseDay(day + 1)) } disabled={ day >= highestDay }>
        { '>' }
      </S.NavButton>
    </S.NavMenu>
  );
};

const MainMenu = ({ day }: { day: number }) => {
  const dispatch = useAppDispatch();
  const { year } = useAppSelector(state => state.calendar);
  const { inputs, isCustomInput, canSave } = useAppSelector(state => state.solver);
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: savedInputs } = api.useFetchInputQuery({ year, day, custom: true });
  const [createInput] = api.useCreateInputMutation({ fixedCacheKey: `createInput${year}_${day}` });
  const [updateInput] = api.useUpdateInputMutation({ fixedCacheKey: `updateInput${year}_${day}` });
  const [deleteInput] = api.useDeleteInputMutation({ fixedCacheKey: `deleteInput${year}_${day}` });
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const createNewInput = () => {
    if (!canSave || unsavedConfirmation()) {
      !isCustomInput && dispatch(rx.toggleSetting('useCustom'));
      createInput({ year, day, custom: true })
        .then(response => {
          'data' in response && updateInput({ year, day, id: response.data.id, mostRecent: true });
        })
        .catch(rejected => console.error(rejected));
    }
  };

  const saveInput = () => {
    updateInput({ year, day, ...inputs[day] });
  };

  useEffect(
    function bindMenuCloseListeners() {
      if (menuOpen) {
        const closeMenu = (event: Event) => {
          if (!event.target || !dropdownRef.current?.contains(event.target as Node)) {
            setMenuOpen(false);
          }
        };
        window.addEventListener('keydown', closeMenu);
        window.addEventListener('mousedown', closeMenu);
        return () => {
          window.removeEventListener('keydown', closeMenu);
          window.removeEventListener('mousedown', closeMenu);
        };
      }
    },
    [menuOpen],
  );

  const close = () => {
    (!canSave || unsavedConfirmation()) && dispatch(rx.closeSolver());
  };

  return (
    <S.MainMenu>
      <S.MenuButton onClick={ createNewInput }>New</S.MenuButton>
      <S.MenuButton onClick={ saveInput } disabled={ !canSave }>
        Save
      </S.MenuButton>
      <S.DropdownContainer ref={ dropdownRef }>
        <S.MenuButton
          disabled={ !savedInputs?.results }
          onClick={ (event: Event) => {
            event.stopPropagation();
            setMenuOpen(!menuOpen);
          } }
        >
          Load
        </S.MenuButton>
        { menuOpen ? (
          <S.DropdownList>
            { savedInputs?.inputs.map(input => (
              <S.DropdownButton
                disabled={ input.id === inputs[day].id && isCustomInput }
                key={ input.order }
                customLayout
                noTransform
                onClick={ (event: Event) => {
                  event.stopPropagation();
                  if (!isCustomInput || input.id !== inputs[day].id) {
                    !isCustomInput && dispatch(rx.toggleSetting('useCustom'));
                    input.id !== inputs[day].id && updateInput({ year, day, id: input.id, mostRecent: true });
                    setMenuOpen(false);
                  }
                } }
              >
                { input.title || `Input ${input.order}` }
                <S.DropdownOptionSpan>
                  { input.order < 2 ? null : (
                    <S.ReorderButton
                      onClick={ (event: Event) => {
                        event.stopPropagation();
                        updateInput({ year, day, id: input.id, position: 1 });
                      } }
                    >
                      ^
                    </S.ReorderButton>
                  ) }
                  <S.DeleteButton
                    onClick={ (event: Event) => {
                      event.stopPropagation();
                      if (window.confirm(`Delete "${input.title || `Input ${input.order}`}"?`)) {
                        deleteInput({ year, day, id: input.id }).then(() => setMenuOpen(false));
                      }
                    } }
                  >
                    X
                  </S.DeleteButton>
                </S.DropdownOptionSpan>
              </S.DropdownButton>
            )) }
          </S.DropdownList>
        ) : null }
      </S.DropdownContainer>
      <S.MenuButton onClick={ close }>Close</S.MenuButton>
    </S.MainMenu>
  );
};

const PuzzlePane = ({ day }: { day: number }) => {
  const { year } = useAppSelector(state => state.calendar);

  const { data: headerData } = api.useFetchCalendarQuery({ year });
  const { data, isLoading } = api.useFetchPuzzleQuery({ year, day });
  const [create, { isUninitialized }] = api.useCreatePuzzleMutation({ fixedCacheKey: `create-puzzle-${year}-${day}` });
  const [update, { status: updateStatus }] = api.useUpdateCalendarMutation();

  const { stars: puzzleStars, title: puzzleTitle } = headerData?.days[day - 1] ?? {};

  useEffect(
    function createPuzzleIfAbsent() {
      if (!data && !isLoading && isUninitialized) {
        create({ year, day });
      }
    },
    [day, year, data, isLoading, create, isUninitialized],
  );

  const puzzle = data?.main ? data : undefined;
  const classes = puzzle?.main?.attributes['className']?.split(' ') ?? [];
  const stars = puzzle?.main && (classes.includes('verycomplete') ? 2 : classes.includes('complete') ? 1 : 0);
  const title = puzzle?.main?.attributes['title'];

  useEffect(
    function updateHeaderFromPuzzle() {
      if (
        stars != null &&
        title != null &&
        puzzleStars != null &&
        puzzleTitle != null &&
        (stars !== puzzleStars || title !== puzzleTitle) &&
        updateStatus !== QueryStatus.pending &&
        updateStatus !== QueryStatus.rejected
      ) {
        update({ year, day, ...(stars !== puzzleStars && { stars }), ...(title !== puzzleTitle && { title }) });
      }
    },
    [day, year, stars, title, puzzleStars, puzzleTitle, update, updateStatus],
  );

  return (
    <S.Pane>
      <S.Content>{ puzzle?.main ? <PuzzleDisplayComponentList nodes={ puzzle.main.childNodes ?? [] } /> : '' }</S.Content>
    </S.Pane>
  );
};

const PuzzleDisplayComponentList = ({ nodes }: { nodes: PuzzleNode[] }) => (
  <>{ nodes.map((node, index) => (node.nodeType === Node['TEXT_NODE'] ? node.text : <PuzzleDisplayComponent key={ index } { ...node } />)) }</>
);

const externalHrefClass = /withHref=(\S*)/;
const PuzzleDisplayComponent = ({ name, attributes: { className, ...attrs }, childNodes }: PuzzleElementNode) => {
  const Component = puzzleDisplayFC(name);
  const externalHref = className && decodeURIComponent(externalHrefClass.exec(className)?.[1] ?? '');
  const onClick = (e: Event) => {
    !window.confirm(`This will take you to ${externalHref}. Are you sure?`) && e.preventDefault();
  };
  return (
    <Component { ...{ className, ...attrs, ...(externalHref && { href: externalHref, onClick }) } }>
      <PuzzleDisplayComponentList nodes={ childNodes } />
    </Component>
  );
};

const puzzleDisplayFC = (name: string): FC<PropsWithChildren> => {
  switch (name) {
    case 'article':
      return props => <S.Article { ...props } />;
    case 'code':
      return props => <S.Code { ...props } />;
    case 'em':
      return props => <S.Em { ...props } />;
    case 'ul':
      return props => <S.Ul { ...props } />;
    case 'li':
      return props => <S.Li { ...props } />;
    case 'pre':
      return props => <pre { ...props } />;
    case 'a':
      return Anchor;
    case 'h2':
      return H2;
    case 'p':
      return P;
    case 'span':
      return Span;
    case 'br':
      return () => <br />;
    default:
      return () => null;
  }
};

const H2: FC<PropsWithChildren> = ({ children, ...restProps }) => <S.H2 { ...restProps }>{ children }</S.H2>;

const P: FC<PropsWithChildren<{ className?: string }>> = ({ className, ...restProps }) =>
  className?.split(' ').includes('day-success') ? <S.DaySuccess { ...restProps } /> : <p { ...restProps } />;

const Span: FC<PropsWithChildren<{ title?: string }>> = props => {
  const { year } = useAppSelector(state => state.calendar);
  const { data: { totalStars } = {} } = api.useFetchCalendarQuery({ year });
  return totalStars === 50 && props.title ? <S.EasterEgg { ...props } /> : <span { ...props } />;
};

const InputBody = ({ day }: { day: number }) => {
  const { year } = useAppSelector(state => state.calendar);
  const { part, inputs, isCustomInput, canSave } = useAppSelector(state => state.solver);

  const { data } = api.useFetchInputQuery({ year, day, custom: false });
  const id = isCustomInput ? inputs[day].id : data?.inputs[0]?.id ?? '';
  const [createSolution, { data: solution, isLoading }] = api.useCreateSolutionMutation({ fixedCacheKey: `solution_${id}_${part}` });
  const [updateInput] = api.useUpdateInputMutation({ fixedCacheKey: `updateInput${year}_${day}` });

  const runSolver = () => {
    if (isCustomInput && canSave) {
      updateInput({ year, day, ...inputs[day] }).then(() => createSolution({ id, part }));
    } else {
      createSolution({ id, part });
    }
  };

  const Input = isCustomInput ? CustomInput : PuzzleInput;
  return (
    <S.InputBody>
      <S.Pane>
        <S.Content>
          <S.Article>
            <Input day={ day } />
            <Result { ...{ part, ...solution } } />
          </S.Article>
        </S.Content>
      </S.Pane>
      <InputMenu createSolution={ runSolver } canSolve={ id } isRunning={ isLoading } />
    </S.InputBody>
  );
};

const CustomInput: FC<{ day: number }> = ({ day }) => {
  const { year } = useAppSelector(state => state.calendar);
  const { inputs, canSave } = useAppSelector(state => state.solver);
  const { input, title, id } = inputs[day];
  const { data } = api.useFetchInputQuery({ year, day, custom: true, mostRecent: true });
  const [updateInput] = api.useUpdateInputMutation({ fixedCacheKey: `updateInput${year}_${day}` });

  const dispatch = useAppDispatch();

  const savedInput = data?.inputs[0];

  useEffect(
    function checkEditSync() {
      if (savedInput?.id !== id) {
        dispatch(rx.loadFetchedInput({ day, id: '', ...savedInput }));
      }
      dispatch(rx.updateCanSave(!!savedInput && (savedInput.input !== input || savedInput.title !== title)));
    },
    [day, dispatch, savedInput, id, input, title],
  );

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.ctrlKey) {
        if (event.key === 'z') {
          dispatch(rx.undoInput());
        } else if (event.key === 'Z' || event.key === 'y') {
          dispatch(rx.redoInput());
        } else if (event.key === 's') {
          event.preventDefault();
          canSave && updateInput({ year, day, ...inputs[day] });
        }
      }
    },
    [canSave, dispatch, updateInput, year, day, inputs],
  );

  useEffect(
    function bindUndoListener() {
      window.addEventListener('keydown', handleKeyPress);
      return () => {
        window.removeEventListener('keydown', handleKeyPress);
      };
    },
    [handleKeyPress],
  );

  return id ? (
    <>
      <TitleInput day={ day } />
      <TextArea value={ input } placeholder={ 'Enter input' } />
    </>
  ) : null;
};

const PuzzleInput: FC<{ day: number }> = ({ day }) => {
  const { year } = useAppSelector(state => state.calendar);
  const { data, isLoading } = api.useFetchInputQuery({ year, day, custom: false });
  const [createInput, { isUninitialized }] = api.useCreateInputMutation({
    fixedCacheKey: `create-input-${year}-${day}`,
  });

  const input = data?.inputs[0]?.input;

  useEffect(
    function createInputIfAbsent() {
      if (!isLoading && data?.results !== 1 && isUninitialized) {
        createInput({ year, day, custom: false });
      }
    },
    [day, year, data, isLoading, createInput, isUninitialized],
  );

  return <TextArea readOnly value={ input ?? '' } placeholder={ 'Loading input...' } />;
};

const TitleInput: FC<{ day: number }> = ({ day }) => {
  const dispatch = useAppDispatch();
  const { inputs, canSave } = useAppSelector(state => state.solver);
  const { title } = inputs[day];
  const displayTitle = title || `Input ${inputs[day].order}`;

  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = (event: MouseEvent<HTMLInputElement>) => {
    event.currentTarget.blur();
    if (event.detail === 2) {
      setIsEditing(true);
    }
  };

  const finishTitleEdit = useCallback(() => {
    inputRef.current?.value != null && inputRef.current.value !== title && dispatch(rx.updateTitle(inputRef.current.value));
    setIsEditing(false);
  }, [dispatch, title]);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Enter':
          finishTitleEdit();
          break;
        case 'Escape':
          if (inputRef.current?.value) {
            inputRef.current.value = '';
            inputRef.current.setAttribute('size', `1`);
          } else {
            setIsEditing(false);
          }
          break;
      }
    },
    [finishTitleEdit],
  );

  useEffect(
    function bindKeyListener() {
      if (isEditing) {
        window.addEventListener('keydown', handleKeyPress);
        return () => {
          window.removeEventListener('keydown', handleKeyPress);
        };
      }
    },
    [isEditing, handleKeyPress],
  );

  const resize = (event: FocusEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>) => {
    event.currentTarget.size = event.currentTarget.value.length || 1;
  };

  return (
    <S.H2>
      { isEditing ? (
        <S.TitleInput autoFocus ref={ inputRef } onBlur={ finishTitleEdit } onFocus={ resize } onChange={ resize } defaultValue={ title } />
      ) : (
        <S.InactiveTitleInput
          readOnly
          onClick={ handleClick }
          value={ `${displayTitle}${canSave ? '*' : ''}` }
          size={ (displayTitle.length || 1) + (canSave ? 1 : 0) }
        />
      ) }
    </S.H2>
  );
};

const TextArea: FC<{ value: string; placeholder: string; readOnly?: boolean }> = ({ value, placeholder, readOnly }) => {
  const { hideCustomInput, hidePuzzleInput } = useAppSelector(state => state.solver);
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLTextAreaElement | null>(null);

  const displayValue = value?.replace(/\n$/g, '\t') ?? '';
  const isInputHidden = readOnly ? hidePuzzleInput : hideCustomInput;

  useEffect(
    function resizeOnInputChange() {
      if (ref.current != null) {
        const currentValue = ref.current.value;
        ref.current.value = ref.current.value || placeholder;
        ref.current.style.height = '0';
        ref.current.style.height = `${ref.current.scrollHeight}px`;
        ref.current.style.width = '0';
        ref.current.style.width = `${ref.current.scrollWidth}px`;
        ref.current.value = currentValue;
      }
    },
    [displayValue, isInputHidden, placeholder],
  );

  const inputProps = readOnly
    ? {
        readOnly: true,
        onFocus: () => ref.current?.blur(),
      }
    : {
        onFocus: (event: FocusEvent<HTMLTextAreaElement>) => {
          event.currentTarget.setSelectionRange(event.target.value.length, event.target.value.length);
        },
        onChange: (event: ChangeEvent<HTMLTextAreaElement>) => {
          dispatch(rx.userInput(event.target.value.replace('\t', '\n')));
        },
        onClick: (event: MouseEvent) => {
          if (event.detail === 2) {
            dispatch(rx.userInput(''));
          }
        },
      };

  return isInputHidden ? null : (
    <p>
      <S.Input ref={ ref } value={ displayValue } spellCheck={ false } { ...{ placeholder, ...inputProps } } />
    </p>
  );
};

const formatTime = (time: number) => {
  if (time < 1000) {
    return `${time}μs`;
  } else if (time < 1000000) {
    return `${(time / 1000).toFixed(3)}ms`;
  } else {
    return `${(time / 1000000).toFixed(3)}s`;
  }
};

const Result = ({ part, result, time }: { part: number; result?: string; time?: number }) => {
  return result != null && time != null ? (
    <>
      <S.ResultHeader>--- Part { part } result ---</S.ResultHeader>
      <pre>
        <S.Code>{ result }</S.Code>
      </pre>
      <p>Ran in { formatTime(time) }</p>
    </>
  ) : null;
};

const InputMenu = ({ canSolve, isRunning, createSolution }: { canSolve: unknown; isRunning: unknown; createSolution: () => void }) => {
  const { part, isCustomInput, hideCustomInput, hidePuzzleInput } = useAppSelector(state => state.solver);
  const dispatch = useAppDispatch();

  const [cancelSolution] = api.useCancelSolutionMutation();

  const [cancel, setCancel] = useState(false);
  const [cancelDelay, setCancelDelay] = useState<NodeJS.Timeout | undefined>(undefined);

  useEffect(
    function clearCancel() {
      if (!isRunning) {
        clearTimeout(cancelDelay);
        setCancel(false);
      }
    },
    [cancelDelay, isRunning],
  );

  const handleRunClick = () => {
    setCancelDelay(
      setTimeout(() => {
        setCancel(true);
      }, 500),
    );
    createSolution();
  };

  return (
    <S.Menu>
      <S.MenuButton onClick={ () => dispatch(rx.toggleSetting('useCustom')) } disabled={ isRunning }>
        Use { isCustomInput ? 'Puzzle' : 'Custom' } Input
      </S.MenuButton>
      <S.MenuButton onClick={ () => dispatch(rx.toggleSetting('hideInput')) } disabled={ isRunning }>
        { (isCustomInput ? hideCustomInput : hidePuzzleInput) ? 'Show' : 'Hide' } Input
      </S.MenuButton>
      <S.MenuButton onClick={ () => dispatch(rx.toggleSetting('part')) } disabled={ isRunning }>
        Part { part }
      </S.MenuButton>
      { cancel ? (
        <S.MenuButton onClick={ cancelSolution }>Cancel</S.MenuButton>
      ) : (
        <S.MenuButton onClick={ handleRunClick } disabled={ !canSolve || isRunning }>
          Run
        </S.MenuButton>
      ) }
    </S.Menu>
  );
};
