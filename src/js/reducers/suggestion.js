import * as actions from '../actions';
import { suggest } from '../utils/suggestion';

export const initial = {
  registeredInquiries: [],
  previousId: null,
  suggestions: []
};


const handlers = {
  [ actions.SET_REGISTERED_INQUIRIES ]: ( state, action ) => {
    const registeredInquiries = action.payload;
    return {
      ...state,
      registeredInquiries
    };
  },

  [ actions.UPDATE_SUGGESTION ]: ( state, action ) => {
    const text = action.payload;
    const suggestions = suggest( state.registeredInquiries, state.previousId, text );

    if ( !text || ( suggestions.length === 1 && suggestions[0] === text ) )
      suggestions.length = 0;

    return {
      ...state,
      suggestions
    };
  },

  [ actions.RESET_SUGGESTION ]: ( state, action ) => {
    return {
      ...state,
      suggestions: []
    }
  },

  /*
    新 cschat フロントにつき、サジェスチョンは一旦オフにしている
    サジェスチョンを有効にするには以下のコードを修正する必要がある
  [ actions.RESPONSE_RECEIVED ]: ( state, action ) => {
    const { payload } = action;

    // ボットの最終発言から previous_id を取得
    let previousId = state.previousId;
    for ( const { utterance } of payload ) {
      try {
        previousId = JSON.parse( utterance.serializedContext ).previous_id;
      } catch ( e ) {
      }
    }

    return {
      ...state,
      previousId
    };
  }
  */
};

export default ( state = initial, action ) => {
  const handler = handlers[ action.type ];
  return !handler ? state : handler( state, action );
}
