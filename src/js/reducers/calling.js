import * as actions from '../actions';

export const initial = {
  calling: false,
};

const handlers = {
  [ actions.CALLING_BEGIN ]: ( state, action ) => {
    return {
      ...state,
      calling: true
    };
  },

  [ actions.CALLING_CANCELED ]: ( state, action ) => {
    return {
      ...state,
      calling: false
    };
  },

  [ actions.INTERCEPT ]: ( state, action ) => {
    return {
      ...state,
      calling: false
    };
  },
};

export default ( state = initial, action ) => {
  const handler = handlers[ action.type ];
  return !handler ? state : handler( state, action );
}
