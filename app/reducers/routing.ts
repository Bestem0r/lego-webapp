import { produce } from 'immer';
import { Routing } from 'app/actions/ActionTypes';
import type { StrictReducer } from 'app/utils/joinReducers';
import type { RouterState } from 'connected-react-router';

export interface RoutingState extends RouterState {
  statusCode?: number | null;
}

const initialState: RoutingState = {
  action: undefined,
  location: undefined,
  statusCode: null,
};

const routing: StrictReducer<RoutingState> = produce((newState, action) => {
  switch (action.type) {
    case Routing.SET_STATUS_CODE:
      newState.statusCode = action.payload;
      break;

    default:
      break;
  }
}, initialState);
export default routing;
