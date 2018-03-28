import { takeEvery, takeLatest, eventChannel, delay } from 'redux-saga';
import { call, put, select, fork, take, join } from 'redux-saga/effects';
import { animateScroll, scroller } from 'react-scroll';
import * as actions from 'actions';
import { htmlize, mdToHtml } from '../utils/sanitize';
import 'axios';
import config from 'conf';

export function* connected() {
  const task = yield fork( retrieveHistory );
  yield join( task );
  yield fork( sendCommand, 'client_reenter' );
}

export function* connectedEventWatcher() {
  yield* takeEvery( actions.CONNECTED, connected );
}

export function* scroll() {
  const duration = 500;

  scroller.scrollTo( 'destination', {
    duration,
    delay: 0,
    smooth: true,
    offset: -29
  } );

  // duration 秒後に forcedScrolling を false にする
  yield call( delay, duration );
  yield put( actions.autoScrollingEnd() );
}

export function* autoScrollEventWatcher() {
  yield takeLatest( actions.AUTO_SCROLLING_BEGIN, scroll );
}

export function* handleScrolling( entries ) {
  const forcedScrolling = yield select( state => state.timeline.forcedScrolling );
  const scrolledToBottom = yield select( state => state.timeline.scrolledToBottom );

  if ( entries.length > 0 && ( forcedScrolling || entries[ entries.length - 1 ].speaker === 'user' || scrolledToBottom ) ) {
    const latestTimestamp = entries[ entries.length - 1 ].timestamp;

    for ( const entry of entries ) {
        if ( entry.timestamp === latestTimestamp ) {
            yield put( actions.setDestination( entry ) );
            break;
        }
    }

    yield put( actions.autoScrollingBegin() );
  }
}

export function* retrieveHistory() {
  const retrieveHistoryLocked = yield select( state => state.timeline.retrieveHistoryLocked );
  if ( retrieveHistoryLocked )
    return;

  yield put( actions.setRetrieveHistoryLocked( true ) );

  const timestamp = yield select( state => state.timeline.oldestTimestamp );
  const socket = yield select( state => state.dialog.socket );
  socket.getLogs( {
    ltDate: timestamp === Number.MAX_SAFE_INTEGER ? undefined : new Date( timestamp ).toISOString(),
    limit: 20
  } );
}

export function* retrieveHistoryEventWatcher() {
  yield takeLatest( actions.RETRIEVE_HISTORY, retrieveHistory );
}

export function* scrolledToTop() {
  const logCompleted = yield select( state => state.timeline.logCompleted );
  if ( logCompleted )
    return;

  const retrieveHistoryLocked = yield select( state => state.retrieveHistoryLocked );
  if ( retrieveHistoryLocked )
    return;

  const entries = yield select( state => state.timeline.entries );
  if ( entries.length === 0 )
    return;

  let destination = null;
  for ( const entry of entries ) {
    if ( !entry.invisible ) {
      destination = entry;
      break;
    }
  }
  yield put( actions.setDestination( destination ) );

  const task = yield fork( retrieveHistory );
}

export function* scrolledToTopEventWatcher() {
  while ( true ) {
    const { payload } = yield take( actions.SET_SCROLLED_TO_TOP );
    if ( payload ) {
      yield fork( scrolledToTop );
    }
  }
}

export function* sendMessage( text ) {
  // 直前のボット発話の type が ~Buttons だった場合の対応
  const existingEntries = yield select( state => state.timeline.entries );
  if ( existingEntries.length > 0 &&
       existingEntries[existingEntries.length - 1].entry.type.endsWith( 'Buttons' ) ) {
    const buttonsEntry = existingEntries[existingEntries.length - 1].entry;
    const index = buttonsEntry.captions.indexOf( text );
    if ( buttonsEntry.commands[ index ] ) {
      yield fork( sendCommand, buttonsEntry.commands[ index ] );
      return;
    }
  }

  const entry = { type: 'balloon', text: text };
  yield put( actions.setPendingEntry( {
    entry: {
      ...entry,
      html: htmlize( text )
    } , speaker: 'user'
  } ) );
  yield fork( sendEntry, entry );
}

export function* sendMessageEventWatcher() {
  while ( true ) {
    const { payload } = yield take( actions.SEND_MESSAGE );
    yield fork( sendMessage, payload );
  }
}

export function* sendCommand( command ) {
  const entry = { type: 'command', command: command };
  yield put( actions.setPendingEntry( { entry: entry, speaker: 'user' } ) );
  yield fork( sendEntry, entry );

  if (command === "operator_yes") {
    const socket = yield select( state => state.dialog.socket );
    yield put(actions.callingBegin());
    socket.call();
  }
}

