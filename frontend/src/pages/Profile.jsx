import * as React from "react";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Grid from "@mui/joy/Grid";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Avatar from "@mui/joy/Avatar";
import Button from "@mui/joy/Button";
import { Link as Lk, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import axios from "axios";

export default function ProfilePage() {
  const params = useParams();
  const [theUser, setTheUser] = useState(null);
  const [render, setRender] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          throw new Error("Access token not found");
        }

        const response = await axios.get(
          `https://social-sphere-xzkh.onrender.com/api/v1/users/profile/${params.username}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log("Response", response);
        const fetchedProfile = response.data;
        setTheUser(fetchedProfile);
        let res = await axios.get(
          "https://social-sphere-xzkh.onrender.com/api/v1/users/me",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setCurrentUser(res.data);
        setRender(true);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleFollow = async () => {
    try {
      // Implement follow logic here
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleUnfollow = async () => {
    try {
      // Implement unfollow logic here
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Navbar />
      <Box sx={{ display: "flex", flexDirection: "row", marginTop: "70px" }}>
        <Sidebar />
        <Box sx={{ flex: 2 }}>
          {theUser && render && (
            <>
              <Box sx={{ p: 4, marginLeft: "300px", marginTop: "10px" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 3,
                    marginTop: "20px",
                  }}
                >
                  <Avatar
                    sx={{ width: 200, height: 200 }}
                    alt="Profile Image"
                    src={
                      theUser.data[0].profilepic ||
                      "https://via.placeholder.com/150"
                    }
                  />
                  <Box sx={{ ml: 15 }}>
                    <Typography
                      variant="h2"
                      sx={{
                        fontSize: "3rem",
                        display: "inline",
                        paddingRight: "1.5rem",
                      }}
                    >
                      {theUser.data[0].name || ""}
                    </Typography>
                    <Typography
                      variant="h2"
                      sx={{ fontSize: "3rem", display: "inline" }}
                    >
                      .
                    </Typography>
                    <Typography
                      variant="h2"
                      sx={{
                        fontSize: "2rem",
                        display: "inline",
                        paddingLeft: "1.5rem",
                      }}
                    >
                      @{theUser.data[0].username || ""}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ fontSize: "1.5rem", mr: 2 }}
                      >
                        {theUser.data[0].followersCount} followers
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.primary"
                        sx={{ fontSize: "1.5rem", mr: 2 }}
                      >
                        {theUser.data[0].followingsCount} following
                      </Typography>
                      {/** Follow/Unfollow buttons */}
                      <Button
                        variant="outlined"
                        onClick={handleUnfollow}
                        sx={{ fontSize: "1.5rem" }}
                      >
                        {theUser.data[0].isFollowing ? "Unfollow" : "Follow"}
                      </Button>
                    </Box>
                    {theUser.data[0].username === currentUser.data.username ? (
                      <Lk to="/edit-profile" style={{ textDecoration: "none" }}>
                        <Button
                          variant="outlined"
                          startIcon={<EditRoundedIcon />}
                          sx={{ fontSize: "1.5rem", mt: 2 }}
                        >
                          Edit Profile
                        </Button>
                      </Lk>
                    ) : (
                      <></>
                    )}
                  </Box>
                </Box>
                <Typography
                  variant="body1"
                  color="text.primary"
                  sx={{ fontSize: "1.5rem" }}
                >
                  {theUser.data[0].bio}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.primary"
                  sx={{ fontSize: "1.5rem", mt: 3, mb: 1 }}
                >
                  {theUser.data[0].posts.length}{" "}
                  {theUser.data[0].posts.length === 1 ? "post" : "posts"}
                </Typography>
                <hr
                  style={{
                    border: "1px solid #ccc",
                    width: "100%",
                    marginBottom: "20px",
                  }}
                />
                <Grid container spacing={3}>
                  {theUser.data[0].posts.map((post, index) => (
                    <Grid key={post._id} item xs={4}>
                      <Card style={{ width: "80%" }}>
                        <CardContent>
                          <Typography variant="h6">{post.caption}</Typography>
                          <img
                            src={post.mediaFile[0] || ""}
                            alt={post.caption}
                            style={{ width: "100%", marginTop: 10 }}
                          />
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}
