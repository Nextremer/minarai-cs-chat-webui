import * as actions from '../actions';

export const initial = {
  html: '',
  hidden: true
};


const handlers = {
  [ actions.SET_NOTIFICATION_HTML ]: ( state, action ) => {
    const html = action.payload;

    return {
      ...state,
      html
    };
  },

  [ actions.SHOW_NOTIFICATION_VIEW ]: ( state, action ) => {
    return {
      ...state,
      hidden: false
    };
  },

  [ actions.HIDE_NOTIFICATION_VIEW ]: ( state, action ) => {
    return {
      ...state,
      hidden: true
    }
  },
};

export default ( state = initial, action ) => {
  const handler = handlers[ action.type ];
  return !handler ? state : handler( state, action );
}
