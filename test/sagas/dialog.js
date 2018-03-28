import 'babel-polyfill';
import { spy } from 'sinon';
import { expect } from 'chai';
import { take, call, put, fork } from 'redux-saga/effects';
import * as actions from '../../src/js/actions';
import * as sagas from '../../src/js/sagas/dialog';
import { Dialog } from '../../src/js/utils/dialog';
import { analyzeHrimeResponse } from '../../src/js/sagas/hrime';
import { CHARACTER_STATUS } from '../../src/js/consts';

let saga, socket, stub;
describe( 'Sagas > Dialog', () => {
  describe( 'sendMessage', () => {
    context( 'when socket to connect to dialog engine is not defined,', () => {
      before( () => {
        saga = sagas.sendMessage();
        saga.next();
        stub = spy( console, 'error' );
      });
      after( () => {
        console.error.restore();
      });

      it( 'put console error log', () => {
        saga.next( null );
        expect( stub.withArgs( 'No Dialog Engine Specified' ).callCount ).to.be.equal( 1 );
      });
    });

    context( 'when socket is specified', () => {
      before( () => {
        saga = sagas.sendMessage( 'hoge' );
        saga.next();
        socket = new Dialog();
        stub = spy( socket, 'send' );
      });
      after( () => {
        socket.send.restore();
      });

      it( 'call socket.send', () => {
        saga.next( socket );
        expect( stub.withArgs( 'hoge' ).callCount ).to.be.equal( 1 );
      });
    });
  });

  describe( 'responseReceived', () => {
    context( 'when payload is array(size == 1),', () => {
      before( () => {
        saga = sagas.responseReceived({ payload: [{ utterance: 'hoge' }]});
      });

      it( 'put updateResponse with empty array', () => {
        expect( saga.next().value )
          .to.deep.equal( put( actions.updateResponse([]) ) );
      });
      it( 'fork analyzeHrimeResponse with payload', () => {
        expect( saga.next().value )
          .to.deep.equal( fork( analyzeHrimeResponse, { utterance: 'hoge' }) );
      });
    });

    context( 'when payload is array(size > 1),', () => {
      before( () => {
        saga = sagas.responseReceived({ payload: [
          { utterance: 'hoge' },
          { utterance: 'fuga' },
          { utterance: 'piyo' },
        ]});
      });

      it( 'put updateResponse with second and subsequent payload', () => {
        expect( saga.next().value )
          .to.deep.equal( put( actions.updateResponse([
            { utterance: 'fuga' },
            { utterance: 'piyo' },
          ])));
      });
      it( 'fork analyzeHrimeResponse with first payload', () => {
        expect( saga.next().value )
          .to.deep.equal( fork( analyzeHrimeResponse, { utterance: 'hoge' }) );
      });
    });
  });

  describe( 'analyzeNextResponse', () => {
    context( 'when state.response is array(size == 1)', () => {
      before( () => {
        saga = sagas.analyzeNextResponse({ payload: { stopSpeechRecognition: false } });
        saga.next();
      });

      it( 'put updateResponse with empty array', () => {
        expect( saga.next([{ utterance: 'hoge' }]).value )
          .to.deep.equal( put( actions.updateResponse([]) ) );
      });
      it( 'fork analyzeHrimeResponse with response', () => {
        expect( saga.next().value )
          .to.deep.equal( fork( analyzeHrimeResponse, { utterance: 'hoge' } ) );
      });
    });

    context( 'when state.response is array(size > 1)', () => {
      before( () => {
        saga = sagas.analyzeNextResponse({ payload: { stopSpeechRecognition: false } });
        saga.next();
      });

      it( 'put updateResponse with second and subsequent response', () => {
        expect( saga.next([
          { utterance: 'hoge' },
          { utterance: 'fuga' },
          { utterance: 'piyo' },
        ]).value ).to.deep.equal( put( actions.updateResponse([
          { utterance: 'fuga' },
          { utterance: 'piyo' },
        ]) ) );
      });
      it( 'fork analyzeHrimeResponse with first response', () => {
        expect( saga.next().value )
          .to.deep.equal( fork( analyzeHrimeResponse, { utterance: 'hoge' } ) );
      });
    });

    context( 'when state.response is array(size == 0)', () => {
      before( () => {
        saga = sagas.analyzeNextResponse({ payload: { stopSpeechRecognition: false } });
        saga.next();
      });

      it( 'put responseAnalyzeSucceeded', () => {
        expect( saga.next([]).value )
          .to.deep.equal( put( actions.responseAnalyzeSucceeded( false ) ) );
      });
    });
  });

  describe( 'responseAnalyzeSucceeded', () => {
    context( 'when stopSpeechRecognition is TRUE', () => {
      before( () => {
        saga = sagas.responseAnalyzeSucceeded({ payload: { stopSpeechRecognition: true } });
        saga.next();
      });
      it( 'put updateCharacter with CHARACTER_STATUS.NORMAL', () => {
        expect( saga.next().value )
          .to.deep.equal( put( actions.updateCharacter( CHARACTER_STATUS.NORMAL ) ) );
      });
    });

    context( 'when stopSpeechRecognition is FALSE', () => {
      before( () => {
        saga = sagas.responseAnalyzeSucceeded({ payload: { stopSpeechRecognition: false } });
        saga.next();
      });
      it( 'put startSpeechRecognition', () => {
        expect( saga.next().value )
          .to.deep.equal( put( actions.startSpeechRecognition() ) );
      });
      it( 'put updateCharacter with CHARACTER_STATUS.LISTENING', () => {
        expect( saga.next().value )
          .to.deep.equal( put( actions.updateCharacter( CHARACTER_STATUS.LISTENING ) ) );
      });
    });
  });

  describe( 'dialogRoot', () => {
    before( () => {
      saga = sagas.dialogRoot();
    });
    it( 'fork registerHandler', () => {
      expect( saga.next().value ).to.deep.equal( fork( sagas.registerHandler ) );
    });
    it( 'fork sendMessageEventWatcher', () => {
      expect( saga.next().value ).to.deep.equal( fork( sagas.sendMessageEventWatcher ) );
    });
    it( 'fork responseReceivedEventWatcher', () => {
      expect( saga.next().value ).to.deep.equal( fork( sagas.responseReceivedEventWatcher ) );
    });
  });
});


