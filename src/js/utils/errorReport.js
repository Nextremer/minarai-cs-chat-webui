import config from 'conf';
import qs from 'qs';

window.addEventListener( 'error', ( e ) => {
  const payload = {
    message: e.message,
    lineno: e.lineno,
    colno: e.colno,
    filename: e.filename,
    userAgent: navigator.userAgent,
    locationSearch: location.search,
  };

  console.log( 'error caught', e );

  var xhr = new XMLHttpRequest();
  xhr.open( 'POST', config.errorReportURL );
  xhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
  xhr.send( qs.stringify( payload ) );
} );
