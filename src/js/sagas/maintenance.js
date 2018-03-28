import { takeEvery, takeLatest, eventChannel, delay } from 'redux-saga';
import { call, put, select, fork, take } from 'redux-saga/effects';
import * as actions from 'actions';
import { checkMaintenance, redirectToMaintenance } from '../utils/maintenance';
import { htmlize } from '../utils/sanitize';
import config from 'conf';


export function* transitToMaintenance() {
  const html = htmlize( config.maintenance.transitionMessage );
  yield put( actions.setNotificationHtml( html ) );
  yield put( actions.showNotificationView() );
  yield call( delay, config.maintenance.transitionDelay );
  redirectToMaintenance();
}

export function* transitToMaintenanceEventWatcher() {
  yield* takeEvery( actions.TRANSIT_TO_MAINTENANCE, transitToMaintenance );
}


function subscribe( socket ) {
  return eventChannel( emit => {
    const socketioClient = socket.minaraiClient.socket;

    socketioClient.on( 'connect_error', payload => {
      console.log( 'socket connect_error' );

      checkMaintenance()
        .catch( () => {
          console.log( 'now under maintenance...' );
          emit( actions.transitToMaintenance() );
        } );
    } );

    return () => {};
  } );
}

export function* observeSocketConnectError() {
  const socket = yield select( state => state.dialog.socket );

  if ( !!socket ) {
    const channel = yield call( subscribe, socket );
    while( true ) {
      let action = yield take( channel );
      yield put( action );
    }
  }
}


export function* maintenanceRoot() {
  yield fork( observeSocketConnectError );
  yield fork( transitToMaintenanceEventWatcher );
}
