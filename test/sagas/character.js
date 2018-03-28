import 'babel-polyfill';
import { spy } from 'sinon';
import { expect } from 'chai';
import { fork } from 'redux-saga/effects';
import * as sagas from '../../src/js/sagas/character';
import { Dialog } from '../../src/js/utils/dialog';
import { CHARACTER_STATUS } from '../../src/js/consts';

let socket, saga, stub;
describe( 'Sagas > Character', () => {
  describe( 'updateCharacter', () => {
    context( 'when socket to connect to dialog engine is not defined,', () => {
      before( () => {
        saga = sagas.updateCharacter();
        saga.next();
        saga.next( null );
      });
      it( 'do nothing and done', () => {
        expect( saga.next( CHARACTER_STATUS.NORMAL ).done ).to.be.true;
      });
    });

    context( 'when socket is specified,', () => {
      beforeEach( () => {
        saga = sagas.updateCharacter();
        saga.next();
        socket = new Dialog();
        stub = spy( socket, 'sendSystemCommand' );
      });
      afterEach( () => {
        socket.sendSystemCommand.restore();
      });
      context( 'character status (NORMAL) is specified', () => {
        it( 'send system command with specified character(NORMAL)', () => {
          saga.next( socket );
          saga.next( CHARACTER_STATUS.NORMAL );

          expect( stub.calledOnce ).to.be.true;
          expect( stub.withArgs( 'update-character', { uiState: CHARACTER_STATUS.NORMAL } ).callCount ).to.be.equal( 1 );
        });
      });

      context( 'character status (LISTENING) is specified', () => {
        it( 'send system command with specified character(NORMAL)', () => {
          saga.next( socket );
          saga.next( CHARACTER_STATUS.LISTENING );

          expect( stub.calledOnce ).to.be.true;
          expect( stub.withArgs( 'update-character', { uiState: CHARACTER_STATUS.LISTENING } ).callCount ).to.be.equal( 1 );
        });
      });
    });
  });

  describe( 'characterRoot', () => {
    it( 'fork each Watchers', () => {
      const saga = sagas.characterRoot();
      expect( saga.next().value ).to.deep.equal( fork( sagas.updateCharacterEventWatcher ) );
      expect( saga.next().done ).to.be.true;
    });
  });
});


