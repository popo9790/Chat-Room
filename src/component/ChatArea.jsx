import React from "react";
import { Grid } from "@mui/material";
import TextField from "@mui/material/TextField";
import { IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

import { getAuth } from "firebase/auth";
import {
  getDatabase,
  ref,
  set,
  get,
  onChildAdded,
  update,
  onChildRemoved,
} from "firebase/database";

import TextBlock from "./TextBlock";

export default function ChatArea(props) {
  const { curRoom } = props;
  const [msgList, setMsgList] = React.useState([]);

  const auth = getAuth();
  const msgListRef = React.useRef(msgList);
  const scrollButtonRef = React.useRef();

  // Request for notification permission
  React.useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  React.useEffect(() => {
    msgListRef.current = msgList;
  }, [msgList]);

  // Get the message list from the database when the room changes
  React.useEffect(() => {
    const database = getDatabase();
    const chatPath = "/chat/" + curRoom;
    const chatRef = ref(database, chatPath);

    get(chatRef).then((snapshot) => {
      if (snapshot.exists()) {
        const histroyMSG = snapshot.val();
        if (histroyMSG === null) {
          setMsgList([]);
        } else {
          setMsgList(histroyMSG);
        }
      } else {
        setMsgList([]);
      }
    });

    // Listen for new messages
    const onAdd = onChildAdded(chatRef, (snapshot) => {
      const newMSG = snapshot.val();

      // Check if the current user is not the sender and notifications are allowed
      if (auth.currentUser !== null) {
        const curUserName = auth.currentUser.email.split("@")[0];
        if (
          Notification.permission === "granted" &&
          newMSG.userName !== curUserName &&
          newMSG.notified === false
        ) {
          const notification = new Notification("New Message!", {
            body: `${newMSG.userName} send a messege to you: ${newMSG.content}`,
          });
          newMSG.notified = true;
          update(ref(database, "/chat/" + curRoom + "/" + snapshot.key), {
            notified: true,
          });
        }
      }

      setMsgList((prevMSGs) => [...prevMSGs, newMSG]);
    });

    const onRemove = onChildRemoved(chatRef, (snapshot) => {
      const curUserName = auth.currentUser.email.split("@")[0];
      const removedMSG = snapshot.val();
      if (removedMSG.userName !== curUserName) {
        const newMsgList = msgListRef.current.filter(
          (msg) => msg.time !== removedMSG.time
        );
        console.log(newMsgList);
        setMsgList(newMsgList);
      }
    });

    return () => {
      onAdd();
      onRemove();
    };
  }, [curRoom]);

  // Scroll to the bottom of the chat area when the message list changes
  React.useEffect(() => {
    scrollButtonRef.current.scrollIntoView({ behavior: "smooth" });
  }, [msgList]);

  // Add the message to the database
  function handleAddMSGtoDatabase() {
    const textInput = document.getElementById("textInput");

    // Create something for using the database
    const database = getDatabase();
    const chatPath = "/chat/" + curRoom;
    const chatRef = ref(database, chatPath);

    // Get the current user's name
    const auth = getAuth();
    if (auth.currentUser === null) {
      alert("Please login first!");
      textInput.value = "";
      return;
    }

    // Update the local message list
    const curUserName = auth.currentUser.email.split("@")[0];
    const Content = {
      userName: curUserName,
      content: textInput.value,
      notified: false,
      time: new Date().getTime(),
    };
    const newMsgList = [...msgList, Content];

    // Update the database
    set(chatRef, newMsgList);
    textInput.value = "";
  }

  // Delete the message from the database
  function handleDeleteMSG(index) {
    if (auth.currentUser === null) {
      alert("Please login first!");
      return;
    }
    const database = getDatabase();
    const chatPath = "/chat/" + curRoom;
    const chatRef = ref(database, chatPath);
    const newMsgList = msgList.filter((msg, i) => i !== index);
    set(chatRef, newMsgList);
    setMsgList(newMsgList);
  }

  return (
    <Grid
      item
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
      sx={{ height: "100%", width: "100%" }}
    >
      <Grid
        item
        container
        direction="column"
        sx={{
          width: "100%",
          height: "85%",
          mx: 2,
          mt: 1,
          p: 2,
          background: "#85b8cb",
          borderRadius: 3,
          overflowY: "scroll",
        }}
      >
        {/* Display the message list */}
        <Grid key={msgList}>
          {msgList.map((msg, index) => (
            <TextBlock
              key={index}
              idxMSG={index}
              userName={msg.userName}
              content={msg.content}
              handleDeleteMSG={handleDeleteMSG}
            />
          ))}
          <div ref={scrollButtonRef}> </div>
        </Grid>
      </Grid>
      <Grid
        item
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        wrap="nowrap"
        sx={{
          width: "100%",
          height: "10%",
          background: "#85b8cb",
          borderRadius: 3,
          mx: 2,
          mb: 1,
        }}
      >
        {/* Input box and send button */}
        <TextField
          id="textInput"
          label="Please type here..."
          autoComplete="off"
          variant="standard"
          sx={{ width: "90%" }}
        ></TextField>
        <IconButton
          onClick={() => {
            handleAddMSGtoDatabase();
          }}
        >
          <SendIcon fontSize="large" />
        </IconButton>
      </Grid>
    </Grid>
  );
}
