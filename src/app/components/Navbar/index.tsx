"use client";
import { BASE_URL } from "@/app/constants/backendURL";
import { useUser } from "@/app/user/store";
import {
  AppBar,
  Avatar,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Logo } from "../Logo";
import UserAvatar from "../UserAvatar";

type NavbarMenuOption = {
  name: string;
  url: string;
};

const NO_USER_MENU: NavbarMenuOption[] = [
  {
    name: "LogIn",
    url: "/user/login",
  },
  {
    name: "SignUp",
    url: "/user/register",
  },
];
const WITH_USER_MENU: NavbarMenuOption[] = [
  {
    name: "Watchlists",
    url: "/user/watchlists",
  },
  {
    name: "Logout",
    url: "/user/logout",
  },
];

export function Navbar() {
  const { user, setUser } = useUser();
  const [userMenu, setUserMenu] = useState(NO_USER_MENU);

  useEffect(() => {
    if (user) {
      axios({
        url: BASE_URL + "user",
        method: "GET",
        params: {
          id: user.id,
        },
        withCredentials: false,
        headers: {
          Authorization: "Bearer " + user.token,
        },
      })
        .then((res) => {
          setUserMenu(WITH_USER_MENU);
        })
        .catch((err) => {
          console.log(err);
          setUser(null);
        });
    } else {
      setUserMenu(NO_USER_MENU);
    }
  }, [user]);

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" color="transparent">
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          <Box sx={{ height: "40px", width: "110px", position: "relative" }}>
            <Link href="/">
              <Logo></Logo>
            </Link>
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <UserAvatar />
            </IconButton>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {userMenu.map((menuItem) => (
                <Link
                  href={menuItem.url}
                  key={menuItem.name}
                  style={{
                    textDecoration: "none",
                    color: "rgba(0, 0, 0, 0.87)",
                  }}
                >
                  <MenuItem key={menuItem.name} onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">{menuItem.name}</Typography>
                  </MenuItem>
                </Link>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
