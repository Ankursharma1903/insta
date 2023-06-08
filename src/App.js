import { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post";
import { db, auth } from "./firebase";
import { Button, Modal, Input } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ImageUpload from "./ImageUpload";
// import InstagramEmbed from "react-instagram-embed";

// material ui styling we have copied below till the function app
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

// usestyle helps us to make use of classes later

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  // a state is like a short term memory in react or a way of setting variables in react
  // const [posts, setPosts] = useState([
  //   // we are giving it 2 default objects when the page loads
  //   // by this we have always 2 post in the starting by default
  //   // {
  //   //   username: "ssssangha",
  //   //   caption: "let me help u achieve this",
  //   //   imageUrl:
  //   //     "	https://i.ytimg.com/vi/tbvguOj8C-o/hq720.jpg?sqp=-…AFwAcABBg==&rs=AOn4CLD1kmL0RL35WfsezpnNX7G3i7otkQ ",
  //   // },
  //   // {
  //   //   username: "ssssangha",
  //   //   caption: "let me help u achieve this",
  //   //   imageUrl:
  //   //     "	https://i.ytimg.com/vi/tbvguOj8C-o/hq720.jpg?sqp=-…AFwAcABBg==&rs=AOn4CLD1kmL0RL35WfsezpnNX7G3i7otkQ ",
  //   // },
  //   // we remove these hard coded values as we have setted the use effect now
  // ]);
  const [posts, setPosts] = useState([]);

  // making for madal functions
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [openSignIn, setOpenSignIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in
        console.log(authUser);
        setUser(authUser);
        // i have simplified this part of code by updating the username at the time of the creation

        // if (authUser.displayName) {
        //   // dont update the username
        // } else {
        //   // if we havew created a user so we will have to update the username and set their profile

        //   return authUser.updateProfile({
        //     displayName: username,
        //   });
        // }

        // state is not persisiten but this auth change detector will help us looged in remain if we log in
      } else {
        // the user has logged our
        setUser(null);
      }
    }); // this will listen for every single time any authentication changes happen in it
    return () => {
      //perform some cleanup actions before using the useeffect hook again
      unsubscribe();
    };
  }, [user, username]); // we need to include the dependencies so everytime these 2 changes this will run

  // use effect runs a code base on a particular condition
  useEffect(() => {
    // we put the codition in the [] brackets at the last of the syntax and it take the value given in that bracket to run the code inside the {} brackets
    // it always runs once when app component load
    // we have givent the value of the posts so it will run every singlr time the posts are reloaded
    db.collection("posts")
      .orderBy("timestamp", "desc") // it will order the post by timstamp descending
      .onSnapshot((snapshot) => {
        // evey post have unique id so we can pull it individually also
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
        // snapshots.docs will get the docs from the database and then we will do mapping

        // docs will take all the data from the database and map will map through all the data inside the database
        // data is username , caption and image url here that it will take from the databse
      });
    // snapshot is a very powerful listener
    // snapshot will capture all the data changed at that time and send it to the database
    // everytime anything added this listener fires

    // we are putting postss inside the database
  }, []);
  const signUp = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password) // create a new user
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username, // this will also update the username while creating the profile
        });
      }) // this give us suth user and we will use functions on it as per our needs

      .catch((error) => alert(error.message)); // if any error so catch it
    setOpen(false); // because we dont want modal to be open after work is done
  };
  const signIn = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
    setOpenSignIn(false); // we want modal to close after we sign up or sign in
  };

  return (
    <div className="app">
      {/*we are pasting herer the modal code from the material ui we have copied earlier*/}

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <img
                className="app_headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="logo"
              />
              {/* this tag will center this logo in the middle of the screen */}
            </center>
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>
              SignUp
            </Button>
          </form>
        </div>
      </Modal>
      <Modal
        open={openSignIn}
        onClose={() => {
          setOpenSignIn(false);
        }}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <img
                className="app_headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="logo"
              />
              {/* this tag will center this logo in the middle of the screen */}
            </center>

            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>
              SignIn
            </Button>
          </form>
        </div>
      </Modal>
      {/* header */}
      <div className="app_header">
        <img
          className="app_headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="logo"
        />

        {user ? (
          <Button onClick={() => auth.signOut()}>Log Out</Button>
        ) : (
          <div className="app_loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )}
      </div>

      <div className="app_posts">
        <div className="app_postsleft">
          {user ? (
            posts.map(({ id, post }) => (
              // id will help the react to know which post is changed and adding new post will show the changes easily
              // so everytime we get a post so we will render that post
              // without key it will refresh all the posts but now only refresh the changed one in the post

              <Post
                key={id}
                postId={id} // this is used for the comments section as we want to comment on a particular post so we need id of that post
                // it is used for the collection inside the posts
                user={user}
                username={post.username}
                imageUrl={post.imageUrl}
                caption={post.caption}
              />
            ))
          ) : (
            <h2>
              Sorry!!! <br /> You have to SignUp/SignIn
            </h2>
          )}
        </div>
        {/* <div className="app_postsright">
          <InstagramEmbed
            url="https://instagr.am/p/Zw9o4/"
            clientAccessToken="123|456"
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div> */}
      </div>
      {user?.displayName ? ( // user?. means dont break the function even its not there
        <ImageUpload username={user.displayName} />
      ) : (
        <h3>Sorry you need to login to upload</h3>
      )}
      {/*  done this as user is null when its logout so our function will try to access the null value so gives error*/}

      {/* posts */}
      {/* props only take those things that a server can serve so plz dont pass anything from your computer */}
      {/* <Post
        username="AnkurSharma5090"
        caption="doing great and trying to achieve new levels in this field"
        imageUrl="https://th.bing.com/th/id/R.4f47902345e0ade1b74c3d3a2579d658?rik=LEVz7HC29meplQ&riu=http%3a%2f%2fbuzzmuzz.com%2fwp-content%2fuploads%2f2020%2f09%2fImage.jpg&ehk=nK5%2fksTmBAVkcNWxCRk2UCS%2fbN4a%2fEMjLC11MxIUyE8%3d&risl=&pid=ImgRaw&r=0"
      />
      <Post
        username="ssssangha"
        caption="let me help u achieve this"
        imageUrl="	https://i.ytimg.com/vi/tbvguOj8C-o/hq720.jpg?sqp=-…AFwAcABBg==&rs=AOn4CLD1kmL0RL35WfsezpnNX7G3i7otkQ        "
      />
      <Post
        username="cleverqazi"
        caption="join us now"
        imageUrl="	https://i.ytimg.com/vi/3_zoGgffxac/hq720.jpg?sqp=-…AFwAcABBg==&rs=AOn4CLC_xlaFxQhMkCRBGV31BQApF7pnug"
      />
      <Post
        username="GTBIT"
        caption="join us now and feel the power of knowledge inside your body and brain"
        imageUrl="https://th.bing.com/th/id/OIP.-HZTnwqwgOxRXP35ZMKAMAHaDt?w=323&h=174&c=7&r=0&o=5&dpr=1.25&pid=1.7"
      /> */}
    </div>
  );
}

export default App;
