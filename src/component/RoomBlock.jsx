import React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/DeleteForever";
import JoinIcon from "@mui/icons-material/KeyboardTab";

import { getDatabase, onValue, ref, set } from "firebase/database";
import { getAuth } from "firebase/auth";

export default function RoomBlock(props) {
  const { curRoom, roomName, renewRoomList, chooseRoom } = props;
  const [dynamicFontSize, setDynamicFontSize] = React.useState("large");
  const [backgroundColor, setBackgroundColor] = React.useState(
    "rgba(241, 238, 220, 0.3)"
  );

  // Change the font size of the roomName if it is too long
  React.useEffect(() => {
    if (roomName.length > 30) {
      setDynamicFontSize("small");
    }
  }, [roomName]);

  // Change the background color of the roomName if it is the current room
  React.useEffect(() => {
    if (curRoom === roomName) {
      setBackgroundColor("rgba(241, 238, 220, 0.7)");
    } else {
      setBackgroundColor("rgba(241, 238, 220, 0.3)");
    }
  }, [curRoom, roomName]);

  // Delete the room in the curUser's database
  function deleteChatRoomFromDatabase() {
    const auth = getAuth();
    const database = getDatabase();
    const curUserName = auth.currentUser.email.split("@")[0];
    const curUserPath = "/room/" + curUserName;

    onValue(
      ref(database, curUserPath),
      (snapshot) => {
        const roomList = snapshot.val();
        const newRoomList = roomList.filter((room) => room !== roomName);
        set(ref(database, curUserPath), newRoomList);
      },
      { onlyOnce: true }
    );
  }

  return (
    <Grid
      item
      container
      direction="row"
      wrap="nowrap"
      justifyContent="space-between"
      alignItems="center"
      sx={{
        width: "100%",
        height: "15%",
        borderRadius: 3,
        background: backgroundColor,
        p: 1,
        my: 1,
      }}
    >
      <Grid item sx={{ width: "100%" }}>
        <Typography
          fontFamily={"Bookman"}
          fontSize={"large"}
          align="center"
          sx={{ fontWeight: "bold" }}
        >
          {roomName === "Public" ? "Public" : "Private"}
        </Typography>
        <Divider variant="middle" />
        <Typography
          fontFamily={"Bookman"}
          fontSize={dynamicFontSize}
          align="center"
          sx={{ fontWeight: "bold", color: "rgba(0, 0, 0, 0.4)" }}
        >
          {roomName === "Public" ? "Open to every body" : roomName}
        </Typography>
      </Grid>
      <Grid>
        {roomName !== "Public" && curRoom === roomName && (
          <Grid item>
            <IconButton
              onClick={() => {
                deleteChatRoomFromDatabase();
                renewRoomList(roomName);
                chooseRoom("Public");
              }}
            >
              <DeleteIcon fontSize="large" />
            </IconButton>
          </Grid>
        )}
        {curRoom !== roomName && (
          <Grid item>
            <IconButton
              onClick={() => {
                chooseRoom(roomName);
              }}
            >
              <JoinIcon fontSize="large" />
            </IconButton>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}
