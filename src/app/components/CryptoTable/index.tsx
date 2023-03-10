"use client"

import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useTableRows } from './store';

export function CryptoTable() {
  useTableRows();




  return (
    <TableContainer component={Paper}>
     <Table aria-label="simple table">
       <TableHead>
         <TableRow>
           <TableCell>S.No</TableCell>
           <TableCell align="right">Item</TableCell>
           <TableCell align="right">Quantity&nbsp;(kg)</TableCell>
           <TableCell align="right">Price&nbsp;($)</TableCell>
         </TableRow>
       </TableHead>
       <TableBody>
         {/* {rows.map((row) => (
           <TableRow key={row.number}>
             <TableCell component="th" scope="row">
               {row.number}
             </TableCell>
             <TableCell align="right">{row.item}</TableCell>
             <TableCell align="right">{row.qty}</TableCell>
             <TableCell align="right">{row.price}</TableCell>
           </TableRow>
         ))} */}
       </TableBody>
     </Table>
   </TableContainer>
  );
}
