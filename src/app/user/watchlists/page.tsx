"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "@/app/constants/backendURL";
import { useUser } from "../store";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { Watchlist } from "@/app/interfaces/Watchlist";
import AddIcon from "@mui/icons-material/Add";
import { CryptoTable } from "@/app/components/CryptoTable";
import { DeleteForeverOutlined } from "@mui/icons-material";

export default function Wishlists() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user, setUser } = useUser();
  const router = useRouter();
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [activeWatchlist, setActiveWatchlist] = useState<Watchlist>({
    id: -1,
    name: "",
    list: [],
  });
  const [open, setOpen] = useState(false);
  const [newWatchlistName, setNewWatchlistName] = useState<string>("");
  const [alertVisible, setAlertVisible] = useState<boolean>(false);

  const handleClick = (watchlist: Watchlist | null) => () => {
    if (watchlist) {
      setActiveWatchlist(watchlist);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function getChipVariant(watchlistId: number): "filled" | "outlined" {
    if (activeWatchlist) {
      return watchlistId === activeWatchlist.id ? "filled" : "outlined";
    }
    return "outlined";
  }

  function newWatchlistNameHandler(watchlistName: string) {
    setNewWatchlistName(watchlistName);
  }

  function closeAlert() {
    setAlertVisible(false);
  }
  function deleteWatchlist(watchlist: Watchlist) {
    setIsLoading(true);
    axios({
      url: BASE_URL + "watchlists/delete",
      method: "DELETE",
      params: {
        id: watchlist.id,
      },
      withCredentials: false,
      headers: {
        Authorization: "Bearer " + user?.token,
      },
    })
      .then(() => {
        let activeWatchlistIndex = watchlists.indexOf(activeWatchlist);
        if (activeWatchlistIndex > -1) {
          watchlists.splice(activeWatchlistIndex, 1);
        }
        setActiveWatchlist({
          id: -1,
          name: "",
          list: [],
        });
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setAlertVisible(true);
        setIsLoading(false);
        setTimeout(() => {
          closeAlert();
        }, 3000);
      });
  }

  function handleAddWatchlist() {
    setOpen(false);
    setIsLoading(true);
    axios({
      url: BASE_URL + "watchlists/add",
      method: "POST",
      params: {
        name: newWatchlistName,
      },
      withCredentials: false,
      headers: {
        Authorization: "Bearer " + user?.token,
      },
    })
      .then((res) => {
        return {
          id: res.data.id,
          name: res.data.name,
          list: res.data.listing,
        };
      })
      .then((watchlist: Watchlist) => {
        setWatchlists([...watchlists, watchlist]);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setAlertVisible(true);
        setIsLoading(false);
        setTimeout(() => {
          closeAlert();
        }, 3000);
      });
  }

  function handleRemoveToken(tokenId: number) {
    axios({
      url: BASE_URL + "watchlists/watchlist/"  + activeWatchlist.id + "/remove",
      method: "PUT",
      params: {
        coinId: tokenId
      },
      withCredentials: false,
      headers: {
        Authorization: "Bearer " + user?.token,
      },
    })
      .then(() => {
        for (let i =0; i < activeWatchlist.list.length; i++) {
          if (activeWatchlist.list[i].id === tokenId) {
            activeWatchlist.list.splice(i, 1);
          }
        }
        setActiveWatchlist( JSON.parse(JSON.stringify(activeWatchlist)));
      })
      .catch((err) => {
        console.log(err);
      });
  }

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
          setIsLoading(false);
          setWatchlists(watchlists);
        })
        .then(() => {
          console.log(watchlists);
          if (watchlists.length > 0) {
            setActiveWatchlist(watchlists[0]);
          }
        })
        .catch((err) => {
          setIsLoading(false);
          router.replace("/user/logout");
          console.log(err);
        });
    }
  }, [user, watchlists.length]);

  if (isLoading) {
    return <LinearProgress />;
  } else {
    return (
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Box sx={{ display: "flex", justifyContent: "start" }}>
          {watchlists.length !== 0 ? (
            watchlists.map((watchlist) => {
              return (
                <Chip
                  label={watchlist.name}
                  key={watchlist.id}
                  onClick={handleClick(watchlist)}
                  variant={getChipVariant(watchlist.id)}
                />
              );
            })
          ) : (
            <></>
          )}
          <Chip
            label={"Add Watchlist"}
            icon={<AddIcon />}
            variant="outlined"
            onClick={handleClickOpen}
          />
          <Dialog open={open} onClose={handleClose}>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Watchlist Name"
                fullWidth
                variant="outlined"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  newWatchlistNameHandler(event.target.value);
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleAddWatchlist}>Add</Button>
            </DialogActions>
          </Dialog>
        </Box>
        <Box sx={{ width: "80%" }}>
          {activeWatchlist.list.length === 0 ? (
            <Typography>Watchlist is empty!</Typography>
          ) : (
            <>
              <Button
                onClick={() => deleteWatchlist(activeWatchlist)}
                color="error"
              >
                <DeleteForeverOutlined /> Delete Watchlist
              </Button>
              <CryptoTable listings={activeWatchlist.list} removeTokenCallback={handleRemoveToken}></CryptoTable>
            </>
          )}
        </Box>
        {alertVisible ? (
          <Alert severity="error" onClose={closeAlert}>
            Internal Server Error
          </Alert>
        ) : (
          <></>
        )}
      </Box>
    );
  }
}
