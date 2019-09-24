import { ActionReducer, INIT as StoreInit, MetaReducer } from '@ngrx/store';
import { State } from './index';
import { HistoryService } from '@api/services/history.service';
import { UNDO } from '../actions/times';

const EffectsInit = '@ngrx/effects/init';

export function logger(historyService: HistoryService): MetaReducer<State> {
  return function (reducer: ActionReducer<State>): ActionReducer<State> {
    return function (state: State, action: any): State {
      const newState = reducer(state, action);

      if (action.type !== StoreInit
        && action.type !== EffectsInit
        && action.type !== UNDO) {
        localStorage['today'] = JSON.stringify(newState.times.list);

        historyService.addState(newState.times);
      }
      return newState;
    };
  };
}
