import path from 'path';
import { expect } from 'chai';
import * as actions from '../../src/js/actions';
import { Dialog } from '../../src/js/utils/dialog';

describe( 'Reducers > Dialog', () => {
  beforeEach(() => {
    global.appConfig = {
      dialog: {
        url: 'http://localhost:3000',
        basic: {
          user: 'dummy',
          pass: 'dummy'
        }
      },
    };
  });

  it( 'returns default state', () => {
    const file = path.resolve('src/js/reducers/dialog.js');
    delete require.cache[file];

    const reducer = require(file);
    const state = reducer.default( undefined, { type: '' } );

    expect( state ).to.be.not.empty;
    expect( state.socket ).to.be.an.instanceof( Dialog );
  });
});

