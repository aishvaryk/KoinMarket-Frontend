"use client";
import { Box, Typography } from "@mui/material";
import { FlexBox } from "../global/FlexBox";
import { Logo } from "../Logo";

export function Navbar() {
  return (
    <FlexBox className={"navbar-wrapper"} height={"60px"} width={"100%"}>
      <Box sx={{ height: "100%", width: "110px", position: "relative" }}>
        <Logo></Logo>
      </Box>
    </FlexBox>
  );
}
