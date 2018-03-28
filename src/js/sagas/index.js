import { put, fork } from 'redux-saga/effects';
import { dialogRoot } from './dialog';
import { callingRoot } from './calling';
import { suggestionRoot } from './suggestion';
import { inputFieldRoot } from './inputField';
import { fileUploadRoot } from './fileUpload';
import { userInfoRoot } from './userInfo';
import { maintenanceRoot } from './maintenance';
import * as actions from 'actions';
import config from 'conf';

export default function* rootSaga() {
  yield fork( dialogRoot );
  yield fork( callingRoot );
  yield fork( suggestionRoot );
  yield fork( inputFieldRoot );
  yield fork( fileUploadRoot );
  yield fork( userInfoRoot );
  yield fork( maintenanceRoot );
}
