import { ActionReducerMap, createFeatureSelector, createSelector, MetaReducer } from '@ngrx/store';

import * as fromTimes from './times';

export interface State {
  times: fromTimes.State;
}

export const reducers: ActionReducerMap<State> = {
  times: fromTimes.reducer
};

export const getTimesState =
  createFeatureSelector<fromTimes.State>('times');

export const getList = createSelector(
  getTimesState,
  fromTimes.getList,
);

export const getCalcList = createSelector(
  getTimesState,
  fromTimes.getCalcList,
);
