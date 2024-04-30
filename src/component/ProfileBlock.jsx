import React from "react";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import LogoutIcon from "@mui/icons-material/Logout";
import CameraIcon from "@mui/icons-material/Camera";

import DefaultUserPic from "../img/default_user.png";

import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { getDatabase, onValue, ref } from "firebase/database";

export default function Profile(props) {
  const { user_email } = props;
  const [dynamicFontSize, setDynamicFontSize] = React.useState("22px");
  const [userPic, setUserPic] = React.useState(DefaultUserPic);
  const auth = getAuth();
  const navigate = useNavigate();

  function logOut() {
    auth
      .signOut()
      .then(() => {
        alert("Sign out successfully!");
      })
      .catch((error) => {
        alert("Error: " + error.message);
      });
  }

  React.useEffect(() => {
    if (user_email.length > 20) {
      setDynamicFontSize("12px");
    } else {
      setDynamicFontSize("22px");
    }
  }, [user_email]);

  React.useEffect(() => {
    const userNames = user_email.split("@")[0];
    const database = getDatabase();
    const userPath = "/user/" + userNames;
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
        className="fade-in-11s"
      >
        <Box
          component="img"
          src={userPic}
          sx={{
            width: "9rem",
            height: "9rem",
            objectFit: "cover",
            borderRadius: "50%",
            mt: 1,
          }}
        ></Box>
        <Typography fontSize={dynamicFontSize} sx={{ fontWeight: "bold" }}>
          {user_email}
        </Typography>
      </Grid>
      <Grid
        item
        container
        direction="column"
        justifyContent="spcae-between"
        alignItems="center"
        xs={3}
        sx={{ pr: 2, py: 2 }}
      >
        <IconButton aria-label="logout" sx={{ p: 2 }} onClick={() => logOut()}>
          <LogoutIcon fontSize="large" />
        </IconButton>
        <IconButton
          aria-label="changepic"
          sx={{ p: 2 }}
          onClick={() => {
            navigate("/setting");
          }}
        >
          <CameraIcon fontSize="large" />
        </IconButton>
      </Grid>
    </Grid>
  );
}
