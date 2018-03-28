import 'babel-polyfill';
import { expect } from 'chai';
import { put } from 'redux-saga/effects';
import * as actions from '../../src/js/actions';
import * as sagas from '../../src/js/sagas/chatText';

let saga;
describe( 'Sagas > Chat Text', () => {
  describe( 'changeChatText', () => {
    before ( () => {
      saga = sagas.changeChatText( 'user', 'hoge' );
    });
    it( 'puts changeChatText', () => {
      expect( saga.next().value ).to.deep.equal( put( actions.changeChatText({ user: 'hoge' }) ) );
    });
    it( 'puts chatTextChangeSucceeded', () => {
      expect( saga.next().value ).to.deep.equal( put( actions.chatTextChangeSucceeded({ type: 'user' }) ) );
    });
  });
});
