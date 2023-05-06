"use client";

import { ListingData } from "@/app/interfaces/ListingData";
import Image from "next/image";
import {
  Box,
  IconButton,
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
import { DeleteOutline } from "@mui/icons-material";

const TABLE_HEAD = [
  "NAME",
  "MARKET CAP",
  "PRICE (USD)",
  "CIRCULATING SUPPLY",
  "CHANGE (24h)",
  "CHANGE (7d)",
];

type tableHead =
  | "NAME"
  | "MARKET CAP"
  | "PRICE (USD)"
  | "CIRCULATING SUPPLY"
  | "CHANGE (24h)"
  | "CHANGE (7d)";

type listingSort = {
  sortBy: "name" | "rank" | "circulatingSupply";
  direction: direction;
};

type direction = "asc" | "desc";

export function CryptoTable(props: {
  listings?: ListingData[];
  removeTokenCallback?: (tokenId: number) => void;
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
  const [activeRow, setActiveRow] = useState<number | null>(null);
  const router = useRouter();

  function getActiveHeadAndDirection(sort: listingSort): {
    activeHead: string;
    direction: direction;
  } {
    switch (sort.sortBy) {
      case "name":
        return { activeHead: "NAME", direction: sort.direction };
        break;
      case "rank":
        return {
          activeHead: "MARKET CAP",
          direction: sort.direction === "asc" ? "desc" : "asc",
        };
        break;
      case "circulatingSupply":
        return { activeHead: "CIRCULATING SUPPLY", direction: sort.direction };
        break;
      default:
        return { activeHead: "MARKET CAP", direction: "desc" };
        break;
    }
  }

  function handleTableHeadClick(head: tableHead) {
    switch (head) {
      case "NAME":
        setSort({
          sortBy: "name",
          direction:
            sort.sortBy === "name" && sort.direction === "asc" ? "desc" : "asc",
        });
        break;
      case "MARKET CAP":
        setSort({
          sortBy: "rank",
          direction:
            sort.sortBy === "rank" && sort.direction === "asc" ? "desc" : "asc",
        });
        break;

      case "CIRCULATING SUPPLY":
        setSort({
          sortBy: "circulatingSupply",
          direction:
            sort.sortBy === "circulatingSupply" && sort.direction === "asc"
              ? "desc"
              : "asc",
        });
        break;
      default:
        setSort({
          sortBy: "rank",
          direction: "asc",
        });
        break;
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
            {head === "NAME" ||
            head === "MARKET CAP" ||
            head === "CIRCULATING SUPPLY" ? (
              <TableSortLabel
                active={active}
                direction={direction}
                onClick={() => handleTableHeadClick(head)}
              >
                {head}
                {active ? (
                  <Box component="span" sx={visuallyHidden}>
                    {sort.direction}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              head
            )}
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
    if (props.listings) {
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
          router.replace("/error/500");
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

  if (isLoading || rows.length === 0)
    return (
      <>
        {" "}
        {props.listings ? (
          <LinearProgress sx={{ mt: "20px", width: "100%" }} />
        ) : (
          <LinearProgress />
        )}
      </>
    );
  else {
    return (
      <Box
        sx={{
          mt: "20px",
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <TableContainer
          component={Paper}
          sx={{ width: { xs: "95%", sm: "85%", md: "80%" } }}
        >
          <Table stickyHeader sx={{ width: "100%" }}>
            <TableHead>
              <TableRow>{tableHead()}</TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(rows) ? (
                rows.map((row) => (
                  <TableRow
                    key={row.id}
                    onMouseEnter={() => setActiveRow(row.id)}
                    onMouseLeave={() => setActiveRow(null)}
                  >
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
                      <Typography>
                        {parseFloat(row.marketCap.toFixed(2)).toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{row.price.toFixed(2)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>
                        {Math.round(row.circulatingSupply).toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{ color: row.change24H < 0 ? "red" : "green" }}
                      >
                        {Math.abs(row.change24H).toFixed(2)}%
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{ color: row.change7D < 0 ? "red" : "green" }}
                      >
                        {Math.abs(row.change7D).toFixed(2)}%
                      </Typography>
                    </TableCell>
                    {props.listings &&
                    props.removeTokenCallback &&
                    activeRow &&
                    activeRow === row.id ? (
                      <TableCell sx={{padding:"0"}}>
                        <IconButton
                          color="error"
                          aria-label="remove token"
                          component="label"
                          onClick={() =>
                            props.removeTokenCallback
                              ? props.removeTokenCallback(row.id)
                              : () => {}
                          }
                        >
                          <DeleteOutline />
                        </IconButton>
                      </TableCell>
                    ) : (
                      <></>
                    )}
                  </TableRow>
                ))
              ) : (
                <></>
              )}
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
