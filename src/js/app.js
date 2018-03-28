import './utils/errorReport';
import './utils/accessReport';
import { Provider } from 'react-redux';
import ReactGA from 'react-ga';
import { createRedux } from './utils/redux';
import configureStore from './utils/redux';
import { suitable } from './utils/deviceSuitability';
import { initial } from './reducers';
import Main from './components/presentators/Main';
import UnavailableDevice from './components/presentators/UnavailableDevice';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { checkMaintenance, redirectToMaintenance } from './utils/maintenance';
injectTapEventPlugin();


if ( 1===1 ) {
  // 対応端末のとき

  checkMaintenance()
       .then( () => {
         if ('gaTrackingId' in (window.minaraiConfig || {}) && window.minaraiConfig.gaTrackingId.length > 0) {
           ReactGA.initialize(window.minaraiConfig.gaTrackingId, {
             // debug: true,
           });
           ReactGA.pageview(window.location.pathname + window.location.search);
         }
         ReactDOM.render(
           <Provider store={ configureStore( initial ) }>
             <Main />
           </Provider>,
           document.getElementById( 'main' )
         );
       } )
       .catch( () => {
         // redirectToMaintenance();
       } );

} else {
  // 非対応端末のとき

  ReactDOM.render(<UnavailableDevice />,
    document.getElementById( 'main' )
  );

}
