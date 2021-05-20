import firebase from 'firebase'

  const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBmrzJ1o1bSBu3MBJwYmDWRAv_BdKpUqeU",
    authDomain: "instagram-clone-94926.firebaseapp.com",
    projectId: "instagram-clone-94926",
    storageBucket: "instagram-clone-94926.appspot.com",
    messagingSenderId: "98955416061",
    appId: "1:98955416061:web:552041d6629c69bf028994"

  });

  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  export { db,auth,storage}