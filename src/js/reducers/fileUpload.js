import * as actions from '../actions';

export const initial = {
  fileForUpload: null,
  dataUrl: null,
  uploadStatus: 'no file'
};


const handlers = {
  [ actions.SELECT_FILE ]: ( state, action ) => {
    const fileForUpload = action.payload;

    if ( fileForUpload.size >= 1024 * 1024 * 5 ) {
      // ファイルサイズ超過
      return {
        ...state,
        fileForUpload: null,
        uploadStatus: 'no file',
        fileSizeOver: true
      };
    } else {
      return {
        ...state,
        fileForUpload,
        uploadStatus: 'ready',
        fileSizeOver: false
      };
    }
  },

  [ actions.SET_PREVIEW_IMAGE ]: ( state, action ) => {
    const dataUrl = action.payload;
    return {
      ...state,
      dataUrl
    };
  },

  [ actions.FILE_UPLOAD_CANCEL ]: ( state, action ) => {
    return {
      ...state,
      fileForUpload: null,
      dataUrl: null,
      uploadStatus: 'no file'
    };
  },

  [ actions.FILE_UPLOAD_BEGIN ]: ( state, action ) => {
    return {
      ...state,
      uploading: true,
      uploadStatus: 'uploading'
    };
  },

  [ actions.FILE_UPLOAD_END ]: ( state, action ) => {
    return {
      ...state,
      fileForUpload: null,
      dataUrl: null,
      uploadStatus: 'no file'
    };
  },

  [ actions.FILE_UPLOAD_FAILED ]: ( state, action ) => {
    return {
      ...state,
      uploading: false,
      uploadStatus: 'failed'
    };
  },
};

export default ( state = initial, action ) => {
  const handler = handlers[ action.type ];
  return !handler ? state : handler( state, action );
}
