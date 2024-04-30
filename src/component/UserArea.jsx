import React from "react";

import LoginBlock from "./LoginBlock";
import ProfileBlock from "./ProfileBlock";
import RoomBlock from "./RoomBlock";

import { Grid, IconButton, TextField } from "@mui/material";
import AddChatIcon from "@mui/icons-material/AddReaction";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, set, onValue } from "firebase/database";

export default function UserArea(props) {
  const { transferCurRoomToUpperNode } = props;
  const database = getDatabase();
  const [user, setUser] = React.useState(null);
  const [roomList, setRoomList] = React.useState(["Public"]);
  const [curRoom, setCurRoom] = React.useState("Public");

  // Check if user is logged in
  // If user is logged in, get the roomList from the database
  React.useEffect(() => {
    const auth = getAuth();
    return onAuthStateChanged(auth, (user) => {
      setUser(user);
      setCurRoom("Public");
      transferCurRoomToUpperNode("Public");

      // Initialize the roomList
      if (user === null) {
        setRoomList(["Public"]);
      } else {
        const userNames = user.email.split("@")[0];
        const path = "/room/" + userNames;
        const roomRef = ref(database, path);
        onValue(
          roomRef,
          (snapshot) => {
            const rooms = snapshot.val();
            if (rooms) {
              setRoomList(Array.isArray(rooms) ? rooms : [rooms]);
            } else {
              setRoomList(["Public"]);
            }
          },
          { onlyOnce: true }
        );
      }
    });
  }, [user]);

  // Mainly for deleting the chat at another component
  // Doing like this can help me to have no need to transfer info to this component
  function renewRoomList(roomName) {
    const newRoomList = roomList.filter((room) => room !== roomName);
    setRoomList(newRoomList);
  }

  // Add room to the roomList
  // And update the roomList in the database
  function addChat() {
    const userNames = user !== null ? user.email.split("@")[0] : "";
    const newRoomName = document.getElementById("AddChat").value;
    if (userNames === "") {
      alert("Please login first!");
      return;
    }
    if (newRoomName === "") {
      alert("Room name can't be empty!");
      return;
    }
    if (roomList.includes(newRoomName)) {
      alert("You already have this room!");
      return;
    }

    const path = "/room/" + userNames;
    const newRoomList = roomList.concat(newRoomName);
    setRoomList(newRoomList);
    set(ref(database, path), newRoomList);
  }

  // Choose the room to chat
  function chooseRoom(roomName) {
    setCurRoom(roomName);
    transferCurRoomToUpperNode(roomName);
  }

  return (
    <Grid
      container
      direction="column"
      justifyContent="space-around"
      alignItems="center"
      sx={{ height: "100%", width: "100%" }}
    >
      <Grid
        item
        sx={{
          width: "90%",
          height: "25%",
          mx: 1,
          my: 2,
          background: "linear-gradient(to right, #85b8cb, #d1dddb)",
          borderRadius: 3,
        }}
      >
        {user ? (
          <ProfileBlock user_email={user.email.split("@")[0]} />
        ) : (
          <LoginBlock />
        )}
      </Grid>
      <Grid
        item
        sx={{
          width: "90%",
          height: "65%",
          my: 2,
          mx: 1,
          px: 2,
          background: "linear-gradient(to right, #85b8cb, #d1dddb)",
          borderRadius: 3,
        }}
      >
        <Grid item container direction="row" wrap="nowrap">
          <TextField
            id="AddChat"
            label="Room name"
            variant="filled"
            margin="normal"
            autoComplete="off"
            sx={{ width: "100%" }}
          ></TextField>
          <IconButton
            onClick={() => {
              addChat();
              const addChatInput = document.getElementById("AddChat");
              addChatInput.value = "";
            }}
          >
            <AddChatIcon fontSize="large" />
          </IconButton>
        </Grid>
        <Grid
          item
          container
          direction="column"
          justifyContent="flex-start"
          key={roomList}
          sx={{ height: "81%", overflowY: "scroll" }}
          className="fade-in-11s"
        >
          {roomList.map((roomName, index) => (
            <RoomBlock
              roomName={roomName}
              key={index}
              curRoom={curRoom}
              chooseRoom={chooseRoom}
              renewRoomList={renewRoomList}
            />
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
}
