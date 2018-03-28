import { expect } from 'chai';
import reducer from '../../src/js/reducers/chatText';
import * as actions from '../../src/js/actions';

describe( 'Reducers > Chat Text', () => {
  it( 'returns default state', () => {
    const state = reducer( undefined, { type: '' } );
    expect( state ).to.deep.equal({ user: '', bot: '' });
  });

  context( 'when both text is empty', () => {
    it( 'change user chat text', () => {
      const state = reducer( undefined, actions.changeChatText({ user: 'hoge' }) );
      expect( state ).to.deep.equal({ user: 'hoge', bot: '' });
    });
    it ('change bot chat text', () => {
      const state = reducer( undefined, actions.changeChatText({ bot: 'hoge' }) );
      expect( state ).to.deep.equal({ user: '', bot: 'hoge' });
    });
  });
  context( 'when both text is not empty', () => {
    it( 'change user chat text', () => {
      const state = reducer( { user:'user', bot: 'bot' }, actions.changeChatText({ user: 'hoge' }) );
      expect( state ).to.deep.equal({ user: 'hoge', bot: 'bot' });
    });
    it ('change bot chat text', () => {
      const state = reducer( { user:'user', bot: 'bot' }, actions.changeChatText({ bot: 'hoge' }) );
      expect( state ).to.deep.equal({ user: 'user', bot: 'hoge' });
    });
  });
});

