"use client";
import { useRouter } from 'next/navigation';
import { BASE_URL } from "@/app/constants/backendURL";
import {
  LinearProgress,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useUser } from "../store";
import Cookies from 'js-cookie';

export default function Logout() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user, setUser } = useUser();
  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    axios({
      url: BASE_URL + "logout",
      method: "POST",
      withCredentials: false,
      headers: {
        Authorization: "Bearer " + user?.token
      },
    })
      .then((res) => {
        setIsLoading(false);
        setUser(null);
        Cookies.remove("jwt");
        setTimeout(()=>{
            router.replace("/");
        }, 1000);
      })
      .catch((err) => {
        setIsLoading(false);
        setUser(null);
        console.log(err);
        router.replace("/");
      });
  }, []);

  if (isLoading) {
    return <LinearProgress />;
  } else {
    return (
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography>You are successfully logged out</Typography>
        <Typography>Redirecting to Home Page</Typography>
        <CircularProgress />
      </Box>
    );
  }
}
