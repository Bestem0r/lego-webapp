// @flow

import { get, union, isEmpty } from 'lodash';

import joinReducers from 'app/utils/joinReducers';
import mergeObjects from 'app/utils/mergeObjects';

import type { Reducer, AsyncActionType } from 'app/types';

type EntityReducerOptions = {
  key: string,
  types: {
    fetch?: ?AsyncActionType,
    mutate?: ?AsyncActionType
  },
  mutate?: Reducer,
  initialState?: Object
};

export function fetching(fetchType?: ?AsyncActionType) {
  return (state: any, action: any) => {
    if (!fetchType) {
      return state;
    }

    switch (action.type) {
      case fetchType.BEGIN:
        return { ...state, fetching: true };

      case fetchType.SUCCESS:
      case fetchType.FAILURE:
        return { ...state, fetching: false };

      default:
        return state;
    }
  };
}

const isNumber = id => !isNaN(Number(id)) && !isNaN(parseInt(id, 10));

export function entities(key: string, fetchType?: ?AsyncActionType) {
  return (
    state: any = {
      actionGrant: [],
      pagination: {},
      byId: {},
      items: []
    },
    action: any
  ) => {
    const result = get(action, ['payload', 'entities', key], {});
    const resultIds = Object.keys(result).map(
      i => (isNumber(i) ? parseInt(i, 10) : i)
    );
    const actionGrant = get(action, ['payload', 'actionGrant'], []);

    if (
      !action.payload ||
      (isEmpty(result) &&
        !isEmpty(actionGrant) &&
        action.type !== get(fetchType, 'SUCCESS'))
    )
      return state;

    let pagination = state.pagination;
    if (
      action.meta &&
      !action.cached &&
      action.meta.queryString !== undefined
    ) {
      pagination = {
        queryString: action.meta.queryString,
        nextPage: action.payload.next
      };
    }
    return {
      ...state,
      byId: mergeObjects(state.byId, result),
      items: union(state.items, resultIds),
      actionGrant: union(state.actionGrant, actionGrant),
      pagination
    };
  };
}

export function optimistic(mutateType?: ?AsyncActionType) {
  return (state: any, action: any) => {
    if (
      !mutateType ||
      ![mutateType.FAILURE, mutateType.SUCCESS].includes(action.type)
    ) {
      return state;
    }

    if (!action.meta.optimisticId) {
      return state;
    }

    return {
      ...state,
      items: state.items.filter(item => item !== action.meta.optimisticId)
    };
  };
}

/**
 * Create reducers for common crud actions
 */
export default function createEntityReducer({
  key,
  types,
  mutate,
  initialState = {}
}: EntityReducerOptions) {
  const { fetch: fetchType, mutate: mutateType } = types;

  const finalInitialState = {
    actionGrant: [],
    pagination: {},
    byId: {},
    items: [],
    fetching: false,
    ...initialState
  };

  const reduce = joinReducers(
    fetching(fetchType),
    entities(key, fetchType),
    optimistic(mutateType),
    mutate
  );

  return (state: any = finalInitialState, action: any) => reduce(state, action);
}