export function* sendEntry( entry ) {
  const socket = yield select( state => state.dialog.socket );
  if ( !!socket ) {
    let payload;

    switch ( entry.type ) {
    case 'balloon':
      payload = {
        message: entry.text,
        extra: {
          godspeed: {
            type: 'message',
            message: entry.text
          }
        }
      };
      break;
    case 'command':
      payload = {
        message: entry.command,
        extra: {
          godspeed: {
            type: 'command',
            message: entry.command
          }
        }
      };
      break;
    case 'metaMessage':
      payload = {
        message: entry.text,
        extra: {
          godspeed: {
            type: 'metaMessage',
            message: entry.text
          }
        }
      };
      break;
    // 将来的に、ユーザアップロードした画像(ファイル)を表す type が追加されるのでは？
    }

    socket.send( payload );
  } else {
    console.error( 'No Dialog Engine Specified' );
  }
}

export function* buttonPressed( payload ) {
  const { buttonGroupProps, index } = payload;

  if (buttonGroupProps.commands[index]) {
    // send as command
    yield fork( sendCommand, buttonGroupProps.commands[index] );
  } else {
    // send as balloon
    const text = buttonGroupProps.captions[index];
    const entry = { type: 'balloon', text: text };
    yield fork( sendEntry, entry );
  }
}

export function* buttonPressedEventWatcher() {
  while ( true ) {
    const { payload } = yield take( actions.BUTTON_PRESSED );
    yield fork( buttonPressed, payload );
  }
}

export function* responseReceived( { payload } ) {
  const timestamp = payload.head.timestampUnixTime;
  let entries = [];

  if (payload.body.type === "image") {
      entries = [
          {
              entry: {
                  url: payload.body.messages[0].url,
                  type: 'file',
              },
              speaker: 'operator',
              timestamp: timestamp,
          }
      ];
  } else if (payload.body.type === "not_receiving") {
      entries = [
          {
              entry: {
                  html: mdToHtml( payload.body.messages[0].value ),
                  type: "balloon"
              },
              speaker: 'bot',
              timestamp: timestamp,
          }
      ];
  } else {
      const rawEntries = payload.body.messages[0].value.entries;
      const speaker = payload.head.engineType  === "operator" ? "operator" : "bot" ;

      yield put( actions.setOldestTimestamp( timestamp ) );

      entries = rawEntries.map( entry => {
          if ( 'md' in entry ) {
              entry = {
                  ...entry,
                  html: mdToHtml( entry.md )
              };
          }
          return {
              entry: entry,
              speaker: speaker,
              timestamp: timestamp,
          };
      } );
  }

  yield put( actions.setPendingEntry( null ) );

  if ( entries.length > 0 ) {
    // ボットの吹き出しは遅延させて表示する
    const {
      pendingEntryTimestamp,
      botUtteranceDelay,
    } = yield select( state => state.timeline );

    let delayTime = 0;
    if ( pendingEntryTimestamp &&
         Date.now() - pendingEntryTimestamp < botUtteranceDelay ) {
      delayTime = botUtteranceDelay - (Date.now() - pendingEntryTimestamp);
    }

    yield call( delay, delayTime );

    const entriesList = [];
    for ( const entry of entries ) {
      if ( entriesList.length > 0 &&
           [ 'verticalButtons', 'horizontalButtons' ].includes( entry.entry.type ) ) {
        entriesList[ entriesList.length - 1 ].push( entry );
      } else {
        entriesList.push( [ entry ] );
      }
    }

    for ( const entries of entriesList ) {
      if ( entries !== entriesList[0] ) {
        yield call( delay, botUtteranceDelay );
      }
      yield put( actions.appendEntries( entries ) );
      yield fork( handleScrolling, entriesList[0] );
    }
  } else {
    yield put( actions.appendEntries( entries ) );
    yield fork( handleScrolling, entries );
  }
}

export function* responseReceivedEventWatcher() {
  yield* takeEvery( actions.RESPONSE_RECEIVED, responseReceived );
}

export function* syncReceived( { payload } ) {
  let entry;
  const timestamp = payload.head.timestampUnixTime;
  if (payload.body.type === "image") {
    const { message } = payload.body;
    entry = {
      entry: {
        url: message.url,
        type: 'file',
      },
      speaker: 'user',
      timestamp: timestamp,
    };
  } else if (payload.body.type === "not_receiving") {
      entry = {
          entry: {
              md: payload.body.message[0].value,
              type: "balloon"
          },
          speaker: 'bot',
          timestamp: timestamp,
      }
  } else {
    const rawMessage = payload.body.message;
    const extraGodspeed = rawMessage.extra.godspeed;

    yield put( actions.setOldestTimestamp( timestamp ) );

    switch ( extraGodspeed.type ) {
    case 'message':
      entry = {
        entry: {
          type: 'balloon',
          text: extraGodspeed.message,
          html: htmlize( extraGodspeed.message )
        },
        speaker: 'user',
        timestamp: timestamp,
      };
      break;
    case 'command':
      entry = {
        entry: {
          type: 'command',
          command: extraGodspeed.message
        },
        speaker: 'user',
        timestamp: timestamp,
      };
      break;
    case 'metaMessage':
      entry = {
        entry: {
          type: 'metaMessage',
          text: extraGodspeed.message
        },
        speaker: 'operator',
        timestamp: timestamp,
      };
      break;
    default:
      throw new Error( 'Unknown type in sync payload: ' + extraGodspeed.type );
    }
  }

  const entries = [ entry ];

  yield put( actions.setPendingEntry( null ) );

  yield put( actions.appendEntries( entries ) );
  yield fork( handleScrolling, entries );
}

