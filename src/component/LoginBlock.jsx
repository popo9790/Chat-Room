import React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import LoginIcon from "@mui/icons-material/Login";
import SignupIcon from "@mui/icons-material/FiberNew";
import GoogleIcon from "@mui/icons-material/Google";

import app from "../firebase-config";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

export default function LoginBlock() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const database = getDatabase();

  function signUp() {
    if (email === "" || password === "") {
      alert("Email or password can't be empty!");
      return;
    }

    const auth = getAuth(app);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        alert("Sign up successfully!");
        const roomPath = "/room/" + email.split("@")[0];
        const userPath = "/user/" + email.split("@")[0];
        set(ref(database, roomPath), ["Public"]);
        set(ref(database, userPath), {
          name: email.split("@")[0],
          email: email,
          bio: "I'm new here!",
          pic: "https://t3.ftcdn.net/jpg/05/87/76/66/360_F_587766653_PkBNyGx7mQh9l1XXPtCAq1lBgOsLl6xH.jpg",
        });
      })
      .catch((error) => {
        alert("Error: " + error.message);
      });
  }

  function signIn() {
    if (email === "" || password === "") {
      alert("Email or password can't be empty!");
      return;
    }

    const auth = getAuth(app);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        alert("Sign in successfully!");
      })
      .catch((error) => {
        alert("Error: " + error.message);
      });
  }

  function signInWithGoogle() {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        alert("Sign in successfully! User: " + result.user.email);
        const roomPath = "/room/" + result.user.email.split("@")[0];
        const userPath = "/user/" + result.user.email.split("@")[0];
        set(ref(database, roomPath), ["Public"]);
        set(ref(database, userPath), {
          name: result.user.email.split("@")[0],
          email: result.user.email,
          bio: "I'm new here!",
          pic: "https://t3.ftcdn.net/jpg/05/87/76/66/360_F_587766653_PkBNyGx7mQh9l1XXPtCAq1lBgOsLl6xH.jpg",
        });
      })
      .catch((error) => {
        console.error("Error signing in with Google:", error.message);
      });
  }

  return (
    <Grid
      item
      container
      direction="row"
      justifyContent="space-around"
      alignItems="center"
      sx={{
        height: "100%",
        width: "100%",
      }}
    >
      <Grid
        item
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        xs={7}
        sx={{ ml: 2, my: 2 }}
      >
        <TextField
          id="emailInput"
          label="Email"
          variant="filled"
          margin="normal"
          sx={{ width: "100%" }}
          onChange={(e) => setEmail(e.target.value)}
        ></TextField>
        <TextField
          id="passwordInput"
          label="Password"
          type="password"
          variant="filled"
          autoComplete="off"
          margin="normal"
          sx={{ width: "100%" }}
          onChange={(e) => setPassword(e.target.value)}
        ></TextField>
      </Grid>
      <Grid
        item
        container
        direction="column"
        justifyContent="spcae-around"
        alignItems="center"
        xs={3}
        sx={{ mr: 2, my: 2 }}
      >
        <IconButton aria-label="login" sx={{ p: 1 }} onClick={() => signIn()}>
          <LoginIcon fontSize="large" />
        </IconButton>
        <IconButton aria-label="signup" sx={{ p: 1 }} onClick={() => signUp()}>
          <SignupIcon fontSize="large" />
        </IconButton>
        <IconButton
          aria-label="google"
          sx={{ p: 1 }}
          onClick={() => signInWithGoogle()}
        >
          <GoogleIcon fontSize="large" />
        </IconButton>
      </Grid>
    </Grid>
  );
}
