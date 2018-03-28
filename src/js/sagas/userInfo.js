import { select, fork } from 'redux-saga/effects';

export function* sendUserInfo() {
  const query = decodeURIComponent(location.search);
  const params = query.replace( /^(\?|#\&)/, '' );

  if ( !params ) {
    return;
  }

  for ( const param of params.split( '&' ) ) {
    const [ k, v ] = param.split( '=' );

    if ( k === 'param' && v ) {
      try {
        const payload = JSON.parse(v);
        const socket = yield select( state => state.dialog.socket );
        socket.sendSystemCommand( 'set-user-info', payload );
      } catch ( e ) {
        throw 'invalid user info.';
      }
      return;
    }
  }
}

export function* userInfoRoot() {
  yield fork( sendUserInfo );
}
