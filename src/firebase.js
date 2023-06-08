// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// import firebase from "firebase"
// this is an api key and put this config file inside the initialize command
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
// import {getAuth} from 'firebase/auth';

// i have done with the new way of version 9 as old way is now deprecated 
// in this we only get the specific things we want


// import {initializeApp} from  "firebase/app"
import { getStorage } from "firebase/storage";
// //import {getFirestore} from "firebase/firestore/lite"   // using lite will remove the use of onsnapshot listener
// import {getFirestore, onSnapshot, setDoc} from "firebase/firestore"   // but now for our application i dont need it for now

const firebaseConfig = {
    apiKey: "AIzaSyAlL3Eqzj0QH-4JR-IuLhvS7T-ZPp1LjqE",
    authDomain: "instagram-clone-faf37.firebaseapp.com",
    projectId: "instagram-clone-faf37",
    storageBucket: "instagram-clone-faf37.appspot.com",
    messagingSenderId: "173322745861",
    appId: "1:173322745861:web:2851bc34784adce72d846c",
    measurementId: "G-SD8MD3DSMS"
  };


  // const firebaseApp =firebase.intializeApp({apiKey: "AIzaSyAlL3Eqzj0QH-4JR-IuLhvS7T-ZPp1LjqE",
  //     authDomain: "instagram-clone-faf37.firebaseapp.com",
  //     projectId: "instagram-clone-faf37",
  //     storageBucket: "instagram-clone-faf37.appspot.com",
  //     messagingSenderId: "173322745861",
  //     appId: "1:173322745861:web:2851bc34784adce72d846c",
  //     measurementId: "G-SD8MD3DSMS"
  //   });
  const firebaseApp=firebase.initializeApp(firebaseConfig);
  // export const firebaseApp = initializeApp(firebaseConfig);
 const db =firebaseApp.firestore();
// export const db =firebaseApp.firestore();

const auth = firebase.auth();
// export const auth = getAuth(firebaseApp);
// const storage =firebase.storage();
 const storage = getStorage(firebaseApp);
  export {db,auth,storage};
  // export {db,auth};
// now we hav e to export it like export {setdoc, storage etc}

  // now we can use ref so either use db.collection or directly importing and using the function collection
  // or in doc directly pass the db, collection name and id
  // we can use getdoc to give iot the information of the game ref
  //like gamesnap =getDoc(gameref)
  // game-gamespan.data() this will now give us all the data
  // setDoc(gameref,{field1:'value1},{merge:true}) // like this se can set data inside the collection with fields now



  // on snapshot is just a function now and we can use it like
  // onSnapshot(doc(db,'games','id-123'),callbackfunction)  it caN DOC OR a colledction for example
  // or we can do it like onsnapshot(gameref,callbackfunction)
  // or we can do it like onsnapshot(gameref,doc=>{
   // setDoc()
 // })