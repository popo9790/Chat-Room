import React from "react";

import Grid from "@mui/material/Grid";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import Topbar from "../component/Topbar";
import ChatArea from "../component/ChatArea";
import UserArea from "../component/UserArea";

export default function HomePage() {
  const [curRoom, setCurRoom] = React.useState("Public");

  function transferCurRoomToUpperNode(roomName) {
    setCurRoom(roomName);
  }

  return (
    <React.StrictMode>
      <Grid container item xs={12}>
        <Topbar />
      </Grid>
      <Grid container direction="row" sx={{ height: "800px" }}>
        <Grid item xs={12} sm={7} md={9} sx={{ height: "100%" }}>
          <ChatArea curRoom={curRoom} />
        </Grid>
        <Grid item xs={12} sm={5} md={3} sx={{ height: "100%" }}>
          <UserArea transferCurRoomToUpperNode={transferCurRoomToUpperNode} />
        </Grid>
      </Grid>
    </React.StrictMode>
  );
}
