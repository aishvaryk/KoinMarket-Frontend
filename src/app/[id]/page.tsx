"use client";

import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Box, LinearProgress, Typography, Paper, MenuItem, IconButton, Menu } from "@mui/material";
import { BASE_URL } from "../constants/backendURL";
import TradingViewChartWidget from "../components/TradingView/Chart";
import { MetaData } from "../interfaces/MetaData";
import { Language, Twitter, Reddit } from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Watchlist } from "../interfaces/Watchlist";
import { useUser } from "../user/store";
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function CoinDetails({ params }: { params: { id: number } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const [metadata, setMetadata] = useState<MetaData>({
    id: params.id,
    symbol: "",
    name: "",
    logoURL: "#",
    website: "#",
    twitter: "#",
    reddit: "#",
  });
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const { user, setUser } = useUser();
  const [anchorElMenu, setAnchorElMenu] = useState<null | HTMLElement>(
    null
  );

  useEffect(() => {
    setIsLoading(true);
    axios({
      url: BASE_URL + "metadata",
      method: "GET",
      params: {
        ids: params.id,
      },
    })
      .then((res) => {
        var metadataResponse: MetaData = res.data[0];
        metadataResponse.twitter = metadataResponse.twitter
          ? metadataResponse.twitter
          : "#";
        metadataResponse.reddit = metadataResponse.reddit
          ? metadataResponse.reddit
          : "#";
        metadataResponse.website = metadataResponse.website
          ? metadataResponse.website
          : "#";
        setMetadata(metadataResponse);
      })
      .then(() => {
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        router.replace("/error/500");
      });
  }, []);

  useEffect(() => {
    if (user) {
      axios({
        url: BASE_URL + "watchlists/all",
        method: "GET",
        headers: {
          Authorization: "Bearer " + user?.token,
        },
        withCredentials: false,
      })
        .then((res) => {
          return res.data.map((watchlist: any): Watchlist => {
            return {
              id: watchlist.id,
              name: watchlist.name,
              list: watchlist.listing,
            };
          });
        })
        .then((watchlists: Watchlist[]) => {
          setWatchlists(watchlists);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [user, watchlists.length]);

  const handleOpenWatchlistMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElMenu(event.currentTarget);
  };

  const handleCloseWatchlistMenu = () => {
    setAnchorElMenu(null);
  };

  const handleMenuItemClick = (watchlistId: number)  => {
    axios({
      url: BASE_URL + "watchlists/watchlist/" + watchlistId + "/add",
      method: "PUT",
      headers: {
        Authorization: "Bearer " + user?.token,
      },
      params: {
        coinId: params.id
      },
      withCredentials: false,
    })
      .then((res) => {
        console.log("added");
        setAnchorElMenu(null);
      })
      .catch((err) => {
        console.log(err);
        setAnchorElMenu(null);
      });
  }


  if (isLoading) {
    return <LinearProgress />;
  } else {
    return (
      <Box
        sx={{
          mt: "20px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex" }}>
          <Image
            src={metadata.logoURL}
            alt={metadata.symbol}
            width="48"
            height="48"
          ></Image>
          <Typography variant="h3">{metadata.name}</Typography>
          <Paper elevation={1} sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h4">{metadata.symbol}</Typography>
          </Paper>
          {metadata.twitter === "#" ? (
            <></>
          ) : (
            <Link href={metadata.twitter} style={{ color: "#00acee " }}>
              <Twitter />
            </Link>
          )}
          {metadata.reddit === "#" ? (
            <></>
          ) : (
            <Link href={metadata.reddit} style={{ color: "##ff4500 " }}>
              <Reddit />
            </Link>
          )}
          {metadata.website === "#" ? (
            <></>
          ) : (
            <Link href={metadata.website} style={{ color: "teal" }}>
              <Language />
            </Link>
          )}
        </Box>
        <Typography variant="body1">{metadata.description}</Typography>
        {(watchlists.length!==0 && user) ? <Box>
            <IconButton onClick={handleOpenWatchlistMenu} sx={{ p: 0 }}>
               <MoreVertIcon />
            </IconButton>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElMenu}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElMenu)}
              onClose={handleCloseWatchlistMenu}
            >
              {watchlists.map((watchlist) => (
                  <MenuItem key={watchlist.id} onClick={()=>handleMenuItemClick(watchlist.id)}>
                    <Typography textAlign="center">{watchlist.name}</Typography>
                  </MenuItem>
              ))}
            </Menu>
          </Box> : <></>}
        <Box
          sx={{
            width: { xs: "95%", sm: "85%", md: "85%" },
            height: { xs: "400px", md: "600px" },
          }}
        >
          <TradingViewChartWidget
            key={metadata}
            symbol={metadata.symbol}
            theme="light"
          ></TradingViewChartWidget>
        </Box>
      </Box>
    );
  }
}
