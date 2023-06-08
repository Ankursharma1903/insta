import React, { useState } from "react";
import { Button } from "@material-ui/core";
import { storage, db } from "./firebase";
import firebase from "firebase/compat/app";

// using v9

// import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

import "./ImageUpload.css";

function ImageUpload({ username }) {
  const [caption, setCaption] = useState("");

  const [progress, setProgress] = useState(0);
  const [image, setImage] = useState(null);
  // using v9
//   const [imgUrl, setImgUrl] = useState(null);
// const [progresspercent, setProgresspercent] = useState(0);

  const handleChange = (e) => {
    if (e.target.file[0]) {
      // it will take the file we will select because sometimes we are selecting more than one files so to avoid this confussion

      setImage(e.target.file[0]);
    }
  };
  const handleUpload = (e) => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    // image name is the file name that we have selected
    // we are putting the image we have grabbed inside the database
    uploadTask.on(
      "state_changed", // it sis a listener and we listen to many things like state change
      (snapshot) => {
        // prgress function
        // this below function is a equation that runs between 0 and 100
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        ); // it is async as it will take time to upload so by snapshot we are keeping a track of it that how much time it will take to upload
        setProgress(progress);
      },
      (error) => {
        // if antything error happen so this will show us what had happened
        console.log(error);
        alert(error.message);
        // showing in console is
      },
      () => {
        // it will show what will happen if the uploads completes or no error
        storage
          .ref("images") // it means go to reference images
          .child(image.name) // go to the image name child
          .getDownloadURL() //give me the download url as it already uploaded the image to the firebase storage
          .then((url) => {
            // here we will post the image inside the database
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(), // it will help us to save the post with the correct timings AND WE ARE TAKING THE TIMESTAMP OF THE SERVERS
              // regardless of our location in the world this will give us a one unified time
              caption: caption, // it is easy to take as we have stored it earlier inside a state
              imageUrl: url,
              username: username, // we have passed it from app.js file
            });
            setProgress(0); // as we dont want our progress bar to stuck to 100 after work is done and we need to reset it and similarly others
            setCaption("");
            setImage(null);
          });
      }
    );
 };

// using version 9

// const handleChange = (e) => {
//   e.preventDefault()
//   const file = e.target[0]?.files[0]

//   if (file) {
//     setImgUrl(e.target.file[0]);
//   }
// };
// const handleUpload = (e) => {
//   const storageRef = ref(storage, `imgUrl/${imgUrl.name}`);
//   const uploadTask = uploadBytesResumable(storageRef, imgUrl);

//   uploadTask.on("state_changed",
//     (snapshot) => {
//       const progress =
//         Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
//       setProgresspercent(progress);
//     },
//     (error) => {
//       alert(error);
//     },
//     () => {
//       getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//         setImgUrl(downloadURL)
//         db.collection("posts").add({
//                       timestamp: firebase.firestore.FieldValue.serverTimestamp(), // it will help us to save the post with the correct timings AND WE ARE TAKING THE TIMESTAMP OF THE SERVERS
//                       // regardless of our location in the world this will give us a one unified time
//                       caption: caption, // it is easy to take as we have stored it earlier inside a state
//                      imageUrl: downloadURL,
//                       username: username, // we have passed it from app.js file
//                     });
//                     setProgresspercent(0); // as we dont want our progress bar to stuck to 100 after work is done and we need to reset it and similarly others
//                     setCaption("");
//                     setImgUrl(null);
//       });
//     }
//   );
// }


   


  return (
    <div className="imageupload">
      {/* <progress className="imageupload_progress" value={progresspercent} max="100" /> */}
      <progress className="imageupload_progress" value={progress} max="100" />
      {/* this is a natureal html tag to show the progress */}

      <input
        type="text"
        placeholder="Enter a caption ..."
        value={caption}
        onChange={(event) => setCaption(event.target.value)}
      />
      <input type="file" placeholder="choose file" onChange={handleChange} />
      <Button className="imageupload_button" onClick={handleUpload}>
        Upload
      </Button>
    </div>
  );
}

export default ImageUpload;
