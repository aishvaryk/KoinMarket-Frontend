"use client";

import { ListingData } from "@/app/interfaces/ListingData";
import Image from "next/image";
import {
  Box,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../constants/backendURL";
import { visuallyHidden } from "@mui/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

const TABLE_HEAD = [
  "NAME",
  "MARKET CAP",
  "PRICE (USD)",
  "CIRCULATING SUPPLY",
  "CHANGE (24h)",
  "CHANGE (7d)",
];

type listingSort = {
  sortBy: "name" | "rank" | "circulatingSupply";
  direction: direction;
};

type direction = "asc" | "desc";

export function CryptoTable(props: {
  listings?: ListingData[];
  children?: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const [pageNo, setPageNo] = useState<number>(0);
  const [numOfRows, setNumOfRows] = useState<number>(25);
  const [sort, setSort] = useState<listingSort>({
    sortBy: "rank",
    direction: "asc",
  });
  const [rows, setRows] = useState<ListingData[]>([]);
  const router = useRouter();

  function getActiveHeadAndDirection(sort: listingSort): {
    activeHead: string;
    direction: direction;
  } {
    switch (sort.sortBy) {
      case "name":
        return { activeHead: "NAME", direction: sort.direction };
      case "rank":
        return {
          activeHead: "MARKET CAP",
          direction: sort.direction === "asc" ? "desc" : "asc",
        };
      case "circulatingSupply":
        return { activeHead: "CIRCULATING SUPPLY", direction: sort.direction };
      default:
        return { activeHead: "MARKET CAP", direction: "desc" };
    }
  }

  function tableHead(): React.ReactNode {
    var activeHead: string = getActiveHeadAndDirection(sort).activeHead;
    var direction: direction = getActiveHeadAndDirection(sort).direction;

    if (!props.listings) {
      return TABLE_HEAD.map((head): React.ReactNode => {
        var active: boolean = activeHead === head;
        return (
          <TableCell key={head}>
            <TableSortLabel
              active={active}
              direction={direction}
              onClick={() => null}
            >
              {head}
              {active ? (
                <Box component="span" sx={visuallyHidden}>
                  {sort.direction}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        );
      });
    } else {
      return TABLE_HEAD.map((head): React.ReactNode => {
        return <TableCell key={head}>{head}</TableCell>;
      });
    }
  }

  useEffect(() => {
    console.log("table render")
    if (props.listings) {
      console.log("table render")
      console.log(props.listings)
      setRows(props.listings);
      setIsLoading(false);
    } else {
      setIsLoading(true);
      axios({
        url: BASE_URL + "list",
        method: "GET",
        params: {
          pageNo: pageNo + 1,
          count: numOfRows,
          orderBy: sort.sortBy,
          direction: sort.direction,
        },
      })
        .then((res) => {
          setRows(res.data);
        })
        .then(() => {
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          router.replace("/error");
        });
    }
  }, [pageNo, numOfRows, sort, props.listings]);

  function handleChangePage(
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) {
    setPageNo(newPage);
  }

  function handleChangeRowsPerPage(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setNumOfRows(parseInt(event.target.value, 10));
    setPageNo(0);
  }

  if (isLoading) return( <> {props.listings ?  <LinearProgress sx={{mt:"20px", width: "100%"}}/> :<LinearProgress />}</>);
  else {
    return (
      <Box
        sx={{
          mt: "20px",
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "column",
          alignItems: "center",
          width:"100%"
        }}
      >
        <TableContainer
          component={Paper}
          sx={{ width: "80%", display: isLoading ? "none" : "block" }}
        >
          <Table sx={{ width: "100%" }}>
            <TableHead>
              <TableRow>{tableHead()}</TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell sx={{ display: "flex" }}>
                    <Link
                      key={row.id}
                      href={"/" + row.id}
                      style={{
                        textDecoration: "none",
                        color: "rgba(0, 0, 0, 0.87)",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        src={row.logoURL}
                        alt=""
                        width="20"
                        height="20"
                      ></Image>
                      <Typography>{row.name}</Typography>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Typography>{row.marketCap.toPrecision(2)}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{row.price.toPrecision(2)}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>
                      {row.circulatingSupply.toPrecision(2)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      sx={{ color: row.change24H < 0 ? "red" : "green" }}
                    >
                      {Math.abs(row.change24H)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      sx={{ color: row.change7D < 0 ? "red" : "green" }}
                    >
                      {Math.abs(row.change7D)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {!props.listings ? (
          <TablePagination
            component="div"
            count={1000}
            page={pageNo}
            onPageChange={handleChangePage}
            rowsPerPage={numOfRows}
            sx={{ display: isLoading ? "none" : "block" }}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        ) : ( 
          <></>
        )}
      </Box>
    );
  }
}
