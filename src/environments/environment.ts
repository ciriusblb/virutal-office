// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const FB_PROJECT_ID = 'virtual-office-cbdd8';

export const environment = {
  production: false,
  auth: {
    clientId: 'wiRQwIJCEZWuR2hysq2rfawG72ICEz17',
    clientDomain: 'virtual-office.auth0.com',
    audience: 'http://localhost:8000/',
    redirect: 'http://localhost:4200/callback',
    scope: 'openid profile email'
  },
  firebase: {
    apiKey: 'AIzaSyB8RY9flHv-VBU0TX-wfPryZCBc2_yZ634',
    authDomain: `${FB_PROJECT_ID}.firebaseapp.com`,
    databaseURL: `https://${FB_PROJECT_ID}.firebaseio.com`,
    projectId: FB_PROJECT_ID,
    storageBucket: `${FB_PROJECT_ID}.appspot.com`,
    messagingSenderId: '919870581250'
  },
  apiRoot: 'http://localhost:8000/',
  URL_SERVICIOS: 'http://localhost:8000'
};


/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
