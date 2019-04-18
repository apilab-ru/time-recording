import * as timesAction from '../actions/times';
import { TimeItem } from '../../models/time-item';
import { Calc } from '../../models/calc';

export interface State {
  list: TimeItem[];
  calculatedList: Calc[];
}

export const initialState: State = {
  list: [],
  calculatedList: []
};

function deepCopy(object: any) {
  return JSON.parse(JSON.stringify(object));
}

export function reducer(state = initialState,
                        action: timesAction.Action) {
  switch (action.type) {
    case timesAction.ADD: {
      const newItem: TimeItem = action.payload as TimeItem;
      return {
        ...state,
        list: [...state.list, newItem]
      };
    }

    case timesAction.SET_LIST: {
      return {
        ...state,
        list: action.payload
      };
    }

    case timesAction.UPDATE: {
      const { index, item } = action.payload;
      const list = deepCopy(state.list);
      list[index] = item;
      return {
        ...state,
        list: list
      };
    }

    case timesAction.DELETE: {
      const index = action.payload;
      const list = deepCopy(state.list);
      list.splice(index, 1);
      return {
        ...state,
        list
      };
    }

    case timesAction.CLEAR: {
      return {
        ...state,
        list: []
      };
    }

    case timesAction.SET_CALCULATION_LIST: {
      return {
        ...state,
        calculatedList: action.payload,
      };
    }

    case timesAction.DELETE_CALCULATION_ITEM: {
      const index = action.payload;
      const calculatedList = deepCopy(state.calculatedList);
      calculatedList.splice(index, 1);
      return {
        ...state,
        calculatedList,
      };
    }

    case timesAction.UNDO_DATA: {
      return {
        ...state,
        ...action.payload,
      };
    }

    default:
      return state;
  }
}

export const getList = (state: State) => state.list;

export const getCalcList = (state: State) => state.calculatedList;
