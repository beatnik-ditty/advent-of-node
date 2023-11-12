const getSavedState = (namespace: string) => {
  const serializedState = localStorage.getItem(namespace);
  if (serializedState != null) {
    return JSON.parse(serializedState);
  }
  return undefined;
};

const tryLocalStorage = <T>(namespace: string, fn: () => T) => {
  try {
    return fn();
  } catch (error) {
    console.error(error);
    localStorage.removeItem(namespace);
  }
  return undefined;
};

export const loadState = (namespace: string) => {
  return tryLocalStorage(namespace, () => {
    const state = getSavedState(namespace);
    return state ?? {};
  });
};

export const saveState = <T>(namespace: string, mutateState: (state: T) => void) => {
  tryLocalStorage(namespace, () => {
    const state = getSavedState(namespace) ?? {};
    mutateState(state);
    localStorage.setItem(namespace, JSON.stringify(state));
  });
};
