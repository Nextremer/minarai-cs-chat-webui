import path from 'path';
import { createAction } from 'redux-actions';
import { expect } from 'chai';
import { spy } from 'sinon';
import mock from 'mock-require';
import { FACE_DETECTION } from '../../src/js/consts';

let actions = null;
let reducer = null;

describe( 'Reducers > Face Detection', () => {
  beforeEach(() => {
    global.window = global;
    global.window.setupWebGL = spy();
    mock( 'react-redux-saga-face-detector', {
      actions: {
        FACE_DETECTED: 'FACE_DETECTED',
        faceDetected: createAction( 'FACE_DETECTED' ),
        FACE_LOST: 'FACE_LOST',
        faceLost: createAction( 'FACE_LOST' ),
      }
    });

    actions = require('react-redux-saga-face-detector').actions;
    reducer = require( path.resolve('src/js/reducers/faceDetection.js') ).default;
  });
  it( 'returns default state', () => {
    const state = reducer( undefined, { type: '' } );
    expect( state ).to.deep.equal( FACE_DETECTION.LOST );
  });

  it ('face detected', () => {
    const state = reducer( undefined, actions.faceDetected() );
    expect( state ).to.deep.equal( FACE_DETECTION.DETECTED );
  });
  it ('face lost', () => {
    const state = reducer( undefined, actions.faceLost() );
    expect( state ).to.deep.equal( FACE_DETECTION.LOST );
  });
});

