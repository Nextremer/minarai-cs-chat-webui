import { createAction } from 'redux-actions';

// Dialog
export const CONNECT = 'CONNECT';
export const CONNECTED = 'CONNECTED';
export const INTERCEPT = 'INTERCEPT';
export const INTERCEPT_CANCEL = 'INTERCEPT_CANCEL';
export const TAKE_OVER = 'TAKE_OVER';
export const TAKE_OVER_CANCEL = 'TAKE_OVER_CANCEL';

export const connect = createAction( CONNECT );
export const connected = createAction( CONNECTED );
export const intercept = createAction( INTERCEPT );
export const interceptCancel = createAction( INTERCEPT_CANCEL );
export const takeOver = createAction( TAKE_OVER );
export const takeOverCancel = createAction( TAKE_OVER_CANCEL );

// Window
export const TOUCH_END = 'TOUCH_END';

export const touchEnd = createAction( TOUCH_END );

// Timeline
export const APPEND_ENTRIES = 'APPEND_ENTRIES';
export const APPEND_HISTORY = 'APPEND_HISTORY';
export const SET_PENDING_ENTRY = 'SET_PENDING_ENTRY';
export const SET_DESTINATION = 'SET_DESTINATION';
export const SET_SCROLL_TOP = 'SET_SCROLL_TOP';
export const AUTO_SCROLLING_BEGIN = 'AUTO_SCROLLING_BEGIN';
export const AUTO_SCROLLING_END = 'AUTO_SCROLLING_END';
export const SET_SCROLLED_TO_BOTTOM = 'SET_SCROLLED_TO_BOTTOM';
export const SET_SCROLLED_TO_TOP = 'SET_SCROLLED_TO_TOP';
export const SET_BOT_UTTERANCE_DELAY = 'SET_BOT_UTTERANCE_DELAY';
export const SET_LOG_COMPLETED = 'SET_LOG_COMPLETED';
export const SET_FIRST_LOG = 'SET_FIRST_LOG';
export const SET_OLDEST_TIMESTAMP = 'SET_OLDEST_TIMESTAMP';
export const SOCKET_CONNECTED = 'SOCKET_CONNECTED';
export const SET_RETRIEVE_HISTORY_LOCKED = 'SET_RETRIEVE_HISTORY_LOCKED';
export const RETRIEVE_HISTORY = 'RETRIEVE_HISTORY';

export const appendEntries = createAction( APPEND_ENTRIES );
export const appendHistory = createAction( APPEND_HISTORY );
export const setPendingEntry = createAction( SET_PENDING_ENTRY );
export const setDestination = createAction( SET_DESTINATION );
export const setScrollTop = createAction( SET_SCROLL_TOP );
export const autoScrollingBegin = createAction( AUTO_SCROLLING_BEGIN );
export const autoScrollingEnd = createAction( AUTO_SCROLLING_END );
export const setScrolledToBottom = createAction( SET_SCROLLED_TO_BOTTOM );
export const setScrolledToTop = createAction( SET_SCROLLED_TO_TOP );
export const setBotUtteranceDelay = createAction( SET_BOT_UTTERANCE_DELAY );
export const setLogCompleted = createAction( SET_LOG_COMPLETED );
export const setFirstLog = createAction( SET_FIRST_LOG );
export const setOldestTimestamp = createAction( SET_OLDEST_TIMESTAMP );
export const socketConnected = createAction( SOCKET_CONNECTED );
export const setRetrieveHistoryLocked = createAction( SET_RETRIEVE_HISTORY_LOCKED );
export const retrieveHistory = createAction( RETRIEVE_HISTORY );

// Dialog Engine
export const SEND_MESSAGE = 'SEND_MESSAGE';
export const BUTTON_PRESSED = 'BUTTON_PRESSED';
export const RESPONSE_RECEIVED = 'RESPONSE_RECEIVED';
export const SYNC_RECEIVED = 'SYNC_RECEIVED';
export const LOGS_RECEIVED = 'LOGS_RECEIVED';
export const SYSTEM_COMMAND_RECEIVED = 'SYSTEM_COMMAND_RECEIVED';
export const OPERATOR_COMMAND_RECEIVED = 'OPERATOR_COMMAND_RECEIVED';

