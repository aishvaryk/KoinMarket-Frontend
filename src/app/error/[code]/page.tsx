"use client";
import { Box, Typography } from "@mui/material";

import { useState } from "react";

type Error = {
  code: string;
  message: string | null;
};

export default function ErrorPage({ params }: { params: { code: string } }) {
  const [error, setError] = useState<Error>({ code: params.code, message: null });

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
