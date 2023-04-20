import { useEffect } from "react";
import { getTableDataDefault } from "./services";

export function useTableRows() {
useEffect(()=>{
    getTableDataDefault();
})}
