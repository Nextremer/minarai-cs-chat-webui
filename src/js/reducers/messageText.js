import * as actions from '../actions';

export const initial = '';

const handlers = {
  [ actions.CHANGE_MESSAGE_TEXT ]: ( state, action ) => {
    const text = action.payload;
    return text;
  },
  [ actions.SET_FORM_TEMPLATE ]: ( state, action ) => {
    const fields = action.payload;
    const text = fields.map( x => x + ':').join( '\n' );
    if ( state === '' )
      return text;
    else
      return state + '\n' + text;
  }
};

export default ( state = initial, action ) => {
  const handler = handlers[ action.type ];
  return !handler ? state : handler( state, action );
}
