const s3StaticUrl = 'https://s3-ap-northeast-1.amazonaws.com/nextremer-dev/static';

export default {
  lang: 'ja-JP',
  minarai: {
    url: 'https://socketio-connector.minarai.ch/', // to Socket.IO connector
    apiVersion: 'v1',
    applicationId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    applicationSecret: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    userId: 'dummy',
  },
  suggestionListJsonURL: 'http://localhost:3000/suggestionList.json',
  fileUploadUrl: 'http://localhost:3000/file/user',
  accessReportURL: '/access',
  errorReportURL: '/error',
  maintenance: {
    maintenanceStateUrl: '/maintenance/state',
    maintenanceUrl: '/maintenance',
    transitionMessage: 'ただいまシステムメンテナンス中です。\n10秒後にページが切り替わります。',
    transitionDelay: 10000,
  },
  suitableDevices: {
    mobile: true,
    pc: true
  },
  assets: {
    backgroundImgUrl: s3StaticUrl + '/background.png',
    fileIconUrl: s3StaticUrl + '/file_icon.png',
    faceBotUrls: {
      normal: s3StaticUrl + '/icon_bot_default.png',
      sad: s3StaticUrl + '/icon_bot_sad.png',
    },
    faceOperatorDefaultUrl: s3StaticUrl + '/icon_operator_default.png',
    faceUserUrl: s3StaticUrl + '/icon_user.png',
  },
  specialButtonCaptions: []
};
