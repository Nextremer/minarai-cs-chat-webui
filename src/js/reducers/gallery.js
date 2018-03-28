import * as actions from '../actions';

export const initial = {
  url: null
};

const handlers = {
  [ actions.OPEN_GALLERY ]: ( state, action ) => {
    const { url } = action.payload;
    return {
      ...state,
      url
    };
  },

  [ actions.CLOSE_GALLERY ]: ( state, action ) => {
    return {
      ...state,
      url: null
    };
  }
};

export default ( state = initial, action ) => {
  const handler = handlers[ action.type ];
  return !handler ? state : handler( state, action );
}
