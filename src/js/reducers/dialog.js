import * as actions from 'actions';
import { Dialog } from 'utils/dialog';

export const initial = {
  socket: null,
  entered: false,
  toOperator: false,
  isTakeOver:false,
};

const handlers = {
  [ actions.CONNECT ]: ( state, action ) => {
    return {
      ...state,
      socket: new Dialog()
    };
  },

  [ actions.CONNECTED ]: ( state, action ) => {
    return {
      ...state,
      entered: true
    };
  },

  [ actions.INTERCEPT ]: ( state, action ) => {
    return {
      ...state,
      toOperator: true
    };
  },

  [ actions.INTERCEPT_CANCEL ]: ( state, action ) => {
    return {
      ...state,
      toOperator: false
    };
  },

  [ actions.TAKE_OVER ]: ( state, action ) => {
    return {
      ...state,
      isTakeOver: true
    };
  },

  [ actions.TAKE_OVER_CANCEL ]: ( state, action ) => {
    return {
      ...state,
      isTakeOver: false
    };
  },
};

export default ( state = initial, action ) => {
  const handler = handlers[ action.type ];
  return !handler ? state : handler( state, action );
}
