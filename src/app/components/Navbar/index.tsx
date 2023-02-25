"use client";
import { Box, Typography, Icon } from "@mui/material";
import { Logo } from "../Logo";

export function Navbar() {
  const pageTitle = "KoinMarket";
    return (<Box className="navbar-wrapper" sx={{
        height:"53px",
        width: "50%",
        display: "flex",
        alignItems: "center",
        px:2,
        zIndex:1,
        position:"fixed",
        overflowY:"clip",
        backgroundColor: "white",
        opacity:0.92
    }}>
        <Typography variant="h2" sx={{
            fontSize:"20px",
            opacity:1
        }}><Logo></Logo><strong><Icon></Icon>{pageTitle}</strong></Typography>
    </Box>
    )
}
