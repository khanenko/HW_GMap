import React, {
  createContext, useReducer, useContext, ReactNode,
} from 'react';
import reducer, { MarkerStateType, markerInitialState } from './reducer';
import useActions, { MarkerActionsType } from './useActions';

export const StateContext = createContext<MarkerStateType>(null);

export const ActionsContext = createContext<MarkerActionsType>(null);

export const useMarkerState = (): MarkerStateType => useContext(StateContext);

export const useMarkerDispatch = (): MarkerActionsType => useContext(ActionsContext);

export const MarkerStateProvider = ({ children }: {children: ReactNode}): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, markerInitialState);

  const actions = useActions(dispatch);

  return (
    <StateContext.Provider value={state}>
      <ActionsContext.Provider value={actions}>
        {children}
      </ActionsContext.Provider>
    </StateContext.Provider>
  );
};
