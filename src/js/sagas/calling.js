import { takeEvery, takeLatest, eventChannel, delay } from 'redux-saga';
import { call, put, select, fork, take, join } from 'redux-saga/effects';
import * as actions from 'actions';


function* callingCancel() {
  const socket = yield select( state => state.dialog.socket );
  socket.cancelCalling();
  yield put(actions.callingCanceled());
}

function* callingCancelEventWatcher() {
  yield* takeEvery( actions.CALLING_CANCEL, callingCancel );
}

export function* callingRoot() {
  yield fork( callingCancelEventWatcher );
}
