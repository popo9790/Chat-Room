import React from "react";
import { getAuth } from "firebase/auth";

import CoPresentIcon from "@mui/icons-material/CoPresent";
import { Grid } from "@mui/material";

export default function Topbar() {
  const [user, setUser] = React.useState(null);
  const [topBarMSG, settopBarMSG] = React.useState("Chat Room");
  const auth = getAuth();

  React.useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      setUser(user);

      if (user !== null) {
        settopBarMSG(auth.currentUser.email.split("@")[0] + "'s Chat Room");
      } else {
        settopBarMSG("Chat Room");
      }
    });
  });

  return (
    <Grid
      itme
      container
      sx={{
        width: "100%",
        background: "linear-gradient(to right, #1d6a96, #85b8cb)",
        px: 4,
        py: 4,
      }}
    >
      <CoPresentIcon fontSize="large"></CoPresentIcon>
      <div className={`text-4xl pl-4 ${user !== null ? "slide-in" : ""}`}>
        {topBarMSG}
      </div>
    </Grid>
  );
}
