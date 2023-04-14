"use client";
import { Box, Button, TextField } from "@mui/material";
import { useReducer } from "react";

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

interface TextfieldValidation {
  isValid: boolean;
  validationMessage: string;
}

type FormValidationAction = {
  type: "valid" | "shortLength" | "invalidEmail" | "alreadyExists";
  payload?: string;
};

function validationReducer(
  state: TextfieldValidation,
  action: FormValidationAction
) {
  switch (action.type) {
    case "shortLength":
      return {
        ...state,
        isValid: false,
        validationMessage: action.payload + " should have minimum 8 characters",
      };
    case "invalidEmail":
      return {
        ...state,
        isValid: false,
        validationMessage: action.payload + " is an invalid email address",
      };
    case "alreadyExists":
      return {
        ...state,
        isValid: false,
        validationMessage: action.payload + " is already in use",
      };
    case "valid":
      return { ...state, isValid: true, validationMessage: "" };
    default:
      return { ...state };
  }
}

export default function Page() {
  const [usernameValidation, userNameDispatch] = useReducer(validationReducer, {
    isValid: true,
    validationMessage: "",
  });

  const [emailValidation, emailDispatch] = useReducer(validationReducer, {
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
        type: "shortLength",
        payload: "Username",
      });
    } else {
      userNameDispatch({
        type: "valid",
      });
    }
  }

  function handleEmail(email: string) {
    if (!email.match(EMAIL_REGEX)) {
      emailDispatch({
        type: "invalidEmail",
        payload: "Entered Email",
      });
    } else {
      emailDispatch({
        type: "valid",
      });
    }
  }

  function handlePassword(password: string) {
    if (password.length < 8) {
      passwordDispatch({
        type: "shortLength",
        payload: "Password",
      });
    } else {
      passwordDispatch({
        type: "valid",
      });
    }
  }
  
  function handleSubmit() {
    
  }


  return (
    <Box
      component="form"
      sx={{
        height: "calc(100% - 64px)",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      onSubmit = {handleSubmit}
    >
      <Box
        sx={{
          height: { xs: "40%", sm: "30%" },
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
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            handleUsername(event.target.value);
          }}
          error={!usernameValidation.isValid}
          helperText={usernameValidation.validationMessage}
          label="Username"
        />
        <TextField
          sx={{
            width: "100%",
          }}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            handleEmail(event.target.value);
          }}
          error={!emailValidation.isValid}
          helperText={emailValidation.validationMessage}
          label="Email Address"
        />
        <TextField
          sx={{
            width: "100%",
          }}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            handlePassword(event.target.value);
          }}
          error={!passwordValidation.isValid}
          helperText={passwordValidation.validationMessage}
          label="Password"
          type="password"
        />
        <Button
          sx={{
            width: "50%",
          }}
          variant="contained"
          type="submit"
        >
          SignUp
        </Button>
      </Box>
    </Box>
  );
}
