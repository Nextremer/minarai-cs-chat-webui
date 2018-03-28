import { expect } from 'chai';
import reducer from '../../src/js/reducers/reservation';
import * as actions from '../../src/js/actions';

const initial_info = {
  reserved: null,
  name: null,
  date: null,
  smoking: null,
  postal: null,
  address: null,
  isPaid: null,
}

describe( 'Reducers > Reservation', () => {
  it( 'returns default state', () => {
    const state = reducer( undefined, { type: '' } );
    expect( state ).have.keys([ 'visible', 'info' ]);
    expect( state.visible ).to.be.false;
    expect( state.info ).to.deep.equal( initial_info );
  });

  context( 'update reservation', () => {
    it ('update name', () => {
      const state = reducer( undefined, actions.updateReservation({ name: { value: 'hoge', fixed: false } }) );
      expect( state ).have.keys([ 'visible', 'info' ]);
      expect( state.visible ).to.be.false;
      expect( state.info ).to.deep.equal({
        ...initial_info,
        name: { value: 'hoge', fixed: false },
      });
    });

    it ('update smoking', () => {
      const state = reducer( undefined, actions.updateReservation({ smoking: { value: true, fixed: true } }) );
      expect( state ).have.keys([ 'visible', 'info' ]);
      expect( state.visible ).to.be.false;
      expect( state.info ).to.deep.equal({
        ...initial_info,
        smoking: { value: true, fixed: true },
      });
    });

    it ('update all', () => {
      const changeTo = {
        reserved: { value: true, fixed: true },
        name: { value: 'hoge', fixed: true },
        date: { value: '2016/4/28', fixed: true },
        smoking: { value: true, fixed: true },
        postal: { value: '100-0001', fixed: true },
        address: { value: 'Tokyo', fixed: true },
        isPaid: { value: false, fixed: true }
      };
      const state = reducer( undefined, actions.updateReservation( changeTo ));
      expect( state ).have.keys([ 'visible', 'info' ]);
      expect( state.visible ).to.be.false;
      expect( state.info ).to.deep.equal( changeTo );
    });
  });

  context( 'update visible', () => {
    it ('to show', () => {
      const state = reducer( undefined, actions.showReservation() );
      expect( state ).have.keys([ 'visible', 'info' ]);
      expect( state.visible ).to.be.true;
      expect( state.info ).to.deep.equal( initial_info );
    });
    it ('to hide', () => {
      const state = reducer( undefined, actions.hideReservation() );
      expect( state ).have.keys([ 'visible', 'info' ]);
      expect( state.visible ).to.be.false;
      expect( state.info ).to.deep.equal( initial_info );
    });
  });
});

