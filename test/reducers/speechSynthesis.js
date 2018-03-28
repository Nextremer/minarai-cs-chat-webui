import path from 'path';
import mock from 'mock-require';
import { expect } from 'chai';
import { spy, stub } from 'sinon';
import * as actions from '../../src/js/actions';
import { WebSpeechSynthesis, AITalkSynthesis } from '../../src/js/utils/speechSynthesis';
import conf from '../../src/js/conf';

describe( 'Reducers > Speech Synthesis', () => {
  beforeEach(() => {
    global.window = global;
    global.SpeechSynthesisUtterance = spy();
    global.AudioContext = spy();
    global.speechSynthesis = {
      getVoices: () => {},
      speech: () => {},
    };
  });

  context( 'returns default state', () => {
    const file = path.resolve('src/js/reducers/speechSynthesis.js');

    beforeEach(() => {
      delete require.cache[file];
    });

    it( 'make synthesizer from conf', () => {
      mock( 'conf', {
        ...conf,
        speechSynthesis: {
          ...conf.speechSynthesis,
          'en-US': {
            male: {
              api: 'WEB_SPEECH_API',
              voice: 'Bruce'
            },
            female: {
              api: 'AI_TALK',
              voice: 'Kathy'
            },
          },
          'ja-JP': {
            male: {
              api: 'WEB_SPEECH_API',
              voice: 'Otoya'
            },
            female: {
              api: 'AI_TALK',
              voice: 'Kyoko'
            },
          }
        }
      });

      const reducer = require(file);
      const state = reducer.default( undefined, { type: '' } );

      expect( state ).to.deep.equal({
        speechSynthesizer: {
          'en-US': {
            male: new WebSpeechSynthesis( 'en-US', 'Bruce' ),
            female: new AITalkSynthesis( 'en-US', 'Kathy' ),
          },
          'ja-JP': {
            male: new WebSpeechSynthesis( 'ja-JP', 'Otoya' ),
            female: new AITalkSynthesis( 'ja-JP', 'Kyoko' ),
          },
        }
      });
    });
  });
});

