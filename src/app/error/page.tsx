"use client";
import { Box, LinearProgress, Typography } from "@mui/material";

import { useState } from "react";

export type Error = {
  code: string;
  message: string | null;
};

function errObjToError(errObj: string): Error {
  errObj = JSON.parse(errObj);
  return { code: "unknown", message: null };
}

export default function ErrorPage(props: {
  errorProp: any;
  children: React.ReactNode;
}) {
  const [error, setError] = useState<Error>({ code: "unknown", message: null });

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
      <Typography color={"red"}>Error : {error.code}</Typography>
      <Typography>{error.message}</Typography>
    </Box>
  );
}
