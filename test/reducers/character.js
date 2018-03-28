import { expect } from 'chai';
import reducer from '../../src/js/reducers/character';
import * as actions from '../../src/js/actions';
import { CHARACTER_STATUS } from '../../src/js/consts';

describe( 'Reducers > Character', () => {
  it( 'returns default state', () => {
    const state = reducer( undefined, { type: '' } );
    expect( state ).to.deep.equal( CHARACTER_STATUS.NORMAL );
  });

  context( 'update character', () => {
    it ('to listening', () => {
      const changeTo = CHARACTER_STATUS.LISTENING;
      const state = reducer( undefined, actions.updateCharacter( changeTo ) );
      expect( state ).to.deep.equal( changeTo );
    });
    it ('to speaking(normal)', () => {
      const changeTo = CHARACTER_STATUS.SPEAKING.NORMAL;
      const state = reducer( undefined, actions.updateCharacter( changeTo ) );
      expect( state ).to.deep.equal( changeTo );
    });
  });
});

