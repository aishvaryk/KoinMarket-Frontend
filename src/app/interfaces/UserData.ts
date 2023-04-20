import { Watchlist } from "./Watchlist";

export interface UserData {
    id: number;
    username: string;
    emailAddress: string;
    watchlists?: Watchlist[];
    token: string;
}