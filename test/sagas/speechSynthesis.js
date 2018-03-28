import 'babel-polyfill';
import path from 'path';
import mock from 'mock-require';
import { spy } from 'sinon';
import { expect } from 'chai';
import * as actions from '../../src/js/actions';
import { takeEvery } from 'redux-saga';
import { call, put, select, take, fork } from 'redux-saga/effects';
// import * as sagas from '../../src/js/sagas/speechSynthesis';
import { WebSpeechSynthesis, AITalkSynthesis } from '../../src/js/utils/speechSynthesis';
import conf from '../../src/js/conf';

let sagas, synthesizer, saga, stub;
const file = path.resolve('src/js/sagas/speechSynthesis.js');
describe( 'Sagas > Speech Synthesis', () => {
  beforeEach(() => {
    global.window = global;
    global.SpeechSynthesisUtterance = spy();
    global.AudioContext = spy();
    global.speechSynthesis = {
      getVoices: () => {},
      speech: () => {},
    }
  });

  describe( 'startSynthesis', () => {
    context( 'when synthesis is not defined', () => {
      before( () => {
        sagas = require( file );
        saga = sagas.startSpeechSynthesis({ payload: { text: 'hoge' } });
        saga.next();
        stub = spy( console, 'error');
      });

      after( () => {
        console.error.restore();
        delete require.cache[file];
      });

      it('put failure action', () => {
        expect( saga.next( null ).done ).to.be.true;
        expect( stub.withArgs( 'No Synthesis API Specified' ).callCount ).to.be.equal( 1 );
      });
    });

    context('when valid synthesizer is specified', () => {
      let synthesizers;
      before( () => {
        synthesizers = {
          'en-US': {
            male: new WebSpeechSynthesis( 'en-US', 'Bruce' ),
            female: new AITalkSynthesis( 'en-US', 'Kathy' ),
          },
          'ja-JP': {
            male: new WebSpeechSynthesis( 'ja-JP', 'Otoya' ),
            female: new AITalkSynthesis( 'ja-JP', 'Kyoko' ),
          },
        };
      });
      context( 'when give one sentence', () => {
        context( 'without sex', () => {
          before( () => {
            mock( 'conf', { ...conf, lang: 'en-US' } )
            sagas = require( file );
            saga = sagas.startSpeechSynthesis({ payload: { text: 'hoge' } });
            saga.next();
          });

          after( () => {
            delete require.cache[file];
          });

          it ( 'call changeChatText action with specified text', () => {
            expect( saga.next( synthesizers ).value )
              .to.deep.equal( put( actions.changeChatText({ bot: 'hoge' }) ) );
          });

          it ( 'call synthesizer.start with specified text', () => {
            synthesizer = synthesizers[ 'en-US' ][ 'female' ];
            expect( saga.next().value )
              .to.deep.equal( call([synthesizer, synthesizer.start], 'hoge', 0) );
          });

          it ( 'call speechSynthesisSucceeded action', () => {
            expect( saga.next().value )
              .to.deep.equal( put( actions.speechSynthesisSucceeded() ) );
          });
        });

        context( 'with sex', () => {
          before( () => {
            mock( 'conf', { ...conf, lang: 'ja-JP' } )
            sagas = require( file );
            saga = sagas.startSpeechSynthesis({ payload: { text: 'M:hoge' } });
            saga.next();
          });

          after( () => {
            delete require.cache[file];
          });

          it ( 'call changeChatText action with specified text', () => {
            expect( saga.next( synthesizers ).value )
              .to.deep.equal( put( actions.changeChatText({ bot: 'hoge' }) ) );
          });

          it ( 'call synthesizer.start with specified text', () => {
            synthesizer = synthesizers[ 'ja-JP' ][ 'male' ];
            expect( saga.next().value )
              .to.deep.equal( call([synthesizer, synthesizer.start], 'hoge', 0) );
          });

          it ( 'call speechSynthesisSucceeded action', () => {
            expect( saga.next().value )
              .to.deep.equal( put( actions.speechSynthesisSucceeded() ) );
          });
        });
      });

      context( 'when give separatable sentence', () => {
        let synthesizer;
        before( () => {
          mock( 'conf', { ...conf, lang: 'ja-JP' } )
          sagas = require( file );
          saga = sagas.startSpeechSynthesis({ payload: { text: 'F:hoge[]fuga' } });
          saga.next();
          synthesizer = synthesizers[ 'ja-JP' ][ 'female' ];
        });

        it ( 'call changeChatText action with first text', () => {
          expect( saga.next( synthesizers ).value )
            .to.deep.equal( put( actions.changeChatText({ bot: 'hoge' }) ) );
        });

        it ( 'call synthesizer.start with first text', () => {
          expect( saga.next().value )
            .to.deep.equal( call([synthesizer, synthesizer.start], 'hoge', 100) );
        });

        it ( 'call changeChatText action with second text', () => {
          expect( saga.next().value )
            .to.deep.equal( put( actions.changeChatText({ bot: 'fuga' }) ) );
        });

        it ( 'call synthesizer.start with second text', () => {
          expect( saga.next().value )
            .to.deep.equal( call([synthesizer, synthesizer.start], 'fuga', 0) );
        });

        it ( 'call speechSynthesisSucceeded action', () => {
          expect( saga.next().value )
            .to.deep.equal( put( actions.speechSynthesisSucceeded() ) );
        });
      });
    });
  });

  describe( 'speechSynthesisRoot', () => {
    before( () => {
      saga = sagas.speechSynthesisRoot();
    });

    it( 'fork watchStartSpeechSynthesisEvent', () => {
      expect( saga.next().value ).to.deep.equal( fork( sagas.watchStartSpeechSynthesisEvent ) );
    });
  });
});


