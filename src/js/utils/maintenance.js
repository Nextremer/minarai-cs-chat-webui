import config from 'conf';
import 'axios';
import qs from 'qs';


export function checkMaintenance() {
  // メンテナンスページは未使用
  return new Promise( ( resolve, reject ) => {
    resolve();
  } );
}

export function redirectToMaintenance() {
  let url = location.href.replace(/^[^?]*/, config.maintenance.maintenanceUrl);
  location.href = url;
}