export function* syncReceivedEventWatcher() {
  yield* takeEvery( actions.SYNC_RECEIVED, syncReceived );
}

const UserStatus = {
  NotAssigned: 0,
  Calling: 1,
  Holding: 2,
  Assigned: 3,
};

export function* logsReceived( { payload: logs } ) {
  if ( logs.length === 0 ) {
    // XXX: この方法で logCompleted すると、完全に読み込まれているのにログ取得ボタンがでてしまう
    yield put( actions.setLogCompleted( true ) );
    return;
  }

  const socket = yield select( state => state.dialog.socket );
  const existingEntries = yield select( state => state.timeline.entries );

  logs = logs
    .filter(x => {
      if (x.utterancer === 'System') {
        return x.state === UserStatus.NotAssigned;
      }
      return true;
    })
    .sort((x, y) => Date.parse(x.created_at) - Date.parse(y.created_at));

  yield put( actions.setOldestTimestamp( Date.parse( logs[0].created_at ) ) );

  const entries = [];
  for ( const log of logs ) {
    const timestamp = Date.parse( log.created_at );
    switch ( log.utterancer ) {
    case 'User':
      for ( const message of log.messages ) {
        let entry;
        let speaker;
        if (message.extra && message.extra.godspeed && message.extra.godspeed.type) {
          switch ( message.extra.godspeed.type ) {
            case 'message':
              entry = {
                type: 'balloon',
                md: message.extra.godspeed.message,
                html: htmlize( message.extra.godspeed.message )
              };
              speaker = "user";
              break;
            case 'command':
              entry = {
                type: 'command',
                command: message.extra.godspeed.message
              };
              break;
          }
        } else if (message.imageUrl) {
          const imageUrl = yield socket.getImageUrl( message.imageUrl, message.imageType );
          entry = {
            url: imageUrl,
            type: 'file',
          };
          speaker = "user";
        }
        if (entry){
          entries.push({
            entry: entry,
            speaker: speaker,
            timestamp: timestamp
          });
        }
      }
      break;
    case 'System':
    case 'Operator':
      for ( const message of log.messages ) {
        if (message.value) {
          for ( const rawEntry of message.value.entries ) {
            let speaker = log.utterancer === 'Operator' ? 'operator' : "bot";
            entries.push( convertEntry( rawEntry, timestamp, speaker ) );
          }
        } else if (message.imageUrl) {
          const imageUrl = yield socket.getImageUrl( message.imageUrl, message.imageType );
          const entry = {
            url: imageUrl,
            type: 'file',
          };
          entries.push( convertEntry( entry, timestamp, 'operator' ) );
        } else if(message.takeOver !== undefined){
          const text = message.takeOver ? "オペレータに切り替わりました" : "オペレータとの会話を終了しました";
          const entry = {
            type: 'metaMessage',
            text,
          };
          entries.push( {
            entry: entry,
            speaker: 'operator',
            timestamp: timestamp
          } );
        }
      }
      break;
    }
  }
  yield put( actions.appendHistory( entries ) );
  yield put( actions.setRetrieveHistoryLocked( false ) );

  const firstLog = yield select( state => state.timeline.firstLog );
  if ( firstLog ) {
    // 最初のログ取得だと判断されるので、最新のエントリへスクロール
    yield fork( handleScrolling, entries );
    yield put( actions.setFirstLog( false ) );
  } else {
    // ログ取得開始時の位置へスクロール
    scroller.scrollTo( 'destination', {
      duration: 0,
      delay: 0,
      offset: -29 - 34
    } );
  }
}

function convertEntry( entry, timestamp, speaker ) {
  if ( 'md' in entry ) {
    entry = {
      ...entry,
      html: mdToHtml( entry.md )
    };
  }
  return {
    entry: entry,
    speaker: speaker,
    timestamp: timestamp
  };
}

export function* logsReceivedEventWatcher() {
  yield* takeEvery( actions.LOGS_RECEIVED, logsReceived );
}

