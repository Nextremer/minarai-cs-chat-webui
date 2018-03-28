import { takeEvery } from 'redux-saga';
import { select, fork, put } from 'redux-saga/effects';
import * as actions from 'actions';

function* touchEnd() {
  const inputting = yield select( state => state.inputField.inputting );
  if ( inputting ) {
    const element = document.activeElement;
    if ( element ) {
      element.blur();
    }
  }
}

function* touchMoveEventWatcher() {
  yield takeEvery( actions.TOUCH_END, touchEnd );
}

export function* inputFieldRoot() {
  yield fork( touchMoveEventWatcher );
}
