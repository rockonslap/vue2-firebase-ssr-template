import Firebase from 'firebase';

require('firebase/firestore');

export function createAPI({
  firebaseConfig,
}) {
  let api;
  if (process.__API__) {
    api = process.__API__;
  } else {
    Firebase.initializeApp(firebaseConfig);
    process.__API__ = Firebase;
    api = Firebase;
  }

  const firestoreDb = api.firestore();

  const authProvider = new api.auth.FacebookAuthProvider();
  authProvider.addScope('public_profile');
  authProvider.addScope('email');
  authProvider.setCustomParameters({
    display: 'popup',
  });

  return {
    firebase: Firebase,
    provider: authProvider,
    auth: api.auth(),
    firebaseDb: api.database(),
    firestoreDb,
  };
}