export function* systemCommandReceived({ payload }) {
  const entries = [];

  const entered = yield select( state => state.dialog.entered );
  if (payload.type === 'ensure-client-store' && !entered)
    yield put( actions.connected( payload ) );

  if (payload.type === 'intercepted') {
    yield put( actions.intercept() );
    yield put( actions.updateSuggestion( '' ) );
  }

  if (payload.type === 'intercept-canceled') {
    yield put( actions.interceptCancel() );
  }

  if (payload.type === 'setParameter') {
    switch ( payload.name ) {
      case 'botUtteranceDelay':
        if ( !Number.isNaN( +payload.value ) ) {
          yield put( actions.setBotUtteranceDelay( +payload.value ) );
        } else {
          console.warn( 'Bad systemCommand', payload );
        }
        break;
    }
  }

  if (payload.type === 'maintenance-notification') {
    yield put( actions.setNotificationHtml( htmlize( payload.message ) ) );
    yield put( actions.showNotificationView() );
  }

  if (payload.type === 'notify-operator-mode') {
    yield put( actions.intercept() );
    yield put( actions.setNotificationHtml( htmlize( 'オペレータとのチャットを継続しています。' ) ) );
    yield put( actions.showNotificationView() );
  }

  if (payload.type === 'takeover-requested') {
    yield put( actions.callingBegin() );
  }

  if (payload.type === 'takeover-request-canceled') {
    yield put( actions.callingCanceled() );
  }

  if ( entries.length > 0 ) {
    yield put( actions.appendEntries( entries ) );
    yield fork( handleScrolling, entries );
  }
}

export function* systemCommandReceivedEventWatcher() {
  yield* takeEvery( actions.SYSTEM_COMMAND_RECEIVED, systemCommandReceived );
}

export function* operatorCommandReceived({ payload }) {
  const isTakeOver = yield select( state => state.dialog.isTakeOver );
  if (payload.body.name === 'takeover') {
    if(!isTakeOver) {
      yield put( actions.takeOver() );
      const syncPayload = { payload: {
        head: { timestampUnixTime: Date.now() },
        body: { message: { extra: { godspeed: {
          type: 'metaMessage',
          message: 'オペレータに切り替わりました'
        } } } } } };
      yield fork( syncReceived, syncPayload );
      yield put(actions.callingCanceled());
    }
  }

  if (payload.body.name === 'release') {
    if(isTakeOver) {
      yield put(actions.takeOverCancel());
      const syncPayload = { payload: {
        head: { timestampUnixTime: Date.now() },
        body: { message: { extra: { godspeed: {
        type: 'metaMessage',
        message: 'オペレータとの会話を終了しました'
      } } } } } };
      yield fork( syncReceived, syncPayload );
    }
  }
}

export function* operatorCommandReceivedEventWatcher() {
  yield* takeEvery( actions.OPERATOR_COMMAND_RECEIVED, operatorCommandReceived );
}

export function* socketConnectedEventWatcher() {
  yield* takeEvery( actions.SOCKET_CONNECTED, socketConnected );
}

function subscribe( socket ) {
  return eventChannel( emit => {
    socket.on('joined', payload => {
      console.log('joined');
      emit( actions.connected() );
      emit( actions.fetchRegisteredInquiries( payload ) );
    });
    socket.on('message', payload => {
      emit( actions.responseReceived( payload ) );
    });
    socket.on('system-message', payload => {
      console.log( payload );
      emit( actions.systemCommandReceived( payload ) );
    });
    socket.on('sync', payload => {
      emit( actions.syncReceived( payload ) );
    });
    socket.on('logs', payload => {
      emit( actions.logsReceived( payload ) );
    });
    socket.on('operator-command', payload => {
      emit( actions.operatorCommandReceived( payload ) );
    });
    socket.on('error', payload => {

    });
    socket.minaraiClient.socket.on('reconnect', payload => {
      emit( actions.callingCanceled() );
    });
    return () => {};
  });
}

export function* registerHandler() {
  const socket = yield select( state => state.dialog.socket );
  if ( !!socket ) {
    const channel = yield call( subscribe, socket );
    while( true ) {
      let action = yield take( channel );
      console.log('action:', action)
      yield put( action );
    }
  }
}


export function* dialogRoot() {
  yield fork( registerHandler );
  yield fork( connectedEventWatcher );
  yield fork( sendMessageEventWatcher );
  yield fork( buttonPressedEventWatcher );
  yield fork( responseReceivedEventWatcher );
  yield fork( syncReceivedEventWatcher );
  yield fork( logsReceivedEventWatcher );
  yield fork( autoScrollEventWatcher );
  yield fork( scrolledToTopEventWatcher );
  yield fork( systemCommandReceivedEventWatcher );
  yield fork( operatorCommandReceivedEventWatcher );
  yield fork( retrieveHistoryEventWatcher );
}
