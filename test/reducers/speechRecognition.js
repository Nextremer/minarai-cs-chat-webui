import path from 'path';
import mock from 'mock-require';
import { expect } from 'chai';
import { spy } from 'sinon';
import * as actions from '../../src/js/actions';
import { WebSpeechRecognition } from '../../src/js/utils/speechRecognition';
import conf from '../../src/js/conf';

describe( 'Reducers > Speech Recognition', () => {
  beforeEach(() => {
    global.window = global;
    global.webkitSpeechRecognition = spy();
  });

  context( 'returns default state', () => {
    const file = path.resolve('src/js/reducers/speechRecognition.js');

    beforeEach(() => {
      delete require.cache[file];
    });

    it( 'recognition api is not specified', () => {
      mock('conf', { ...conf, speechRecognition: {
        ...conf.speechRecognition,
        api: ''
      }});

      const reducer = require(file);
      const state = reducer.default( undefined, { type: '' } );

      expect( state ).to.deep.equal({ speechRecognizer: null });
    });

    it( 'recognition api is WEB_SPEECH_API', () => {

      mock('conf', conf);
      const reducer = require(file);
      const state = reducer.default( undefined, { type: '' } );

      expect( state ).to.be.not.empty;
      expect( state.speechRecognizer ).to.be.an.instanceof( WebSpeechRecognition );
    });
  });
});

