import { takeEvery, takeLatest, eventChannel } from 'redux-saga';
import { call, put, select, fork, take } from 'redux-saga/effects';
import * as actions from 'actions';
import { appendEntries } from './dialog';
import 'axios';
import config from 'conf';


const createObjectURL = ( window.URL && window.URL.createObjectURL ) ||
                        ( window.webkitURL && window.webkitURL.createObjectURL );


function readFile(file) {
  return new Promise( resolve => {
    if ( createObjectURL ) {
      resolve( createObjectURL( file ) );
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      resolve( reader.result );
    };

    reader.readAsDataURL( file );
  } );
}

export function* selectFile( { payload: fileForUpload } ) {
  const fileSizeOver = yield select( state => state.fileUpload.fileSizeOver );
  if ( fileSizeOver ) {
    alert( '5MB 以上のファイルはアップロードできません' );
  } else {
    const dataUrl = yield readFile( fileForUpload );
    yield put( actions.setPreviewImage( dataUrl ) );
  }
}

export function* selectFileEventWatcher() {
  yield* takeEvery( actions.SELECT_FILE, selectFile );
}

// function upload( clientId, file ) {
//   const formData = new FormData();
//   formData.append( 'client_id', encodeURIComponent( clientId ) );
//   formData.append( 'file', file, file.name );

//   return axios.post( config.fileUploadUrl, formData )
//               .then( res => {
//                 if ( res.data.ok ) {
//                   return { result: res.data };
//                 } else {
//                   return { err: res.data.message };
//                 }
//               } )
//               .catch( err => {
//                 return { err };
//               } );
// }

function upload( client, clientId, file ) {
  return client.uploadImage(file);
}

export function* sendFileEntry( payload ) {
  const socket = yield select( state => state.dialog.socket );
  if ( !!socket ) {
    socket.send( {
      entries: [
        {
          ...payload,
          type: 'file'
        }
      ]
    } );
  } else {
    console.error( 'No Dialog Engine Specified' );
  }
}

export function* fileUpload( { payload } ) {
  yield put( actions.fileUploadBegin() );
  const client = yield select(state => state.dialog.socket.minaraiClient);

  const { result, err } = yield upload( client, payload.clientId, payload.file );
  console.log(result, err)
  if ( err ) {
    yield put( actions.fileUploadFailed() );
  } else {
    const originalFileName = payload.file.name.split( '/' ).pop();

    yield put( actions.fileUploadEnd() );
    // yield put( actions.appendEntries([{
    //   entry: {url: result.url, originalFileName: originalFileName,
    //           type: 'file'}}]) );
    // yield fork( sendFileEntry, { url: result.url, originalFileName: originalFileName } );
  }
}

export function* fileUploadEventWatcher() {
  yield* takeEvery( actions.FILE_UPLOAD, fileUpload );
}

export function* fileUploadRoot() {
  yield fork( selectFileEventWatcher );
  yield fork( fileUploadEventWatcher );
}
