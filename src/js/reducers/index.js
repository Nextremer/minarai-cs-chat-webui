import timeline from './timeline';
import dialog from './dialog';
import messageText from './messageText';
import suggestion from './suggestion';
import fileUpload from './fileUpload';
import gallery from './gallery';
import inputField from './inputField';
import notification from './notification';
import calling from './calling';
import { combineReducers } from 'redux';

export default combineReducers({
  timeline,
  dialog,
  messageText,
  suggestion,
  fileUpload,
  gallery,
  inputField,
  notification,
  calling,
});
