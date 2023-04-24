"use client";

import axios from "axios";
import Image from "next/image";
import { useEffect, useRef, useState, FC } from "react";
import { Box, LinearProgress, Typography, Paper } from "@mui/material";
import { BASE_URL } from "../constants/backendURL";
import TradingViewChartWidget from "../components/TradingView/Chart";
import { MetaData } from "../interfaces/MetaData";
import {Language, Twitter, Reddit} from '@mui/icons-material';
import Link from "next/link";

export default function CoinDetails({ params }: { params: { id: number } }) {
  
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const [metadata, setMetadata] = useState<MetaData>({
    id: params.id,
    symbol: "",
    name: "",
    logoURL: "#",
    website: "#",
    twitter: "#",
    reddit: "#"
  });

  useEffect(() => {
    setIsLoading(true);
    axios({
      url: BASE_URL + "metadata",
      method: "GET",
      params: {
        ids: params.id,
      }
    })
      .then((res) => {
        var metadataResponse: MetaData = res.data[0];
        metadataResponse.twitter = metadataResponse.twitter ? metadataResponse.twitter : "#";
        metadataResponse.reddit = metadataResponse.reddit ? metadataResponse.reddit : "#";
        metadataResponse.website = metadataResponse.website ? metadataResponse.website : "#";
        setMetadata(metadataResponse);
      })
      .then(() => {
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  
  if (isLoading) {
    return <LinearProgress />;
  } else {
    return (
      <Box sx={{ mt: "20px", width:"100%", display:"flex", flexDirection:"column", alignItems:"center" }}>
        <Box sx={{ display: "flex" }}>
          <Image src={metadata.logoURL} alt={metadata.symbol} width="48" height="48"></Image>
          <Typography variant="h3">{metadata.name}</Typography>
          <Paper elevation={1} sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h4">{metadata.symbol}</Typography>
          </Paper>
          <Link href={metadata.twitter} style={{display: metadata.twitter==="#"? "none": "inline"}}><Twitter/></Link>
          <Link  href={metadata.reddit}><Reddit/></Link>
          <Link href={metadata.website}><Language/></Link>
        </Box>
        <Typography variant="body1">{metadata.description}</Typography>
        <Box
          sx={{
            width: { xs: "95%", sm: "85%", md: "85%" },
            height: { xs: "400px", md: "600px" }
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
