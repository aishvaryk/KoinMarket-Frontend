"use client";
import Link from "next/link";
import {
  Box,
  Button,
  TextField,
  Typography,
  LinearProgress,
} from "@mui/material";
import { useReducer, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/app/constants/backendURL";
import { UserData } from "@/app/interfaces/UserData";
import { useUser } from "../store";
import { useRouter } from 'next/navigation';
import Cookies from "js-cookie";

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

interface TextfieldValidation {
  isValid: boolean;
  validationMessage: string;
}

type FormValidationAction = {
  type: "valid" | "wrongPassword" | "notExist";
  payload?: string;
};

function validationReducer(
  state: TextfieldValidation,
  action: FormValidationAction
) {
  switch (action.type) {
    case "wrongPassword":
      return {
        ...state,
        isValid: false,
        validationMessage: " Entered password is wrong",
      };
    case "notExist":
      return {
        ...state,
        isValid: false,
        validationMessage: "Entered username or email is wrong",
      };
    case "valid":
      return { ...state, isValid: true, validationMessage: "" };
    default:
      return { ...state };
  }
}

export default function Page() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {user, setUser} = useUser();
  const router = useRouter();

  const [usernameValidation, userNameDispatch] = useReducer(validationReducer, {
    isValid: true,
    validationMessage: "",
  });

  const [passwordValidation, passwordDispatch] = useReducer(validationReducer, {
    isValid: true,
    validationMessage: "",
  });

  function handleUsername(username: string) {
    if (username.length < 8) {
      userNameDispatch({
        type: "notExist",
      });
    } else {
      userNameDispatch({
        type: "valid",
      });
    }
  }

  function handlePassword(password: string) {
    if (password.length < 8) {
      passwordDispatch({
        type: "wrongPassword",
      });
    } else {
      passwordDispatch({
        type: "valid",
      });
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    axios({
      url: BASE_URL + "login",
      method: "POST",
      data: {
        "username": username,
        "password": password,
      },
      withCredentials: false,
    })
      .then((res) => {
        var user: UserData = {
          id: res.data.user.id,
          token: res.data.token,
          username: res.data.user.username,
          emailAddress: res.data.user.emailAddress,
        };
        Cookies.set("jwt", res.data.token);
      })
      .then(() => {
        setUser(user);
        setIsLoading(false);
        router.replace("/");
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  }

  if (isLoading) {
    return <LinearProgress />;
  } else {
    return (
      <Box
        component="form"
        sx={{
          height: "calc(100% - 64px)",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
        onSubmit={handleSubmit}
      >
        <Box
          sx={{
            height: { xs: "30%", sm: "20%" },
            width: { xs: "80%", sm: "70%", md: "60%", lg: "40%" },
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TextField
            sx={{
              width: "100%",
            }}
            error={!usernameValidation.isValid}
            helperText={usernameValidation.validationMessage}
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            sx={{
              width: "100%",
            }}
            error={!passwordValidation.isValid}
            helperText={passwordValidation.validationMessage}
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            sx={{
              width: "50%",
            }}
            variant="contained"
            type="submit"
          >
            LogIn
          </Button>
        </Box>
        <Typography sx={{ mt: "20px" }}>
          Do not have an account? <Link href="/user/register">Sign Up!</Link>
        </Typography>
      </Box>
    );
  }
}
