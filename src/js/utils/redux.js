import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import reducers from 'reducers';
import rootSaga from 'sagas';
import { syncTranslationWithStore, loadTranslations, setLocale } from 'react-redux-i18n';
import trans from 'i18n/trans';
import config from 'conf';
import * as actions from 'actions';

const logger = store => next => action => {
  console.log('dispatching', action);
  const result = next(action);
  console.log('next state', store.getState());
  return result;
};

export default function configureStore( initialState ) {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(
    reducers,
    initialState,
    applyMiddleware(
      sagaMiddleware, logger
    )
  );

  syncTranslationWithStore( store );
  store.dispatch( loadTranslations( trans ) );
  store.dispatch( setLocale( config.lang ) );
  store.dispatch( {
    type: actions.CONNECT
  } );

  sagaMiddleware.run( rootSaga );
  return store;
}
