import 'babel-polyfill';
import { spy, useFakeTimers } from 'sinon';
import { expect } from 'chai';
import mock from 'mock-require';
import path from 'path';
import moment from 'moment';
import { put, fork, call } from 'redux-saga/effects';
import { createAction } from 'redux-actions';
import * as actions from '../../src/js/actions';
import { Dialog } from '../../src/js/utils/dialog';
import { CHARACTER_STATUS } from '../../src/js/consts';
import conf from '../../src/js/conf';
import * as msFace from '../../src/js/utils/msFace';

let sagas, fdActions, socket, saga, stub, clock, socketStub, msFaceStub;
const file = path.resolve('src/js/sagas/faceDetector.js');
describe( 'Sagas > Face Detector', () => {
  before(() => {
    mock( 'react-redux-saga-face-detector', {
      actions: {
        faceDetectStart: createAction( 'FACE_DETECT_START' )
      }
    });
    fdActions = require('react-redux-saga-face-detector').actions;
    socket = new Dialog();
  });

  describe( 'faceDetectorReadyHandler', () => {
    before( () => {
      sagas = require( file );
    });
    after( () => {
      delete require.cache[file];
    });
    it( 'put faceDetectStart action', () => {
      const saga = sagas.faceDetectorReadyHandler();
      expect( saga.next().value ).to.deep.equal( put( fdActions.faceDetectStart() ) );
    });
  });

  describe( 'faceDetectedHandler', () => {
    context('when socket to connect to dialog engine is not defined', () => {
        before( () => {
          mock('conf', { ...conf, MsFace: { ...conf.MsFace, enabled: true }});
          clock = useFakeTimers();
          sagas = require( file );
          saga = sagas.faceDetectedHandler({ payload:
            { position: null, size: null, dataURL: 'hoge' }
          });
        });

        after( () => {
          delete require.cache[file];
          clock.restore();
        });

        it('put stopTalkWaiting', () => {
          expect( saga.next().value )
            .to.deep.equal( put( actions.stopTalkWaiting() ) );
          saga.next( null );
        });

        it('put changeUserFace', () => {
          expect( saga.next().value )
            .to.deep.equal( put( actions.changeUserFace( 'hoge' ) ) );
        });
    });

    context('when socket is specified', () => {
      context('and MsFace is disabled,', () => {
        before( () => {
          mock('conf', { ...conf, MsFace: { ...conf.MsFace, enabled: false }});
          clock = useFakeTimers();
          sagas = require( file );
          saga = sagas.faceDetectedHandler({ payload:
            { position: null, size: null, dataURL: 'hoge' }
          });
        });

        after( () => {
          delete require.cache[file];
          clock.restore();
        });

        beforeEach( () =>{
          socketStub = spy( socket, 'sendSystemCommand' );
        });

        afterEach( () => {
          socket.sendSystemCommand.restore();
        });

        it('put stopTalkWaiting', () => {
          expect( saga.next().value )
            .to.deep.equal( put( actions.stopTalkWaiting() ) );
          saga.next( null );
        });

        it('send system command and put talkToUser', () => {
          const now = moment( new Date() );
          expect( saga.next( socket ).value )
            .to.deep.equal( put( actions.talkToUser({ now }) ) );
          expect( socketStub.calledOnce ).to.be.true;
          expect( socketStub.withArgs( 'customer-detected' ).callCount ).to.be.equal( 1 );
        });

        it('send system command and put changeUserFace', () => {
          expect( saga.next().value )
            .to.deep.equal( put( actions.changeUserFace( 'hoge' ) ) );
        });
      });
      context('and MsFace is enabled,', () => {
        before( () => {
          mock('conf', { ...conf, MsFace: { ...conf.MsFace, enabled: true }});
          clock = useFakeTimers();
          sagas = require( file );
          saga = sagas.faceDetectedHandler({ payload:
            { position: null, size: null, dataURL: 'hoge' }
          });
        });

        after( () => {
          delete require.cache[file];
          clock.restore();
        });

        beforeEach( () =>{
          socketStub = spy( socket, 'sendSystemCommand' );
          msFaceStub = spy( msFace, 'request' );
        });

        afterEach( () => {
          socket.sendSystemCommand.restore();
          msFace.request.restore();
        });

        it('put stopTalkWaiting', () => {
          expect( saga.next().value )
            .to.deep.equal( put( actions.stopTalkWaiting() ) );
          saga.next( null );
        });

        it('send system command and put talkToUser', () => {
          const now = moment( new Date() );
          expect( saga.next( socket ).value )
            .to.deep.equal( put( actions.talkToUser({ now }) ) );
          expect( socketStub.calledOnce ).to.be.true;
          expect( socketStub.withArgs( 'customer-detected' ).callCount ).to.be.equal( 1 );
        });

        it('call msFace.request', () => {
          expect( saga.next().value )
            .to.deep.equal( call( msFace.request, 'hoge' ) );
        });

        it('send system command and put changeUserFace', () => {
          expect( saga.next({ data: [{ faceAttributes: 'hoge' }] }).value )
            .to.deep.equal( put( actions.changeUserFace( 'hoge' ) ) );
          expect( socketStub.calledOnce ).to.be.true;
          expect( socketStub.withArgs( 'log-face-attr', [ 'hoge' ] ).callCount ).to.be.equal( 1 );
        });
      });
    });
  });

  describe( 'faceInterimReportHandler', () => {
    before( () => {
      sagas = require( file );
    });
    after( () => {
      delete require.cache[file];
    });
    it( 'put changeUserFace', () => {
      saga = sagas.faceInterimReportHandler({ payload:
        { position: null, size: null, dataURL: 'hoge' }
      });
      expect( saga.next().value )
        .to.deep.equal( put( actions.changeUserFace( 'hoge' ) ) );
    });
  });

  describe( 'faceLostHandler', () => {
    before( () => {
      sagas = require( file );
    });
    after( () => {
      delete require.cache[file];
    });
    context('when socket to connect to dialog engine is not defined,', () => {
      context('and speechRecognizer is not stopped,', () => {
        before( () => {
          saga = sagas.faceLostHandler();
          saga.next();
        });

        it('put startTalkWaiting', () => {
          expect( saga.next({ stopped: false }).value )
            .to.deep.equal( put( actions.startTalkWaiting() ) );
        });

        it('put clearUserFace', () => {
          saga.next();
          expect( saga.next( null ).value )
            .to.deep.equal( put( actions.clearUserFace() ) );
        });
      });
      context('and speechRecognizer is stopped,', () => {
        before( () => {
          saga = sagas.faceLostHandler();
          saga.next();
          saga.next({ stopped: true });
        });

        it('put clearUserFace', () => {
          expect( saga.next( null ).value )
            .to.deep.equal( put( actions.clearUserFace() ) );
        });
      });
    });

    context('when socket is specified', () => {
      context('and speechRecognizer is not stopped,', () => {
        before( () => {
          saga = sagas.faceLostHandler();
          saga.next();
          stub = spy( socket, 'sendSystemCommand' );
        });
        after( () => {
          socket.sendSystemCommand.restore();
        });

        it('put startTalkWaiting', () => {
          expect( saga.next({ stopped: false }).value )
            .to.deep.equal( put( actions.startTalkWaiting() ) );
        });

        it('send system command and put clearUserFace', () => {
          saga.next();
          const ret = saga.next( socket );
          expect( stub.withArgs( 'customer-lost', {} ).callCount ).to.be.equal( 1 );
          expect( ret.value ).to.deep.equal( put( actions.clearUserFace() ) );
        });
      });

      context('and speechRecognizer is stopped,', () => {
        before( () => {
          saga = sagas.faceLostHandler();
          saga.next();
          saga.next({ stopped: true });
          stub = spy( socket, 'sendSystemCommand' );
        });
        after( () => {
          socket.sendSystemCommand.restore();
        });

        it('send system command and put clearUserFace', () => {
          const ret = saga.next( socket );
          expect( stub.withArgs( 'customer-lost', {} ).callCount ).to.be.equal( 1 );
          expect( ret.value ).to.deep.equal( put( actions.clearUserFace() ) );
        });
      });
    });
  });

  describe( 'faceDetectorRoot', () => {
    before( () => {
      sagas = require( file );
      saga = sagas.faceDetectorRoot();
    });
    after( () => {
      delete require.cache[file];
    });

    it( 'fork faceDetectorReadyWatcher', () => {
      expect( saga.next().value )
        .to.deep.equal( fork( sagas.faceDetectorReadyWatcher ) );
    });
    it( 'fork faceDetectedWatcher', () => {
      expect( saga.next().value )
        .to.deep.equal( fork( sagas.faceDetectedWatcher ) );
    });
    it( 'fork faceInterimReportWatcher', () => {
      expect( saga.next().value )
        .to.deep.equal( fork( sagas.faceInterimReportWatcher ) );
    });
    it( 'fork faceLostWatcher', () => {
      expect( saga.next().value )
        .to.deep.equal( fork( sagas.faceLostWatcher ) );
    });
  });
});


