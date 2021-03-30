import Firebase from 'firebase';

require('firebase/firestore');

export function createAPI({
  firebaseConfig,
}) {
  Firebase.initializeApp(firebaseConfig);

  const firestoreDb = Firebase.firestore();

  const authProvider = new Firebase.auth.FacebookAuthProvider();
  authProvider.addScope('public_profile');
  authProvider.addScope('email');
  authProvider.setCustomParameters({
    display: 'popup',
  });
  return {
    firebase: Firebase,
    provider: authProvider,
    auth: Firebase.auth(),
    firebaseDb: Firebase.database(),
    firestoreDb,
    storage: Firebase.storage(),
  };
}
