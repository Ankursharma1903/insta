import React, { useEffect } from "react";
import "./Post.css";
import  Avatar  from "@material-ui/core/Avatar";
import { useState } from "react";
import { db } from "./firebase";
import firebase from "firebase/compat/app";
// import firebase from "firebase";
function Post({ imageUrl, caption, username, user, postId }) {
  const [comments, setComments] = useState([]); // for making the comment section of the page
  const [comment, setComment] = useState(""); // for keeping track of individuall comments and initially its blank

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db // access database
        .collection("posts") // going inside the collection posts
        .doc(postId) // accessing the post id from the collection
        .collection("comments") // inside its comments collection we go and get a snapshot listener for comments
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    return () => {
      unsubscribe();
    };
  }, [postId]); // if the postId changes so above code will run everytime it changes

  const postComment = (event) => {
    event.preventDefalt();
    // now we will post the comments
    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      // here we dont need the username of the poster we want username of the person who is signed in and in app.js we have stored the user who is signed in inside the user variable
      // we ahve passed the user from the app.js through the post
    });
    setComment(""); // it will clear the box again
    // so we go inside post then inside a specific post or document using post id and then we go insdie the comments collection and add the value in it
    // and then we mention the values inside the key fields
  };
  // username of the person who write the post and user is the person who has signed in

  return (
    <div className="post">
      <div className="post_header">
        <Avatar
          className="post_avatar"
          alt="image"
          src="./public/logo192./png"
        />
        <h3>{username}</h3>
      </div>
      {/* header => avatar  username */}
      {/* image */}
      {/* <img
        className="post_image"
        src="https://www.freedcodecamp.org/news/content/images/size/w2000/02/Ekran-Resmi-2019-11-18-18.08.13.png"
        alt=""
      /> */}
      <img
        className="post_image"
        // src="https://th.bing.com/th/id/R.4f47902345e0ade1b74c3d3a2579d658?rik=LEVz7HC29meplQ&riu=http%3a%2f%2fbuzzmuzz.com%2fwp-content%2fuploads%2f2020%2f09%2fImage.jpg&ehk=nK5%2fksTmBAVkcNWxCRk2UCS%2fbN4a%2fEMjLC11MxIUyE8%3d&risl=&pid=ImgRaw&r=0"
        src={imageUrl}
        alt=""
      />
      {/* username + caption */}
      <h4 className="post_text">
        <strong>{username}</strong> : {caption}
      </h4>
      <div className="post_comments">
        {comments.map((comment) => (
          <p>
            <strong>{comment.username}</strong>
            {comment.text}
            {/* as inside the comments doc we have made these 2 fields that are username and text */}
          </p>
        ))}
      </div>
      {user && ( // by this we are only able to comment when we are logged in
        <form className="post_commentBox">
          <input
            className="post_input"
            type="text"
            placeholder="add a comment... "
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            // comment is used to keep track of the individual comments
          />
          <button
            className="post_button"
            disabled={!comment} // it means that button is disbaled if it has no comment
            type="submit"
            onClick={postComment()}
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
}

export default Post;
