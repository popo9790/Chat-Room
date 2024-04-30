import React from "react";

import DefaultUserPic from "../img/default_user.png";
import { Typography, IconButton, Box, Grid } from "@mui/material";
import DeleteIcon from "@mui/icons-material/DeleteSweep";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";

export default function TextBlock(props) {
  const { userName, content, idxMSG, handleDeleteMSG } = props;
  const [curUser, setCurUser] = React.useState(null);
  const [userPic, setUserPic] = React.useState(DefaultUserPic);
  const [isSelf, setIsSelf] = React.useState(false);

  // Get the current user
  React.useEffect(() => {
    const auth = getAuth();
    return onAuthStateChanged(auth, (user) => {
      setCurUser(user);
    });
  });

  // Check the sender of this msg is curUser
  React.useEffect(() => {
    if (curUser !== null && curUser.email.split("@")[0] === userName) {
      setIsSelf(true);
    } else {
      setIsSelf(false);
    }
  }, [curUser, userName]);

  // Get the user's profile pic
  React.useEffect(() => {
    const database = getDatabase();
    const userPath = "/user/" + userName;
    const userRef = ref(database, userPath);
    onValue(
      userRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data !== null) {
          setUserPic(data.pic);
        }
      },
      { onlyOnce: true }
    );
  });

  return (
    <Grid
      item
      container
      direction={"row"}
      sx={{
        width: "100%",
        borderRadius: 3,
        background: "rgba(241, 238, 220, 0.7)",
        my: 1,
        p: 1,
      }}
    >
      <Grid
        item
        container
        direction="row"
        wrap="nowrap"
        justifyContent="space-between"
        alignItems="flex-start"
        sx={{ width: "100%" }}
      >
        <Grid item container direction={"row"}>
          <Box
            component="img"
            src={userPic}
            sx={{
              width: "4.5rem",
              height: "4.5rem",
              objectFit: "cover",
              borderRadius: "50%",
              mr: 1,
            }}
          ></Box>
          <Grid>
            <Typography align="left" sx={{ fontSize: "1.2rem" }}>
              {userName}
            </Typography>
            <Typography align="left" sx={{ fontSize: "2rem" }}>
              {content}
            </Typography>
          </Grid>
        </Grid>
        {isSelf && (
          <Grid item sx={{ alignSelf: "flex-end", justifySelf: "flex-start" }}>
            <IconButton
              onClick={() => {
                var result = window.confirm(
                  "Are you SURE to delete this message?"
                );
                if (!result) return;
                handleDeleteMSG(idxMSG);
              }}
            >
              <DeleteIcon fontSize="medium" />
            </IconButton>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}
