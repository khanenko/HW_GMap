import { MarkerActionType, MarkerStateType } from './markerStore/reducer';

type StateType = MarkerStateType;

type ActionType = MarkerActionType;

type Actions = {
  [key: string]: (state: StateType, payload: ActionType['payload']) => StateType
};

export const createReducer = (actions: Actions) =>
  (state: StateType, action: ActionType): StateType => {
    const updated = actions[action.type](state, action.payload);

    return { ...state, ...updated };
  };