export const sendMessage = createAction( SEND_MESSAGE );
export const buttonPressed = createAction( BUTTON_PRESSED );
export const responseReceived = createAction( RESPONSE_RECEIVED );
export const syncReceived = createAction( SYNC_RECEIVED );
export const logsReceived = createAction( LOGS_RECEIVED );
export const systemCommandReceived = createAction( SYSTEM_COMMAND_RECEIVED );
export const operatorCommandReceived = createAction( OPERATOR_COMMAND_RECEIVED );

// Text
export const CHANGE_MESSAGE_TEXT = 'CHANGE_MESSAGE_TEXT';
export const SET_FORM_TEMPLATE = 'SET_FORM_TEMPLATE';

export const changeMessageText = createAction( CHANGE_MESSAGE_TEXT );
export const setFormTemplate = createAction( SET_FORM_TEMPLATE );

// Suggest
export const FETCH_REGISTERED_INQUIRIES = 'FETCH_REGISTERED_INQUIRIES';
export const SET_REGISTERED_INQUIRIES = 'SET_REGISTERED_INQUIRIES';
export const UPDATE_SUGGESTION = 'UPDATE_SUGGESTION';
export const RESET_SUGGESTION = 'RESET_SUGGESTION';

export const fetchRegisteredInquiries = createAction( FETCH_REGISTERED_INQUIRIES );
export const setRegisteredInquiries = createAction( SET_REGISTERED_INQUIRIES );
export const updateSuggestion = createAction( UPDATE_SUGGESTION );
export const resetSuggestion = createAction( RESET_SUGGESTION );

// File Upload
export const SELECT_FILE = 'SELECT_FILE';
export const FILE_UPLOAD = 'FILE_UPLOAD';
export const FILE_UPLOAD_CANCEL = 'FILE_UPLOAD_CANCEL';
export const FILE_UPLOAD_BEGIN = 'FILE_UPLOAD_BEGIN';
export const FILE_UPLOAD_END = 'FILE_UPLOAD_END';
export const FILE_UPLOAD_FAILED = 'FILE_UPLOAD_FAILED';
export const SET_PREVIEW_IMAGE = 'SET_PREVIEW_IMAGE';

export const selectFile = createAction( SELECT_FILE );
export const fileUpload = createAction( FILE_UPLOAD );
export const fileUploadCancel = createAction( FILE_UPLOAD_CANCEL );
export const fileUploadBegin = createAction( FILE_UPLOAD_BEGIN );
export const fileUploadEnd = createAction( FILE_UPLOAD_END );
export const fileUploadFailed = createAction( FILE_UPLOAD_FAILED );
export const setPreviewImage = createAction( SET_PREVIEW_IMAGE );

// Gallery
export const OPEN_GALLERY = 'OPEN_GALLERY';
export const CLOSE_GALLERY = 'CLOSE_GALLERY';

export const openGallery = createAction( OPEN_GALLERY );
export const closeGallery = createAction( CLOSE_GALLERY );

// Calling
export const CALLING_BEGIN = 'CALLING_BEGIN';
export const CALLING_CANCEL = 'CALLING_CANCEL';
export const CALLING_CANCELED = 'CALLING_CANCELED';

export const callingBegin = createAction( CALLING_BEGIN );
export const callingCancel = createAction( CALLING_CANCEL );
export const callingCanceled = createAction( CALLING_CANCELED );

// Notification
export const SET_NOTIFICATION_HTML = 'SET_NOTIFICATION_HTML';
export const SHOW_NOTIFICATION_VIEW = 'SHOW_NOTIFICATION_VIEW';
export const HIDE_NOTIFICATION_VIEW = 'HIDE_NOTIFICATION_VIEW';

export const setNotificationHtml = createAction( SET_NOTIFICATION_HTML );
export const showNotificationView = createAction( SHOW_NOTIFICATION_VIEW );
export const hideNotificationView = createAction( HIDE_NOTIFICATION_VIEW );

// InputField
export const INPUT_BEGIN = 'INPUT_BEGIN';
export const INPUT_END = 'INPUT_END';

export const inputBegin = createAction( INPUT_BEGIN );
export const inputEnd = createAction( INPUT_END );

// Maintenance
export const TRANSIT_TO_MAINTENANCE = 'TRANSIT_TO_MAINTENANCE';

export const transitToMaintenance = createAction( TRANSIT_TO_MAINTENANCE );
