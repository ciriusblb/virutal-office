const FB_PROJECT_ID = 'virtual-office-cbdd8';

export const environment = {
  production: true,
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
  // apiRoot: 'http://localhost:8000/'
  apiRoot: 'https://virtual-office-cbdd8.firebaseapp.com/ssr/'
};
