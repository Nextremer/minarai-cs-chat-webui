import * as actions from 'actions';

export const initial = {
  entries: [],
  pendingEntry: null,
  pendingEntryTimestamp: null,
  destination: null,
  scrollTop: 0,
  scrolledToBottom: true,
  scrolledToTop: true,
  forcedScrolling: false,
  botUtteranceDelay: 1000,
  oldestTimestamp: Number.MAX_SAFE_INTEGER,
  logCompleted: false,
  firstLog: true,
  retrieveHistoryLocked: false
};

function entriesPostProcess( entries ) {
  for ( let i = 0; i < entries.length - 1; ++i ) {
    const wrappedEntry1 = entries[i];
    const wrappedEntry2 = entries[i+1];

    if ( ![ 'verticalButtons', 'horizontalButtons' ].includes( wrappedEntry1.entry.type ) ||
         wrappedEntry1.entry.disabled )
      continue;

    let index = -1;

    switch ( wrappedEntry2.entry.type ) {
      case 'balloon':
        index = wrappedEntry1.entry.captions.indexOf( wrappedEntry2.entry.html );
        if ( index >= 0 ) {
          // 非表示の吹き出しにする
          entries[i+1] = {
            ...wrappedEntry2,
            invisible: true,
          };
        }
        break;
      case 'command':
        index = wrappedEntry1.entry.commands.indexOf( wrappedEntry2.entry.command );
        break;
    }

    entries[i] = {
      ...wrappedEntry1,
      entry: {
        ...wrappedEntry1.entry,
        disabled: true,
        selectedIndex: index
      }
    };
  }
}

// reenterのコマンドが含まれているとボタンの活性制御がおかしくなるので省く
function excludeReenterEntries(entries) {
    return entries.filter((e) => e.entry.type !== "command" || e.entry.command !== "client_reenter");
}

const handlers = {
  [ actions.APPEND_ENTRIES ]: ( state, action ) => {
    let wrappedEntries = action.payload;
    const entries = excludeReenterEntries([ ...state.entries, ...wrappedEntries ]);

    entriesPostProcess( entries );

    return { ...state, entries };
  },

  [ actions.APPEND_HISTORY ]: ( state, action ) => {
    let wrappedEntries = action.payload;
    const entries = excludeReenterEntries([ ...wrappedEntries, ...state.entries ]);

    entriesPostProcess( entries );

    return { ...state, entries };
  },

  [ actions.SET_PENDING_ENTRY ]: ( state, action ) => {
    // ユーザの発言は一旦 pending 状態にしておく、D-Hub から返ってきて確定状態にする
    const entry = action.payload;
    return {
      ...state,
      pendingEntry: entry,
      pendingEntryTimestamp: Date.now()
    };
  },

  [ actions.SET_DESTINATION ]: ( state, action ) => {
    const destination = action.payload;
    return { ...state, destination };
  },

  [ actions.SET_SCROLL_TOP ]: ( state, action ) => {
    const scrollTop = action.payload;
    return { ...state, scrollTop };
  },

  [ actions.AUTO_SCROLLING_BEGIN ]: ( state, action ) => {
    return {
      ...state,
      forcedScrolling: true
    }
  },

  [ actions.AUTO_SCROLLING_END ]: ( state, action ) => {
    return {
      ...state,
      forcedScrolling: false
    }
  },

  [ actions.SET_SCROLLED_TO_BOTTOM ]: ( state, action ) => {
    const scrolledToBottom = action.payload;
    return { ...state, scrolledToBottom };
  },

  [ actions.SET_SCROLLED_TO_TOP ]: ( state, action ) => {
    const scrolledToTop = action.payload;
    return { ...state, scrolledToTop };
  },

  [ actions.SET_BOT_UTTERANCE_DELAY ]: ( state, action ) => {
    const botUtteranceDelay = action.payload;
    return { ...state, botUtteranceDelay };
  },

  [ actions.SET_LOG_COMPLETED ]: ( state, action ) => {
    const logCompleted = action.payload;
    return { ...state, logCompleted };
  },

  [ actions.SET_FIRST_LOG ]: ( state, action ) => {
    const firstLog = action.payload;
    return { ...state, firstLog };
  },

  [ actions.SET_OLDEST_TIMESTAMP ]: ( state, action ) => {
    const oldestTimestamp = Math.min( state.oldestTimestamp, action.payload );
    return { ...state, oldestTimestamp };
  },

  [ actions.SET_RETRIEVE_HISTORY_LOCKED ]: ( state, action ) => {
    const retrieveHistoryLocked = action.payload;
    return { ...state, retrieveHistoryLocked };
  },
};

export default ( state = initial, action ) => {
  const handler = handlers[ action.type ];
  return !handler ? state : handler( state, action );
}
