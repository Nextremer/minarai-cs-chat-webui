import * as actions from '../actions';

export const initial = {
  inputting: false
};


const handlers = {
  [ actions.INPUT_BEGIN ]: ( state, action ) => {
    return {
      ...state,
      inputting: true
    };
  },
  [ actions.INPUT_END ]: ( state, action ) => {
    return {
      ...state,
      inputting: false
    };
  },
};

export default ( state = initial, action ) => {
  const handler = handlers[ action.type ];
  return !handler ? state : handler( state, action );
}
