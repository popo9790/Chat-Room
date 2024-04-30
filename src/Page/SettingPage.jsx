import React from "react";

import { useNavigate } from "react-router-dom";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Box, IconButton, Typography, Grid, TextField } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";

import defaultUserPic from "../img/default_user.png";
import Topbar from "../component/Topbar";

import { getAuth } from "firebase/auth";
import { getDatabase, onValue, ref, update } from "firebase/database";

export default function SettingPage() {
  const navigate = useNavigate();
  const [curUser, setcurUserr] = React.useState(null);
  const [isSetting, setIsSetting] = React.useState(false);
  const [userPic, setUserPic] = React.useState(defaultUserPic);
  const auth = getAuth();

  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  React.useEffect(() => {
    const database = getDatabase();
    if (curUser !== null) {
      const userNames = curUser.email.split("@")[0];
      const path = "/user/" + userNames;
      const userRef = ref(database, path);
      onValue(
        userRef,
        (snapshot) => {
          const data = snapshot.val();
          if (data !== null) {
            document.getElementById("bioFeild").value = data.bio;
            document.getElementById("picFeild").value = data.pic;
            setUserPic(data.pic);
          }
        },
        { onlyOnce: true }
      );
    }
  });

  // Get current user's info
  React.useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      setcurUserr(user);
    });
  });

  function handleSaveProfile() {
    const database = getDatabase();
    const userNames = curUser.email.split("@")[0];
    const bio = document.getElementById("bioFeild").value;
    const pic = document.getElementById("picFeild").value;
    const path = "/user/" + userNames;
    const userRef = ref(database, path);
    update(userRef, {
      bio: bio,
      pic: pic,
    });
    alert("Profile saved!");
  }

  return (
    <div>
      <Grid item xs={12}>
        <Topbar />
      </Grid>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignContent="center"
        sx={{ height: "800px" }}
      >
        <Grid
          item
          container
          direction={"row"}
          justifyContent="center"
          alignItems="center"
          xs={11}
          sx={{
            height: "90%",
            borderRadius: 3,
            p: 2,
          }}
        >
          <Grid
            item
            container
            direction={"column"}
            justifyContent="center"
            alignItems="center"
            md={5}
            sx={{
              height: "90%",
              background: "#85b8cb",
              borderRadius: 3,
              display: isMediumScreen ? "none" : "flex",
              mr: 2,
            }}
          >
            {/* Display the user's pic and name */}
            <Box
              component="img"
              src={userPic}
              sx={{
                width: "20rem",
                height: "20rem",
                objectFit: "cover",
                borderRadius: "50%",
                m: 4,
              }}
            ></Box>
            <Typography sx={{ fontSize: "2rem" }}>
              {curUser !== null ? curUser.email.split("@")[0] : "Anonymous"}
            </Typography>
          </Grid>
          {/* Display the user's profile */}
          <Grid
            item
            container
            direction={"column"}
            justifyContent="flex-start"
            alignItems="flex-start"
            wrap="nowrap"
            sm={12}
            md={6}
            sx={{
              height: "90%",
              background: "linear-gradient(to right, #85b8cb, #d1dddb)",
              borderRadius: 3,
              ml: 2,
              p: 2,
            }}
          >
            <Typography sx={{ fontSize: "1.5rem" }}>Your Email</Typography>
            <TextField
              disabled
              id="emailFeild"
              label={curUser !== null ? curUser.email : "Anonymous"}
              variant="filled"
              sx={{ width: "100%", pb: 2 }}
            />
            <Typography sx={{ fontSize: "1.5rem" }}>Your Name</Typography>
            <TextField
              disabled
              id="nameFeild"
              label={
                curUser !== null ? curUser.email.split("@")[0] : "Anonymous"
              }
              variant="filled"
              sx={{ width: "100%", pb: 2 }}
            />
            <Typography sx={{ fontSize: "1.5rem" }}>Bio</Typography>
            <TextField
              disabled={!isSetting}
              id="bioFeild"
              variant="filled"
              multiline
              rows={5}
              sx={{ width: "100%", pb: 2 }}
            ></TextField>
            <Typography sx={{ fontSize: "1.5rem" }}>
              User Picture URL
            </Typography>
            <TextField
              disabled={!isSetting}
              id="picFeild"
              variant="filled"
              sx={{ width: "100%", pb: 2 }}
            ></TextField>
            <Grid
              item
              container
              direction={"row"}
              justifyContent="space-between"
              alignItems="center"
              sx={{ height: "10%", width: "100%" }}
            >
              <IconButton
                onClick={() => {
                  navigate("/");
                }}
              >
                <ArrowBackIcon fontSize="large" />
              </IconButton>
              {isSetting ? (
                <IconButton
                  onClick={() => {
                    setIsSetting(!isSetting);
                    handleSaveProfile();
                  }}
                >
                  <CheckIcon fontSize="large" />
                </IconButton>
              ) : (
                <IconButton
                  onClick={() => {
                    if (curUser !== null) setIsSetting(!isSetting);
                    else alert("Please login first!");
                  }}
                >
                  <EditIcon fontSize="large" />
                </IconButton>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
