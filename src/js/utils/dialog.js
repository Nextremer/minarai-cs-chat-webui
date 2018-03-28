import io from 'socket.io-client';
import MinaraiClient from 'minarai-client-sdk-js-socket-io';
import config from 'conf';

export class Dialog {
  constructor() {
    const embeddedConfig = window.minaraiConfig || {};
    const userId = this.getUserId( location.search ) || embeddedConfig.userId || config.minarai.userId;
    if (!userId) {
      throw new TypeError("unknown userId");
    }
    this.minaraiClient = new MinaraiClient({
      io,
      socketIORootURL: config.minarai.url,
      apiVersion: config.minarai.apiVersion,
      applicationId: embeddedConfig.applicationId || config.minarai.applicationId,
      applicationSecret: embeddedConfig.applicationSecret || config.minarai.applicationSecret,
      clientId: null,
      userId: userId,
      deviceId: null,
    });

    this.minaraiClient.init();

    this.minaraiClient.on( 'connect', () => console.log('connected!') );
  }

  send( text ) {
    this.minaraiClient.send( text );
  }

  sendSystemCommand( command, payload ) {
    this.minaraiClient.sendSystemCommand( command, payload );
  }

  sendCommand( command, payload ) {
    this.minaraiClient.sendCommand( command, payload );
  }

  call( payload ) {
    this.minaraiClient.call( payload );
  }

  cancelCalling( payload ) {
    this.minaraiClient.cancelCalling( payload );
  }

  getLogs( payload ) {
    console.log( 'getLogs', payload );
    this.minaraiClient.getLogs( payload );
  }

  getImageUrl( url, type ) {
    return this.minaraiClient.getImageUrl( url, type );
  }

  on( evt, cb ) {
    if ( evt === 'first-connect' ) {
      let first = true;

      this.minaraiClient.on( 'connect', ( data ) => {
        if ( first )
          cb( data );
        first = false;
      } );
    } else {
      this.minaraiClient.on( evt, cb );
    }
  }

  getUserId( query ) {
    if ( typeof query !== 'string' ) {
      return null;
    }

    const parts = query.replace( /^(\?|#\&)/, '' );
    if ( !parts ) {
      return null;
    }

    let ret = null;
    parts.split( '&' ).forEach( item => {
      const [ k, v ] = item.split( '=' );
      if ( k === 'userId' || k === 'user_id' || k === 'uid' ) {
        ret = decodeURIComponent(v);
        return;
      }
    });

    return ret;
  }
}
