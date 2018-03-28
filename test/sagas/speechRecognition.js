import 'babel-polyfill';
import { spy } from 'sinon';
import { expect } from 'chai';
import * as actions from '../../src/js/actions';
import { takeEvery } from 'redux-saga';
import { call, put, select, take, fork } from 'redux-saga/effects';
import * as sagas from '../../src/js/sagas/speechRecognition';
import { WebSpeechRecognition } from '../../src/js/utils/speechRecognition';
import { FACE_DETECTION } from '../../src/js/consts'

let recognizer, saga, stub;
describe( 'Sagas > Speech Recognition', () => {
  before(() => {
    global.window = global;
    global.webkitSpeechRecognition = spy();
    recognizer = new WebSpeechRecognition();
  });
  describe( 'startSpeechRecognition', () => {
    context( 'when speechRecognition succeed', () => {
      before( () => {
        saga = sagas.startSpeechRecognition( recognizer );
      });

      it( 'call speechRecognition start', () => {
        expect( saga.next( recognizer ).value )
          .to.deep.equal( call([ recognizer, recognizer.start ]) );
      });

      it( 'put stopTalkWaiting', () => {
        expect( saga.next({ text: 'hoge' }).value )
          .to.deep.equal( put( actions.stopTalkWaiting()));
      });

      it( 'put speechRecognitionSucceeded action', () => {
        expect( saga.next().value )
          .to.deep.equal(
            put( actions.speechRecognitionSucceeded({ text: 'hoge' }) )
          );
      });
    });

    context( 'when speechRecognition failure', () => {
      before( () => {
        saga = sagas.startSpeechRecognition( recognizer );
        stub = spy( console, 'error');
      });

      after( () => {
        console.error.restore();
      });

      it( 'call speechRecognition start', () => {
        expect( saga.next( recognizer ).value )
          .to.deep.equal( call([ recognizer, recognizer.start ]) );
      });

      it( 'put console error', () => {
        saga.next({ error: 'hoge' });
        expect( stub.withArgs('hoge').callCount ).to.be.equal( 1 );
      });
    });
  });

  describe( 'startTalkWaiting', () => {
    context( 'when faceDetection is FACE_DETECTION.LOST', () => {
      before( () => {
        saga = sagas.startTalkWaiting();
      });

      it( 'put resetLastTalkToUserDate', () => {
        expect( saga.next().value )
          .to.deep.equal( put( actions.resetLastTalkToUserDate() ) );
      });

      it( 'put startTalkWaiting', () => {
        saga.next();
        expect( saga.next( FACE_DETECTION.LOST ).value )
          .to.deep.equal( put( actions.startTalkWaiting() ) );
      });
    });

    context( 'when faceDetection is FACE_DETECTION.DETECTED', () => {
      before( () => {
        saga = sagas.startTalkWaiting();
      });

      it( 'put resetLastTalkToUserDate', () => {
        expect( saga.next().value )
          .to.deep.equal( put( actions.resetLastTalkToUserDate() ) );
      });

      it( "startTalkWaiting is not put", () => {
        saga.next();
        expect( saga.next( FACE_DETECTION.DETECTED ).done ).to.be.true;
      });
    });
  });

  describe( 'startSpeechRecognitionHandler', () => {
    context( 'when recognizer is not specified', () => {
      before( () => {
        saga = sagas.startSpeechRecognitionHandler();
        stub = spy( console, 'error');
      });

      after( () => {
        console.error.restore();
      });

      it( 'fork startTalkWaiting', () => {
        expect( saga.next().value )
          .to.deep.equal( fork( sagas.startTalkWaiting ) );
      });

      it( 'put console error', () => {
        saga.next();
        expect( saga.next( null ).done ).to.be.true;
        expect( stub.withArgs( 'No Speech Recognition API Specified' ).callCount ).to.be.equal( 1 );
      });
    });

    context( 'when recognizer is specified', () => {
      before( () => {
        saga = sagas.startSpeechRecognitionHandler();
      });

      it( 'fork startTalkWaiting', () => {
        expect( saga.next().value )
          .to.deep.equal( fork( sagas.startTalkWaiting ) );
      });

      it( 'fork startSpeechRecognition', () => {
        saga.next();
        expect( saga.next( recognizer ).value )
          .to.deep.equal( fork( sagas.startSpeechRecognition, recognizer ) );
      });
    });
  });

  describe( 'stopSpeechRecognition', () => {
    context( 'when recognizer is not defined', () => {
      before( () => {
        saga = sagas.stopSpeechRecognition();
        saga.next();
        stub = spy( console, 'error');
      });

      after( () => {
        console.error.restore();
      });

      it( 'put failure action', () => {
        expect( saga.next( null ).done ).to.be.true;
        expect( stub.withArgs( 'No Speech Recognition API Specified' ).callCount ).to.be.equal( 1 );
      });
    });

    context( 'when recognizer is specified', () => {
      before( () => {
        saga = sagas.stopSpeechRecognition();
        saga.next();
      });
      it( 'call recognizer.stop', () => {
        expect( saga.next( recognizer ).value )
          .to.deep.equal( call([ recognizer, recognizer.stop ]) );
      });
    });
  });

  describe( 'speechRecognitionRoot', () => {
    before( () => {
      saga = sagas.speechRecognitionRoot();
    });
    it( 'fork startSpeechRecognitionEventWatcher', () => {
      expect( saga.next().value ).to.deep.equal( fork( sagas.startSpeechRecognitionEventWatcher ) );
    });
    it( 'fork stopSpeechRecognitionEventWatcher', () => {
      expect( saga.next().value ).to.deep.equal( fork( sagas.stopSpeechRecognitionEventWatcher ) );
    });
  });
});


