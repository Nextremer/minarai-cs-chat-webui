import { takeEvery, takeLatest, eventChannel, delay } from 'redux-saga';
import { call, put, select, fork, take } from 'redux-saga/effects';
import * as actions from 'actions';
import 'axios';
import { iOS } from '../utils/deviceSuitability';
import config from 'conf';

function getRegisteredInquiries(extra) {
  let result = [];
  if (!extra || !Array.isArray(extra.preparations)) {
    return result;
  }
  for (const preparation of extra.preparations) {
    const { engineType, suggestionList } = preparation;
    if (engineType === "Godspeed" && Array.isArray(suggestionList)) {
      result = result.concat(suggestionList);
    }
  }
  return result;
}

export function* fetchRegisteredInquiries({ payload }) {
  const { extra } = payload;

  const registeredInquiries = getRegisteredInquiries(extra);

  yield put( actions.setRegisteredInquiries( registeredInquiries ) );
}

export function* updateSuggestion({ payload }) {
  if ( yield select( state => state.dialog.toOperator ) ) {
    yield put( actions.updateSuggestion( '' ) );
    return;
  }

  // messageText が文字列が入っている場合は1秒待つ
  // 空の場合は即座に update (全削除後すぐに文字を入力した場合に、削除前のサジェスチョンが出るのを防ぐ)
  if ( payload ) {
    yield call( delay, 100 );
  }

  if ( yield select( state => state.inputField.inputting ) ) {
    yield put( actions.updateSuggestion( payload ) );
  }
}

export function* fetchRegisteredInquiriesWatcher() {
  yield takeEvery( actions.FETCH_REGISTERED_INQUIRIES, fetchRegisteredInquiries );
}

export function* changeMessageTextEventWatcher() {
  yield takeLatest( actions.CHANGE_MESSAGE_TEXT, updateSuggestion );
}

export function* showSuggestion() {
  const messageText = yield select( state => state.messageText );
  yield put( actions.updateSuggestion( messageText ) );
}

export function* inputBeginEventWatcher() {
  yield takeEvery( actions.INPUT_BEGIN, showSuggestion );
}

export function* hideSuggestion() {
  yield put( actions.updateSuggestion( '' ) );
}

export function* inputEndEventWatcher() {
  yield takeEvery( actions.INPUT_END, hideSuggestion );
}

export function* suggestionRoot() {
  yield fork( fetchRegisteredInquiriesWatcher );
  yield fork( changeMessageTextEventWatcher );
  if ( iOS ) {
    yield fork( inputBeginEventWatcher );
    yield fork( inputEndEventWatcher );
  }
}
