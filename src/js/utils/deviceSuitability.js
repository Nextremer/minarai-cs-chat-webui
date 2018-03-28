import woothee from 'woothee';
import qs from 'qs';
import config from 'conf';


const REQUIRED_MOBILE_VERSION = { 'ANDROID': 4.4, 'IOS': 8.1 };
const ENABLED_MOBILE_BROWSERS = [ 'Chrome', 'Firefox', 'Safari' ];
const ENABLED_PC_BROWSERS = [ 'Chrome', 'Firefox', 'Safari', 'Opera', 'Edge' ];


function isAndroid( os ) {
  const oss = [ 'Android' ];
  return oss.includes( os );
}

function isIOS( os ) {
  const oss = [ 'iPhone', 'iPad', 'iPod', 'iOS' ];
  return oss.includes( os );
}

function isPC( os ) {
  const oss = [ 'Mac', 'Win' ];
  for ( let o of oss ) {
    if ( os.startsWith( o ) ) {
      return true;
    }
  }
  return false;
}


export const ua = woothee.parse( navigator.userAgent );
const params = qs.parse( location.search.substr(1) );

let enabled = false;
if ( config.suitableDevices.mobile && isAndroid( ua.os ) ) {
  if ( Number.parseFloat( ua.os_version ) >= REQUIRED_MOBILE_VERSION.ANDROID &&
       ENABLED_MOBILE_BROWSERS.includes( ua.name ) ) {
    enabled = true;
  }
} else if ( config.suitableDevices.mobile && isIOS( ua.os ) ) {
  if ( Number.parseFloat( ua.os_version ) >= REQUIRED_MOBILE_VERSION.IOS &&
       ENABLED_MOBILE_BROWSERS.includes( ua.name ) ) {
    enabled = true;
  }
} else if ( config.suitableDevices.pc && isPC( ua.os ) ) {
  if ( ENABLED_PC_BROWSERS.includes( ua.name ) ) {
    enabled = true;
  }
}

// URL パラメータによって強制的に suitable を書き換える
const forcedSuitable = params.suitable;
if ( forcedSuitable !== undefined )
  enabled = !!+forcedSuitable;

export const suitable = enabled;
export const iOS = isIOS( ua.os );
